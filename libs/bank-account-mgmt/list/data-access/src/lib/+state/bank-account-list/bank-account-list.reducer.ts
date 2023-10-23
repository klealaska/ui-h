import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IBankAccount, IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';
import { createReducer, on } from '@ngrx/store';
import { BankAccountListActions } from './bank-account-list.actions';

export const bankAccountListFeatureKey = 'bankAccountList';

export interface IBankAccountListState extends EntityState<IBankAccountMapped> {
  listLoading: boolean;
  listLoaded: boolean;
  addLoading: boolean;
  addLoaded: boolean;
  error: any;
}

export function selectBankAccountId(account: IBankAccount): string {
  return account.accountId;
}

export const adapter: EntityAdapter<IBankAccountMapped> = createEntityAdapter<IBankAccountMapped>({
  selectId: selectBankAccountId,
});

export const initialState: IBankAccountListState = adapter.getInitialState({
  listLoading: false,
  listLoaded: false,
  addLoading: false,
  addLoaded: false,
  error: null,
});

export const reducer = createReducer(
  initialState,
  on(BankAccountListActions.getBankAccountList, state => {
    return { ...state, listLoading: true };
  }),
  on(BankAccountListActions.getBankAccountListSuccess, (state, { response }) =>
    adapter.addMany(response, {
      ...state,
      listLoading: false,
      listLoaded: true,
    })
  ),
  on(BankAccountListActions.getBankAccountListFailure, state => {
    return { ...state, addLoading: false, addLoaded: true };
  })
);

const { selectAll } = adapter.getSelectors();

export const selectAllBankAccounts = selectAll;
