import { ApiController } from '@/ApiManager/ApiController';
import Button from '@/components/Button';
import CloseSVGIcon from '@/components/CustomSVGIcons/CloseSVGIcon';
import FilterSVGIcon from '@/components/CustomSVGIcons/FilterSVGIcon';
import FileViewer from '@/components/FileViewer';
import Input from '@/components/Input';
import LottieLoading from '@/components/LottieFiles/LottieLoading';
import UploadFileButton from '@/components/UploadFileButton';
import { useConfigurationContext } from '@/context/ConfigurationContextProvider';
import { UserFolderContentsResponse } from '@/models/UserFiles';
import { handleAPIResponse } from '@/utils/Helper';
import { PATHS } from '@/utils/Paths';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const {
    userLogin,
    folderContentsMapping,
    setFolderContentsMapping,
    onAuthLoadPending,
  } = useConfigurationContext();

  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [searchString, setSearchString] = useState<string>('');

  function handleSearchInputValueChange(value: string) {
    setSearchString(value);
  }

  function handleInputBoxElementClick() {
    setSearchString('');
  }

  function initialiseCurrentPath() {
    setCurrentPath([
      userLogin?.user_name ? `${userLogin?.user_name}'s Nest` : 'Root Folder',
    ]);
  }

  async function getFolderContents(folderId: string) {
    const apiResponse = await ApiController.getFolderContents(folderId);
    handleAPIResponse({
      apiResponse: apiResponse,
      handleSuccess: () => {
        const response: UserFolderContentsResponse =
          apiResponse?.data as UserFolderContentsResponse;

        if (response instanceof Object) {
          setFolderContentsMapping(val => ({
            ...val,
            [folderId]: response,
          }));
        }
      },

      handleError: () => {
        if (userLogin?.root_folder_id) {
          router.push({
            pathname: PATHS.home,
            query: { folder_id: userLogin?.root_folder_id },
          });
        } else {
          router.push({
            pathname: PATHS.login,
          });
        }
      },
    });
  }

  useEffect(() => {
    initialiseCurrentPath();
  }, []);

  useEffect(() => {
    const { folder_id } = router?.query;
    if (!onAuthLoadPending) {
      if (typeof folder_id === 'string' && userLogin?.user_uid) {
        getFolderContents(folder_id);
      } else {
        if (userLogin?.root_folder_id) {
          router.push({
            pathname: PATHS.home,
            query: { folder_id: userLogin?.root_folder_id },
          });
        } else {
          router.push({
            pathname: PATHS.login,
          });
        }
      }
    }
  }, [router?.query?.folder_id, userLogin, onAuthLoadPending]);

  return (
    <div
      className={`flex flex-col overflow-hidden flex-1 px-[16px] py-[12px] relative`}>
      {!!folderContentsMapping?.[router?.query?.folder_id as string] ? (
        <div className={`flex-1 flex flex-col overflow-hidden gap-[32px]`}>
          <div className={`flex gap-[16px]`}>
            <UploadFileButton folder_id={router?.query?.folder_id as string} />

            <div className={`flex-1`}>
              <Input
                inputValue={searchString}
                id={`files-search-input`}
                title={`Search your files`}
                handleInputValueChange={handleSearchInputValueChange}
                inputBoxElement={
                  !!searchString ? (
                    <div
                      onClick={handleInputBoxElementClick}
                      className={`w-[18px] h-[18px] flex justify-center items-center relative cursor-pointer`}>
                      <CloseSVGIcon className={`stroke-primary fill-primary`} />
                    </div>
                  ) : (
                    <></>
                  )
                }
              />
            </div>

            <Button className={`mt-[6px]`} handleOnClick={() => {}}>
              <div className={`flex gap-[12px] items-center`}>
                <div
                  className={`w-[18px] h-[18px] flex justify-center items-center relative`}>
                  <FilterSVGIcon className={``} />
                </div>
              </div>
            </Button>
          </div>

          <div className={`flex-1 flex flex-col overflow-hidden`}>
            <FileViewer
              folderId={router?.query?.folder_id as string}
              currentPath={currentPath}
              folderContents={
                folderContentsMapping?.[router?.query?.folder_id as string]
              }
              searchString={searchString}
            />
          </div>
        </div>
      ) : (
        <div className={`flex-1 flex justify-center items-center`}>
          <LottieLoading />
        </div>
      )}
    </div>
  );
}
