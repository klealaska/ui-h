import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import { IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';
import { AddBankAccountActions } from './add-bank-account.actions';

export const addBankAccountFeatureKey = 'addBankAccount';

export interface AddBankAccountState extends EntityState<IBankAccountMapped> {
  addLoading: boolean;
  addLoaded: boolean;
  error: any;
}

export const addBankAccountAdapter: EntityAdapter<IBankAccountMapped> =
  createEntityAdapter<IBankAccountMapped>();

export const initialAddBankAccountState: AddBankAccountState =
  addBankAccountAdapter.getInitialState({
    addLoading: false,
    addLoaded: false,
    error: null,
  });

export const reducer = createReducer(
  initialAddBankAccountState,
  on(AddBankAccountActions.addBankAccount, state => {
    return { ...state, addLoading: true };
  }),
  on(AddBankAccountActions.addBankAccountSuccess, (state, { response }) =>
    addBankAccountAdapter.addOne(response, {
      ...state,
      addLoading: false,
      addLoaded: true,
    })
  ),
  on(AddBankAccountActions.addBankAccountFailure, state => {
    return { ...state, addLoading: false, addLoaded: true };
  })
);

export function addBankAccountReducer(state: AddBankAccountState | undefined, action: Action) {
  return reducer(state, action);
}
