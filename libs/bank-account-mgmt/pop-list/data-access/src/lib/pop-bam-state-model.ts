import { ActionReducerMap } from '@ngrx/store';
import { PopBamListEffects } from './+state/bank-account-list/bank-account-list.effects';
import * as fromPopBamList from './+state/bank-account-list/bank-account-list.reducer';
import { EntityState } from '@ngrx/entity';
import { IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';

export const popBamStateListFeatureKey = 'popBamList';
export const popBamListReducers: ActionReducerMap<IPopBamListFeatureState> = {
  [fromPopBamList.popBamListFeatureKey]: fromPopBamList.reducer,
};
export const popBamListEffects = [PopBamListEffects];
export interface IPopBamListFeatureState {
  [fromPopBamList.popBamListFeatureKey]: EntityState<IBankAccountMapped>;
}
