import { ActionReducerMap } from '@ngrx/store';
import { BankAccountListEffects } from './+state/bank-account-list/bank-account-list.effects';
import * as fromBankAccountList from './+state/bank-account-list/bank-account-list.reducer';
import { EntityState } from '@ngrx/entity';
import { IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';

export const bankAccountStateListFeatureKey = fromBankAccountList.bankAccountListFeatureKey;
export const bankAccountListReducers: ActionReducerMap<IBankAccountListFeatureState> = {
  [fromBankAccountList.bankAccountListFeatureKey]: fromBankAccountList.reducer,
};
export const bankAccountListEffects = [BankAccountListEffects];
export interface IBankAccountListFeatureState {
  [fromBankAccountList.bankAccountListFeatureKey]: EntityState<IBankAccountMapped>;
}
