import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BankAccountListActions } from './bank-account-list.actions';
import { IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';
import { selectAllBankAccounts, selectBankAccountListLoading } from './bank-account-list.selectors';
import { Observable } from 'rxjs';
import { Actions } from '@ngrx/effects';

@Injectable()
export class BankAccountListFacade {
  public bankAccounts$: Observable<IBankAccountMapped[]> =
    this._store.select(selectAllBankAccounts);
  public listLoading$: Observable<boolean> = this._store.select(selectBankAccountListLoading);

  public dispatchGetBankAccounts(): void {
    this._store.dispatch(BankAccountListActions.getBankAccountList());
  }

  constructor(private readonly _store: Store, private readonly _actions$: Actions) {}
}
