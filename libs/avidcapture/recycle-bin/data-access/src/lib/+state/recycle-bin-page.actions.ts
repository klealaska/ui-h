import { Sort } from '@angular/material/sort';
import { AdvancedFilter, Buyer } from '@ui-coe/avidcapture/shared/types';

export class QueryRecycleBinDocuments {
  static readonly type = '[RecycleBinPageState] QueryRecycleBinDocuments';
}

export class QueryBuyerLookAhead {
  static readonly type = '[RecycleBinPageState] QueryBuyerLookAhead';
  constructor(public searchValue: string) {}
}

export class QueryAllBuyersLookAhead {
  static readonly type = '[RecycleBinPageState] QueryAllBuyersLookAhead';
  constructor(public searchValue: string) {}
}

export class SetFilteredBuyers {
  static readonly type = '[RecycleBinPageState] SetFilteredBuyers';
  constructor(public filteredBuyers: Buyer[]) {}
}

export class SetAdvanceFilters {
  static readonly type = '[RecycleBinPageState] SetAdvanceFilters';
  constructor(public filters: AdvancedFilter) {}
}

export class SetColumnSortedData {
  static readonly type = '[RecycleBinPageState] SetColumnSortedData';
  constructor(public columnData: Sort) {}
}

export class ResetPageNumber {
  static readonly type = '[RecycleBinPageState] ResetPageNumber';
}

export class SetScrollPosition {
  static readonly type = '[RecycleBinPageState] SetScrollPosition';
  constructor(public scrollPosition: [number, number]) {}
}

export class ScrollToPosition {
  static readonly type = '[RecycleBinPageState] ScrollToPosition';
}

export class SetSearchFields {
  static readonly type = '[RecycleBinPageState] SetSearchFields';
  constructor(public searchFields: string[]) {}
}

export class UpdateRecycleBinQueueInvoiceOnLock {
  static readonly type = '[RecycleBinPageState] UpdateRecycleBinQueueInvoiceOnLock';
  constructor(public documentId: string, public lockedBy: string) {}
}

export class UpdateRecycleBinQueueInvoiceOnUnlock {
  static readonly type = '[RecycleBinPageState] UpdateRecycleBinQueueInvoiceOnUnlock';
  constructor(public documentId: string) {}
}

export class UpdateRecycleBinQueueOnInvoiceSubmit {
  static readonly type = '[RecycleBinPageState] UpdateRecycleBinQueueOnInvoiceSubmit';
  constructor(public documentId: string) {}
}

export class RemoveFilter {
  static readonly type = '[RecycleBinPageState] RemoveFilter';
  constructor(public filterKey: string) {}
}

export class EnablePageRefresh {
  static readonly type = '[RecycleBinPageState] EnablePageRefresh';
}

export class DisablePageRefresh {
  static readonly type = '[RecycleBinPageState] DisablePageRefresh';
}

export class SetRecycleBinPageSignalEvents {
  static readonly type = '[RecycleBinPageState] SetRecycleBinPageSignalEvents';
}

export class RemoveRecycleBinPageSignalEvents {
  static readonly type = '[RecycleBinPageState] RemoveRecycleBinPageSignalEvents';
}
