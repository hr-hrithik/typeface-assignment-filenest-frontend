import React, { ReactNode } from 'react';
import Titlebar from '@/components/Titlebar';
import { useConfigurationContext } from '@/context/ConfigurationContextProvider';
import LottieLoading from '@/components/LottieFiles/LottieLoading';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@/components/Button';
import UpdateSVGIcon from '@/components/CustomSVGIcons/UpdateSVGIcon';
import UploadingContentDetails from '@/components/UploadingContentDetails';
import { ToastSettings } from '@/utils/constants';
import SignoutSVGIcon from '@/components/CustomSVGIcons/SignoutSVGIcon';

type Props = {
  children: ReactNode;
};

function Layout({ children }: Props) {
  const {
    userLogin,
    onAuthLoadPending,
    getUserProfile,
    handleSignOut,
    contentUploader,
  } = useConfigurationContext();

  return (
    <div
      className={`absolute w-full h-full overflow-hidden bg-background flex flex-col`}>
      <ToastContainer
        stacked={ToastSettings.stacked}
        newestOnTop={ToastSettings.newestOnTop}
      />

      {!!userLogin && (
        <div className={`w-full`}>
          <Titlebar />
        </div>
      )}

      <div className={`flex-1 flex flex-col overflow-hidden`}>
        {onAuthLoadPending ? (
          <div className={`flex flex-1 justify-center items-center`}>
            <LottieLoading stylingClassName={`w-[144px]`} />
          </div>
        ) : userLogin === null ? (
          <div
            className={`flex flex-1 flex-col gap-[16px] justify-center items-center`}>
            <LottieLoading stylingClassName={`w-[144px]`} />
            <div className={`flex gap-[12px]`}>
              <Button handleOnClick={getUserProfile}>
                <div className={`flex gap-[8px] items-center`}>
                  <div
                    className={`w-[18px] h-[18px] flex justify-center items-center relative`}>
                    <UpdateSVGIcon />
                  </div>

                  <div>
                    <p className={`text-[14px] font-bold`}>Retry</p>
                  </div>
                </div>
              </Button>

              <Button
                buttonStyle='secondary'
                handleOnClick={handleSignOut}
                className={`group`}>
                <div className={`flex gap-[8px] items-center`}>
                  <div
                    className={`w-[18px] h-[18px] flex justify-center items-center relative`}>
                    <SignoutSVGIcon
                      className={`stroke-primary group-hover:stroke-black`}
                    />
                  </div>

                  <div>
                    <p className={`text-[14px] font-bold truncate`}>Log out</p>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        ) : (
          children
        )}
      </div>

      {!!contentUploader?.contentQueuedForUpload?.length && (
        <UploadingContentDetails />
      )}
    </div>
  );
}

export default Layout;
