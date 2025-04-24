import React, { useState } from 'react';
import CompanyLogo from '@/components/CompanyLogo';
import { useConfigurationContext } from '@/context/ConfigurationContextProvider';
import Image from 'next/image';
import OutsideClickCapturer from '@/components/OutsideClickCapturer';

type Props = {};

function Titlebar({}: Props) {
  const { userLogin, handleSignOut } = useConfigurationContext();
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  const profileOptions = [
    {
      name: 'Sign out',
      key: 'sign-out',
      handleOnclick: () => {
        handleSignOut();
        setShowProfileMenu(false);
      },
    },
  ];

  function handleProfileButtonClick(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    event.stopPropagation();
    setShowProfileMenu(val => !val);
  }

  function handleOutsideProfileMenuClick() {
    setShowProfileMenu(false);
  }

  return (
    <div className={`px-[16px] py-[12px] flex`}>
      <div className={``}>
        <CompanyLogo />
      </div>
      <div className={`flex-1 flex justify-end items-center`}>
        <div className={`w-fit relative`}>
          <div
            onClick={handleProfileButtonClick}
            className={`w-fit px-[16px] py-[12px] bg-black/25 hover:bg-black/50 cursor-pointer transition-[background-color] duration-500 rounded-lg relative`}>
            <div className={`flex gap-[12px] items-center`}>
              {!!userLogin?.user_name && (
                <div
                  className={`text-[14px] font-bold text-primary hidden md:block`}>
                  <p>{userLogin?.user_name} </p>
                </div>
              )}

              <div
                className={`flex w-[32px] h-[32px] min-w-[32px] rounded-full bg-primary justify-center items-center text-[18px] font-bold relative overflow-hidden`}>
                {!!userLogin?.user_profile_image ? (
                  <Image alt='icon' fill src={userLogin?.user_profile_image} />
                ) : (
                  <p>{userLogin?.user_name?.[0] || 'U'} </p>
                )}
              </div>
            </div>
          </div>

          {showProfileMenu && (
            <OutsideClickCapturer
              handleClickOutside={handleOutsideProfileMenuClick}>
              <div
                className={`absolute w-fit min-w-full bg-background right-0 top-[64px] rounded-lg overflow-hidden z-[8]`}>
                {profileOptions.map((option, index) => (
                  <div key={`profile-option-${index}`} className={``}>
                    <p
                      onClick={option.handleOnclick}
                      className={`px-[12px] py-[12px] bg-black/50 truncate text-[14px] font-bold text-primary hover:bg-primary hover:text-background cursor-pointer`}>
                      {option.name}
                    </p>
                  </div>
                ))}
              </div>
            </OutsideClickCapturer>
          )}
        </div>
      </div>
    </div>
  );
}

export default Titlebar;
