import { Sort } from '@angular/material/sort';
import { Document, PendingUploadDocument } from '@ui-coe/avidcapture/shared/types';

export class QueryUploadedInvoices {
  static readonly type = '[UploadsQueuePageState] QueryUploadedInvoices';
}

export class SetSourceEmail {
  static readonly type = '[UploadsQueuePageState] SetSourceEmail';
  constructor(public email: string) {}
}

export class SetColumnSortedData {
  static readonly type = '[UploadsQueuePageState] SetColumnSortedData';
  constructor(public columnData: Sort) {}
}

export class ResetPageNumber {
  static readonly type = '[UploadsQueuePageState] ResetPageNumber';
}

export class EnablePageRefresh {
  static readonly type = '[UploadsQueuePageState] EnablePageRefresh';
}

export class DisablePageRefresh {
  static readonly type = '[UploadsQueuePageState] DisablePageRefresh';
}

export class SetScrollPosition {
  static readonly type = '[UploadsQueuePageState] SetScrollPosition';
  constructor(public scrollPosition: [number, number]) {}
}

export class ScrollToPosition {
  static readonly type = '[UploadsQueuePageState] ScrollToPosition';
}

export class UpdateMyUploadsInvoiceSubmit {
  static readonly type = '[UploadsQueuePageState] UpdateMyUploadsInvoiceSubmit';
  constructor(public documentId: string) {}
}

export class UploadDocument {
  static readonly type = '[UploadsQueuePageState] Upload Document';
  constructor(public file: File, public organizationId: string, public correlationId: string) {}
}

export class QueryAllPendingDocuments {
  static readonly type = '[UploadsQueuePageState] QueryAllPendingDocuments';
}

export class CreatePendingUpload {
  static readonly type = '[UploadsQueuePageState] CreatePendingUpload';
  constructor(public documents: PendingUploadDocument[]) {}
}

export class UpdatePendingUploadDocument {
  static readonly type = '[UploadsQueuePageState] UpdatePendingUploadDocument';
  constructor(public correlationId: string, public documentId: string) {}
}

export class SetUploadsPageSignalEvents {
  static readonly type = '[UploadsQueuePageState] SetUploadsPageSignalEvents';
}

export class FilterByInvoiceName {
  static readonly type = '[UploadsQueuePageState] FilterByInvoiceName';
  constructor(public searchValue: string) {}
}

export class ClearUploadedDocumentMessages {
  static readonly type = '[UploadsQueuePageState] ClearUploadedDocumentMessages';
}

export class BatchDeletion {
  static readonly type = '[UploadsQueuePageState] BatchDeletion';
  constructor(public documentIds: string[]) {}
}

export class BatchDownload {
  static readonly type = '[UploadsQueuePageState] BatchDownload';
  constructor(public documents: Document[]) {}
}
