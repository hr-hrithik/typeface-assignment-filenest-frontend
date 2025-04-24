import React, { ReactNode } from 'react';
import Modal from '@/components/Modals/Modal';
import Button from '@/components/Button';

type Props = {
  handleCancel: () => void;
  handleConfirm: () => void;
  title: string;
  subtitle?: string | ReactNode;
};

function ConfirmationModal({
  title,
  subtitle,
  handleCancel,
  handleConfirm,
}: Props) {
  return (
    <Modal
      title={
        <div>
          <p className={`text-[18px] font-bold text-primary`}>{title}</p>
          {subtitle && (
            <div
              className={`text-[12px] md:text-[14px] font-medium text-white flex-wrap`}>
              {subtitle}
            </div>
          )}
        </div>
      }
      className={`h-fit !max-w-[480px]`}
      handleClose={handleCancel}>
      <div className={` h-fit flex flex-col`}>
        <div className={`w-full flex gap-[12px]`}>
          <div className={`flex-1`}>
            <Button
              buttonStyle={`secondary`}
              className={`w-full`}
              handleOnClick={handleCancel}>
              <div>Cancel</div>
            </Button>
          </div>

          <div className={`flex-1`}>
            <Button
              buttonStyle={`primary`}
              className={`w-full`}
              handleOnClick={handleConfirm}>
              <div>Confirm</div>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;
