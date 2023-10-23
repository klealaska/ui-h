import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTableModule } from '@angular/material/table';
import { mockPaymentList } from '@ui-coe/pay-transformation/shared/test';
import { IPaymentListTableView } from '@ui-coe/pay-transformation/shared/types';

import { PaymentListComponent } from './payment-list.component';

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import SpyInstance = jest.SpyInstance;

@Component({
  selector: 'ui-coe-empty-state',
  template: '<div>Hello</div>',
})
class MockEmptyStateComponent {}

describe('PaymentListComponent', () => {
  let component: PaymentListComponent;
  let fixture: ComponentFixture<PaymentListComponent>;

  const mockView: IPaymentListTableView = {
    id: 'Payment ID',
    amount: 'Amount',
    date: 'Payment Date',
    vendorName: 'VendorName',
    status: 'Status',
  };

  beforeEach(async () => {
    return await TestBed.configureTestingModule({
      declarations: [PaymentListComponent, MockEmptyStateComponent],
      imports: [MatTableModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentListComponent);
    component = fixture.componentInstance;
    component.payments = mockPaymentList;
    fixture.detectChanges();
  });

  describe('Creation and state changes', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render the table', () => {
      component.view = mockView;
      fixture.detectChanges();

      const tableElem: HTMLElement = fixture.debugElement.query(
        By.css('table.w-full')
      ).nativeElement;
      expect(tableElem).toBeTruthy();
    });

    it('should show empty state if payment list is empty', () => {
      component.view = mockView;
      component.payments = [];
      fixture.detectChanges();

      const emptyStateComponent: HTMLElement = fixture.debugElement.query(
        By.css('ui-coe-empty-state')
      ).nativeElement;
      expect(emptyStateComponent).toBeTruthy();
    });
  });

  describe('onViewPaymentDetails()', () => {
    it('should emit paymentDetails id to parent', () => {
      const emitSpy: SpyInstance = jest.spyOn(component.viewPaymentDetails, 'emit');
      const handlerSpy: SpyInstance = jest.spyOn(component, 'onViewPaymentDetails');

      component.view = mockView;
      component.payments = mockPaymentList;
      fixture.detectChanges();

      const elem: DebugElement = fixture.debugElement.query(By.css('.linkRow'));
      elem.triggerEventHandler('click', mockPaymentList[0]);

      expect(handlerSpy).toHaveBeenCalledWith(mockPaymentList[0]);
      expect(emitSpy).toHaveBeenCalledWith(mockPaymentList[0].id);
    });
  });
});
