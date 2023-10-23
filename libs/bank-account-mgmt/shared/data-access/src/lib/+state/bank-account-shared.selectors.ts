import * as fromSharedState from './bank-account-shared.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IBankAccountSharedState } from './bank-account-shared.reducer';

export const selectBankAccountSharedFeature = createFeatureSelector<IBankAccountSharedState>(
  fromSharedState.sharedStateFeatureKey
);

export const selectSelectedAccountId = createSelector(
  selectBankAccountSharedFeature,
  (state: IBankAccountSharedState) => state.selectedAccountId
);

export const selectSidePanelComponentId = createSelector(
  selectBankAccountSharedFeature,
  (state: IBankAccountSharedState) => state.sidePanelComponentId
);
