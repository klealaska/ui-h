import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';
import { createReducer, on } from '@ngrx/store';
import {
  BankAccountDetailActions,
  EditBankAccountDetailActions,
} from './bank-account-detail.actions';

export const bankAccountDetailFeatureKey = 'bankAccountDetail';

export interface IBankAccountDetailState extends EntityState<IBankAccountMapped> {
  selectedBankAccountId: string | null;
  unmaskedAccountNumber: string | null;
  error: any;
}

export function selectBankAccountId(account: IBankAccountMapped): string {
  return account.accountId;
}

export function sortByAccount(a: IBankAccountMapped, b: IBankAccountMapped): number {
  return a.accountId.localeCompare(b.accountId);
}

export const adapter: EntityAdapter<IBankAccountMapped> = createEntityAdapter<IBankAccountMapped>({
  selectId: selectBankAccountId,
  sortComparer: sortByAccount,
});

export const initialState: EntityState<IBankAccountMapped> = adapter.getInitialState({
  selectedBankAccountId: null,
  unmaskedAccountNumber: null,
  error: null,
});

export const reducer = createReducer(
  initialState,
  on(BankAccountDetailActions.resetDetails, () => initialState),

  // Get Account reducers
  on(BankAccountDetailActions.getBankAccount, state => {
    return { ...state };
  }),
  on(BankAccountDetailActions.getBankAccountSuccess, (state, { response }) =>
    adapter.upsertOne(response, {
      ...state,
      selectedBankAccountId: response.accountId,
    })
  ),
  on(BankAccountDetailActions.getBankAccountFailure, (state, { error }) => {
    return {
      ...state,
      error,
    };
  }),

  // Edit Reducers
  on(EditBankAccountDetailActions.editBankAccount, state => {
    return { ...state };
  }),
  on(EditBankAccountDetailActions.editBankAccountSuccess, (state, { response }) =>
    adapter.upsertOne(response, {
      ...state,
      selectedBankAccountId: response.accountId,
    })
  ),
  on(EditBankAccountDetailActions.editBankAccountFailure, (state, { error }) => {
    return { ...state, error };
  }),

  // Deactivate Reducers
  on(BankAccountDetailActions.deactivateBankAccount, state => {
    return { ...state };
  }),
  on(BankAccountDetailActions.deactivateBankAccountSuccess, (state, { response }) =>
    adapter.upsertOne(response, {
      ...state,
      selectedBankAccountId: response.accountId,
    })
  ),
  on(BankAccountDetailActions.deactivateBankAccountError, (state, { error }) => {
    return { ...state, error };
  }),

  // Reactivate Reducers
  on(BankAccountDetailActions.activateBankAccount, state => {
    return { ...state };
  }),
  on(BankAccountDetailActions.activateBankAccountSuccess, (state, { response }) =>
    adapter.upsertOne(response, {
      ...state,
      selectedBankAccountId: response.accountId,
    })
  ),
  on(BankAccountDetailActions.activateBankAccountError, (state, { error }) => {
    return { ...state, error };
  }),

  // Unmask Reducers
  on(BankAccountDetailActions.unmaskBankAccountNumber, state => {
    return state;
  }),
  on(BankAccountDetailActions.unmaskBankAccountNumberSuccess, (state, { response }) => {
    return { ...state, unmaskedAccountNumber: response.accountNumber };
  }),
  on(BankAccountDetailActions.unmaskBankAccountNumberError, (state, { error }) => {
    return { ...state, error };
  }),

  // status update
  on(BankAccountDetailActions.updateStatus, state => {
    return { ...state };
  }),
  on(BankAccountDetailActions.updateStatusSuccess, (state, { response }) =>
    adapter.upsertOne(response, {
      ...state,
      selectedBankAccountId: response.accountId,
    })
  ),
  on(BankAccountDetailActions.updateStatusFailure, (state, { error }) => {
    return { ...state, error };
  })
);

const { selectEntities } = adapter.getSelectors();

export const selectAccountEntities = selectEntities;
