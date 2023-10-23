import { ActionReducerMap } from '@ngrx/store';
import * as fromBankAccountDetail from './+state/bank-account-detail.reducer';
import { EntityState } from '@ngrx/entity';
import { IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';
import { BankAccountDetailEffects } from './+state/bank-account-detail.effects';

export const bankAccountDetailStateFeatureKey = fromBankAccountDetail.bankAccountDetailFeatureKey;
export const bankAccountDetailReducers: ActionReducerMap<IBankAccountDetailFeatureState> = {
  [fromBankAccountDetail.bankAccountDetailFeatureKey]: fromBankAccountDetail.reducer,
};
export const bankAccountDetailEffects = [BankAccountDetailEffects];
export interface IBankAccountDetailFeatureState {
  [fromBankAccountDetail.bankAccountDetailFeatureKey]: EntityState<IBankAccountMapped>;
}
