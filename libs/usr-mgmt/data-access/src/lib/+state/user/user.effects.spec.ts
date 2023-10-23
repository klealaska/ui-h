import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { cold, hot } from 'jasmine-marbles';
import { TranslateService } from '@ngx-translate/core';

import { ConfigService } from '@ui-coe/shared/util/services';
import { getToasterConfig } from '@ui-coe/shared/util/interfaces';
import { IListWrapper, ToastIcon, ToastTypeEnum } from '@ui-coe/shared/types';

import { UserService } from '../../services/user/user.service';
import { UserEffects } from './user.effects';
import * as UserActions from './user.actions';
import { IUser, UserStatus } from '@ui-coe/usr-mgmt/shared/types';

describe('UserEffects', () => {
  let actions$: Observable<any>;
  let effects: UserEffects;
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        ConfigService,
        provideMockActions(() => actions$),
        {
          provide: TranslateService,
          useValue: {
            get: jest.fn(() =>
              of({
                listPage: {
                  toaster: {
                    getUsers: {
                      error: 'Failed to load users.',
                    },
                  },
                },
              })
            ),
          },
        },
      ],
      imports: [HttpClientTestingModule],
    });

    effects = TestBed.inject(UserEffects);
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadUsers', () => {
    it('should load users when loadUsers action is dispatched', () => {
      const users: IListWrapper<IUser> = {
        itemsRequested: 1,
        itemsReturned: 1,
        itemsTotal: 1,
        offset: 0,
        items: [
          {
            userId: '00u98v1wp5ONavBDt1d8',
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
            email: 'johndoe@example.com',
            username: 'johndoe@example.com',
            userType: 'External',
            status: UserStatus.INACTIVE,
            createdTimestamp: '2021-10-03T12: 22: 13Z',
            createdByActorId: 'v1df1c37h7tp8u5dhzvn',
            lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
            lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
          },
        ],
      };

      actions$ = hot('-a', { a: UserActions.loadUsers({}) });
      const response = cold('-a', { a: users });
      const expected = cold('--b', {
        b: UserActions.loadUsersSuccess({ response: users.items }),
      });

      service.getUsers = jest.fn(() => response);
      expect(effects.loadUsers$).toBeObservable(expected);
    });

    it('should catch error when load users fails', () => {
      actions$ = hot('-a', { a: UserActions.loadUsers });
      const response = cold('-#', {}, { error: 'error' });
      const expected = cold('--b', {
        b: {
          error: { error: 'error' },
          type: '[User] Load Users Failure',
        },
      });

      service.getUsers = jest.fn(() => response);
      expect(effects.loadUsers$).toBeObservable(expected);
    });
  });

  describe('addUser', () => {
    it('should create user succesfully when addUser action is dispatched', () => {
      const userCreated: IUser = {
        userId: '00u98v1wp5ONavBDt1d8',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        email: 'johndoe@example.com',
        username: 'johndoe@example.com',
        userType: 'External',
        status: UserStatus.INACTIVE,
        createdTimestamp: '2021-10-03T12: 22: 13Z',
        createdByActorId: 'v1df1c37h7tp8u5dhzvn',
        lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
        lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
      };
      const content = {
        toastFailureText: 'user Created.',
        toastSuccessText: 'Network failure.',
      };
      const createBody = {
        firstName: 'Rob',
        lastName: 'Smith',
        email: 'mail@mail.com',
        username: 'mail@mail.com',
      };
      actions$ = hot('-a', {
        a: UserActions.addUser({
          body: createBody,
          toastContent: content,
        }),
      });
      const response = cold('-a|', { a: userCreated });
      const expected = cold('--b', {
        b: UserActions.addUserSuccess({
          response: userCreated,
          toastSuccessText: content.toastSuccessText,
        }),
      });

      service.createUser = jest.fn(() => response);
      expect(effects.addUser$).toBeObservable(expected);
    });

    it('should fail to create user when addUser action is dispatched', () => {
      const content = {
        toastFailureText: 'user Created.',
        toastSuccessText: 'Network failure.',
      };
      const createBody = {
        firstName: 'Rob',
        lastName: 'Smith',
        email: 'mail@mail.com',
        username: 'mail@mail.com',
      };
      actions$ = hot('-a', {
        a: UserActions.addUser({
          body: createBody,
          toastContent: content,
        }),
      });
      const response = cold('-#', {}, 'error');
      const expected = cold('--b', {
        b: UserActions.addUserFailure({
          error: 'error',
          toastFailureText: content.toastFailureText,
        }),
      });

      service.createUser = jest.fn(() => response);
      expect(effects.addUser$).toBeObservable(expected);
    });
  });

  describe('editUser', () => {
    const id = '00u98v1wp5ONavBDt1d8';
    const user: IUser = {
      userId: id,
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      username: 'johndoe@example.com',
      userType: 'External',
      status: UserStatus.INACTIVE,
      createdTimestamp: '2021-10-03T12: 22: 13Z',
      createdByActorId: 'v1df1c37h7tp8u5dhzvn',
      lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
      lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
    };

    const toastContent = {
      toastFailureText: 'user Created.',
      toastSuccessText: 'Network failure.',
    };

    const body = {
      firstName: 'Rob',
      lastName: 'Smith',
      email: 'mail@mail.com',
      username: 'mail@mail.com',
    };

    it('should dispatch editUserSuccess', () => {
      actions$ = hot('-a', { a: UserActions.editUser({ id, body, toastContent }) });
      const response = cold('-a', { a: user });
      const expected = cold('--b', {
        b: UserActions.editUserSuccess({
          response: user,
          toastSuccessText: toastContent.toastSuccessText,
        }),
      });

      service.editUser = jest.fn(() => response);
      expect(effects.editUser$).toBeObservable(expected);
    });

    it('should catch error when edit user fails', () => {
      actions$ = hot('-a', { a: UserActions.editUser({ id, body, toastContent }) });
      const response = cold('-#', {}, { error: 'error' });
      const expected = cold('--b', {
        b: UserActions.editUserFailure({
          error: { error: 'error' },
          toastFailureText: toastContent.toastFailureText,
        }),
      });

      service.editUser = jest.fn(() => response);
      expect(effects.editUser$).toBeObservable(expected);
    });
  });

  describe('displayToast', () => {
    const id = '00u98v1wp5ONavBDt1d8';
    const user: IUser = {
      userId: id,
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      username: 'johndoe@example.com',
      userType: 'External',
      status: UserStatus.INACTIVE,
      createdTimestamp: '2021-10-03T12: 22: 13Z',
      createdByActorId: 'v1df1c37h7tp8u5dhzvn',
      lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
      lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
    };

    const toastContent = {
      toastFailureText: 'Network failure.',
      toastSuccessText: 'success message',
    };

    const body = {
      firstName: 'Rob',
      lastName: 'Smith',
      email: 'mail@mail.com',
      username: 'mail@mail.com',
    };

    const successToast = {
      title: toastContent.toastSuccessText,
      type: ToastTypeEnum.SUCCESS,
      icon: ToastIcon.CHECK_CIRCLE,
    };

    const failureToast = {
      title: toastContent.toastFailureText,
      type: ToastTypeEnum.CRITICAL,
      icon: ToastIcon.ERROR,
    };

    it('should dispatch displayToast with success text for addUserSuccess', () => {
      actions$ = hot('-a', {
        a: UserActions.addUserSuccess({
          response: user,
          toastSuccessText: toastContent.toastSuccessText,
        }),
      });
      const expected = cold('-a', {
        a: UserActions.displayToast({ config: getToasterConfig(successToast) }),
      });

      expect(effects.displayToast$).toBeObservable(expected);
    });

    it('should dispatch displayToast with failure text for addUserFailure', () => {
      actions$ = hot('-a', {
        a: UserActions.addUserFailure({
          error: { error: 'error' },
          toastFailureText: toastContent.toastFailureText,
        }),
      });

      const expected = cold('-a', {
        a: UserActions.displayToast({ config: getToasterConfig(failureToast) }),
      });

      expect(effects.displayToast$).toBeObservable(expected);
    });

    it('should dispatch displayToast with success text for editUserSuccess', () => {
      actions$ = hot('-a', {
        a: UserActions.editUserSuccess({
          response: user,
          toastSuccessText: toastContent.toastSuccessText,
        }),
      });
      const expected = cold('-a', {
        a: UserActions.displayToast({ config: getToasterConfig(successToast) }),
      });

      expect(effects.displayToast$).toBeObservable(expected);
    });

    it('should dispatch displayToast with failure text for editUserFailure', () => {
      actions$ = hot('-a', {
        a: UserActions.editUserFailure({
          error: { error: 'error' },
          toastFailureText: toastContent.toastFailureText,
        }),
      });

      const expected = cold('-a', {
        a: UserActions.displayToast({ config: getToasterConfig(failureToast) }),
      });

      expect(effects.displayToast$).toBeObservable(expected);
    });

    it('should dispatch displayToast with failure text for loadUsersFailure', () => {
      const loadUsersFailureToast = {
        title: undefined,
        type: failureToast.type,
        icon: failureToast.icon,
      };

      actions$ = hot('-a', {
        a: UserActions.loadUsersFailure({
          error: { error: 'error' },
        }),
      });

      const expected = cold('-a', {
        a: UserActions.displayToast({ config: getToasterConfig(loadUsersFailureToast) }),
      });

      expect(effects.displayToast$).toBeObservable(expected);
    });
  });
  describe('deactivateUser', () => {
    const userId = '67899982';
    const user: IUser = {
      userId: userId,
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      username: 'johndoe@example.com',
      userType: 'External',
      status: UserStatus.INACTIVE,
      createdTimestamp: '2021-10-03T12: 22: 13Z',
      createdByActorId: 'v1df1c37h7tp8u5dhzvn',
      lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
      lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
    };

    it('should deactivade a user when deactivate user is dispatched', () => {
      actions$ = hot('-a', {
        a: UserActions.deactivateUser({ userId: userId }),
      });
      const response = cold('-#', {}, 'error');
      const expected = cold('--b', {
        b: UserActions.deactivateUserFailure({
          error: 'error',
        }),
      });

      service.deactivateUser = jest.fn(() => response);
      expect(effects.deactivateUser$).toBeObservable(expected);
    });
    it('should dispatch deactivateUserSuccess', () => {
      actions$ = hot('-a', { a: UserActions.deactivateUser({ userId: userId }) });
      const response = cold('-a', { a: user });
      const expected = cold('--b', {
        b: UserActions.deactivateUserSuccess({
          response: user,
        }),
      });

      service.deactivateUser = jest.fn(() => response);
      expect(effects.deactivateUser$).toBeObservable(expected);
    });
  });
});
