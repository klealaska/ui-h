import { Injectable } from '@angular/core';
import { BankAccountDetailsService } from '../services/bank-account-details.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { IBankAccountMapped, IUnmaskedBankAccount } from '@ui-coe/bank-account-mgmt/shared/types';
import {
  BankAccountDetailActions,
  EditBankAccountDetailActions,
} from './bank-account-detail.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopBamListActions } from '@ui-coe/bank-account-mgmt/pop-list/data-access';
import { ToastComponent } from '@ui-coe/shared/ui-v2';

@Injectable()
export class BankAccountDetailEffects {
  constructor(
    private readonly _actions$: Actions,
    private readonly _bankAccountService: BankAccountDetailsService,
    private readonly _toast: MatSnackBar
  ) {}

  loadBankAccountDetail$ = createEffect(() =>
    this._actions$.pipe(
      ofType(BankAccountDetailActions.getBankAccount),
      switchMap(({ accountId }) =>
        this._bankAccountService.getBankAccount(accountId).pipe(
          map((response: IBankAccountMapped) =>
            BankAccountDetailActions.getBankAccountSuccess({ response })
          ),
          catchError((error: unknown) =>
            of(BankAccountDetailActions.getBankAccountFailure({ error }))
          )
        )
      )
    )
  );

  editBankAccount$ = createEffect(() =>
    this._actions$.pipe(
      ofType(EditBankAccountDetailActions.editBankAccount),
      switchMap(({ editBankAccountParams }) => {
        return this._bankAccountService.editBankAccount(editBankAccountParams).pipe(
          map((response: IBankAccountMapped) => {
            this._toast.openFromComponent(ToastComponent, {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              data: {
                title: 'Changes saved',
                icon: 'check_circle',
                type: 'success',
                close: false,
              },
            });

            return EditBankAccountDetailActions.editBankAccountSuccess({ response });
          }),
          catchError((error: unknown) =>
            of(EditBankAccountDetailActions.editBankAccountFailure({ error }))
          )
        );
      })
    )
  );

  activateBankAccount$ = createEffect(() =>
    this._actions$.pipe(
      ofType(BankAccountDetailActions.activateBankAccount),
      switchMap(({ accountId }) => {
        return this._bankAccountService
          .activateBankAccount(accountId)
          .pipe(
            switchMap(response => {
              return [
                BankAccountDetailActions.activateBankAccountSuccess({ response }),
                PopBamListActions.getBankAccountList(),
              ];
            })
          )
          .pipe(
            catchError((error: unknown) =>
              of(BankAccountDetailActions.activateBankAccountError({ error }))
            )
          );
      })
    )
  );

  deactivateBankAccount$ = createEffect(() =>
    this._actions$.pipe(
      ofType(BankAccountDetailActions.deactivateBankAccount),
      switchMap(({ accountId }) => {
        return this._bankAccountService
          .deactivateBankAccount(accountId)
          .pipe(
            switchMap(response => {
              return [
                BankAccountDetailActions.deactivateBankAccountSuccess({ response }),
                PopBamListActions.getBankAccountList(),
              ];
            })
          )
          .pipe(
            catchError((error: unknown) =>
              of(BankAccountDetailActions.deactivateBankAccountError({ error }))
            )
          );
      })
    )
  );

  unmaskBankAccountNumber$ = createEffect(() =>
    this._actions$.pipe(
      ofType(BankAccountDetailActions.unmaskBankAccountNumber),
      switchMap(({ accountId }) =>
        this._bankAccountService.unmaskAccountNumber(accountId).pipe(
          map((response: IUnmaskedBankAccount) => {
            return BankAccountDetailActions.unmaskBankAccountNumberSuccess({ response });
          }),
          catchError((error: unknown) =>
            of(BankAccountDetailActions.unmaskBankAccountNumberError({ error }))
          )
        )
      )
    )
  );

  updateStatus$ = createEffect(() =>
    this._actions$.pipe(
      ofType(BankAccountDetailActions.updateStatus),
      switchMap(({ updateStatusParams }) => {
        return this._bankAccountService
          .updateStatus(updateStatusParams)
          .pipe(
            switchMap((response: IBankAccountMapped) => {
              return [
                BankAccountDetailActions.updateStatusSuccess({ response }),
                PopBamListActions.getBankAccountList(),
              ];
            })
          )
          .pipe(
            catchError((error: unknown) =>
              of(BankAccountDetailActions.updateStatusFailure({ error }))
            )
          );
      })
    )
  );
}
