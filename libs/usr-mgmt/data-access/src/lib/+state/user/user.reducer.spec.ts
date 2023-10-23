import { getToasterConfig } from '@ui-coe/shared/util/interfaces';
import { ICreateEditUser, IUser, UserStatus } from '@ui-coe/usr-mgmt/shared/types';
import { reducer, initialState } from './user.reducer';
import * as UserActions from './user.actions';

describe('User Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  it('should update the state when loadUsers is dispatched', () => {
    const action = UserActions.loadUsers({ params: null });
    const state = {
      ...initialState,
      loading: true,
    };
    const result = reducer(initialState, action);

    expect(result).toEqual(state);
  });

  it('should update the state when loadUsersSuccess is dispatched', () => {
    const response: IUser[] = [
      {
        userId: '00u98v1wp5ONavBDt1d7',
        firstName: 'Jane',
        lastName: 'Smith',
        fullName: 'Jane Smith',
        email: 'janesmith@example.com',
        username: 'janesmith@bar.com',
        userType: 'External',
        status: UserStatus.ACTIVE,
        createdTimestamp: '2021-10-03T12: 22: 13Z',
        createdByActorId: 'v1df1c37h7tp8u5dhzvn',
        lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
        lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
      },
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
    ];

    const action = UserActions.loadUsersSuccess({ response });
    const state = {
      ...initialState,
      entities: {
        '00u98v1wp5ONavBDt1d7': {
          userId: '00u98v1wp5ONavBDt1d7',
          firstName: 'Jane',
          lastName: 'Smith',
          userType: 'External',
          fullName: 'Jane Smith',
          email: 'janesmith@example.com',
          username: 'janesmith@bar.com',
          status: UserStatus.ACTIVE,
          createdTimestamp: '2021-10-03T12: 22: 13Z',
          createdByActorId: 'v1df1c37h7tp8u5dhzvn',
          lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
          lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
        },
        '00u98v1wp5ONavBDt1d8': {
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
      },
      ids: ['00u98v1wp5ONavBDt1d7', '00u98v1wp5ONavBDt1d8'],
      loading: false,
      error: null,
    };
    const result = reducer(initialState, action);
    expect(result).toEqual(state);
  });

  it('should update the state when loadUsersFailure is dispatched', () => {
    const error = new Error('Error loading users');
    const action = UserActions.loadUsersFailure({ error });
    const state = {
      ...initialState,
      error: action.error,
      loading: false,
    };
    const result = reducer(initialState, action);

    expect(result).toEqual(state);
  });

  it('should update the state when addUserSuccess is dispatched', () => {
    const response: IUser = {
      userId: '00u98v1wp5ONavBDt1d7',
      firstName: 'Jane',
      lastName: 'Smith',
      fullName: 'Jane Smith',
      email: 'janesmith@example.com',
      username: 'janesmith@bar.com',
      userType: 'External',
      status: UserStatus.ACTIVE,
      createdTimestamp: '2021-10-03T12: 22: 13Z',
      createdByActorId: 'v1df1c37h7tp8u5dhzvn',
      lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
      lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
    };

    const action = UserActions.addUserSuccess({ response });
    const state = {
      ...initialState,
      entities: {
        '00u98v1wp5ONavBDt1d7': {
          userId: '00u98v1wp5ONavBDt1d7',
          firstName: 'Jane',
          lastName: 'Smith',
          userType: 'External',
          fullName: 'Jane Smith',
          email: 'janesmith@example.com',
          username: 'janesmith@bar.com',
          status: UserStatus.ACTIVE,
          createdTimestamp: '2021-10-03T12: 22: 13Z',
          createdByActorId: 'v1df1c37h7tp8u5dhzvn',
          lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
          lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
        },
      },
      ids: ['00u98v1wp5ONavBDt1d7'],
      loading: false,
      error: null,
    };
    const result = reducer(initialState, action);
    expect(result).toEqual(state);
  });

  it('should update the state when addUserFailure is dispatched', () => {
    const error = new Error('Error adding user');
    const action = UserActions.addUserFailure({ error });
    const state = {
      ...initialState,
      error: action.error,
      loading: false,
    };
    const result = reducer(initialState, action);

    expect(result).toEqual(state);
  });

  it('should update state when editUser is dispatched', () => {
    const id = '00u98v1wp5ONavBDt1d7';
    const body: ICreateEditUser = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'janesmith@example.com',
      username: 'janesmith@bar.com',
    };
    const action = UserActions.editUser({ id, body, toastContent: {} });
    const state = {
      ...initialState,
      loading: true,
    };

    const result = reducer(initialState, action);

    expect(result).toEqual(state);
  });

  it('should update the state when editUserSuccess is dispatched', () => {
    const state = {
      ...initialState,
      entities: {
        '00u98v1wp5ONavBDt1d7': {
          userId: '00u98v1wp5ONavBDt1d7',
          firstName: 'Jane',
          lastName: 'Smith',
          userType: 'External',
          fullName: 'Jane Smith',
          email: 'janesmith@example.com',
          username: 'janesmith@bar.com',
          status: UserStatus.ACTIVE,
          createdTimestamp: '2021-10-03T12: 22: 13Z',
          createdByActorId: 'v1df1c37h7tp8u5dhzvn',
          lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
          lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
        },
        '00u98v1wp5ONavBDt1d8': {
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
      },
      ids: ['00u98v1wp5ONavBDt1d7', '00u98v1wp5ONavBDt1d8'],
      loading: false,
      error: null,
    };

    const response = {
      userId: '00u98v1wp5ONavBDt1d8',
      firstName: 'John2',
      lastName: 'Doe2',
      fullName: 'John Doe 2',
      email: 'johndoe@example.com',
      username: 'johndoe@example.com',
      userType: 'External',
      status: UserStatus.INACTIVE,
      createdTimestamp: '2021-10-03T12: 22: 13Z',
      createdByActorId: 'v1df1c37h7tp8u5dhzvn',
      lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
      lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
    };

    const newState = {
      ...initialState,
      entities: {
        '00u98v1wp5ONavBDt1d7': {
          userId: '00u98v1wp5ONavBDt1d7',
          firstName: 'Jane',
          lastName: 'Smith',
          userType: 'External',
          fullName: 'Jane Smith',
          email: 'janesmith@example.com',
          username: 'janesmith@bar.com',
          status: UserStatus.ACTIVE,
          createdTimestamp: '2021-10-03T12: 22: 13Z',
          createdByActorId: 'v1df1c37h7tp8u5dhzvn',
          lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
          lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
        },
        '00u98v1wp5ONavBDt1d8': {
          userId: '00u98v1wp5ONavBDt1d8',
          firstName: 'John2',
          lastName: 'Doe2',
          fullName: 'John Doe 2',
          email: 'johndoe@example.com',
          username: 'johndoe@example.com',
          userType: 'External',
          status: UserStatus.INACTIVE,
          createdTimestamp: '2021-10-03T12: 22: 13Z',
          createdByActorId: 'v1df1c37h7tp8u5dhzvn',
          lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
          lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
        },
      },
      ids: ['00u98v1wp5ONavBDt1d7', '00u98v1wp5ONavBDt1d8'],
      loading: false,
      error: null,
    };

    const action = UserActions.editUserSuccess({ response, toastSuccessText: 'Success' });
    const result = reducer(state, action);

    expect(result).toEqual(newState);
  });

  it('should update the state when editUserFailure is dispatched', () => {
    const error = new Error('Error editing user');
    const action = UserActions.editUserFailure({ error });
    const state = {
      ...initialState,
      error: action.error,
      loading: false,
    };
    const result = reducer(initialState, action);

    expect(result).toEqual(state);
  });

  it('should update state when displayToast is dispatched', () => {
    const toastConfigOptions = {
      title: 'string',
      type: 'string',
      icon: 'string',
    };
    const config = getToasterConfig(toastConfigOptions);
    const action = UserActions.displayToast({ config });
    const state = {
      ...initialState,
      toast: config,
    };
    const result = reducer(initialState, action);

    expect(result).toEqual(state);
  });

  it('should update state when deactivateUser is dispatched', () => {
    const id = '00u98v1wp5ONavBDt1d7';

    const action = UserActions.deactivateUser({ userId: id });
    const state = {
      ...initialState,
      loading: true,
    };

    const result = reducer(initialState, action);

    expect(result).toEqual(state);
  });

  it('should update the state when deactivateUserFailure is dispatched', () => {
    const error = new Error('Error deactivating user');
    const action = UserActions.deactivateUserFailure({ error });
    const state = {
      ...initialState,
      error: action.error,
      loading: false,
    };
    const result = reducer(initialState, action);

    expect(result).toEqual(state);
  });
});
