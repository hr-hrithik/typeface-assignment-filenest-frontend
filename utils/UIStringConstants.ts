import { CONSTANTS } from '@/utils/constants';
import { convertFileSizeToString } from '@/utils/Helper';

export const UI_STRINGS_CONSTANTS = {
  companyName: `FileNest`,
  companytagLine: `One Nest for All Your Files`,
  selectFileToUpload: `Select file to upload to your NEST`,
  maxFileSizeString: `Max file size of (${convertFileSizeToString(
    CONSTANTS.maxFileSize,
  )}) allowed`,
};
