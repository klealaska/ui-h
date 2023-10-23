export interface DuplicateDetectionError {
  documentId: string;
  sourceDocumentId: string;
  reason: string;
  invoiceNumber: string;
}
