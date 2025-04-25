import React, { ReactNode } from 'react';

type Props = {
  className?: string;
  handleOnClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  children?: ReactNode;
  buttonStyle?: 'primary' | 'secondary';
};

function Button({
  className,
  handleOnClick,
  children,
  buttonStyle = 'primary',
  ...props
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      onClick={event => {
        handleOnClick(event);
      }}
      className={`${
        className ? className : ''
      } h-[48px] box-border px-[16px] rounded-md ${
        buttonStyle === 'primary'
          ? 'bg-primary hover:bg-primary/90 active:bg-primary text-background font-medium'
          : 'bg-transparent hover:bg-primary text-primary hover:text-background border-2 border-primary '
      } cursor-pointer disabled:bg-backgroundGray disabled:cursor-not-allowed`}>
      {children && children}
    </button>
  );
}

export default Button;
