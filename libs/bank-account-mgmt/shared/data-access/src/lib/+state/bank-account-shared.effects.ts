import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BankAccountSharedActions } from './bank-account-shared.actions';
import { map } from 'rxjs';

@Injectable()
export class BankAccountSharedEffects {
  setSelectedAccountId$ = createEffect(() =>
    this._actions$.pipe(
      ofType(BankAccountSharedActions.setSelectedBankAccount),
      map(() => BankAccountSharedActions.setSidePanelComponentId({ component: 'detail' }))
    )
  );

  constructor(private readonly _actions$: Actions) {}
}
