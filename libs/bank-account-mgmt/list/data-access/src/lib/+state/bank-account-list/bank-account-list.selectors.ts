import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IBankAccountListFeatureState,
  bankAccountStateListFeatureKey,
} from '../../bank-account-state-model';
import * as fromBankAccountList from './bank-account-list.reducer';
import { IBankAccountListState } from './bank-account-list.reducer';

export const selectBankAccountFeatureState = createFeatureSelector<IBankAccountListFeatureState>(
  bankAccountStateListFeatureKey
);

export const selectBankAccountListFeatureState = createSelector(
  selectBankAccountFeatureState,
  (featureState: IBankAccountListFeatureState) =>
    featureState[fromBankAccountList.bankAccountListFeatureKey]
);

export const selectBankAccountListLoading = createSelector(
  selectBankAccountListFeatureState,
  (state: IBankAccountListState) => state.listLoading
);

export const selectBankAccountAddLoading = createSelector(
  selectBankAccountListFeatureState,
  (state: IBankAccountListState) => state.addLoading
);

export const selectAllBankAccounts = createSelector(
  selectBankAccountListFeatureState,
  fromBankAccountList.selectAllBankAccounts
);
