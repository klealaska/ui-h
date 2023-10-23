import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { PaymentListContainerComponent } from './payment-list-container.component';
import { IPaymentListFeatureView } from '@ui-coe/pay-transformation/shared/types';
import { ContentFacade } from '@ui-coe/pay-transformation/shared/data-access';
import { PaymentListComponent } from '../../components/payment-list/payment-list.component';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { PaymentListFacade } from '@ui-coe/pay-transformation/data-access';
import { mockPaymentList } from '@ui-coe/pay-transformation/shared/test';
import { By } from '@angular/platform-browser';
import { mockPaymentListFacade } from '@ui-coe/pay/shared/test';

const mockContentFacade = {
  getPaymentListViewContent: jest.fn(),
};

const mockRouter = {
  navigate: jest.fn(),
};

const mockView: IPaymentListFeatureView = {
  title: 'Payments',
  searchLabel: 'Filter by vendor',
  table: {
    id: 'Payment ID',
    amount: 'Amount',
    date: 'Payment Date',
    vendorName: 'VendorName',
    status: 'Status',
  },
};

describe('PaymentListContainerComponent', () => {
  let component: PaymentListContainerComponent;
  let fixture: ComponentFixture<PaymentListContainerComponent>;
  let contentFacade: ContentFacade;
  let router: Router;
  let paymentListFacade: PaymentListFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentListContainerComponent, PaymentListComponent],
      imports: [RouterTestingModule, MatTableModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: PaymentListFacade, useValue: mockPaymentListFacade },
        { provide: ContentFacade, useValue: mockContentFacade },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentListContainerComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    contentFacade = TestBed.inject(ContentFacade);
    paymentListFacade = TestBed.inject(PaymentListFacade);
    jest.spyOn(contentFacade, 'getPaymentListViewContent').mockReturnValue(of(mockView));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fire navigation event with individual payment id', () => {
    jest.spyOn(component, 'onViewPaymentDetails');

    fixture.detectChanges();

    const elem: DebugElement = fixture.debugElement.query(By.css('ui-coe-payment-list'));
    elem.triggerEventHandler('viewPaymentDetails', mockPaymentList[0].id);
    expect(component.onViewPaymentDetails).toHaveBeenCalledWith(mockPaymentList[0].id);
    expect(router.navigate).toHaveBeenCalledWith([`payments/${mockPaymentList[0].id}`]);
  });

  describe('onSearchEvent', () => {
    it('should dispatch load payments with the text value', () => {
      const text = 'test';
      jest.spyOn(paymentListFacade, 'dispatchLoadPayments').mockImplementation();
      component.onSearchEvent(text);
      expect(paymentListFacade.dispatchLoadPayments).toHaveBeenCalledWith(text);
    });
  });
});
