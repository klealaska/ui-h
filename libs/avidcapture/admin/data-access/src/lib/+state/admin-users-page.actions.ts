import { User } from '@ui-coe/shared/ui';

export class InitAdminUsersPage {
  static readonly type = '[AdminUsersPageState] InitAdminUsersPage';
}

export class SetFilteredUsers {
  static readonly type = '[AdminUsersPageState] SetFilteredUsers';
  constructor(public searchValue: string) {}
}

export class QueryUsers {
  static readonly type = '[AdminUsersPageState] QueryUsers';
  constructor(public usersSelected: User[]) {}
}
