import { User } from '@ui-coe/shared/ui';

export interface AdminUsersStateModel {
  users: User[];
  filteredUsers: User[];
  searchValue: string;
}
