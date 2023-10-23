import { Injectable } from '@angular/core';
import { IAddBankAccountParams } from '@ui-coe/bank-account-mgmt/shared/types';
import { Observable, first } from 'rxjs';
import { selectBankAccountAddLoading } from './add-bank-account.selectors';
import { Action, Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { AddBankAccountActions } from './add-bank-account.actions';

@Injectable()
export class AddBankAccountFacade {
  public addLoading$: Observable<boolean> = this._store.select(selectBankAccountAddLoading);

  public dispatchAddBankAccount(account: IAddBankAccountParams): Observable<Action> {
    this._store.dispatch(AddBankAccountActions.addBankAccount({ account }));
    return this._actions$.pipe(
      ofType(
        AddBankAccountActions.addBankAccountSuccess,
        AddBankAccountActions.addBankAccountFailure
      ),
      first()
    );
  }
  constructor(private readonly _store: Store, private readonly _actions$: Actions) {}
}
