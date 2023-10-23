import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AddBankAccountActions } from './add-bank-account.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';
import { ToastComponent } from '@ui-coe/shared/ui-v2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddAccountService } from '../services/add-account.service';

@Injectable()
export class AddBankAccountEffects {
  constructor(
    private readonly _actions$: Actions,
    private readonly _toast: MatSnackBar,
    private readonly _addAccountService: AddAccountService
  ) {}

  addBankAccount$ = createEffect(() =>
    this._actions$.pipe(
      ofType(AddBankAccountActions.addBankAccount),
      switchMap(({ account }) => {
        const tempData = {
          externalBankReference: 'bank 1',
          bankName: 'JPMorgan Chase Bank N.A.',
        };
        return this._addAccountService.addBankAccount({ ...account, ...tempData }).pipe(
          map((response: IBankAccountMapped) => {
            // TODO check if we should be using a toast or alert since toasts may need to have both a title and message per UX guidelines
            // Also how do we want to handle triggering toasts from an effect?
            this._toast.openFromComponent(ToastComponent, {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              data: {
                title: 'Account added',
                icon: 'check_circle',
                type: 'success',
                close: false,
              },
            });

            return AddBankAccountActions.addBankAccountSuccess({ response });
          }),
          catchError((error: unknown) => of(AddBankAccountActions.addBankAccountFailure({ error })))
        );
      })
    )
  );
}
