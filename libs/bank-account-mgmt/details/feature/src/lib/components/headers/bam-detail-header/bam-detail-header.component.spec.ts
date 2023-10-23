import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BamDetailHeaderComponent } from './bam-detail-header.component';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { bankAccountDetailMock } from '@ui-coe/bank-account-mgmt/shared/test';
import { By } from '@angular/platform-browser';
import { IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';
import { getAccountDisplayName } from '@ui-coe/bank-account-mgmt/shared/util';

@Component({
  selector: 'ax-mock-detail-parent',
  template: `<ax-bam-detail-header #bamDetailHeader [account]="account"></ax-bam-detail-header>`,
})
export class MockDetailParentComponent {
  @ViewChild('bamDetailHeader') bamDetailHeader: BamDetailHeaderComponent;
  public account: IBankAccountMapped = undefined;
}

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  disconnect: jest.fn(),
  observe: jest.fn(),
  unobserve: jest.fn(),
}));

describe('bam detail header', () => {
  let fixture: ComponentFixture<MockDetailParentComponent>;
  let component: MockDetailParentComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockDetailParentComponent],
      imports: [BamDetailHeaderComponent],
    });

    fixture = TestBed.createComponent(MockDetailParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component.bamDetailHeader).toBeTruthy();
  });

  describe('skeleton loader', () => {
    it('should display the skeleton loader when waiting for account', () => {
      const skeletonElem: DebugElement = fixture.debugElement.query(
        By.css('ui-coe-bam-panel-header-skeleton')
      );
      expect(skeletonElem).toBeTruthy();
    });
  });

  describe('when account is provided', () => {
    it('should display the account type and number when no nickname', () => {
      component.account = bankAccountDetailMock;
      fixture.detectChanges();

      const labelElem: DebugElement = fixture.debugElement.query(
        By.css('.bam-detail-header__label')
      );
      expect(labelElem).toBeTruthy();
      expect(labelElem.nativeElement.textContent.trim()).toBe(
        getAccountDisplayName(bankAccountDetailMock)
      );
    });

    it('should display the account nickname when available', () => {
      const updatedAccount: IBankAccountMapped = { ...bankAccountDetailMock, nickName: 'nickname' };
      component.account = updatedAccount;
      fixture.detectChanges();

      const labelElem: DebugElement = fixture.debugElement.query(
        By.css('.bam-detail-header__label')
      );
      expect(labelElem.nativeElement.textContent.trim()).toBe(updatedAccount.nickName);
    });
  });
});
