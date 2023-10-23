import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAddBankAccount from './add-bank-account.reducer';
import {
  IBankAccountAddFeatureState,
  bankAccountAddStateFeatureKey,
} from '../bank-account-state.model';
import { AddBankAccountState } from './add-bank-account.reducer';

export const selectAddBankAccountFeatureState = createFeatureSelector<IBankAccountAddFeatureState>(
  bankAccountAddStateFeatureKey
);

export const getBankAccountAddFeatureState = createSelector(
  selectAddBankAccountFeatureState,
  (state: IBankAccountAddFeatureState) => state[fromAddBankAccount.addBankAccountFeatureKey]
);

export const selectBankAccountAddLoading = createSelector(
  getBankAccountAddFeatureState,
  (state: AddBankAccountState) => state.addLoading
);
