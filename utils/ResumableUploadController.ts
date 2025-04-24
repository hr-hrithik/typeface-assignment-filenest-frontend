import { ContentUploadInformation } from '@/models/CommonModels';

export class ResumableUploadController {
  resumable_upload_url: string | undefined;
  blob: Blob | undefined;
  handleOnUploadSuccess: (
    contentInformation: ContentUploadInformation,
  ) => void = () => {};
  contentUploadInformation: ContentUploadInformation | undefined;

  constructor({
    resumable_upload_url,
    blob,
    handleOnUploadSuccess,
    contentUploadInformation,
  }: {
    resumable_upload_url: string;
    blob: Blob;
    handleOnUploadSuccess: (
      contentInformation: ContentUploadInformation,
    ) => void;
    contentUploadInformation: ContentUploadInformation;
  }) {
    this.resumable_upload_url = resumable_upload_url;
    this.blob = blob;
    this.handleOnUploadSuccess = handleOnUploadSuccess;
    this.contentUploadInformation = contentUploadInformation;
  }

  async uploadBlob(blob: Blob) {
    return new Promise(async resolve => {
      const headers = new Headers({
        'Content-Length': blob.size.toString(),
      });

      try {
        if (typeof this.resumable_upload_url !== 'string') {
          resolve(false);
          return;
        }

        const response = await fetch(this.resumable_upload_url, {
          method: 'PUT',
          headers: headers,
          body: blob,
        });

        this.handleOnUploadSuccess &&
          this.contentUploadInformation &&
          this.handleOnUploadSuccess(this.contentUploadInformation);

        resolve(true);
      } catch (error) {
        resolve(false);
      }
    });
  }
}
