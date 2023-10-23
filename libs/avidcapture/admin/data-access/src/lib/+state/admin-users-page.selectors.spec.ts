import { AdminUsersStateModelStub } from '@ui-coe/avidcapture/shared/test';

import { AdminUsersPageSelectors } from './admin-users-page.selectors';

describe('AdminUsersPageSelectors', () => {
  it('should select users from state', () => {
    expect(
      AdminUsersPageSelectors.users({
        users: [AdminUsersStateModelStub],
      } as any)
    ).toEqual([AdminUsersStateModelStub]);
  });

  it('should select filteredUsers from state', () => {
    expect(
      AdminUsersPageSelectors.filteredUsers({
        filteredUsers: [AdminUsersStateModelStub],
      } as any)
    ).toEqual([AdminUsersStateModelStub]);
  });
});
