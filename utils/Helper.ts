import {
  DB_NAME,
  DB_STORES,
  DB_VERSION,
  LOGIN_KEYS,
} from '@/IndexedDB/DBConfigurations';
import { IndexedDBManager } from '@/IndexedDB/IndexedDBHelper';
import { ApiControllerMakeRequestResponse } from '@/models/CommonModels';
import { toast } from 'react-toastify';
import { TOAST_MESSAGES } from '@/utils/ToastMessages';

export function convertBytesToMBs(bytes: number) {
  let mb = 0;
  if (typeof bytes === 'number' && !Number.isNaN(bytes)) {
    mb = Math.floor(bytes / 1024 / 1024);
  }

  return mb;
}

export function handleAPIResponse({
  apiResponse,
  handleSuccess,
  handleError,
  silentError = false,
}: {
  apiResponse: ApiControllerMakeRequestResponse;
  handleSuccess?: () => void;
  handleError?: () => void;
  silentError?: boolean;
}) {
  if (apiResponse?.statusCode >= 200 && apiResponse?.statusCode < 400) {
    handleSuccess && handleSuccess();
  } else {
    handleError && handleError();
    if (!silentError) {
      const message =
        apiResponse?.data?.message || TOAST_MESSAGES.unexpectedError;
      toast.error(message, { toastId: message });
    }
  }
}

let userToken: string | undefined = undefined;

export async function getUserToken() {
  if (userToken === undefined) {
    const db = new IndexedDBManager(DB_NAME, DB_VERSION);
    const token = await db.getData(DB_STORES.login, LOGIN_KEYS.token);
    if (typeof token === 'string') {
      userToken = token;
    }
  }
  return userToken;
}

export async function setUserToken(token: string) {
  if (typeof token === 'string') {
    userToken = token;
  }
}

export function customRoundOff(number: number, decimalPlaces: number = 2) {
  const baseNumber = typeof number === 'number' ? number || 0 : 0;
  const power = Math.pow(10, decimalPlaces ?? 2);

  return Math.round(baseNumber * power) / power;
}

export function convertFileSizeToString(fileSize: number) {
  const fileSizeNumber = typeof fileSize === 'number' ? fileSize || 0 : 0;
  const sizeInKB = customRoundOff(fileSizeNumber / 1024);
  const sizeInMB = customRoundOff(sizeInKB / 1024);

  if (sizeInMB > 1) {
    return `${sizeInMB} MB`;
  } else {
    return `${sizeInKB} kB`;
  }
}

export function debounceFunction({
  timeout,
  handlerFunction,
  delay,
}: {
  timeout: any;
  handlerFunction: () => void;
  delay: number;
}) {
  clearTimeout(timeout.current);
  timeout.current = setTimeout(() => {
    handlerFunction();
  }, delay);
}

export function convertISOToDateString(ISOTime: string) {
  let convertedDate = '';
  try {
    const date = new Date(ISOTime);
    convertedDate = date.toUTCString();
  } catch (error) {}
  return convertedDate;
}

export function isValidUrl(urlString: string) {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
}

export function uuid(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  function generate() {
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }
  result = generate();
  return result;
}
