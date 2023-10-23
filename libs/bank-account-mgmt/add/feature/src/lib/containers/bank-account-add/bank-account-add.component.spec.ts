import { BankAccountAddComponent } from './bank-account-add.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BankAccountSharedFacade,
  ContentFacade,
} from '@ui-coe/bank-account-mgmt/shared/data-access';
import {
  bankAccountListFacadeMock,
  bankAccountSharedFacadeMock,
  contentFacadeMock,
} from '@ui-coe/bank-account-mgmt/shared/test';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DoneFn } from 'jest-jasmine2/build/queueRunner';
import { AddBankAccountFacade } from '@ui-coe/bank-account-mgmt/add/data-access';
import { ConfigService, ShellConfigService } from '@ui-coe/shared/util/services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('bank account add container', () => {
  let component: BankAccountAddComponent;
  let fixture: ComponentFixture<BankAccountAddComponent>;
  let facade: AddBankAccountFacade;
  let sharedFacade: BankAccountSharedFacade;

  let addAccountForm: FormGroup;
  let nicknameControl: AbstractControl;
  let routingNumberControl: AbstractControl;
  let accountNumberControl: AbstractControl;
  let accountTypeControl: AbstractControl;

  const NINE_DIGITS = '123456789';
  const SEVENTEEN_DIGITS = '12345678910112233';
  window.ResizeObserver =
    window.ResizeObserver ||
    jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BankAccountAddComponent,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ContentFacade, useValue: contentFacadeMock },
        { provide: AddBankAccountFacade, useValue: bankAccountListFacadeMock },
        { provide: ShellConfigService, useValue: { getMfeManifest: jest.fn() } },
        { provide: BankAccountSharedFacade, useValue: bankAccountSharedFacadeMock },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'mockURL'),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(BankAccountAddComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(AddBankAccountFacade);
    sharedFacade = TestBed.inject(BankAccountSharedFacade);
    fixture.detectChanges();
    addAccountForm = component.addAccountForm;
    nicknameControl = addAccountForm.controls['nickName'];
    routingNumberControl = addAccountForm.controls['routingNumber'];
    accountNumberControl = addAccountForm.controls['accountNumber'];
    accountTypeControl = addAccountForm.controls['accountType'];
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form group', () => {
    expect(addAccountForm).toBeDefined();
    expect(addAccountForm.valid).toBe(false);

    nicknameControl.setValue('nickName');
    routingNumberControl.setValue(NINE_DIGITS);
    accountNumberControl.setValue(SEVENTEEN_DIGITS);
    accountTypeControl.setValue('Business Savings');

    expect(addAccountForm.valid).toBe(true);
  });

  it('should validate and invalidate the routingNumber control', () => {
    expect(routingNumberControl.valid).toBe(false);
    routingNumberControl.setValue('1');
    expect(routingNumberControl.valid).toBe(false);
    routingNumberControl.setValue(NINE_DIGITS);
    expect(routingNumberControl.valid).toBe(true);
    routingNumberControl.setValue('abc');
    expect(routingNumberControl.valid).toBe(false);
  });

  it('should validate and invalidate the accountNumber control', () => {
    expect(accountNumberControl.valid).toBe(false);
    accountNumberControl.setValue('1');
    expect(accountNumberControl.valid).toBe(false);
    accountNumberControl.setValue(SEVENTEEN_DIGITS);
    expect(accountNumberControl.valid).toBe(true);
    accountNumberControl.setValue('abc');
    expect(accountNumberControl.valid).toBe(false);
  });

  it('should validate and invalidate the accountType control', () => {
    expect(accountTypeControl.valid).toBe(false);
    accountTypeControl.setValue('Business Savings');
    expect(accountTypeControl.valid).toBe(true);
  });

  it('should handle the submit button click', (done: DoneFn) => {
    jest.spyOn(component, 'onSubmit');
    const addBtn: DebugElement = fixture.debugElement.query(By.css('#addAccountSubmitBtn'));
    addBtn.triggerEventHandler('click');
    expect(component.onSubmit).toHaveBeenCalled();

    facade
      .dispatchAddBankAccount({
        bankName: 'Some Bank',
        nickName: 'nickName',
        accountNumber: SEVENTEEN_DIGITS,
        routingNumber: NINE_DIGITS,
        accountType: 'Business Checking',
      })
      .subscribe(() => {
        done();
      });
  });

  it('should handle the cancel button click', () => {
    jest.spyOn(component, 'handleSidePanelClose');
    jest.spyOn(sharedFacade, 'dispatchSetSidePanelComponentId');
    const addBtn: DebugElement = fixture.debugElement.query(By.css('#addAccountBackBtn'));
    addBtn.triggerEventHandler('click');
    expect(component.handleSidePanelClose).toHaveBeenCalled();
  });
});
