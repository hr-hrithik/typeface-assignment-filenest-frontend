import { UserFileDetails, UserFolderContentMetadata } from '@/models/UserFiles';
import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modals/Modal';
import { convertISOToDateString, handleAPIResponse } from '@/utils/Helper';
import CustomImage from '@/components/CustomImage';
import Button from '@/components/Button';
import DeleteSVGIcon from '@/components/CustomSVGIcons/DeleteSVGIcon';
import { ApiController } from '@/ApiManager/ApiController';
import { useConfigurationContext } from '@/context/ConfigurationContextProvider';
import LottieLoading from '@/components/LottieFiles/LottieLoading';

type Props = {
  content: UserFolderContentMetadata;
  folderId: string;
  handleClose: () => void;
  handleDeleteClick(content: UserFolderContentMetadata): void;
};

function FileDetailsModal({
  content,
  folderId,
  handleClose,
  handleDeleteClick,
}: Props) {
  const { fileDetailsMapping, setFileDetailsMapping } =
    useConfigurationContext();

  const [loading, setLoading] = useState(false);
  const [fileDetails, setFileDetails] = useState<UserFileDetails | undefined>(
    undefined,
  );

  function handleDownloadFile() {}

  function handleDeleteFile() {
    handleClose && handleClose();
    handleDeleteClick(content);
  }

  async function getFileDetails(content: UserFolderContentMetadata) {
    if (typeof folderId !== 'string') {
      return;
    }

    if (fileDetailsMapping?.[content?.content_id] instanceof Object) {
      setFileDetails(fileDetailsMapping?.[content?.content_id]);
      return;
    }

    setLoading(true);
    const apiResponse = await ApiController.getFileDetails(
      content.content_id,
      folderId,
    );
    setLoading(false);

    handleAPIResponse({
      apiResponse: apiResponse,
      handleSuccess: () => {
        const response: UserFileDetails = apiResponse?.data
          ?.file_details as UserFileDetails;

        if (response instanceof Object) {
          setFileDetails(response);
          setFileDetailsMapping(val => ({
            ...val,
            [content?.content_id]: response,
          }));
        }
      },
    });
  }

  function handleCloseClick() {
    setFileDetails(undefined);
    handleClose && handleClose();
  }

  useEffect(() => {
    if (content) {
      getFileDetails(content);
    }
  }, [content]);

  return (
    <Modal
      handleClose={handleCloseClick}
      title={
        <div className={`w-full overflow-y-scroll`}>
          <p className={`text-primary truncate font-bold line-clamp-2`}>
            {fileDetails?.file_name || ''}{' '}
          </p>
          <p className={`text-[12px] text-white font-semibold`}>
            {`${fileDetails?.file_type || 'File'} | ${convertISOToDateString(
              fileDetails?.file_last_modified || '',
            )}`}
          </p>
        </div>
      }>
      {loading ? (
        <div
          className={`h-full w-full flex justify-center items-center relative`}>
          <LottieLoading />
        </div>
      ) : (
        <div className={`h-full flex flex-col relative gap-[12px]`}>
          <div className={`flex-1 relative bg-backgroundGray/50 rounded-lg`}>
            <CustomImage
              fill
              alt='image'
              key={fileDetails?.file_public_url}
              src={
                (fileDetails?.file_type === 'Image'
                  ? fileDetails?.file_public_url
                  : fileDetails?.file_thumbnail_url) || ''
              }
              className={`object-contain`}
            />
          </div>

          <div className={`w-full flex gap-[12px]`}>
            <div className={`flex-1`}>
              <Button
                buttonStyle={`secondary`}
                className={`w-full`}
                handleOnClick={handleDeleteFile}>
                <div className={`flex gap-[6px] justify-center items-center`}>
                  <div
                    className={`w-[18px] h-[18px] flex justify-center items-center relative`}>
                    <DeleteSVGIcon />
                  </div>

                  <div>
                    <p className={`text-red-600 font-medium`}>Delete File</p>
                  </div>
                </div>
              </Button>
            </div>

            <div className={`flex-1`}>
              <Button
                buttonStyle={`primary`}
                className={`w-full`}
                handleOnClick={handleDownloadFile}>
                <div>Download File</div>
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default FileDetailsModal;
