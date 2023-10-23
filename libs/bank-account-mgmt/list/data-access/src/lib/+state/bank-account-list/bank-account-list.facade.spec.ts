import { BankAccountListFacade } from '@ui-coe/bank-account-mgmt/list/data-access';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as BankAccountListSelectors from './bank-account-list.selectors';
import DoneCallback = jest.DoneCallback;
import { bankAccountListMock } from '@ui-coe/bank-account-mgmt/shared/test';
import { IBankAccount } from '@ui-coe/bank-account-mgmt/shared/types';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

describe('bank account detail facade', () => {
  const actions$: Observable<Action> = new Observable<Action>();
  let facade: BankAccountListFacade;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BankAccountListFacade, provideMockStore(), provideMockActions(() => actions$)],
    });
    store = TestBed.inject(MockStore);
    facade = TestBed.inject(BankAccountListFacade);
  });

  it('should create the facade', () => {
    expect(facade).toBeTruthy();
  });

  describe('selectors', () => {
    it('should return the bank account list', (done: DoneCallback) => {
      store.overrideSelector(BankAccountListSelectors.selectAllBankAccounts, bankAccountListMock);
      facade.bankAccounts$.subscribe((result: IBankAccount[]) => {
        expect(result).toEqual(bankAccountListMock);
        done();
      });
    });

    it('should return the list loading state', (done: DoneCallback) => {
      store.overrideSelector(BankAccountListSelectors.selectBankAccountListLoading, true);
      facade.listLoading$.subscribe((result: boolean) => {
        expect(result).toEqual(true);
        done();
      });
    });
  });
});
