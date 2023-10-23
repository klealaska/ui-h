import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IPaymentDetail, IPaymentListFeatureView } from '@ui-coe/pay-transformation/shared/types';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { PaymentListFacade } from '@ui-coe/pay-transformation/data-access';
import { ContentFacade } from '@ui-coe/pay-transformation/shared/data-access';

@Component({
  selector: 'ui-coe-payment-list-container',
  templateUrl: './payment-list-container.component.html',
  styleUrls: ['./payment-list-container.component.scss'],
})
export class PaymentListContainerComponent implements OnInit {
  public view$: Observable<IPaymentListFeatureView>;
  public payments$: Observable<IPaymentDetail[]>;
  public formControl: FormControl = new FormControl();

  constructor(
    private _contentFacade: ContentFacade,
    private _paymentListFacade: PaymentListFacade,
    private _router: Router
  ) {}

  public ngOnInit(): void {
    this.view$ = this._contentFacade.getPaymentListViewContent();
    this.payments$ = this._paymentListFacade.payments$;
    this._paymentListFacade.dispatchLoadPayments();
  }

  public onViewPaymentDetails(paymentId: string): void {
    this._router.navigate([`payments/${paymentId}`]);
  }

  public onSearchEvent(event: string): void {
    this._paymentListFacade.dispatchLoadPayments(event);
  }
}
