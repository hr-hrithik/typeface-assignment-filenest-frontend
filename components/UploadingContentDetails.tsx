import { useConfigurationContext } from '@/context/ConfigurationContextProvider';
import React, { useEffect, useState } from 'react';
import ChevronDownSVGIcon from '@/components/CustomSVGIcons/ChevronDownSVGIcon';
import { convertFileSizeToString } from '@/utils/Helper';
import LottieLoading from '@/components/LottieFiles/LottieLoading';
import DeleteSVGIcon from '@/components/CustomSVGIcons/DeleteSVGIcon';
import { ContentUploadInformation } from '@/models/CommonModels';
import { CONTENT_UPLOADER_UPLOAD_STATUS } from '@/utils/constants';

type Props = {};

function UploadingContentDetails({}: Props) {
  const { contentUploader } = useConfigurationContext();

  const [showUploadInformationCard, setShowUploadInformationCard] =
    useState<boolean>(false);

  function handleUploadInformationCardTitlebarClick() {
    setShowUploadInformationCard(val => !val);
  }

  // function handleDeleteContentFromQueue(
  //   contentInformation: ContentUploadInformation,
  // ) {
  //   contentUploader?.deleteContentFromQueue?.(contentInformation);
  // }

  useEffect(() => {
    if (contentUploader?.contentQueuedForUpload?.length) {
      setShowUploadInformationCard(true);
    }
  }, [contentUploader.contentQueuedForUpload]);

  return (
    <div
      className={`w-[360px] h-fit max-h-[420px] absolute border-[1px] rounded-lg z-[32] bg-black/50 right-[16px] ${
        showUploadInformationCard ? 'bottom-[16px]' : 'bottom-[16px]'
      } transition-all duration-500 overflow-hidden border-primary`}>
      <div
        onClick={handleUploadInformationCardTitlebarClick}
        className={`px-[12px] py-[12px] bg-primary flex gap-[12px] justify-between items-cente cursor-pointer`}>
        <div>
          <p className={`text-[14px] font-bold`}>
            {`Uploading ${
              contentUploader?.contentQueuedForUpload?.length || 0
            } files...`}{' '}
          </p>
        </div>

        <div
          className={`w-[18px] h-[18px] min-w-[18px] flex justify-center items-center relative`}>
          <ChevronDownSVGIcon
            className={`${
              showUploadInformationCard ? 'rotate-0' : 'rotate-180'
            } transition-[rotate] duration-500 w-fit h-fit`}
          />
        </div>
      </div>

      <div
        className={`${
          showUploadInformationCard ? 'h-[232px]' : 'h-0'
        } transition-[height] duration-500 bg-backgroundGray divide-y-[1px] divide-background`}>
        <div className={`relative h-full overflow-y-scroll bg-black/50`}>
          {contentUploader?.contentQueuedForUpload?.map?.((content, index) => (
            <div
              key={`${content.file_id}-${index}`}
              className={`px-[12px] py-[8px] flex gap-[8px] group hover:bg-black/50 overflow-x-hidden`}>
              <div className={`flex-1 overflow-hidden`}>
                <p
                  className={`text-[14px] font-bold text-primary line-clamp-1 truncate`}>
                  {content?.file_name || ''}{' '}
                </p>
                <p className={`text-[12px] font-medium text-white`}>
                  {convertFileSizeToString(content?.file_size)}
                </p>
              </div>

              <div className={`flex gap-[8px] items-center`}>
                {content?.upload_status ===
                CONTENT_UPLOADER_UPLOAD_STATUS.PENDING ? (
                  <div
                    className={`w-[32px] h-[32px] flex justify-center items-center relative`}>
                    <LottieLoading stylingClassName={`!w-[32px] !h-[32px]`} />
                  </div>
                ) : content?.upload_status ===
                  CONTENT_UPLOADER_UPLOAD_STATUS.ERROR ? (
                  <div
                    className={`flex justify-center items-center relative bg-red-300 px-[8px] py-[4px] rounded-md`}>
                    <p className={`text-[12px] text-red-800 font-bold`}>
                      Failed
                    </p>
                  </div>
                ) : content?.upload_status ===
                  CONTENT_UPLOADER_UPLOAD_STATUS.SUCCESS ? (
                  <div
                    className={`flex justify-center items-center relative bg-green-300 px-[8px] py-[4px] rounded-md`}>
                    <p className={`text-[12px] text-green-800 font-bold`}>
                      Success
                    </p>
                  </div>
                ) : (
                  <></>
                )}
                {/* <div
                  onClick={() => {
                    handleDeleteContentFromQueue(content);
                  }}
                  className={`w-[18px] h-[18px] hidden group-hover:flex justify-center items-center relative cursor-pointer`}>
                  <DeleteSVGIcon className={``} />
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div></div>
    </div>
  );
}

export default UploadingContentDetails;
