import { UserStatus } from '@ui-coe/usr-mgmt/shared/types';
import * as fromUser from './user.reducer';
import {
  selectUserLoading,
  selectUsers,
  selectUserState,
  selectUserError,
  selectToast,
} from './user.selectors';
import { getToasterConfig } from '@ui-coe/shared/util/interfaces';

describe('User Selectors', () => {
  const state: fromUser.State = {
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
    toast: getToasterConfig({
      title: 'string',
      type: 'string',
      icon: 'string',
    }),
  };
  it('should select the feature state', () => {
    const result = selectUserState({
      [fromUser.userFeatureKey]: {},
    });

    expect(result).toEqual({});
  });

  it('should select the users', () => {
    const { selectAll } = fromUser.adapter.getSelectors();
    const result = selectUsers.projector(state);
    expect(result).toEqual(selectAll(state));
  });

  it('should select the loading', () => {
    const result = selectUserLoading.projector(state);
    expect(result).toEqual(state.loading);
  });

  it('should select the error', () => {
    const result = selectUserError.projector(state);
    expect(result).toEqual(state.error);
  });

  it('should select toast', () => {
    const result = selectToast.projector(state);
    expect(result).toEqual(state.toast);
  });
});
