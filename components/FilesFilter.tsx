import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Button from '@/components/Button';
import FilterSVGIcon from '@/components/CustomSVGIcons/FilterSVGIcon';
import { FILES_FILTER_KEYS } from '@/utils/constants';
import CheckboxSVGIcon from '@/components/CustomSVGIcons/CheckboxSVGIcon';
import OutsideClickCapturer from '@/components/OutsideClickCapturer';

type Props = {
  selectedFilters: string[];
  setSelectedFilters: Dispatch<SetStateAction<string[]>>;
};

function FilesFilter({ selectedFilters, setSelectedFilters }: Props) {
  const [showFilesFiltersMenu, setShowFilesFiltersMenu] = useState(false);
  const [allSelected, setAllSelected] = useState<boolean>(false);

  function handleSelectFilterClick(filter: string) {
    if (selectedFilters?.includes?.(filter)) {
      setSelectedFilters(val => val?.filter?.(item => item !== filter));
    } else {
      setSelectedFilters(val => [...val, filter]);
    }
  }

  function handleOutsideClick() {
    setShowFilesFiltersMenu(false);
  }

  function handleFiltersButtonClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    event.stopPropagation();
    setShowFilesFiltersMenu(val => !val);
  }

  function handleSelectAllClick() {
    if (!allSelected) {
      setSelectedFilters(Object.values(FILES_FILTER_KEYS));
    } else {
      setSelectedFilters([]);
    }
  }

  useEffect(() => {
    setAllSelected(
      selectedFilters?.length === Object.keys(FILES_FILTER_KEYS)?.length,
    );
  }, [selectedFilters]);

  return (
    <div>
      <Button className={`mt-[6px]`} handleOnClick={handleFiltersButtonClick}>
        <div className={`flex gap-[12px] items-center`}>
          <div
            className={`w-[18px] h-[18px] flex justify-center items-center relative`}>
            <FilterSVGIcon className={``} />
          </div>
        </div>
      </Button>

      {showFilesFiltersMenu && (
        <OutsideClickCapturer handleClickOutside={handleOutsideClick}>
          <div
            className={`absolute bg-background px-[12px] py-[8px] cursor-pointer w-[156px] rounded-lg border-backgroundGray border-[1px] right-[16px] top-[72px] z-[8]`}>
            <div
              onClick={() => {
                handleSelectAllClick();
              }}
              className={`flex gap-[12px] group items-center px-[12px] py-[8px] hover:bg-backgroundGray/25 rounded-lg`}>
              <div>
                <CheckboxSVGIcon
                  className={`${
                    allSelected ? 'fill-white' : 'fill-backgroundGray'
                  } `}
                  isChecked={allSelected}
                />
              </div>

              <div className={``}>
                <p
                  className={`text-[14px] ${
                    allSelected ? 'text-white' : 'text-backgroundGray'
                  } group-hover:text-lightGray  font-bold`}>
                  Select all
                </p>
              </div>
            </div>

            {Object.values(FILES_FILTER_KEYS)?.map?.((filter, index) => (
              <div
                onClick={() => {
                  handleSelectFilterClick(filter);
                }}
                key={`files-filter-index-${index}`}
                className={`flex gap-[12px] group items-center px-[12px] py-[8px] hover:bg-backgroundGray/25 rounded-lg`}>
                <div>
                  <CheckboxSVGIcon
                    className={`${
                      selectedFilters?.includes?.(filter)
                        ? 'fill-primary'
                        : 'fill-backgroundGray'
                    } `}
                    isChecked={selectedFilters?.includes?.(filter)}
                  />
                </div>

                <div className={``}>
                  <p
                    className={`text-[14px] ${
                      selectedFilters?.includes?.(filter)
                        ? 'text-primary'
                        : 'text-backgroundGray'
                    } group-hover:text-lightGray  font-bold`}>
                    {filter}{' '}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </OutsideClickCapturer>
      )}
    </div>
  );
}

export default FilesFilter;
