import React, { ReactNode, useEffect, useRef } from 'react';

interface Props {
  children?: ReactNode;
  bubbleClick?: boolean;
  handleClickOutside: () => void;
  stylingClass?: string;
}

const OutsideClickCapturer = ({
  children,
  bubbleClick = false,
  handleClickOutside,
  stylingClass = '',
}: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClickListener(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        handleClickOutside && handleClickOutside();
      }
    }

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleClickOutside && handleClickOutside();
      }
    }

    document.addEventListener('click', handleOutsideClickListener, {
      capture: bubbleClick,
    });

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('click', handleOutsideClickListener, {
        capture: bubbleClick,
      });
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef} className={`${stylingClass}`}>
      {children}
    </div>
  );
};

export default OutsideClickCapturer;
