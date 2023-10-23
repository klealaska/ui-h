import { SafeUrl } from '@angular/platform-browser';
import {
  BatchUploadFileMessagesEnum,
  BatchUploadFileStatusEnum,
} from '../../enums/batch-upload/batch-upload.enum';
export interface IBatchListItem {
  id: string;
  amount: number;
  totalPayments: number;
  dateSubmitted: string;
  submittedBy: string;
  status: string;
}

export interface IBatchList {
  items: Array<IBatchListItem>;
}

export interface IBatchUpload {
  nid: string;
  file: IBatchUploadFile;
}

export interface IBatchUploadFile {
  data: File;
  erp?: string | number | null;
  url?: SafeUrl;
  fileName?: string;
  message?: BatchUploadFileMessagesEnum;
  status?: BatchUploadFileStatusEnum;
  size?: string;
  completionTime?: string;
  uploaded?: boolean;
}

export interface IBatchUploadFileLocator {
  correlationId: string;
}

export interface IBatchUploadFile {
  data: File;
  erp?: string | number | null;
  url?: SafeUrl;
  fileName?: string;
  message?: BatchUploadFileMessagesEnum;
  status?: BatchUploadFileStatusEnum;
  size?: string;
  completionTime?: string;
  uploaded?: boolean;
  correlationId?: string;
}
