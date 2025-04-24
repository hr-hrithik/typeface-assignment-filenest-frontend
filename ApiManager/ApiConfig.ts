export const BackendBaseURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const ApiConfigs = {
  login: `${BackendBaseURL}/api/v1/login`,
  uploadUserFiles: `${BackendBaseURL}/api/v1/upload-user-files`,
  getUserFiles: `${BackendBaseURL}/api/v1/get-user-files`,
  getUserProfile: `${BackendBaseURL}/api/v1/get-user-profile`,
  userFilesResumableUpload: `${BackendBaseURL}/api/v1/user-files-resumable-upload`,
  fileUploadSuccess: `${BackendBaseURL}/api/v1/file-upload-success`,
  getFolderContents: `${BackendBaseURL}/api/v1/get-folder-contents`,
  deleteFolderContent: `${BackendBaseURL}/api/v1/delete-folder-content`,
  getFileDetails: `${BackendBaseURL}/api/v1/get-file-details`,
};
