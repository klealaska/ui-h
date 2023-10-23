import { Selector } from '@ngxs/store';
import { DocumentStateModel } from '@ui-coe/avidcapture/shared/data-access';
import {
  AdvancedFilter,
  AdvancedFiltersKeys,
  Buyer,
  Document,
  ExposedFilter,
  SortedColumnData,
} from '@ui-coe/avidcapture/shared/types';

import { ResearchPageState } from './research-page.state';

export class ResearchPageSelectors {
  @Selector([ResearchPageState.data])
  static researchInvoices(state: DocumentStateModel): Document[] {
    return state.invoices;
  }

  @Selector([ResearchPageState.data])
  static buyers(state: DocumentStateModel): Buyer[] {
    return state.buyers;
  }

  @Selector([ResearchPageState.data])
  static filteredBuyers(state: DocumentStateModel): Buyer[] {
    return state.filteredBuyers;
  }

  @Selector([ResearchPageState.data])
  static advancedFilters(state: DocumentStateModel): AdvancedFilter {
    return state.filters;
  }

  @Selector([ResearchPageState.data])
  static loadMoreHidden(state: DocumentStateModel): boolean {
    return state.loadMoreHidden;
  }

  @Selector([ResearchPageState.data])
  static sortedColumnData(state: DocumentStateModel): SortedColumnData {
    return state.sortedColumnData;
  }

  @Selector([ResearchPageState.data])
  static appliedFilters(state: DocumentStateModel): Record<string, string> {
    const excludedKeys = [
      AdvancedFiltersKeys.BuyerId,
      AdvancedFiltersKeys.IsSubmitted,
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

  @Selector([ResearchPageState.data])
  static canRefreshPage(state: DocumentStateModel): boolean {
    return state.canRefreshPage;
  }

  @Selector([ResearchPageState.data])
  static queuesNotAllowedList(state: DocumentStateModel): string[] {
    return state.queuesNotAllowedList;
  }

  @Selector([ResearchPageState.data, ResearchPageSelectors.queuesNotAllowedList])
  static exposedFilters(
    state: DocumentStateModel,
    queuesNotAllowedList: string[]
  ): ExposedFilter[] {
    return state.exposedFilters.filter(
      fltr =>
        (fltr.count !== 0 && fltr.show === true) || queuesNotAllowedList.includes(`-${fltr.name}`)
    );
  }
}
