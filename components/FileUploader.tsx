import React, { useState } from 'react';
import UploadSVGIcon from '@/components/CustomSVGIcons/UploadSVGIcon';
import { UI_STRINGS_CONSTANTS } from '@/utils/UIStringConstants';
import InputFileHandler from '@/components/InputFileHandler';
import LottieLoading from '@/components/LottieFiles/LottieLoading';
import { ApiController } from '@/ApiManager/ApiController';
import { useConfigurationContext } from '@/context/ConfigurationContextProvider';
import {
  UserFilesResumableUploadRequest,
  UserFilesResumableUploadResponse,
} from '@/models/UserFiles';
import { handleAPIResponse } from '@/utils/Helper';
import { ContentUploadInformation } from '@/models/CommonModels';
import { CONTENT_UPLOADER_UPLOAD_STATUS } from '@/utils/constants';

type Props = {
  folder_id?: string;
};

function FileUploader({ folder_id }: Props) {
  const { userLogin, contentUploader } = useConfigurationContext();
  const [loading, setLoading] = useState(false);

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
      disabled={loading}
      allowMultipleFiles={true}
      className={`w-full max-w-[360px] aspect-square flex justify-center items-center relative`}
      handleInputFile={handleInputFileUpload}
      id={`user-file-handler`}>
      <div
        className={`w-full h-full relative border-[4px] flex justify-center items-center rounded-lg border-primary border-dashed transition-[background-color] hover:bg-black/15 cursor-pointer active:bg-transparent`}>
        {loading ? (
          <LottieLoading stylingClassName={``} />
        ) : (
          <div className={`flex justify-center items-center h-full`}>
            <div
              className={`flex flex-col justify-center items-center p-[16px] gap-[8px]`}>
              <UploadSVGIcon className={`stroke-white w-[32%]`} />
              <div className={``}>
                <p
                  className={`text-white text-[12px] md:text-[14px] text-center`}>
                  {UI_STRINGS_CONSTANTS.selectFileToUpload}
                </p>
                <p className={`text-[12px] text-white text-center`}>
                  {UI_STRINGS_CONSTANTS.maxFileSizeString}{' '}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </InputFileHandler>
  );
}

export default FileUploader;
