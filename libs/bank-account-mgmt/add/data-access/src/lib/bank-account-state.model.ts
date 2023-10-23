import { ActionReducerMap } from '@ngrx/store';
import { AddBankAccountEffects } from './+state/add-bank-account.effects';
import * as fromBankAccountAdd from './+state/add-bank-account.reducer';
import { EntityState } from '@ngrx/entity';
import { IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';

export const bankAccountAddStateFeatureKey = 'addBankAccount';
export const bankAccountAddReducers: ActionReducerMap<IBankAccountAddFeatureState> = {
  [fromBankAccountAdd.addBankAccountFeatureKey]: fromBankAccountAdd.reducer,
};
export const bankAccountEffects = [AddBankAccountEffects];
export interface IBankAccountAddFeatureState {
  [fromBankAccountAdd.addBankAccountFeatureKey]: EntityState<IBankAccountMapped>;
}
