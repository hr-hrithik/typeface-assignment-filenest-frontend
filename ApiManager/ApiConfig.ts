export const BackendBaseURL =
  'https://typeface-assignment-filenest-backend-23103496258.asia-south1.run.app';

export const ApiConfigs = {
  login: `${BackendBaseURL}/api/v1/users/login`,
  getUserProfile: `${BackendBaseURL}/api/v1/users/get-user-profile`,
  getUserFiles: `${BackendBaseURL}/api/v1/files/get-user-files`,
  uploadUserFiles: `${BackendBaseURL}/api/v1/files/upload-user-file`,
  userFilesResumableUpload: `${BackendBaseURL}/api/v1/files/user-files-resumable-upload`,
  fileUploadSuccess: `${BackendBaseURL}/api/v1/files/file-upload-success`,
  getFolderContents: `${BackendBaseURL}/api/v1/files/get-folder-contents`,
  deleteFolderContent: `${BackendBaseURL}/api/v1/files/delete-folder-content`,
  getFileDetails: `${BackendBaseURL}/api/v1/files/get-file-details`,
  updateFile: `${BackendBaseURL}/api/v1/files/update-file`,
};
