import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  bankAccountCardMock,
  bankAccountDetailMock,
  bankAccountsListContentMock,
} from '@ui-coe/bank-account-mgmt/shared/test';
import { BankAccountCardComponent } from './bank-account-card.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';

import { MatIconModule } from '@angular/material/icon';
import { TagComponent } from '@ui-coe/shared/ui-v2';
describe('bank accounts list card', () => {
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  let component: BankAccountCardComponent;
  let fixture: ComponentFixture<BankAccountCardComponent>;
  const accountNumTrunc = `x${bankAccountCardMock.accountNumber.slice(
    bankAccountDetailMock.accountNumber?.length - 4
  )}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankAccountCardComponent],
      imports: [MatCardModule, MatIconModule, TagComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(BankAccountCardComponent);
    component = fixture.componentInstance;
    component.account = bankAccountCardMock;
    component.content = bankAccountsListContentMock;
  });

  it('should display the correct content in a card', () => {
    fixture.detectChanges();

    const nicknameElem: DebugElement = fixture.debugElement.query(By.css('.nickname'));
    const accountNumberLabelElem: DebugElement = fixture.debugElement.query(
      By.css('.accountNumberLabel')
    );
    const accountNumberElem: DebugElement = fixture.debugElement.query(By.css('.accountNumber'));

    expect(nicknameElem.nativeElement.textContent).toContain(bankAccountCardMock.nickName);
    expect(accountNumberLabelElem.nativeElement.textContent).toContain(
      bankAccountsListContentMock.accountNumberLabel
    );
    // This will eventually come back from the service masked, so below is a test for a
    // temp solution.
    expect(accountNumberElem.nativeElement.textContent).toBe(accountNumTrunc);
  });

  it('should emit an event when the card is clicked', () => {
    fixture.detectChanges();
    jest.spyOn(component.bankAccountSelected, 'emit');
    const cardElem: DebugElement = fixture.debugElement.query(By.css('mat-card'));
    cardElem.triggerEventHandler('click');
    expect(component.bankAccountSelected.emit).toHaveBeenCalledWith(bankAccountCardMock.accountId);
  });

  it('should display an icon when PENDING', () => {
    component.account = {
      ...bankAccountCardMock,
      bankAccountStatus: 'Pending',
    };
    fixture.detectChanges();

    const statusElem: DebugElement = fixture.debugElement.query(By.css('.pendingStatus'));
    expect(statusElem.nativeElement).toBeTruthy();
  });

  it('should display an icon when LOCKED', () => {
    component.account = {
      ...bankAccountCardMock,
      bankAccountStatus: 'Locked',
    };
    fixture.detectChanges();

    const statusElem: DebugElement = fixture.debugElement.query(By.css('.lockedStatus'));
    expect(statusElem.nativeElement).toBeTruthy();
  });

  it('should display a tag when the account is new', () => {
    component.account = {
      ...bankAccountCardMock,
      isNew: true,
    };
    fixture.detectChanges();

    const statusElem: DebugElement = fixture.debugElement.query(By.css('.newStatus'));
    expect(statusElem.nativeElement.textContent).toContain('NEW');
  });

  it('should display an ax-tag when the account is the default', () => {
    component.isDefault = true;
    fixture.detectChanges();

    const statusElem: DebugElement = fixture.debugElement.query(By.css('ax-tag'));
    expect(statusElem.nativeElement.textContent).toContain('Default');
  });

  it('should display the accountType and masked accountNumber when nickname is falsy', () => {
    component.account = {
      ...bankAccountCardMock,
      nickName: ' ',
    };
    fixture.detectChanges();

    const nicknameElem: DebugElement = fixture.debugElement.query(By.css('.nickname'));
    expect(nicknameElem.nativeElement.textContent).toContain(bankAccountDetailMock.accountType);
    expect(nicknameElem.nativeElement.textContent).toContain(accountNumTrunc);
  });
});
