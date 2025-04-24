import React, { useState } from 'react';
import InputFileHandler from '@/components/InputFileHandler';
import UploadFileSVGIcon from '@/components/CustomSVGIcons/UploadFileSVGIcon';
import Button from '@/components/Button';
import { useConfigurationContext } from '@/context/ConfigurationContextProvider';
import { ApiController } from '@/ApiManager/ApiController';
import {
  UserFilesResumableUploadRequest,
  UserFilesResumableUploadResponse,
} from '@/models/UserFiles';
import { handleAPIResponse } from '@/utils/Helper';
import { ContentUploadInformation } from '@/models/CommonModels';
import { CONTENT_UPLOADER_UPLOAD_STATUS } from '@/utils/constants';
import LottieLoading from '@/components/LottieFiles/LottieLoading';

type Props = {
  folder_id: string;
};

function UploadFileButton({ folder_id }: Props) {
  const inputFileHandlerId = `upload-user-file-button`;
  const { userLogin, contentUploader } = useConfigurationContext();
  const [loading, setLoading] = useState<boolean>(false);

  function handleUploadFileButtonClick() {
    if (loading) {
      return;
    }

    const inputElement = document.getElementById(inputFileHandlerId);
    if (inputElement instanceof HTMLInputElement) {
      inputElement.click();
    }
  }

  async function handleInputFileUpload(files: File[]) {
    if (!userLogin?.user_uid || !folder_id || !(files instanceof Array)) {
      return;
    }

    const userFilesResumableUploadPayload: UserFilesResumableUploadRequest = {
      user_id: userLogin?.user_uid,
      folder_id: folder_id,
      files: [],
    };

    const contentUploadIinformation: {
      [key: string]: ContentUploadInformation;
    } = {};

    files?.map?.((file, index) => {
      if (!(file instanceof File)) {
        return;
      }
      const file_request_id = index.toString();
      userFilesResumableUploadPayload.files.push({
        file_request_id: file_request_id,
        file_name: file.name,
        file_size: file.size,
        file_modified_at: file.lastModified,
        mime_type: file.type,
      });

      contentUploadIinformation[file_request_id] = {
        file: file,
        file_id: '',
        resumable_upload_url: '',
        file_name: file.name,
        file_size: file.size,
        folder_id: folder_id,
        upload_status: CONTENT_UPLOADER_UPLOAD_STATUS.PENDING,
      };
    });

    setLoading(true);
    const apiResponse = await ApiController.userFilesResumableUpload(
      userFilesResumableUploadPayload,
    );

    handleAPIResponse({
      apiResponse: apiResponse,
      handleSuccess: () => {
        const response: UserFilesResumableUploadResponse =
          apiResponse?.data as UserFilesResumableUploadResponse;

        if (response instanceof Object) {
          Object.keys(response?.files)?.map?.(file_request_id => {
            if (Object.hasOwn(contentUploadIinformation, file_request_id)) {
              contentUploadIinformation[file_request_id].file_id =
                response?.files?.[file_request_id]?.file_id;

              contentUploadIinformation[file_request_id].resumable_upload_url =
                response?.files?.[file_request_id]?.resumable_upload_url;
            }
          });
        }

        const finalContentForUpload: ContentUploadInformation[] = [];
        if (contentUploadIinformation instanceof Object) {
          Object.values(contentUploadIinformation)?.map(content => {
            if (
              content?.file instanceof File &&
              typeof content?.resumable_upload_url === 'string' &&
              typeof content?.file_id === 'string'
            ) {
              finalContentForUpload.push(content);
            }
          });
        }

        contentUploader.addContentInQueue(finalContentForUpload);
      },
    });

    setLoading(false);
  }
  return (
    <InputFileHandler
      id={inputFileHandlerId}
      allowMultipleFiles={true}
      handleInputFile={handleInputFileUpload}>
      <Button
        disabled={loading}
        handleOnClick={handleUploadFileButtonClick}
        className={`mt-[6px]`}>
        <div className={`flex gap-[8px] items-center`}>
          <div
            className={`w-[18px] h-[18px] flex justify-center items-center relative`}>
            {!loading ? (
              <UploadFileSVGIcon
                className={`stroke-black flex justify-center items-center`}
              />
            ) : (
              <LottieLoading stylingClassName={`!w-[18px] !h-[18px]`} />
            )}
          </div>
          <div className={`hidden md:block `}>
            <p className={`text-[14px] font-semibold truncate`}>Upload file</p>
          </div>
        </div>
      </Button>
    </InputFileHandler>
  );
}

export default UploadFileButton;
