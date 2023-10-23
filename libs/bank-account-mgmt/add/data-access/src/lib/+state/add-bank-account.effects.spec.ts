import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import DoneCallback = jest.DoneCallback;
import { provideMockActions } from '@ngrx/effects/testing';

import { AddBankAccountActions } from './add-bank-account.actions';
import { AddBankAccountEffects } from './add-bank-account.effects';
import { bankAccountListMock, bankAccountServiceMock } from '@ui-coe/bank-account-mgmt/shared/test';
import { AddAccountService } from '../services/add-account.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('AddBankAccountEffects', () => {
  let actions$: Observable<Action> = new Observable<Action>();
  let service: AddAccountService;
  let effects: AddBankAccountEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AddBankAccountEffects,
        provideMockActions(() => actions$),
        { provide: AddAccountService, useValue: bankAccountServiceMock },
        { provide: MatSnackBar, useValue: { openFromComponent: jest.fn() } },
      ],
    });
    service = TestBed.inject(AddAccountService);
    effects = TestBed.inject(AddBankAccountEffects);
  });

  // it('addBankAccount$ success', (done: DoneCallback) => {
  //   actions$ = of({
  //     type: AddBankAccountActions.addBankAccount.type,
  //     account: bankAccountListMock[0],
  //   });
  //   jest.spyOn(service, 'addBankAccount').mockImplementation(account => of(account));
  //   effects.addBankAccount$.subscribe((action: Action) => {
  //     expect(action).toEqual({
  //       type: AddBankAccountActions.addBankAccountSuccess.type,
  //       response: bankAccountListMock[0],
  //     });
  //     done();
  //   });
  // });

  it('addBankAccount$ failure', (done: DoneCallback) => {
    actions$ = of({
      type: AddBankAccountActions.addBankAccount.type,
      account: bankAccountListMock[0],
    });
    jest.spyOn(service, 'addBankAccount').mockReturnValue(throwError(() => 'error'));
    effects.addBankAccount$.subscribe((action: Action) => {
      expect(action).toEqual({
        type: AddBankAccountActions.addBankAccountFailure.type,
        error: 'error',
      });
      done();
    });
  });
});
