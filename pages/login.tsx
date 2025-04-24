import { projectIcons } from '@/assets/icons';
import Button from '@/components/Button';
import CompanyLogo from '@/components/CompanyLogo';
import { useConfigurationContext } from '@/context/ConfigurationContextProvider';
import { FirebaseAuth } from '@/utils/Firebase';
import { PATHS } from '@/utils/Paths';
import { UI_STRINGS_CONSTANTS } from '@/utils/UIStringConstants';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

type Props = {};

function Login({}: Props) {
  const router = useRouter();
  const { userLogin, getUserProfile } = useConfigurationContext();

  async function handleLoginButtonClick() {
    const response = await FirebaseAuth.performAuth();
    if (response) {
      getUserProfile();
    }
  }

  useEffect(() => {
    if (userLogin?.user_uid) {
      router.push({
        pathname: PATHS.home,
      });
    }
  }, [userLogin]);

  return (
    <div className={`flex justify-center items-center h-full`}>
      <div
        className={`w-full max-w-[480px] px-[36px] py-[24px] border-[1px] rounded-lg border-primary shadow-[0px_0px_144px_8px_#fed76664]`}>
        <div>
          <div className={``}>
            <CompanyLogo />
          </div>
          <p className={`text-white text-[14px] font-medium`}>
            {UI_STRINGS_CONSTANTS.companytagLine}{' '}
          </p>
        </div>

        <div className={`mt-[36px] w-full flex flex-col gap-[24px]`}>
          <div>
            <Button
              className={`w-full`}
              buttonStyle={`secondary`}
              handleOnClick={handleLoginButtonClick}>
              <div className={`flex gap-[12px] items-center justify-center`}>
                <div
                  className={`w-[18px] h-[18px] flex justify-centere items-center relative`}>
                  <Image alt='icon' src={projectIcons.google} />
                </div>
                <p
                  className={`text-[14px] font-medium flex justify-center items-center`}>
                  Sign in with Google
                </p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
