import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PaymentListActions } from './payment-list.actions';
import { IPaymentListState } from './payment-list.reducer';
import { selectAllPayments } from './payment-list.selectors';
import { IPaymentDetail } from '@ui-coe/pay-transformation/shared/types';

@Injectable({ providedIn: 'root' })
export class PaymentListFacade {
  constructor(private _store: Store<IPaymentListState>) {}
  public payments$: Observable<IPaymentDetail[]> = this._store.select(selectAllPayments);

  public dispatchLoadPayments(vendorName?: string): void {
    this._store.dispatch(PaymentListActions.getPayments({ vendorName }));
  }
}
