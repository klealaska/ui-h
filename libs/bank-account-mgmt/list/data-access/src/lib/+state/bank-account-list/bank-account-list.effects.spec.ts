import { Action } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import DoneCallback = jest.DoneCallback;
import { BankAccountService } from '../../services/bank-account.service';
import { bankAccountListMock, bankAccountServiceMock } from '@ui-coe/bank-account-mgmt/shared/test';
import { BankAccountListEffects } from './bank-account-list.effects';
import { BankAccountListActions } from './bank-account-list.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('bank account detail effects', () => {
  let actions$: Observable<Action> = new Observable<Action>();
  let service: BankAccountService;
  let effects: BankAccountListEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BankAccountListEffects,
        provideMockActions(() => actions$),
        { provide: BankAccountService, useValue: bankAccountServiceMock },
        { provide: MatSnackBar, useValue: { openFromComponent: jest.fn() } },
      ],
    });
    service = TestBed.inject(BankAccountService);
    effects = TestBed.inject(BankAccountListEffects);
  });

  it('loadBankAccounts$ success', (done: DoneCallback) => {
    actions$ = of({ type: BankAccountListActions.getBankAccountList.type });
    jest.spyOn(service, 'getBankAccounts').mockReturnValue(of(bankAccountListMock));
    effects.loadBankAccounts$.subscribe((action: Action) => {
      expect(action).toEqual({
        type: BankAccountListActions.getBankAccountListSuccess.type,
        response: bankAccountListMock,
      });
      done();
    });
  });

  it('loadBankAccounts$ error', (done: DoneCallback) => {
    actions$ = of({ type: BankAccountListActions.getBankAccountList.type, bankAccountId: '1' });
    jest.spyOn(service, 'getBankAccounts').mockReturnValue(throwError(() => 'error'));
    effects.loadBankAccounts$.subscribe((action: Action) => {
      expect(action).toEqual({
        type: BankAccountListActions.getBankAccountListFailure.type,
        error: 'error',
      });
      done();
    });
  });
});
