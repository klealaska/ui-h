import { AdminUsersStateModelStub, usersStub } from '@ui-coe/avidcapture/shared/test';
import { of } from 'rxjs';

import { InitAdminUsersPage } from './admin-users-page.actions';
import { AdminUsersPageState } from './admin-users-page.state';

describe('AdminUsersPageState', () => {
  const stateContextStub = {
    getState: jest.fn(),
    setState: jest.fn(),
    patchState: jest.fn(),
    dispatch: jest.fn(),
  };

  const xdcServiceStub = {
    getUsers: jest.fn(),
  };

  const adminUsersPageState = new AdminUsersPageState(xdcServiceStub as any);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    it('should select all data from state', () => {
      expect(AdminUsersPageState.data({ users: [AdminUsersStateModelStub] } as any)).toStrictEqual({
        users: [AdminUsersStateModelStub],
      });
    });
  });

  describe('Action: ngxsOnInit', () => {
    beforeEach(() => {
      adminUsersPageState.ngxsOnInit(stateContextStub);
    });

    it('should dispatch InitAdminUsers', () => {
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new InitAdminUsersPage());
    });
  });

  describe('Action: InitAdminUsers', () => {
    describe('get Users Data', () => {
      const users = usersStub;

      beforeEach(() => {
        xdcServiceStub.getUsers.mockReturnValue(of(users));
        adminUsersPageState.initAdminUsersPage(stateContextStub).subscribe();
      });

      it('should call getUsers', () => {
        expect(xdcServiceStub.getUsers).toHaveBeenCalledTimes(1);
      });

      it('should patchState with users', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { users });
      });
    });
  });

  describe('Action: SetFilteresUsers', () => {
    describe('Set filteres customer', () => {
      const users = usersStub;

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ users });
        adminUsersPageState.setFilteredUsers(stateContextStub, { searchValue: 'user name' });
      });

      it('should patch filtered users', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          filteredUsers: users,
        });
      });
    });
  });

  describe('Action: Query Users', () => {
    describe('Get filter input list', () => {
      const users = usersStub;

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ users });
        adminUsersPageState.queryUsers(stateContextStub, { usersSelected: users });
      });

      it('should patch users filtered', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          users,
          filteredUsers: [],
        });
      });
    });
  });
});
