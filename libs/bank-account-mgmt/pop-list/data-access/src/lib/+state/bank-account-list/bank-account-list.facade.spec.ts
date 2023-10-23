import { PopBamListFacade } from '@ui-coe/bank-account-mgmt/pop-list/data-access';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as PopBamListSelectors from './bank-account-list.selectors';
import DoneCallback = jest.DoneCallback;
import { bankAccountListMock } from '@ui-coe/bank-account-mgmt/shared/test';
import { IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

describe('bank account detail facade', () => {
  const actions$: Observable<Action> = new Observable<Action>();
  let facade: PopBamListFacade;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PopBamListFacade, provideMockStore(), provideMockActions(() => actions$)],
    });
    store = TestBed.inject(MockStore);
    facade = TestBed.inject(PopBamListFacade);
  });

  it('should create the facade', () => {
    expect(facade).toBeTruthy();
  });

  describe('selectors', () => {
    it('should return the bank account list', (done: DoneCallback) => {
      store.overrideSelector(PopBamListSelectors.selectAllBankAccounts, bankAccountListMock);
      facade.bankAccounts$.subscribe((result: IBankAccountMapped[]) => {
        expect(result).toEqual(bankAccountListMock);
        done();
      });
    });

    it('should return the list loading state', (done: DoneCallback) => {
      store.overrideSelector(PopBamListSelectors.selectBankAccountListLoading, true);
      facade.listLoading$.subscribe((result: boolean) => {
        expect(result).toEqual(true);
        done();
      });
    });
  });
});
