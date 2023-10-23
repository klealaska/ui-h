import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  PaymentDetailActions,
  CancelPaymentActions,
  StopPaymentActions,
} from './payment-detail.actions';
import { PaymentDetailService } from '../../services/payment-detail/payment-detail.service';
import { IPaymentDetail, IStopPayment } from '@ui-coe/pay-transformation/shared/types';

@Injectable()
export class PaymentDetailEffects {
  getPaymentDetail$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(PaymentDetailActions.getPaymentDetail),
      switchMap(({ id }) =>
        this._paymentDetailService.getPaymentDetails(id).pipe(
          map(detail => PaymentDetailActions.getPaymentDetailSuccess({ detail })),
          catchError(error => of(PaymentDetailActions.getPaymentDetailFailure({ error })))
        )
      )
    );
  });

  cancelPayment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(CancelPaymentActions.cancelPayment),
      switchMap(({ id }) =>
        this._paymentDetailService.cancelPayment(id).pipe(
          map((response: IPaymentDetail) =>
            CancelPaymentActions.cancelPaymentSuccess({ response })
          ),
          catchError(error => of(CancelPaymentActions.cancelPaymentFailure({ error })))
        )
      )
    );
  });

  stopPayment$ = createEffect(() => {
    return this._actions$.pipe(
      ofType(StopPaymentActions.stopPayment),
      switchMap((stopPayment: IStopPayment) =>
        this._paymentDetailService.stopPayment(stopPayment).pipe(
          map((response: IPaymentDetail) =>
            StopPaymentActions.stopPaymentSuccess({
              response,
              distributionId: stopPayment.distributionId,
            })
          ),
          catchError(error => of(StopPaymentActions.stopPaymentFailure({ error })))
        )
      )
    );
  });

  constructor(
    private readonly _actions$: Actions,
    private readonly _paymentDetailService: PaymentDetailService
  ) {}
}
