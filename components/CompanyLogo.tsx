import { PATHS } from '@/utils/Paths';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {
  allowClick?: boolean;
};

function CompanyLogo({ allowClick = true }: Props) {
  const router = useRouter();

  function handleCompanyLogoClick() {
    if (allowClick) {
      router.push({
        pathname: PATHS.home,
      });
    }
  }
  return (
    <div onClick={handleCompanyLogoClick}>
      <div
        className={`flex text-[32px] gap-[2px] ${
          allowClick && 'cursor-pointer'
        }`}>
        <p className={`text-white font-semibold`}>File</p>
        <p className={`text-primary font-extrabold`}>Nest</p>
      </div>
    </div>
  );
}

export default CompanyLogo;
