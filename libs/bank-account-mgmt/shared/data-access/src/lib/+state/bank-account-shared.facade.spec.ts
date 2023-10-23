import { BankAccountSharedFacade } from './bank-account-shared.facade';
import { Store, StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import * as fromShared from './bank-account-shared.reducer';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { BankAccountSharedActions } from './bank-account-shared.actions';
import { cold } from 'jasmine-marbles';
import { TestColdObservable } from 'jasmine-marbles/src/test-observables';

describe('shared facade', () => {
  let facade: BankAccountSharedFacade;
  let store: Store;
  let actions$: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(fromShared.sharedStateFeatureKey, fromShared.reducer),
      ],
      providers: [BankAccountSharedFacade, provideMockActions(() => actions$)],
    });
    facade = TestBed.inject(BankAccountSharedFacade);
    store = TestBed.inject(Store);
  });

  describe('selectors', () => {
    it('should select the selectedBankAccountId', () => {
      const expected: TestColdObservable = cold('x', { x: '1234' });
      store.dispatch(BankAccountSharedActions.setSelectedBankAccount({ id: '1234' }));
      expect(facade.selectedAccountId$).toBeObservable(expected);
    });

    it('should select the sidePanelComponentStr', () => {
      const expected: TestColdObservable = cold('x', { x: 'add' });
      store.dispatch(BankAccountSharedActions.setSidePanelComponentId({ component: 'add' }));
      expect(facade.sidePanelContentId$).toBeObservable(expected);
    });
  });

  describe('action dispatchers', () => {
    it('should dispatch the action set selectedBankAccountId', () => {
      jest.spyOn(store, 'dispatch');
      facade.dispatchSetSelectedAccountId('1234');
      expect(store.dispatch).toHaveBeenCalledWith(
        BankAccountSharedActions.setSelectedBankAccount({ id: '1234' })
      );
    });

    it('should dispatch the action to set the side panel component string', () => {
      jest.spyOn(store, 'dispatch');
      facade.dispatchSetSidePanelComponentId('add');
      expect(store.dispatch).toHaveBeenCalledWith(
        BankAccountSharedActions.setSidePanelComponentId({ component: 'add' })
      );
    });
  });
});
