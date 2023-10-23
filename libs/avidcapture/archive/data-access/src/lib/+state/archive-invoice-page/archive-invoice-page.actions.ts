import { CompositeDocument } from '@ui-coe/avidcapture/shared/types';

export class InitArchiveInvoicePage {
  static readonly type = '[ArchiveInvoicePageState] InitArchiveInvoicePage';
  constructor(public documentId: string) {}
}

export class QueryArchivedDocument {
  static readonly type = '[ArchiveInvoicePageState] QueryArchivedDocument';
  constructor(public documentId: string) {}
}

export class QueryDocumentFormFields {
  static readonly type = '[ArchiveInvoicePageState] QueryDocumentFormFields';
  constructor(public selectedInvoiceType: string) {}
}

export class ParseDocumentFormFields {
  static readonly type = '[ArchiveInvoicePageState] ParseDocumentFormFields';
  constructor(public selectedInvoiceType: string) {}
}

export class UpdateFontFace {
  static readonly type = '[ArchiveInvoicePageState] updateFontFace';
  constructor(public updateFontFace: boolean) {}
}

export class SkipToPreviousDocument {
  static readonly type = '[ArchiveInvoicePageState] SkipToPreviousDocument';
  constructor(public documentId: string) {}
}

export class SkipToNextDocument {
  static readonly type = '[ArchiveInvoicePageState] SkipToNextDocument';
  constructor(public documentId: string) {}
}

export class HandleNextDocumentGiven {
  static readonly type = '[ArchiveInvoicePageState] HandleNextDocumentGiven';
  constructor(public document: CompositeDocument) {}
}
