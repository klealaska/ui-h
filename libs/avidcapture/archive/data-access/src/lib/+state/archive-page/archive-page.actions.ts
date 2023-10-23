import { Sort } from '@angular/material/sort';
import { AdvancedFilter, Buyer } from '@ui-coe/avidcapture/shared/types';

export class QueryArchivedInvoices {
  static readonly type = '[ArchivePageState] QueryArchivedInvoices';
}

export class QueryBuyerLookAhead {
  static readonly type = '[ArchivePageState] QueryBuyerLookAhead';
  constructor(public searchValue: string) {}
}

export class QueryAllBuyersLookAhead {
  static readonly type = '[ArchivePageState] QueryAllBuyersLookAhead';
  constructor(public searchValue: string) {}
}

export class SetFilteredBuyers {
  static readonly type = '[ArchivePageState] SetFilteredBuyers';
  constructor(public filteredBuyers: Buyer[]) {}
}

export class SetAdvanceFilters {
  static readonly type = '[ArchivePageState] SetAdvanceFilters';
  constructor(public filters: AdvancedFilter) {}
}

export class SetColumnSortedData {
  static readonly type = '[ArchivePageState] SetColumnSortedData';
  constructor(public columnData: Sort) {}
}

export class SetScrollPosition {
  static readonly type = '[ArchivePageState] SetScrollPosition';
  constructor(public scrollPosition: [number, number]) {}
}

export class ScrollToPosition {
  static readonly type = '[ArchivePageState] ScrollToPosition';
}

export class ResetPageNumber {
  static readonly type = '[ArchivePageState] ResetPageNumber';
}

export class SetSearchFields {
  static readonly type = '[ArchivePageState] SetSearchFields';
  constructor(public searchFields: string[]) {}
}

export class RemoveFilter {
  static readonly type = '[ArchivePageState] RemoveFilter';
  constructor(public filterKey: string) {}
}

export class EnablePageRefresh {
  static readonly type = '[ArchivePageState] EnablePageRefresh';
}

export class DisablePageRefresh {
  static readonly type = '[ArchivePageState] DisablePageRefresh';
}

export class UpdateArchiveQueueWithNoSUBuyers {
  static readonly type = '[ArchivePageState] UpdateArchiveQueueWithNoSUBuyers';
}
