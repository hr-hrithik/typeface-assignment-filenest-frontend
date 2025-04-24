export interface UserLoginModel {
  user_uid: string;
  user_name: string;
  user_email: string;
  user_profile_image?: string;
}

export interface UserProfileResponse {
  user_uid: string;
  user_name: string;
  user_email: string;
  user_profile_image?: string | null;
  root_folder_id: string;
}
