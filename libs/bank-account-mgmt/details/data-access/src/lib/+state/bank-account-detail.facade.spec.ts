import { BankAccountDetailFacade } from './bank-account-detail.facade';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as BankAccountDetailSelectors from './bank-account-detail.selectors';
import DoneCallback = jest.DoneCallback;
import {
  bankAccountDetailMock,
  editBankAccountParamsMock,
  unmaskedAccountNumberMock,
  updateStatusParamsMock,
} from '@ui-coe/bank-account-mgmt/shared/test';
import { IBankAccount } from '@ui-coe/bank-account-mgmt/shared/types';
import {
  BankAccountDetailActions,
  EditBankAccountDetailActions,
} from './bank-account-detail.actions';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

describe('bank account detail facade', () => {
  const actions$: Observable<Action> = new Observable<Action>();
  let facade: BankAccountDetailFacade;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BankAccountDetailFacade, provideMockStore(), provideMockActions(() => actions$)],
    });
    store = TestBed.inject(MockStore);
    facade = TestBed.inject(BankAccountDetailFacade);
  });

  it('should create the facade', () => {
    expect(facade).toBeTruthy();
  });

  describe('selectors', () => {
    it('should return the bank account details', (done: DoneCallback) => {
      store.overrideSelector(
        BankAccountDetailSelectors.getSelectedBankAccount,
        bankAccountDetailMock
      );
      facade.bankAccount$.subscribe((result: IBankAccount) => {
        expect(result).toEqual(bankAccountDetailMock);
        done();
      });
    });

    it('should return the unmasked account number', (done: DoneCallback) => {
      store.overrideSelector(
        BankAccountDetailSelectors.getUnmaskedAccountNumber,
        unmaskedAccountNumberMock.accountNumber
      );
      facade.unmaskedAccountNumber$.subscribe((result: string) => {
        expect(result).toEqual(unmaskedAccountNumberMock.accountNumber);
        done();
      });
    });
  });

  describe('methods', () => {
    beforeEach(() => {
      jest.spyOn(store, 'dispatch');
    });

    it('should dispatch the get bank account details action', () => {
      facade.dispatchGetBankAccount('1');
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        BankAccountDetailActions.getBankAccount({ accountId: '1' })
      );
    });

    it('should dispatch the edit bank account details action', () => {
      facade.dispatchEditBankAccount(editBankAccountParamsMock);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        EditBankAccountDetailActions.editBankAccount({
          editBankAccountParams: editBankAccountParamsMock,
        })
      );
    });

    it('should dispatch the activate account action', () => {
      facade.dispatchActivateAccount(bankAccountDetailMock.accountId);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        BankAccountDetailActions.activateBankAccount({
          accountId: bankAccountDetailMock.accountId,
        })
      );
    });

    it('should dispatch the deactivate account action', () => {
      facade.dispatchDeactivateAccount(bankAccountDetailMock.accountId);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        BankAccountDetailActions.deactivateBankAccount({
          accountId: bankAccountDetailMock.accountId,
        })
      );
    });

    it('should dispatch unmask account number action', () => {
      facade.dispatchGetUnmaskedAccountNumber(bankAccountDetailMock.accountId);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        BankAccountDetailActions.unmaskBankAccountNumber({
          accountId: bankAccountDetailMock.accountId,
        })
      );
    });

    it('should dispatch unmask account number action', () => {
      facade.dispatchStatusUpdate(updateStatusParamsMock);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        BankAccountDetailActions.updateStatus({ updateStatusParams: updateStatusParamsMock })
      );
    });
  });
});
