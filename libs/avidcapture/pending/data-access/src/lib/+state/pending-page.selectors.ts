import { Selector } from '@ngxs/store';
import { DocumentStateModel } from '@ui-coe/avidcapture/shared/data-access';
import {
  AdvancedFilter,
  AdvancedFiltersKeys,
  Buyer,
  Document,
  SortedColumnData,
} from '@ui-coe/avidcapture/shared/types';

import { PendingPageState } from './pending-page.state';

export class PendingPageSelectors {
  @Selector([PendingPageState.data])
  static invoices(state: DocumentStateModel): Document[] {
    return state.invoices;
  }

  @Selector([PendingPageState.data])
  static buyers(state: DocumentStateModel): Buyer[] {
    return state.buyers.filter(buyer => !state.filters.buyerId.find(x => x.id === buyer.id));
  }

  @Selector([PendingPageState.data])
  static filteredBuyers(state: DocumentStateModel): Buyer[] {
    return state.filteredBuyers;
  }

  @Selector([PendingPageState.data])
  static advancedFilters(state: DocumentStateModel): AdvancedFilter {
    return state.filters;
  }

  @Selector([PendingPageState.data])
  static loadMoreHidden(state: DocumentStateModel): boolean {
    return state.loadMoreHidden;
  }

  @Selector([PendingPageState.data])
  static sortedColumnData(state: DocumentStateModel): SortedColumnData {
    return state.sortedColumnData;
  }

  @Selector([PendingPageState.data])
  static appliedFilters(state: DocumentStateModel): Record<string, string> {
    const excludedKeys = [
      AdvancedFiltersKeys.BuyerId,
      AdvancedFiltersKeys.IsSubmitted,
      AdvancedFiltersKeys.EscalationCategoryIssue,
      AdvancedFiltersKeys.EscalationLevel,
      AdvancedFiltersKeys.IngestionType,
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

  @Selector([PendingPageState.data])
  static canRefreshPage(state: DocumentStateModel): boolean {
    return state.canRefreshPage;
  }
}
