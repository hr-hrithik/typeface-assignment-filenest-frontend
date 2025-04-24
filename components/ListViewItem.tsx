import { UserFolderContentMetadata } from '@/models/UserFiles';
import React, { useState } from 'react';
import DotsMenuSVGIcon from '@/components/CustomSVGIcons/DotsMenuSVGIcon';
import DeleteSVGIcon from '@/components/CustomSVGIcons/DeleteSVGIcon';
import OutsideClickCapturer from '@/components/OutsideClickCapturer';
import UpdateSVGIcon from '@/components/CustomSVGIcons/UpdateSVGIcon';
import { convertISOToDateString } from '@/utils/Helper';
import CustomImage from '@/components/CustomImage';

type Props = {
  content: UserFolderContentMetadata;
  index: number;
  handleFileSelectClick: (content: UserFolderContentMetadata) => void;
  handleDeleteContent: (content: UserFolderContentMetadata) => void;
};

function ListViewItem({
  content,
  index,
  handleFileSelectClick,
  handleDeleteContent,
}: Props) {
  const [showOptionsMenu, setShowOptionsMenu] = useState<boolean>(false);

  const optionsMenu = [
    {
      name: 'Update',
      key: 'update-file',
      icon: <UpdateSVGIcon />,
      className: 'text-background',
      handleClick: handleFileSelectClick,
    },
    {
      name: 'Delete',
      key: 'delete-file',
      icon: <DeleteSVGIcon />,
      className: 'text-red-600',
      handleClick: handleDeleteContent,
    },
  ];

  function handleMenuDotsClick(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    event.stopPropagation();
    setShowOptionsMenu(val => !val);
  }

  function handleClickOutsideHandler() {
    setShowOptionsMenu(false);
  }
  return (
    <div
      key={content?.content_id}
      onClick={() => {
        handleFileSelectClick(content);
      }}
      className={`flex px-[24px] py-[18px] gap-[18px] items-center bg-black/25 ${
        showOptionsMenu ? '' : 'hover:bg-black/50'
      } group border-[1px] border-backgroundGray rounded-sm cursor-pointer`}>
      <div
        className={`w-[32px] h-[32px] min-w-[32px] md:w-[36px] md:h-[36px] md:min-w-[36px] flex justify-centere items-center relative`}>
        <CustomImage alt='' fill src={content?.content_thumbnail_url} />
      </div>

      <div className={`flex-1 overflow-hidden`}>
        <p
          className={`text-white ${
            showOptionsMenu ? '' : 'group-hover:text-primary'
          } text-[12px] md:text-[14px] line-clamp-2 font-bold`}>
          {content?.content_name || 'File'}
        </p>
        <p
          className={`text-[10px] md:text-[12px] font-semibold text-backgroundGray group-hover:text-white`}>
          {`${content?.content_file_type} | ${convertISOToDateString(
            content?.content_last_modified || '',
          )}`}
        </p>
      </div>

      <div className={`relative`}>
        <div
          onClick={handleMenuDotsClick}
          className={`w-[28px] h-[28px] flex justify-center items-center relative hover:bg-primary/50 p-[2px] rounded-md`}>
          <DotsMenuSVGIcon className={`stroke-white`} />
        </div>

        {showOptionsMenu && (
          <OutsideClickCapturer handleClickOutside={handleClickOutsideHandler}>
            <div
              className={`absolute right-0 w-[128px] top-[32px] rounded-lg z-[12] bg-white overflow-hidden`}>
              {optionsMenu.map((option, index) => (
                <div
                  onClick={event => {
                    event.stopPropagation();
                    option.handleClick(content);
                    setShowOptionsMenu(false);
                  }}
                  key={`${content?.content_id}-${option?.key}-${index}`}
                  className={`flex items-center gap-[8px] px-[16px] py-[8px] hover:bg-primary/50 cursor-pointer`}>
                  <div
                    className={`w-[16px] h-[16px] flex justify-center items-center relative`}>
                    {option?.icon}
                  </div>
                  <p className={`${option.className} text-[14px] font-medium`}>
                    {option?.name}
                  </p>
                </div>
              ))}
            </div>
          </OutsideClickCapturer>
        )}
      </div>
    </div>
  );
}

export default ListViewItem;
