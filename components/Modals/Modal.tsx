import React, { ReactNode, useEffect } from 'react';
import CloseSVGIcon from '@/components/CustomSVGIcons/CloseSVGIcon';

type Props = {
  children: ReactNode;
  showCloseButton?: boolean;
  title?: string | ReactNode;
  handleClose: () => void;
  showModal?: boolean;
  className?: string;
};

function Modal({
  title = '',
  showCloseButton = true,
  children,
  handleClose,
  showModal = true,
  className = 'h-full',
}: Props) {
  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleClose && handleClose();
      }
    }
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <div
      className={`${
        showModal ? 'fixed' : 'hidden'
      } w-full h-full left-0 top-0 z-[32] flex justify-center items-center`}>
      <div
        className={`px-[24px] py-[24px] bg-background w-full ${className} max-h-[640px] gap-[16px] flex flex-col mx-[16px] max-w-[640px] border-[1px] rounded-lg border-primary relative`}>
        <div className={`flex gap-[8px]`}>
          <div className={`flex-1 overflow-x-hidden`}>{title}</div>
          <div
            onClick={handleClose}
            className={`relative w-[24px] h-[24px] flex justify-center items-center float-right cursor-pointer`}>
            <CloseSVGIcon className={`stroke-white fill-white`} />
          </div>
        </div>
        <div className={`flex-1`}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
