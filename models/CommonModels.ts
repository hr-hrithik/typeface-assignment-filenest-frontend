import { API_RESPONSE_STATUS, REQUEST_TYPES } from '@/utils/constants';
import { ReactNode } from 'react';

export interface ApiControllerMakeRequestModel {
  requestType: REQUEST_TYPES;
  requestURL: string;
  requestParams?: any;
  requestPayload?: any;
  isAuthorisationRequired?: boolean;
}

export interface APIResponse {
  status: string;
  status_code: number;
  data: { [key: string]: any };
}

export interface ApiControllerMakeRequestResponse {
  status: API_RESPONSE_STATUS;
  statusCode: number;
  data: { [key: string]: any };
}

export interface ContentUploadInformation {
  file_id: string;
  file: File;
  file_name: string;
  file_size: number;
  folder_id: string;
  resumable_upload_url: string;
  upload_status: string;
}

export interface ContentUploaderModel {
  addContentInQueue: (content: ContentUploadInformation[]) => void;
  contentQueuedForUpload: ContentUploadInformation[];
  deleteContentFromQueue(content: ContentUploadInformation): void;
}

export interface ConfirmationModalModel {
  title: string;
  subtitle?: string | ReactNode;
  handleConfirm: () => void;
  handleCancel: () => void;
}
