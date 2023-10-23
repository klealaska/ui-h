import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { IBankAccount, IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';
import { createReducer, on } from '@ngrx/store';
import { PopBamListActions } from './bank-account-list.actions';

export const popBamListFeatureKey = 'popBamList';

export interface IPopBamListState extends EntityState<IBankAccountMapped> {
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

export const initialState: IPopBamListState = adapter.getInitialState({
  listLoading: false,
  listLoaded: false,
  addLoading: false,
  addLoaded: false,
  error: null,
});

export const reducer = createReducer(
  initialState,
  on(PopBamListActions.getBankAccountList, state => {
    return { ...state, listLoading: true };
  }),
  on(PopBamListActions.getBankAccountListSuccess, (state, { response }) =>
    adapter.upsertMany(response, {
      ...state,
      listLoading: false,
      listLoaded: true,
    })
  ),
  on(PopBamListActions.getBankAccountListFailure, state => {
    return { ...state, listLoading: false, listLoaded: true };
  })
);

const { selectAll } = adapter.getSelectors();

export const selectAllBankAccounts = selectAll;
