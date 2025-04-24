import React from 'react';
import Lottie from 'lottie-react';
import lottieLoadingAnimation from '@/assets/lottie/loadingBubbleLottie.json';

interface Props {
  stylingClassName?: string;
  lottieClassName?: string;
}

const LottieLoading = ({ stylingClassName, lottieClassName }: Props) => {
  return (
    <div className={`${stylingClassName} w-[128px] h-[128px]`}>
      <Lottie
        className={lottieClassName}
        animationData={lottieLoadingAnimation}
      />
    </div>
  );
};

export default LottieLoading;
