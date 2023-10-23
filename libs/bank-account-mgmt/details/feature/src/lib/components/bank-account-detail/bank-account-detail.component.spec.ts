import { Component, DebugElement, ViewChild } from '@angular/core';
import { BankAccountDetailComponent } from './bank-account-detail.component';
import {
  IBankAccountDetailsContent,
  IBankAccountMapped,
} from '@ui-coe/bank-account-mgmt/shared/types';
import {
  bankAccountDetailMock,
  bankAccountDetailsContentMock,
} from '@ui-coe/bank-account-mgmt/shared/test';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'ax-mock-bam-detail-parent',
  template: `<ax-bank-account-detail
    #detail
    [account]="account"
    [content]="content"
    [unmaskedAccountNumber]="unmaskedAccountNumber"
  ></ax-bank-account-detail>`,
})
export class BamDetailMockParentComponent {
  @ViewChild('detail') public bamDetail: BankAccountDetailComponent;

  public account: IBankAccountMapped = bankAccountDetailMock;
  public content: IBankAccountDetailsContent = bankAccountDetailsContentMock;
  public unmaskedAccountNumber: string = undefined;
}

describe('bank account detail', () => {
  let component: BamDetailMockParentComponent;
  let fixture: ComponentFixture<BamDetailMockParentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BamDetailMockParentComponent],
      imports: [BankAccountDetailComponent],
    });
    fixture = TestBed.createComponent(BamDetailMockParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the detail component', () => {
    expect(component.bamDetail).toBeTruthy();
  });

  describe('skeleton loader', () => {
    it('should display the skeleton loader if no account was passed from the parent', () => {
      component.account = undefined;
      fixture.detectChanges();

      const skeletonElem: DebugElement = fixture.debugElement.query(
        By.css('ui-coe-bam-panel-skeleton')
      );

      expect(skeletonElem).toBeTruthy();
    });
  });

  describe('detail content', () => {
    describe('account number', () => {
      let accountNumberLabel: DebugElement;
      let accountNumberTextElem: DebugElement;
      let maskButton: DebugElement;

      beforeEach(() => {
        accountNumberLabel = fixture.debugElement.query(By.css('.accountNumberLabel'));
        accountNumberTextElem = fixture.debugElement.query(By.css('.accountNumberText'));
        maskButton = fixture.debugElement.query(By.css('.bam-details__show-hide-btn'));
      });

      it('account number label and value', () => {
        expect(accountNumberLabel).toBeTruthy();
        expect(accountNumberLabel.nativeElement.textContent.trim()).toBe(
          component.content.accountNumberLabel
        );

        expect(accountNumberTextElem).toBeTruthy();
        expect(accountNumberTextElem.nativeElement.textContent).toBe(
          component.account.accountNumber
        );
      });

      it('should handle mask/unmask', () => {
        // expect default state
        expect(component.bamDetail.showUnmasked).toBe(false);
        expect(accountNumberTextElem.nativeElement.textContent).toBe(
          component.account.accountNumber
        );

        // click and expect all calls to be made
        jest.spyOn(component.bamDetail, 'handleUnmaskClick');
        jest.spyOn(component.bamDetail.maskClick, 'emit');
        maskButton.triggerEventHandler('click');
        expect(component.bamDetail.handleUnmaskClick).toHaveBeenCalled();
        expect(component.bamDetail.maskClick.emit).toHaveBeenCalledWith(
          component.account.accountId
        );

        // expect updated unmasked state
        component.unmaskedAccountNumber = '123456789';
        expect(component.bamDetail.showUnmasked).toBe(true);
        fixture.detectChanges();
        expect(accountNumberTextElem.nativeElement.textContent).toBe(
          component.unmaskedAccountNumber
        );

        // revert to default again and expect default state
        maskButton.triggerEventHandler('click');
        expect(component.bamDetail.handleUnmaskClick).toHaveBeenCalled();
        expect(component.bamDetail.showUnmasked).toBe(false);
        fixture.detectChanges();
        expect(accountNumberTextElem.nativeElement.textContent).toBe(
          component.account.accountNumber
        );
      });
    });

    describe('routing number', () => {
      it('should display the routing number label and value', () => {
        const routingNumberLabel: DebugElement = fixture.debugElement.query(
          By.css('.routingNumberLabel')
        );
        const routingNumber: DebugElement = fixture.debugElement.query(By.css('.routingNumber'));

        expect(routingNumberLabel).toBeTruthy();
        expect(routingNumberLabel.nativeElement.textContent.trim()).toBe(
          component.content.routingNumberLabel
        );

        expect(routingNumber).toBeTruthy();
        expect(routingNumber.nativeElement.textContent).toBe(component.account.routingNumber);
      });
    });

    describe('account type', () => {
      it('should display the account type label and value', () => {
        const accountTypeLabel: DebugElement = fixture.debugElement.query(
          By.css('.accountTypeLabel')
        );
        const accountType: DebugElement = fixture.debugElement.query(By.css('.accountType'));

        expect(accountTypeLabel).toBeTruthy();
        expect(accountTypeLabel.nativeElement.textContent.trim()).toBe(
          component.content.accountTypeLabel
        );

        expect(accountType).toBeTruthy();
        expect(accountType.nativeElement.textContent).toBe(component.account.accountType);
      });
    });

    describe('bank name', () => {
      it('should display the bank name label and value', () => {
        const bankNameLabel: DebugElement = fixture.debugElement.query(By.css('.bankNameLabel'));
        const bankName: DebugElement = fixture.debugElement.query(By.css('.bankName'));

        expect(bankNameLabel).toBeTruthy();
        expect(bankNameLabel.nativeElement.textContent.trim()).toBe(component.content.bankLabel);

        expect(bankName).toBeTruthy();
        expect(bankName.nativeElement.textContent).toBe(component.account.bankName);
      });
    });

    describe('account holder', () => {
      it('should display the account holder label', () => {
        const accountHolderLabel: DebugElement = fixture.debugElement.query(
          By.css('.accountHolderLabel')
        );
        const accountHolder: DebugElement = fixture.debugElement.query(By.css('.accountHolder'));

        expect(accountHolderLabel.nativeElement.textContent.trim()).toBe(
          component.content.accountHolderLabel
        );
        expect(accountHolder.nativeElement.textContent.trim()).toBe(
          component.account.firstName + ' ' + component.account.lastName
        );
      });
    });
  });
});
