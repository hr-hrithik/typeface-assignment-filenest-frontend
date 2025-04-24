export interface RequestFileMetadata {
  file_request_id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  file_modified_at: number;
}

export interface UserFilesResumableUploadRequest {
  user_id: string;
  folder_id: string;
  files: RequestFileMetadata[];
}

export interface FileUploadSuccessRequest {
  user_id: string;
  folder_id: string;
  file_id: string;
}

// RESPONSE
export interface GetUserFilesResponse {
  file_id: string;
  file_name: string;
  file_type: string;
  file_public_url: string;
  file_last_modified: string;
}

export interface ResumableUploadResponseFileData {
  file_id: string;
  file_name: string;
  file_size: number;
  file_upload_status: string;
  resumable_upload_url: string;
}
export interface UserFilesResumableUploadResponse {
  files: { [key: string]: ResumableUploadResponseFileData };
}

export interface UserFolderContentMetadata {
  content_type: string;
  content_id: string;
  content_name: string;
  content_size: number;
  content_last_modified: string;
  content_file_type: string;
  content_thumbnail_url: string;
}
export interface UserFolderContentsResponse {
  folder_content_count: number;
  folder_name: string;
  folder_size: number;
  folder_last_modified: string;
  folder_content: UserFolderContentMetadata[];
}

export interface UserFileDetails {
  file_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_public_url: string;
  file_thumbnail_url: string;
  file_last_modified: string;
}
