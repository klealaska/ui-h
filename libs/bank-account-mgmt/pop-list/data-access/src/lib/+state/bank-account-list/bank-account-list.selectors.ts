import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IPopBamListFeatureState, popBamStateListFeatureKey } from '../../pop-bam-state-model';
import * as fromBankAccountList from './bank-account-list.reducer';
import { IPopBamListState } from './bank-account-list.reducer';

export const selectBankAccountFeatureState =
  createFeatureSelector<IPopBamListFeatureState>(popBamStateListFeatureKey);

export const selectBankAccountListFeatureState = createSelector(
  selectBankAccountFeatureState,
  (featureState: IPopBamListFeatureState) => featureState[fromBankAccountList.popBamListFeatureKey]
);

export const selectBankAccountListLoading = createSelector(
  selectBankAccountListFeatureState,
  (state: IPopBamListState) => state.listLoading
);

export const selectAllBankAccounts = createSelector(
  selectBankAccountListFeatureState,
  fromBankAccountList.selectAllBankAccounts
);
