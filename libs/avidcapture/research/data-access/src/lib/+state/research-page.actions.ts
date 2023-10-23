import { Sort } from '@angular/material/sort';
import { AdvancedFilter, Buyer, Document } from '@ui-coe/avidcapture/shared/types';

export class QueryResearchInvoices {
  static readonly type = '[ResearchPageState] QueryResearchInvoices';
}

export class QueryBuyerLookAhead {
  static readonly type = '[ResearchPageState] QueryBuyerLookAhead';
  constructor(public searchValue: string) {}
}

export class QueryAllBuyersLookAhead {
  static readonly type = '[ResearchPageState] QueryAllBuyersLookAhead';
  constructor(public searchValue: string) {}
}

export class SetFilteredBuyers {
  static readonly type = '[ResearchPageState] SetFilteredBuyers';
  constructor(public filteredBuyers: Buyer[]) {}
}

export class SetAdvanceFilters {
  static readonly type = '[ResearchPageState] SetAdvanceFilters';
  constructor(public filters: AdvancedFilter) {}
}

export class SetColumnSortedData {
  static readonly type = '[ResearchPageState] SetColumnSortedData';
  constructor(public columnData: Sort) {}
}

export class SetScrollPosition {
  static readonly type = '[ResearchPageState] SetScrollPosition';
  constructor(public scrollPosition: [number, number]) {}
}

export class ScrollToPosition {
  static readonly type = '[ResearchPageState] ScrollToPosition';
}

export class ResetPageNumber {
  static readonly type = '[ResearchPageState] ResetPageNumber';
}

export class SetSearchFields {
  static readonly type = '[ResearchPageState] SetSearchFields';
  constructor(public searchFields: string[]) {}
}

export class UpdateResearchQueueInvoiceOnLock {
  static readonly type = '[ResearchPageState] UpdateResearchQueueInvoiceOnLock';
  constructor(public documentId: string, public lockedBy: string) {}
}

export class UpdateResearchQueueInvoiceOnUnlock {
  static readonly type = '[ResearchPageState] UpdateResearchQueueInvoiceOnUnlock';
  constructor(public documentId: string) {}
}

export class UpdateResearchQueueOnInvoiceSubmit {
  static readonly type = '[ResearchPageState] UpdateResearchQueueOnInvoiceSubmit';
  constructor(public documentId: string) {}
}

export class RemoveFilter {
  static readonly type = '[ResearchPageState] RemoveFilter';
  constructor(public filterKey: string) {}
}

export class RemoveEscalationFilter {
  static readonly type = '[ResearchPageState] RemoveEscalationFilter';
  constructor(public escalationType: string) {}
}

export class RemoveExposedFilter {
  static readonly type = '[ResearchPageState] RemoveExposedFilter';
  constructor(public filterName: string = '') {}
}

export class EnablePageRefresh {
  static readonly type = '[ResearchPageState] EnablePageRefresh';
}

export class DisablePageRefresh {
  static readonly type = '[ResearchPageState] DisablePageRefresh';
}

export class CreateQueuesNotAllowedList {
  static readonly type = '[ResearchPageState] CreateQueuesNotAllowedList';
  constructor(public escalationCategoryList: string[]) {}
}

export class SetResearchPageSignalEvents {
  static readonly type = '[ResearchPageState] SetResearchPageSignalEvents';
}

export class RemoveResearchPageSignalEvents {
  static readonly type = '[ResearchPageState] RemoveResearchPageSignalEvents';
}

export class QueryExposedFiltersCounts {
  static readonly type = '[ResearchPageState] QueryExposedFiltersCounts';
}

export class BatchDeletion {
  static readonly type = '[ResearchPageState] BatchDeletion';
  constructor(public documentIds: string[]) {}
}

export class BatchDownload {
  static readonly type = '[ResearchPageState] BatchDownload';
  constructor(public documents: Document[]) {}
}
