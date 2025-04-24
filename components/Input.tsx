import React, { ReactNode, useEffect, useState } from 'react';

type Props = {
  title?: string;
  heightClass?: string;
  inputValue: string | number;
  inputType?: string;
  handleInputValueChange: (value: string) => void;
  stylingClass?: string;
  inputStylingClass?: string;
  placeholderText?: string;
  isEditable?: boolean;
  inputBoxElement?: ReactNode;
  inputRef?: React.MutableRefObject<HTMLInputElement>;
};

function Input({
  title,
  heightClass = 'h-[48px]',
  inputValue = '',
  inputType = 'text',
  handleInputValueChange,
  stylingClass,
  inputStylingClass,
  placeholderText,
  isEditable = true,
  inputBoxElement,
  inputRef,
  ...props
}: Props & React.InputHTMLAttributes<HTMLInputElement>) {
  const [hasFocus, setHasFocus] = useState(false);

  useEffect(() => {
    if (props?.id) {
      const inputField: HTMLInputElement = document.getElementById(
        props?.id,
      ) as HTMLInputElement;

      if (inputField instanceof HTMLInputElement) {
        inputField.onfocus = event => {
          event.preventDefault();
          if (isEditable) {
            setHasFocus(true);
          }
        };

        inputField.onblur = () => {
          setHasFocus(false);
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.id, isEditable]);

  return (
    <div className={`${stylingClass} relative mt-[6px]`}>
      {title && (
        <div
          className={`duration-300 transition-all absolute font-medium pointer-events-none flex max-w-full
            ${
              hasFocus ||
              inputValue ||
              (typeof inputValue === 'number' && !Number.isNaN(inputValue))
                ? '-top-[8.8px] text-[12px] text-primary left-[8px] px-[4px] bg-background py-0'
                : `top-[13px] text-backgroundGray pl-0 left-[12px] pr-[12px] text-[14px] h-fit bg-transparent`
            }
            `}>
          <div className={`flex-1`}>
            <p className={`min-w-fit line-clamp-1`}>
              {placeholderText ? (hasFocus ? title : placeholderText) : title}{' '}
            </p>
          </div>
        </div>
      )}
      <div
        className={`w-full overflow-hidden ${heightClass} rounded-md flex  ${
          hasFocus
            ? 'border-primary border-[1.2px]'
            : 'border-gray-400 border-[1px] '
        }`}>
        <div className={`flex-1 flex items-center`}>
          <input
            readOnly={!isEditable}
            ref={inputRef ?? undefined}
            value={inputValue}
            type={inputType}
            onChange={event => {
              let currentValue = event?.target?.value;
              handleInputValueChange(currentValue);
            }}
            className={`w-full px-[12px] h-full bg-transparent text-primary font-medium outline-none ${inputStylingClass}`}
            {...props}
          />
        </div>

        {!!inputBoxElement && (
          <div
            className={`h-full pr-[12px] text-gray-600 flex justify-center items-center`}>
            {inputBoxElement}
          </div>
        )}
      </div>
    </div>
  );
}

export default Input;
