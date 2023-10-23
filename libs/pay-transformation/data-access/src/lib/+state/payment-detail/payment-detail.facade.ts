import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  CancelPaymentActions,
  PaymentDetailActions,
  StopPaymentActions,
} from './payment-detail.actions';
import { IPaymentDetailState } from './payment-detail.reducer';
import { getSelectedDetail, getStopPaymentAlerts } from './payment-detail.selectors';
import { IPaymentDetail, IStopPayment } from '@ui-coe/pay-transformation/shared/types';

@Injectable()
export class PaymentDetailFacade {
  constructor(private readonly _store: Store<IPaymentDetailState>) {}
  public paymentDetails$: Observable<IPaymentDetail> = this._store.select(getSelectedDetail);
  public stopPaymentAlerts$: Observable<string[]> = this._store.select(getStopPaymentAlerts);

  public dispatchGetPaymentDetail(id: string): void {
    this._store.dispatch(PaymentDetailActions.getPaymentDetail({ id }));
  }

  public dispatchCancelPayment(id: string): void {
    this._store.dispatch(CancelPaymentActions.cancelPayment({ id }));
  }

  public dispatchStopPayment(stopPayment: IStopPayment): void {
    this._store.dispatch(StopPaymentActions.stopPayment(stopPayment));
  }
}
