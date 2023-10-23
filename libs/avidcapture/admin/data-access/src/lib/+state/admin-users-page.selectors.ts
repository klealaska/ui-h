import { Selector } from '@ngxs/store';
import { User } from '@ui-coe/shared/ui';

import { AdminUsersStateModel } from './admin-users-page.model';
import { AdminUsersPageState } from './admin-users-page.state';

export class AdminUsersPageSelectors {
  @Selector([AdminUsersPageState.data])
  static users(state: AdminUsersStateModel): User[] {
    return state.users;
  }

  @Selector([AdminUsersPageState.data])
  static filteredUsers(state: AdminUsersStateModel): User[] {
    return state.filteredUsers;
  }
}
