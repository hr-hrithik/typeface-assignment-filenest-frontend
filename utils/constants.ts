export const CONSTANTS = {
  maxPasswordLength: 18,
  minPasswordLength: 4,

  maxFileSize: 1024 * 1024 * 500,
};

export const ToastSettings = {
  stacked: true,
  newestOnTop: false,
  limit: 3,
};

export enum REQUEST_TYPES {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum API_RESPONSE_STATUS {
  OK = 'ok',
  ERROR = 'error',
}

export enum FILE_VIEWER_VIEW_TYPES {
  LIST_VIEW = 'List View',
  GRID_VIEW = 'Grid View',
}

export enum CONTENT_UPLOADER_UPLOAD_STATUS {
  PENDING = 'Pending',
  SUCCESS = 'Success',
  ERROR = 'Error',
}
