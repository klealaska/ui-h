import { Selector } from '@ngxs/store';
import { DocumentStateModel } from '@ui-coe/avidcapture/shared/data-access';
import {
  AdvancedFilter,
  AdvancedFiltersKeys,
  Buyer,
  Document,
  SortedColumnData,
} from '@ui-coe/avidcapture/shared/types';

import { RecycleBinPageState } from './recycle-bin-page.state';

export class RecycleBinSelectors {
  @Selector([RecycleBinPageState.data])
  static recycleBinDocuments(state: DocumentStateModel): Document[] {
    return state.invoices;
  }

  @Selector([RecycleBinPageState.data])
  static filteredBuyers(state: DocumentStateModel): Buyer[] {
    return state.filteredBuyers;
  }

  @Selector([RecycleBinPageState.data])
  static buyers(state: DocumentStateModel): Buyer[] {
    return state.buyers;
  }

  @Selector([RecycleBinPageState.data])
  static advancedFilters(state: DocumentStateModel): AdvancedFilter {
    return state.filters;
  }

  @Selector([RecycleBinPageState.data])
  static loadMoreHidden(state: DocumentStateModel): boolean {
    return state.loadMoreHidden;
  }

  @Selector([RecycleBinPageState.data])
  static sortedColumnData(state: DocumentStateModel): SortedColumnData {
    return state.sortedColumnData;
  }

  @Selector([RecycleBinPageState.data])
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

  @Selector([RecycleBinPageState.data])
  static canRefreshPage(state: DocumentStateModel): boolean {
    return state.canRefreshPage;
  }
}
