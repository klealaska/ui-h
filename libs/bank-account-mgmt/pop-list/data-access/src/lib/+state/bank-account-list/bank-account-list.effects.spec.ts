import { Action } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import DoneCallback = jest.DoneCallback;
import { PopBamService } from '../../services/bank-account.service';
import { bankAccountListMock, bankAccountServiceMock } from '@ui-coe/bank-account-mgmt/shared/test';
import { PopBamListEffects } from './bank-account-list.effects';
import { PopBamListActions } from './bank-account-list.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('bank account detail effects', () => {
  let actions$: Observable<Action> = new Observable<Action>();
  let service: PopBamService;
  let effects: PopBamListEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PopBamListEffects,
        provideMockActions(() => actions$),
        { provide: PopBamService, useValue: bankAccountServiceMock },
        { provide: MatSnackBar, useValue: { openFromComponent: jest.fn() } },
      ],
    });
    service = TestBed.inject(PopBamService);
    effects = TestBed.inject(PopBamListEffects);
  });

  it('loadBankAccounts$ success', (done: DoneCallback) => {
    actions$ = of({ type: PopBamListActions.getBankAccountList.type });
    jest.spyOn(service, 'getBankAccounts').mockReturnValue(of(bankAccountListMock));
    effects.loadBankAccounts$.subscribe((action: Action) => {
      expect(action).toEqual({
        type: PopBamListActions.getBankAccountListSuccess.type,
        response: bankAccountListMock,
      });
      done();
    });
  });

  it('loadBankAccounts$ error', (done: DoneCallback) => {
    actions$ = of({ type: PopBamListActions.getBankAccountList.type, bankAccountId: '1' });
    jest.spyOn(service, 'getBankAccounts').mockReturnValue(throwError(() => 'error'));
    effects.loadBankAccounts$.subscribe((action: Action) => {
      expect(action).toEqual({
        type: PopBamListActions.getBankAccountListFailure.type,
        error: 'error',
      });
      done();
    });
  });
});
