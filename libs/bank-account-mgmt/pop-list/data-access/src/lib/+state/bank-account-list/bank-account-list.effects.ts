import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PopBamService } from '../../services/bank-account.service';
import { PopBamListActions } from './bank-account-list.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class PopBamListEffects {
  loadBankAccounts$ = createEffect(() =>
    this._actions$.pipe(
      ofType(PopBamListActions.getBankAccountList),
      switchMap(() =>
        this._bankAccountService.getBankAccounts().pipe(
          map((response: IBankAccountMapped[]) =>
            PopBamListActions.getBankAccountListSuccess({ response })
          ),
          catchError((error: unknown) => of(PopBamListActions.getBankAccountListFailure({ error })))
        )
      )
    )
  );

  constructor(
    private readonly _actions$: Actions,
    private readonly _bankAccountService: PopBamService,
    private readonly _toast: MatSnackBar
  ) {}
}
