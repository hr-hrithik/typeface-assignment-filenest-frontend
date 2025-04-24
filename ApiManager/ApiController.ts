import {
  ApiControllerMakeRequestModel,
  ApiControllerMakeRequestResponse,
  APIResponse,
} from '@/models/CommonModels';
import { UserLoginModel } from '@/models/UserLogin';
import { API_RESPONSE_STATUS, REQUEST_TYPES } from '@/utils/constants';
import { ApiConfigs } from '@/ApiManager/ApiConfig';
import axios from 'axios';
import { getUserToken } from '@/utils/Helper';
import {
  FileUploadSuccessRequest,
  UserFilesResumableUploadRequest,
} from '@/models/UserFiles';

export class ApiController {
  private static async makeRequest({
    requestType,
    requestURL,
    requestParams,
    requestPayload,
  }: ApiControllerMakeRequestModel) {
    const response: ApiControllerMakeRequestResponse = {
      status: API_RESPONSE_STATUS.OK,
      statusCode: 200,
      data: {},
    };

    const headers = {
      Authorization: await getUserToken(),
    };

    try {
      if (requestType === REQUEST_TYPES.GET) {
        const requestResponse: APIResponse = await axios.get(requestURL, {
          params: requestParams,
          headers: headers,
        });

        response.status = requestResponse?.data?.status as API_RESPONSE_STATUS;
        response.statusCode = requestResponse?.data?.status_code;
        response.data = requestResponse?.data?.data;
      } else if (requestType === REQUEST_TYPES.POST) {
        const requestResponse: APIResponse = await axios.post(
          requestURL,
          requestPayload,
          {
            headers: headers,
          },
        );

        response.status = requestResponse?.data?.status as API_RESPONSE_STATUS;
        response.statusCode = requestResponse?.data?.status_code;
        response.data = requestResponse?.data?.data;
      } else if (requestType === REQUEST_TYPES.PUT) {
        const requestResponse: APIResponse = await axios.put(
          requestURL,
          requestPayload,
          {
            headers: headers,
          },
        );

        response.status = requestResponse?.data?.status as API_RESPONSE_STATUS;
        response.statusCode = requestResponse?.data?.status_code;
        response.data = requestResponse?.data?.data;
      } else if (requestType === REQUEST_TYPES.DELETE) {
        const requestResponse: APIResponse = await axios.delete(requestURL, {
          headers: headers,
        });

        response.status = requestResponse?.data?.status as API_RESPONSE_STATUS;
        response.statusCode = requestResponse?.data?.status_code;
        response.data = requestResponse?.data?.data;
      }
    } catch (error: any) {
      const errorResponseData = error?.response?.data;
      console.log('An error occured while making API request :: ', error?.code);

      if (errorResponseData) {
        const status = errorResponseData?.status ?? API_RESPONSE_STATUS.ERROR;
        const statusCode = errorResponseData?.status_code ?? 500;
        const data = errorResponseData?.data ?? {};

        response.status = status;
        response.statusCode = statusCode;
        response.data = data;
      }
    }

    return response;
  }

  static async login(payload: UserLoginModel) {
    const response = await this.makeRequest({
      requestType: REQUEST_TYPES.POST,
      requestURL: ApiConfigs.login,
      requestPayload: payload,
    });

    return response;
  }

  static async uploadUserFiles(
    file_modified_at: number,
    folder_id: string,
    file: File,
  ) {
    const userFilesFormData = new FormData();
    userFilesFormData.append(
      'file_modified_at',
      file_modified_at?.toString?.(),
    );
    userFilesFormData.append('folder_id', folder_id);
    userFilesFormData.append('user_file', file);

    const response = await this.makeRequest({
      requestType: REQUEST_TYPES.POST,
      requestURL: ApiConfigs.uploadUserFiles,
      requestPayload: userFilesFormData,
    });

    return response;
  }

  static async getUserProfile() {
    const response = await this.makeRequest({
      requestType: REQUEST_TYPES.GET,
      requestURL: ApiConfigs.getUserProfile,
    });

    return response;
  }

  static async getUserFiles(userId: string, page: number) {
    const requestParams = {
      user_id: userId,
      page: page,
    };

    const response = await this.makeRequest({
      requestType: REQUEST_TYPES.GET,
      requestURL: ApiConfigs.getUserFiles,
      requestParams: requestParams,
    });

    return response;
  }

  static async userFilesResumableUpload(
    payload: UserFilesResumableUploadRequest,
  ) {
    const response = await this.makeRequest({
      requestType: REQUEST_TYPES.POST,
      requestURL: ApiConfigs.userFilesResumableUpload,
      requestPayload: payload,
    });

    return response;
  }

  static async fileUploadSuccess(payload: FileUploadSuccessRequest) {
    const response = await this.makeRequest({
      requestType: REQUEST_TYPES.POST,
      requestURL: ApiConfigs.fileUploadSuccess,
      requestPayload: payload,
    });

    return response;
  }

  static async getFolderContents(folderId: string) {
    const requestParams = {
      folder_id: folderId,
    };
    const response = await this.makeRequest({
      requestType: REQUEST_TYPES.GET,
      requestURL: ApiConfigs.getFolderContents,
      requestParams: requestParams,
    });

    return response;
  }

  static async deleteFolderContent(contentId: string) {
    const response = await this.makeRequest({
      requestType: REQUEST_TYPES.DELETE,
      requestURL: `${ApiConfigs.deleteFolderContent}/${contentId}`,
    });

    return response;
  }

  static async getFileDetails(fileId: string, folderId: string) {
    const requestParams = {
      file_id: fileId,
      folder_id: folderId,
    };
    const response = await this.makeRequest({
      requestType: REQUEST_TYPES.GET,
      requestURL: ApiConfigs.getFileDetails,
      requestParams: requestParams,
    });

    return response;
  }

  static async updateFile(
    fileId: string,
    fileModifiedAt: number,
    folderId: string,
    file: File,
  ) {
    const updateFileFormData = new FormData();
    updateFileFormData.append('file_id', fileId);
    updateFileFormData.append('file_modified_at', fileModifiedAt?.toString?.());
    updateFileFormData.append('folder_id', folderId);
    updateFileFormData.append('user_file', file);

    const response = await this.makeRequest({
      requestType: REQUEST_TYPES.PUT,
      requestURL: ApiConfigs.updateFile,
      requestPayload: updateFileFormData,
    });

    return response;
  }
}
