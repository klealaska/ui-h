import { Selector } from '@ngxs/store';
import { DocumentStateModel } from '@ui-coe/avidcapture/shared/data-access';
import {
  AdvancedFilter,
  AdvancedFiltersKeys,
  Buyer,
  Document,
  SortedColumnData,
} from '@ui-coe/avidcapture/shared/types';

import { ArchivePageState } from './archive-page.state';

export class ArchivePageSelectors {
  @Selector([ArchivePageState.data])
  static archivedInvoices(state: DocumentStateModel): Document[] {
    return state.invoices;
  }

  @Selector([ArchivePageState.data])
  static buyers(state: DocumentStateModel): Buyer[] {
    return state.buyers;
  }

  @Selector([ArchivePageState.data])
  static filteredBuyers(state: DocumentStateModel): Buyer[] {
    return state.filteredBuyers;
  }

  @Selector([ArchivePageState.data])
  static advancedFilters(state: DocumentStateModel): AdvancedFilter {
    return state.filters;
  }

  @Selector([ArchivePageState.data])
  static loadMoreHidden(state: DocumentStateModel): boolean {
    return state.loadMoreHidden;
  }

  @Selector([ArchivePageState.data])
  static sortedColumnData(state: DocumentStateModel): SortedColumnData {
    return state.sortedColumnData;
  }

  @Selector([ArchivePageState.data])
  static appliedFilters(state: DocumentStateModel): Record<string, string> {
    const excludedKeys = [
      AdvancedFiltersKeys.BuyerId,
      AdvancedFiltersKeys.IsSubmitted,
      AdvancedFiltersKeys.EscalationCategoryIssue,
      AdvancedFiltersKeys.EscalationLevel,
    ];

    return Object.keys(state.filters)
      .filter(key => !excludedKeys.some(excludedKey => key === excludedKey))
      .reduce(
        (acc, key) => ({
          ...acc,
          [key]: state.filters[key],
        }),
        {}
      );
  }

  @Selector([ArchivePageState.data])
  static canRefreshPage(state: DocumentStateModel): boolean {
    return state.canRefreshPage;
  }
}
