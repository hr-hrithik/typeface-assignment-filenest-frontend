import React, { useEffect, useRef, useState } from 'react';
import ListViewSVGIcon from '@/components/CustomSVGIcons/ListViewSVGIcon';
import GridViewSVGIcon from '@/components/CustomSVGIcons/GridViewSVGIcon';
import { FILE_VIEWER_VIEW_TYPES } from '@/utils/constants';
import {
  UserFileDetails,
  UserFolderContentMetadata,
  UserFolderContentsResponse,
} from '@/models/UserFiles';
import ListViewItem from '@/components/ListViewItem';
import FileDetailsModal from '@/components/Modals/FileDetailsModal';
import {
  convertFileSizeToString,
  debounceFunction,
  handleAPIResponse,
} from '@/utils/Helper';
import FileUploader from '@/components/FileUploader';
import { useConfigurationContext } from '@/context/ConfigurationContextProvider';
import LottieEmptySearch from '@/components/LottieFiles/LottieEmptySearch';
import { ApiController } from '@/ApiManager/ApiController';
import { toast } from 'react-toastify';
import GridViewItem from '@/components/GridViewItem';
import ConfirmationModal from '@/components/Modals/ConfirmationModal';
import { ConfirmationModalModel } from '@/models/CommonModels';

type Props = {
  folderId: string;
  currentPath: string[];
  folderContents: UserFolderContentsResponse;
  searchString: string;
};

function FileViewer({
  folderId,
  currentPath,
  folderContents,
  searchString,
}: Props) {
  const timerRef = useRef<any>(0);

  const { userLogin, setFolderContentsMapping } = useConfigurationContext();
  const [selectedContent, setSelectedContent] =
    useState<UserFolderContentMetadata | null>(null);
  const [currentView, setCurrentView] = useState<string>(
    FILE_VIEWER_VIEW_TYPES.LIST_VIEW,
  );
  const [filteredFolderContents, setFilteredFolderContents] = useState<
    UserFolderContentMetadata[]
  >([]);

  const [confirmationModalData, setConfirmationModalData] = useState<
    ConfirmationModalModel | undefined
  >(undefined);

  const viewTypes = [
    {
      name: FILE_VIEWER_VIEW_TYPES.LIST_VIEW,
      icon: (
        <ListViewSVGIcon
          className={`${
            currentView === FILE_VIEWER_VIEW_TYPES.LIST_VIEW
              ? 'stroke-black'
              : 'stroke-white'
          }`}
        />
      ),
    },
    {
      name: FILE_VIEWER_VIEW_TYPES.GRID_VIEW,
      icon: (
        <GridViewSVGIcon
          className={`${
            currentView === FILE_VIEWER_VIEW_TYPES.GRID_VIEW
              ? 'stroke-black'
              : 'stroke-white'
          }`}
        />
      ),
    },
  ];

  function handleFileViewTypeIcon(viewType: string) {
    setCurrentView(viewType);
  }

  function handleFileDetailsModalClose() {
    setSelectedContent(null);
  }

  async function handleFileSelectClick(content: UserFolderContentMetadata) {
    setSelectedContent(content);
  }

  async function handleDeleteContent(content: UserFolderContentMetadata) {
    if (typeof folderId !== 'string') {
      return;
    }

    const apiResponse = await ApiController.deleteFolderContent(
      content?.content_id,
    );
    handleAPIResponse({
      apiResponse: apiResponse,
      handleSuccess: () => {
        const response = apiResponse?.data?.message;
        if (typeof response === 'string') {
          toast.success(response, { toastId: response });
        }

        setFolderContentsMapping(val => ({
          ...val,
          [folderId]: {
            ...val?.[folderId],
            folder_content: val?.[folderId]?.folder_content?.filter(
              item => item?.content_id !== content?.content_id,
            ),
            folder_size: Math.max(
              0,
              val?.[folderId]?.folder_size - (content.content_size ?? 0),
            ),
            folder_content_count: Math.max(
              0,
              val?.[folderId]?.folder_content_count - 1,
            ),
          },
        }));
      },
    });
  }

  function filterFolderContents(searchString: string) {
    const tempFilteredFolderContents: UserFolderContentMetadata[] =
      folderContents?.folder_content?.filter?.(content => {
        return (
          content?.content_name
            ?.toLocaleLowerCase?.()
            ?.includes?.(searchString) ||
          content?.content_file_type
            ?.toLocaleLowerCase?.()
            ?.includes?.(searchString) ||
          content?.content_type?.toLocaleLowerCase?.()?.includes?.(searchString)
        );
      }) ?? [];

    setFilteredFolderContents(tempFilteredFolderContents);
  }

  function handleDeleteClick(content: UserFolderContentMetadata) {
    setConfirmationModalData({
      title: `Delete ${content?.content_type}`,
      subtitle: (
        <div>
          Are you sure you want to delete{' '}
          <span className={`break-all`}>{content?.content_name} </span>?<br />{' '}
          <p className={`text-red-600 font-bold`}>
            This action cannot be undone.
          </p>
        </div>
      ),
      handleConfirm: () => {
        handleDeleteContent(content);
        setConfirmationModalData(undefined);
      },
      handleCancel: () => {
        setConfirmationModalData(undefined);
      },
    });
  }

  async function updateFile(
    content: UserFolderContentMetadata,
    updatedFile: File,
  ) {
    const apiResponse = await ApiController.updateFile(
      content?.content_id,
      updatedFile.lastModified,
      folderId,
      updatedFile,
    );

    handleAPIResponse({
      apiResponse: apiResponse,
      handleSuccess: () => {
        const response: UserFileDetails = apiResponse?.data
          ?.file as UserFileDetails;

        if (response instanceof Object) {
          setFolderContentsMapping(val => {
            const updateFolderContents = {
              ...val,
            };

            const updatedCurrentFolderData: UserFolderContentsResponse =
              val?.[folderId];

            if (updatedCurrentFolderData instanceof Object) {
              const contentIndex =
                updatedCurrentFolderData?.folder_content?.findIndex?.(
                  item => item?.content_id === content?.content_id,
                );

              if (contentIndex !== -1) {
                let sizeDifference =
                  response?.file_size -
                  updatedCurrentFolderData.folder_content[contentIndex]
                    .content_size;
                updatedCurrentFolderData.folder_content[
                  contentIndex
                ].content_name = response?.file_name;
                updatedCurrentFolderData.folder_content[
                  contentIndex
                ].content_size = response?.file_size;
                updatedCurrentFolderData.folder_content[
                  contentIndex
                ].content_last_modified = response?.file_last_modified;
                updatedCurrentFolderData.folder_content[
                  contentIndex
                ].content_file_type = response?.file_type;
                updatedCurrentFolderData.folder_content[
                  contentIndex
                ].content_thumbnail_url = response?.file_thumbnail_url;

                updatedCurrentFolderData.folder_size += sizeDifference;
              }
            }

            return updateFolderContents;
          });
        }
      },
    });
  }

  useEffect(() => {
    debounceFunction({
      timeout: timerRef,
      handlerFunction: () => {
        filterFolderContents(searchString?.toLowerCase?.() || '');
      },
      delay: searchString?.length ? 200 : 0,
    });
  }, [searchString, folderContents?.folder_content]);

  return (
    <div className={`flex-1 flex flex-col overflow-hidden gap-[16px]`}>
      {!!selectedContent && (
        <FileDetailsModal
          folderId={folderId}
          handleDeleteClick={handleDeleteClick}
          content={selectedContent}
          handleClose={handleFileDetailsModalClose}
        />
      )}

      {!!confirmationModalData && (
        <ConfirmationModal
          title={confirmationModalData?.title}
          subtitle={confirmationModalData?.subtitle}
          handleCancel={confirmationModalData?.handleCancel}
          handleConfirm={confirmationModalData?.handleConfirm}
        />
      )}

      <div className={`flex gap-[16px]`}>
        <div className={`flex-1`}>
          <div>
            <p className={`text-[24px] font-bold text-primary`}>
              {folderContents?.folder_name || 'ROOT'}
            </p>
            <div className={`flex gap-[8px] items-center text-white`}>
              <p className={`text-[12px] font-semibold text-white`}>
                {`This folder contains ${
                  folderContents?.folder_content_count
                } items | Total size (${convertFileSizeToString(
                  folderContents?.folder_size,
                )})`}{' '}
              </p>
            </div>
          </div>
        </div>

        <div className={`flex rounded-lg h-fit bg-black/25 overflow-hidden`}>
          {viewTypes.map(view => (
            <div
              onClick={() => {
                handleFileViewTypeIcon(view.name);
              }}
              className={`px-[12px] py-[8px] flex justify-center items-center ${
                currentView === view.name ? 'bg-primary' : 'bg-transparent'
              } cursor-pointer`}
              key={view.name}
              title={view.name}>
              <div
                className={`w-[18px] h-[18px] flex justify-center items-center relative`}>
                {view.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!!filteredFolderContents?.length ? (
        <div className={`flex-1 overflow-y-scroll transition-all duration-700`}>
          {!!searchString && (
            <div className={`mb-[8px]`}>
              <div>
                <p className={`text-[18px] font-bold text-white`}>
                  {`Search results (${filteredFolderContents?.length ?? 0})`}
                </p>
              </div>
            </div>
          )}

          <div
            className={`h-fit ${
              currentView === FILE_VIEWER_VIEW_TYPES.LIST_VIEW
                ? 'flex flex-col gap-[12px]'
                : 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-[12px] '
            } `}>
            {filteredFolderContents?.map?.((content, index) =>
              currentView === FILE_VIEWER_VIEW_TYPES.LIST_VIEW ? (
                <ListViewItem
                  key={content.content_id}
                  content={content}
                  index={index}
                  handleFileSelectClick={handleFileSelectClick}
                  handleDeleteContent={handleDeleteClick}
                  updateFile={updateFile}
                />
              ) : (
                <GridViewItem
                  key={content.content_id}
                  content={content}
                  index={index}
                  handleFileSelectClick={handleFileSelectClick}
                  handleDeleteContent={handleDeleteClick}
                  updateFile={updateFile}
                />
              ),
            )}
          </div>
        </div>
      ) : !!folderContents?.folder_content?.length ? (
        <div className={`flex-1 flex flex-col`}>
          {!!searchString && (
            <div className={`mb-[8px]`}>
              <div>
                <p className={`text-[18px] font-bold text-white`}>
                  {`Search results (${filteredFolderContents?.length ?? 0})`}
                </p>
              </div>
            </div>
          )}

          <div className={`flex-1 flex justify-center items-center`}>
            <LottieEmptySearch />
          </div>
        </div>
      ) : (
        <div className={`flex-1 flex justify-center items-center`}>
          <FileUploader folder_id={userLogin?.root_folder_id} />
        </div>
      )}
    </div>
  );
}

export default FileViewer;
