export enum Default {
  None = 'None',
}

export enum RecycleEscalationType {
  RecycleBin = 'Recycle Bin',
  Void = 'Void',
}

export enum IndexerEscalationTypes {
  DataExceptionAU = 'Data Exception - AU',
  ScanningOpsQC = 'Scanning Ops QC',
  IndexerActivity = 'Indexer Activity',
  IndexingOpsQc = 'Indexing Ops QC',
}

export enum IndexerQAEscalationType {
  IndexerQa = 'Indexer QA',
}

export enum CustomerEscalationTypes {
  DuplicateResearch = 'Duplicate Research',
  ImageIssue = 'Image Issue',
  NonInvoiceDocument = 'Non Invoice Document',
  RejectToSender = 'Reject To Sender',
  ShipToResearch = 'Ship To Research',
  SupplierResearch = 'Supplier Research',
}

export enum MoreActions {
  RejectToSenderCrud = 'Reject To Sender Crud',
}

export const EscalationCategoryTypes = {
  ...Default,
  ...CustomerEscalationTypes,
  ...IndexerEscalationTypes,
  ...RecycleEscalationType,
  ...IndexerQAEscalationType,
};
export type EscalationCategoryTypes = typeof EscalationCategoryTypes;
