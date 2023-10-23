export enum BatchUploadTabsEnum {
  singleErp,
  multipleErp = 1,
}

export enum BatchUploadFileStatusEnum {
  Failed = 'failed',
  Success = 'success',
  InProgress = 'in progress',
}

// -- Temporary Template strings
export enum BatchUploadFileMessagesEnum {
  UnsupportedFileType = 'Unsupported File Type',
  Uploaded = 'Uploaded',
  InProgress = '',
}
