import { ApiController } from '@/ApiManager/ApiController';
import {
  ContentUploaderModel,
  ContentUploadInformation,
} from '@/models/CommonModels';
import {
  FileUploadSuccessRequest,
  UserFolderContentMetadata,
  UserFolderContentsResponse,
} from '@/models/UserFiles';
import { UserProfileResponse } from '@/models/UserLogin';
import { CONTENT_UPLOADER_UPLOAD_STATUS } from '@/utils/constants';
import { handleAPIResponse } from '@/utils/Helper';
import { ResumableUploadController } from '@/utils/ResumableUploadController';
import { TOAST_MESSAGES } from '@/utils/ToastMessages';
import { useEffect, useRef, useState } from 'react';

type Props = {
  userLogin: UserProfileResponse | null | undefined;
  folderContentsMapping: {
    [key: string]: UserFolderContentsResponse;
  };
  setFolderContentsMapping: React.Dispatch<
    React.SetStateAction<{
      [key: string]: UserFolderContentsResponse;
    }>
  >;
};

function useContentUploader({
  userLogin,
  folderContentsMapping,
  setFolderContentsMapping,
}: Props): ContentUploaderModel {
  const uploadInProgress = useRef<{ [key: string]: boolean }>({});

  const [contentQueuedForUpload, setContentQueuedForUpload] = useState<
    ContentUploadInformation[]
  >([]);

  function addContentInQueue(content: ContentUploadInformation[]) {
    setContentQueuedForUpload(queue => [...queue, ...content]);
  }

  function deleteContentFromQueue(content: ContentUploadInformation) {
    setContentQueuedForUpload(val =>
      val.filter(item => item?.file_id !== content?.file_id),
    );
  }

  async function handleFileUploadSuccess(
    content: ContentUploadInformation,
    retriesLeft: number = 3,
  ) {
    if (typeof userLogin?.user_uid !== 'string') {
      return;
    }

    const fileUploadSuccessPayload: FileUploadSuccessRequest = {
      user_id: userLogin?.user_uid,
      file_id: content?.file_id,
      folder_id: content?.folder_id,
    };

    const apiResponse = await ApiController.fileUploadSuccess(
      fileUploadSuccessPayload,
    );
    handleAPIResponse({
      apiResponse: apiResponse,
      silentError: true,
      handleSuccess: () => {
        const folder_content: UserFolderContentMetadata = apiResponse?.data
          ?.folder_content as UserFolderContentMetadata;
        if (folder_content instanceof Object) {
          if (
            folderContentsMapping?.[content?.folder_id]
              ?.folder_content instanceof Array
          ) {
            setFolderContentsMapping(val => ({
              ...val,
              [content?.folder_id]: {
                ...val?.[content?.folder_id],
                folder_content: [
                  folder_content,
                  ...val?.[content?.folder_id]?.folder_content,
                ],
                folder_size:
                  val?.[content?.folder_id]?.folder_size +
                  (folder_content.content_size ?? 0),
                folder_content_count:
                  val?.[content?.folder_id]?.folder_content_count + 1,
              },
            }));
          }
        }

        deleteContentFromQueue(content);
        // if (uploadInProgress.current[content?.file_id]) {
        //   delete uploadInProgress.current[content?.file_id];
        // }

        // const message = TOAST_MESSAGES.fileSuccessfullyUploaded.replace(
        //   '[FILE_NAME]',
        //   content.file_name,
        // );
        // toast.success(message, { toastId: message });
      },
      handleError: () => {
        setContentQueuedForUpload(val => {
          const updatedQueue = [...val];
          const contentFileIdIndex = updatedQueue.findIndex(
            item => item?.file_id === content?.file_id,
          );
          if (contentFileIdIndex !== -1) {
            updatedQueue[contentFileIdIndex].upload_status =
              CONTENT_UPLOADER_UPLOAD_STATUS.ERROR;
          }
          return updatedQueue;
        });
        if (retriesLeft > 0) {
          setTimeout(() => {
            handleFileUploadSuccess(content, retriesLeft - 1);
          }, 2000);
        } else {
          deleteContentFromQueue(content);
        }
      },
    });
  }

  useEffect(() => {
    contentQueuedForUpload?.map?.(content => {
      if (!uploadInProgress.current?.[content?.file_id]) {
        uploadInProgress.current[content?.file_id as string] = true;
        const upload = new ResumableUploadController({
          resumable_upload_url: content.resumable_upload_url,
          blob: content.file,
          contentUploadInformation: content,
          handleOnUploadSuccess: content => {
            handleFileUploadSuccess(content);
          },
        });

        if (upload.blob) {
          upload.uploadBlob(upload.blob);
        }
      }
    });
  }, [contentQueuedForUpload]);

  return {
    addContentInQueue,
    contentQueuedForUpload,
    deleteContentFromQueue,
  };
}

export default useContentUploader;
