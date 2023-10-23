import { Injectable } from '@angular/core';
import {
  BankAccountDetailActions,
  EditBankAccountDetailActions,
} from './bank-account-detail.actions';
import { Action, Store } from '@ngrx/store';
import {
  IBankAccountMapped,
  IEditBankAccountParams,
  IUpdateStatusParams,
} from '@ui-coe/bank-account-mgmt/shared/types';
import { getSelectedBankAccount, getUnmaskedAccountNumber } from './bank-account-detail.selectors';
import { first, Observable } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';

@Injectable()
export class BankAccountDetailFacade {
  public bankAccount$: Observable<IBankAccountMapped> = this._store.select(getSelectedBankAccount);
  public unmaskedAccountNumber$: Observable<string> = this._store.select(getUnmaskedAccountNumber);

  public dispatchResetDetails(): void {
    this._store.dispatch(BankAccountDetailActions.resetDetails());
  }

  public dispatchGetBankAccount(accountId: string): void {
    if (accountId) {
      this._store.dispatch(BankAccountDetailActions.getBankAccount({ accountId }));
    }
  }

  public dispatchGetUnmaskedAccountNumber(accountId: string): void {
    this._store.dispatch(BankAccountDetailActions.unmaskBankAccountNumber({ accountId }));
  }

  public dispatchEditBankAccount(
    editBankAccountParams: IEditBankAccountParams
  ): Observable<Action> {
    this._store.dispatch(EditBankAccountDetailActions.editBankAccount({ editBankAccountParams }));
    return this.actions$.pipe(
      ofType(
        EditBankAccountDetailActions.editBankAccountSuccess,
        EditBankAccountDetailActions.editBankAccountFailure
      ),
      first()
    );
  }

  public dispatchActivateAccount(accountId: string): void {
    this._store.dispatch(BankAccountDetailActions.activateBankAccount({ accountId }));
  }

  public dispatchDeactivateAccount(accountId: string): void {
    this._store.dispatch(BankAccountDetailActions.deactivateBankAccount({ accountId }));
  }

  public dispatchStatusUpdate(updateStatusParams: IUpdateStatusParams): void {
    this._store.dispatch(BankAccountDetailActions.updateStatus({ updateStatusParams }));
  }

  constructor(private readonly _store: Store, private readonly actions$: Actions) {}
}
