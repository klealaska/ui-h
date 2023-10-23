import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { PaymentListActions } from './payment-list.actions';
import { PaymentListService } from '../../services/payment-list/payment-list.service';

@Injectable()
export class PaymentListEffects {
  getPayments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PaymentListActions.getPayments),
      switchMap(action =>
        this._paymentsListService.getPayments(action.vendorName).pipe(
          map(payments => PaymentListActions.getPaymentsSuccess({ payments })),
          catchError(error => of(PaymentListActions.getPaymentsFailure({ error })))
        )
      )
    );
  });

  constructor(private actions$: Actions, private _paymentsListService: PaymentListService) {}
}
