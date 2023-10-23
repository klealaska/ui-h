import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  IBankAccountDetailFeatureState,
  bankAccountDetailStateFeatureKey,
} from '../bank-account-detail-state.model';
import * as fromBankAccountDetail from './bank-account-detail.reducer';
import { IBankAccountDetailState } from './bank-account-detail.reducer';
import { Dictionary } from '@ngrx/entity';
import { IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';

export const selectBankAccountDetailFeatureState =
  createFeatureSelector<IBankAccountDetailFeatureState>(bankAccountDetailStateFeatureKey);

export const getBankAccountDetailFeatureState = createSelector(
  selectBankAccountDetailFeatureState,
  (featureState: IBankAccountDetailFeatureState) =>
    featureState[fromBankAccountDetail.bankAccountDetailFeatureKey]
);

export const getSelectedBankAccountId = createSelector(
  getBankAccountDetailFeatureState,
  (state: IBankAccountDetailState) => state.selectedBankAccountId
);

export const getDetailError = createSelector(
  getBankAccountDetailFeatureState,
  (state: IBankAccountDetailState) => state.error
);

export const getBankAccountDetailEntities = createSelector(
  getBankAccountDetailFeatureState,
  fromBankAccountDetail.selectAccountEntities
);

export const getSelectedBankAccount = createSelector(
  getBankAccountDetailEntities,
  getSelectedBankAccountId,
  (entities: Dictionary<IBankAccountMapped>, id: string) => entities[id]
);

export const getUnmaskedAccountNumber = createSelector(
  getBankAccountDetailFeatureState,
  (state: IBankAccountDetailState) => state.unmaskedAccountNumber
);
