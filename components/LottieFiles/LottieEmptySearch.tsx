import Lottie from 'lottie-react';
import loader from '@/assets/lottie/emptySearch.json';
import { ReactNode } from 'react';

interface Props {
  message?: string | ReactNode;
  stylingClassName?: string;
  lottieClassName?: string;
}

const LottieEmptySearch = ({
  message,
  stylingClassName,
  lottieClassName,
}: Props) => {
  return (
    <div
      className={`${stylingClassName} w-fit h-fit flex flex-col gap-[16px] justify-center items-center`}>
      <Lottie className={lottieClassName} animationData={loader} />

      {!!message && (
        <p className={`text-text font-semibold text-[12px] text-center`}>
          {message}{' '}
        </p>
      )}
    </div>
  );
};

export default LottieEmptySearch;
