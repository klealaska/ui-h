import { Sort } from '@angular/material/sort';
import { AdvancedFilter, Buyer, Document, SearchFilters } from '@ui-coe/avidcapture/shared/types';

export class QueryDocuments {
  static readonly type = '[DocumentState] QueryDocuments';
}

export class QueryArchiveDocuments {
  static readonly type = '[DocumentState] QueryArchiveDocuments';
}

export class QueryBuyerLookAhead {
  static readonly type = '[DocumentState] QueryBuyerLookAhead';
  constructor(public searchValue: string) {}
}

export class QueryAllBuyersLookAhead {
  static readonly type = '[DocumentState] QueryAllBuyersLookAhead';
  constructor(public searchValue: string) {}
}

export class SetFilteredBuyers {
  static readonly type = '[DocumentState] SetFilteredBuyers';
  constructor(public filteredBuyers: Buyer[]) {}
}

export class SetAdvanceFilters {
  static readonly type = '[DocumentState] SetAdvanceFilters';
  constructor(public filters: AdvancedFilter, public newFilters: SearchFilters) {}
}

export class SetColumnSortedData {
  static readonly type = '[DocumentState] SetColumnSortedData';
  constructor(public columnData: Sort) {}
}

export class SetScrollPosition {
  static readonly type = '[DocumentState] SetScrollPosition';
  constructor(public scrollPosition: [number, number]) {}
}

export class ScrollToPosition {
  static readonly type = '[DocumentState] ScrollToPosition';
}

export class ResetPageNumber {
  static readonly type = '[DocumentState] ResetPageNumber';
}

export class SetSearchFields {
  static readonly type = '[DocumentState] SetSearchFields';
  constructor(public searchFields: string[]) {}
}

export class UpdateQueueInvoiceOnLock {
  static readonly type = '[DocumentState] UpdateQueueInvoiceOnLock';
  constructor(public documentId: string, public lockedBy: string) {}
}

export class UpdateQueueInvoiceOnUnlock {
  static readonly type = '[DocumentState] UpdateQueueInvoiceOnUnlock';
  constructor(public documentId: string) {}
}

export class UpdateQueueOnInvoiceSubmit {
  static readonly type = '[DocumentState] UpdateQueueOnInvoiceSubmit';
  constructor(public documentId: string) {}
}

export class RemoveFilter {
  static readonly type = '[DocumentState] RemoveFilter';
  constructor(public filterKey: string) {}
}

export class EnablePageRefresh {
  static readonly type = '[DocumentState] EnablePageRefresh';
}

export class DisablePageRefresh {
  static readonly type = '[DocumentState] DisablePageRefresh';
}

export class BatchDeletion {
  static readonly type = '[DocumentState] BatchDeletion';
  constructor(public documentIds: string[]) {}
}

export class BatchDownload {
  static readonly type = '[DocumentState] BatchDownload';
  constructor(public documents: Document[]) {}
}
