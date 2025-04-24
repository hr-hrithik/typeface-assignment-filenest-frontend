import React, { ReactNode } from 'react';

type Props = {
  id: string;
  children: ReactNode;
  handleInputFile: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
  allowMultipleFiles?: boolean;
};

function InputFileHandler({
  id,
  children,
  handleInputFile,
  className,
  disabled = false,
  allowMultipleFiles = false,
}: Props) {
  function handleInputOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const fileList: FileList = event.target.files as FileList;
    const fileListLength = fileList?.length ?? 0;
    const files: File[] = [];

    for (let index = 0; index < fileListLength; index++) {
      const file = fileList?.item?.(index);
      if (file) {
        files.push(file);
      }
    }

    event.target.value = '';

    if (files?.length > 0) {
      handleInputFile(files);
    }
  }
  return (
    <>
      <input
        multiple={allowMultipleFiles}
        disabled={disabled}
        onChange={handleInputOnChange}
        id={id}
        type={`file`}
        className={`hidden`}
      />
      <label className={`${!!className ? className : ''}`} htmlFor={id}>
        {children}
      </label>
    </>
  );
}

export default InputFileHandler;
