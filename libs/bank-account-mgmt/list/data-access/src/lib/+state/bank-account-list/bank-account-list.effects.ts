import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BankAccountService } from '../../services/bank-account.service';
import { BankAccountListActions } from './bank-account-list.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class BankAccountListEffects {
  loadBankAccounts$ = createEffect(() =>
    this._actions$.pipe(
      ofType(BankAccountListActions.getBankAccountList),
      switchMap(() =>
        this._bankAccountService.getBankAccounts().pipe(
          map((response: IBankAccountMapped[]) =>
            BankAccountListActions.getBankAccountListSuccess({ response })
          ),
          catchError((error: unknown) =>
            of(BankAccountListActions.getBankAccountListFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private readonly _actions$: Actions,
    private readonly _bankAccountService: BankAccountService
  ) {}
}
