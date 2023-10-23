import { Action } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { BankAccountDetailEffects } from './bank-account-detail.effects';
import DoneCallback = jest.DoneCallback;
import {
  BankAccountDetailActions,
  EditBankAccountDetailActions,
} from './bank-account-detail.actions';
import { BankAccountDetailsService } from '../services/bank-account-details.service';
import {
  bankAccountDetailMock,
  bankAccountServiceMock,
  editBankAccountParamsMock,
  unmaskedAccountNumberMock,
  updateStatusParamsMock,
} from '@ui-coe/bank-account-mgmt/shared/test';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('bank account detail effects', () => {
  let actions$: Observable<Action> = new Observable<Action>();
  let service: BankAccountDetailsService;
  let effects: BankAccountDetailEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BankAccountDetailEffects,
        provideMockActions(() => actions$),
        { provide: BankAccountDetailsService, useValue: bankAccountServiceMock },
        { provide: MatSnackBar, useValue: { openFromComponent: jest.fn() } },
      ],
    });
    service = TestBed.inject(BankAccountDetailsService);
    effects = TestBed.inject(BankAccountDetailEffects);
  });

  it('loadBankAccountDetail$ success', (done: DoneCallback) => {
    actions$ = of({ type: BankAccountDetailActions.getBankAccount.type, bankAccountId: '1' });
    jest.spyOn(service, 'getBankAccount').mockReturnValue(of(bankAccountDetailMock));
    effects.loadBankAccountDetail$.subscribe((action: Action) => {
      expect(action).toEqual({
        type: BankAccountDetailActions.getBankAccountSuccess.type,
        response: bankAccountDetailMock,
      });
      done();
    });
  });

  it('loadBankAccountDetail$ error', (done: DoneCallback) => {
    actions$ = of({ type: BankAccountDetailActions.getBankAccount.type, bankAccountId: '1' });
    jest.spyOn(service, 'getBankAccount').mockReturnValue(throwError(() => 'error'));
    effects.loadBankAccountDetail$.subscribe((action: Action) => {
      expect(action).toEqual({
        type: BankAccountDetailActions.getBankAccountFailure.type,
        error: 'error',
      });
      done();
    });
  });

  it('editBankAccount$ success', (done: DoneCallback) => {
    actions$ = of({
      type: EditBankAccountDetailActions.editBankAccount.type,
      editBankAccountParams: editBankAccountParamsMock,
    });
    jest.spyOn(service, 'editBankAccount').mockReturnValue(of(bankAccountDetailMock));
    effects.editBankAccount$.subscribe((action: Action) => {
      expect(action).toEqual({
        type: EditBankAccountDetailActions.editBankAccountSuccess.type,
        response: bankAccountDetailMock,
      });
      done();
    });
  });

  it('editBankAccount$ error', (done: DoneCallback) => {
    actions$ = of({
      type: EditBankAccountDetailActions.editBankAccount.type,
      editBankAccountParams: editBankAccountParamsMock,
    });
    jest.spyOn(service, 'editBankAccount').mockReturnValue(throwError(() => 'error'));
    effects.editBankAccount$.subscribe((action: Action) => {
      expect(action).toEqual({
        type: EditBankAccountDetailActions.editBankAccountFailure.type,
        error: 'error',
      });
      done();
    });
  });

  it('activateBankAccount$ success', (done: DoneCallback) => {
    actions$ = of({
      type: BankAccountDetailActions.activateBankAccount.type,
      accountId: bankAccountDetailMock.accountId,
    });
    jest.spyOn(service, 'activateBankAccount');
    jest.spyOn(service, 'getBankAccount').mockReturnValue(of(bankAccountDetailMock));
    effects.activateBankAccount$.subscribe((action: Action) => {
      expect(action).toEqual({
        type: BankAccountDetailActions.activateBankAccountSuccess.type,
        response: bankAccountDetailMock,
      });
      done();
    });
  });

  it('deactivateBankAccount$ success', (done: DoneCallback) => {
    actions$ = of({
      type: BankAccountDetailActions.deactivateBankAccount.type,
      accountId: bankAccountDetailMock.accountId,
    });
    jest.spyOn(service, 'deactivateBankAccount');
    jest.spyOn(service, 'getBankAccount').mockReturnValue(of(bankAccountDetailMock));
    effects.deactivateBankAccount$.subscribe((action: Action) => {
      expect(action).toEqual({
        type: BankAccountDetailActions.deactivateBankAccountSuccess.type,
        response: bankAccountDetailMock,
      });
      done();
    });
  });

  it('unmaskBankAccountNumber$ success', (done: DoneCallback) => {
    actions$ = of({
      type: BankAccountDetailActions.unmaskBankAccountNumber.type,
      accountId: '1',
    });
    jest.spyOn(service, 'unmaskAccountNumber').mockReturnValue(of(unmaskedAccountNumberMock));
    effects.unmaskBankAccountNumber$.subscribe((action: Action) => {
      expect(action).toEqual({
        type: BankAccountDetailActions.unmaskBankAccountNumberSuccess.type,
        response: unmaskedAccountNumberMock,
      });
      done();
    });
  });

  it('unmaskBankAccountNumber$ error', (done: DoneCallback) => {
    actions$ = of({
      type: BankAccountDetailActions.unmaskBankAccountNumber.type,
      accountId: '1',
    });
    jest.spyOn(service, 'unmaskAccountNumber').mockReturnValue(throwError(() => 'error'));
    effects.unmaskBankAccountNumber$.subscribe((action: Action) => {
      expect(action).toEqual({
        type: BankAccountDetailActions.unmaskBankAccountNumberError.type,
        error: 'error',
      });
      done();
    });
  });

  it('updateStatus$ success', (done: DoneCallback) => {
    actions$ = of({
      type: BankAccountDetailActions.updateStatus.type,
      updateStatusParamsMock,
    });
    jest.spyOn(service, 'updateStatus');
    jest.spyOn(service, 'getBankAccount').mockReturnValue(of(bankAccountDetailMock));
    effects.updateStatus$.subscribe((action: Action) => {
      expect(action).toEqual({
        type: BankAccountDetailActions.updateStatusSuccess.type,
        response: bankAccountDetailMock,
      });
      done();
    });
  });

  it('updateStatus error', (done: DoneCallback) => {
    actions$ = of({
      type: BankAccountDetailActions.updateStatus.type,
      updateStatusParamsMock,
    });
    jest.spyOn(service, 'updateStatus').mockReturnValue(throwError(() => 'error'));
    effects.updateStatus$.subscribe((action: Action) => {
      expect(action).toEqual({
        type: BankAccountDetailActions.updateStatusFailure.type,
        error: 'error',
      });
      done();
    });
  });
});
