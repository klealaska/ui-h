export interface AttachmentServiceConfig {
  sourceSystem: string;
  baseUrl: string;
  attachmentUrl: string;
}

export interface UploaderConfig {
  acceptedFiles: string;
  maxFiles: number;
  maxSize: number;
  sourceSystem: string;
  baseUrl: string;
  indexingBaseUrl?: string;
  attachmentUrl: string;
}

export interface AttachmentMetaData {
  file_name: string;
  mime_type: string;
  user_id: string;
  source_system: string;
}

export interface PendingUpload {
  correlationId: string;
  buyerId: string;
  username: string;
  fileName: string;
}
