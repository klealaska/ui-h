export interface Document {
  buyerId?: string;
  buyerKeyword?: string;
  buyerName?: string;
  correlationId?: string;
  dateFirstOpened?: string;
  dateLocked?: string;
  dateReceived?: string;
  dateRecycled?: string;
  dateSubmitted?: string;
  documentId?: string;
  documentIndexedId?: string;
  documentUnindexedId?: string;
  escalationCategoryIssue?: string;
  escalationCategoryLevel?: string;
  escalationCategoryReason?: string;
  fileId?: string;
  fileName?: string;
  id?: string;
  indexedDocumentId?: string;
  ingestionType?: string;
  isSubmitted?: string;
  invoiceSourceId?: string;
  sourceEmail?: string;
  sourceSystem?: string;
  amountDue?: string;
  billingAddress?: string;
  billingAddressRecipient?: string;
  customerAddressRecipient?: string;
  customerName?: string;
  invoiceDate?: string;
  serviceAddress?: string;
  serviceEndDate?: string;
  serviceStartDate?: string;
  totalTax?: string;
  vendorAddress?: string;
  vendorAddressRecipient?: string;
  vendorName?: string;
  searchScore?: string;
  registrationCode?: string;
  propertyCode?: string;
  purchaseOrderIdentifier?: string;
  secondsSpentIndexing?: string;
  shipToName?: string;
  shipToAddress?: string;
  shipToId?: string;
  supplier?: string;
  sourceSystemBuyerId?: string;
  supplierAddress?: string;
  supplierId?: string;
  customerAccountNumber?: string;
  invoiceDueDate?: string;
  invoiceNumber?: string;
  invoiceAmount?: string;
  invoiceType?: string;
  currentCharges?: string;
  lockedBy?: string;
  unindexedDocumentId?: string;
  lastModified?: string;
  lastModifiedByUser?: string;
  previousQueue?: string;
  uploadStatus?: string;
}
