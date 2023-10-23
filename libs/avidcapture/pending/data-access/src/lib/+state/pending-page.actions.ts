import { Sort } from '@angular/material/sort';
import { AdvancedFilter, Buyer, Document } from '@ui-coe/avidcapture/shared/types';

export class QueryQueueInvoices {
  static readonly type = '[PendingPageState] QueryQueueInvoices';
}

export class QueryBuyerLookAhead {
  static readonly type = '[PendingPageState] QueryBuyerLookAhead';
  constructor(public searchValue: string) {}
}

export class QueryAllBuyersLookAhead {
  static readonly type = '[PendingPageState] QueryAllBuyersLookAhead';
  constructor(public searchValue: string) {}
}

export class SetFilteredBuyer {
  static readonly type = '[PendingPageState] SetFilteredBuyer';
  constructor(public filteredBuyers: Buyer[]) {}
}

export class SetAdvanceFilters {
  static readonly type = '[PendingPageState] SetAdvanceFilters';
  constructor(public filters: AdvancedFilter) {}
}

export class SetColumnSortedData {
  static readonly type = '[PendingPageState] SetColumnSortedData';
  constructor(public columnData: Sort) {}
}

export class ResetPageNumber {
  static readonly type = '[PendingPageState] ResetPageNumber';
}

export class UpdateQueueInvoiceOnLock {
  static readonly type = '[PendingPageState] UpdateQueueInvoiceOnLock';
  constructor(public documentId: string, public lockedBy: string) {}
}

export class UpdateQueueInvoiceOnUnlock {
  static readonly type = '[PendingPageState] UpdateQueueInvoiceOnUnlock';
  constructor(public documentId: string) {}
}

export class UpdateQueueOnInvoiceSubmit {
  static readonly type = '[PendingPageState] UpdateQueueOnInvoiceSubmit';
  constructor(public documentId: string) {}
}

export class SetScrollPosition {
  static readonly type = '[PendingPageState] SetScrollPosition';
  constructor(public scrollPosition: [number, number]) {}
}

export class ScrollToPosition {
  static readonly type = '[PendingPageState] ScrollToPosition';
}

export class SetSearchFields {
  static readonly type = '[PendingPageState] SetSearchFields';
  constructor(public searchFields: string[]) {}
}

export class RemoveFilter {
  static readonly type = '[PendingPageState] RemoveFilter';
  constructor(public filterKey: string) {}
}

export class EnablePageRefresh {
  static readonly type = '[PendingPageState] EnablePageRefresh';
}

export class DisablePageRefresh {
  static readonly type = '[PendingPageState] DisablePageRefresh';
}

export class SetPendingPageSignalEvents {
  static readonly type = '[PendingPageState] SetPendingPageSignalEvents';
}

export class RemovePendingPageSignalEvents {
  static readonly type = '[PendingPageState] RemovePendingPageSignalEvents';
}

export class BatchDeletion {
  static readonly type = '[PendingPageState] BatchDeletion';
  constructor(public documentIds: string[]) {}
}

export class BatchDownload {
  static readonly type = '[PendingPageState] BatchDownload';
  constructor(public documents: Document[]) {}
}
