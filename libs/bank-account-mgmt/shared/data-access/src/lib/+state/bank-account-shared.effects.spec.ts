import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { BankAccountSharedEffects } from './bank-account-shared.effects';
import { cold, hot } from 'jasmine-marbles';
import { BankAccountSharedActions } from './bank-account-shared.actions';
import { BankAccountSharedFacade } from '@ui-coe/bank-account-mgmt/shared/data-access';
import { bankAccountSharedFacadeMock } from '@ui-coe/bank-account-mgmt/shared/test';

describe('bank account shared effects', () => {
  let actions$: Observable<Action>;
  let sharedEffects: BankAccountSharedEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BankAccountSharedEffects, provideMockActions(() => actions$)],
    });

    sharedEffects = TestBed.inject(BankAccountSharedEffects);
  });

  it('setSelectedAccountId$', () => {
    actions$ = hot('a', { a: BankAccountSharedActions.setSelectedBankAccount({ id: '1234' }) });
    const expected = cold('b', {
      b: BankAccountSharedActions.setSidePanelComponentId({ component: 'detail' }),
    });
    expect(sharedEffects.setSelectedAccountId$).toBeObservable(expected);
  });
});
