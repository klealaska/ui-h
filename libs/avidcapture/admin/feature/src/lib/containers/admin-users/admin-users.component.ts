import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ClaimsQueries } from '@ui-coe/avidcapture/core/data-access';
import { SecurityAttributes } from '@ui-coe/avidcapture/shared/types';
import { User } from '@ui-coe/shared/ui';
import { Observable } from 'rxjs';
import {
  AdminUsersPageSelectors,
  QueryUsers,
  SetFilteredUsers,
} from '@ui-coe/avidcapture/admin/data-access';

@Component({
  selector: 'xdc-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss'],
})
export class AdminUsersComponent {
  @Select(AdminUsersPageSelectors.users) users$: Observable<User[]>;
  @Select(ClaimsQueries.canCreateUser) canCreateUser$: Observable<boolean>;

  showUserForm = false;
  user = new User();
  roles: SecurityAttributes[] = [
    SecurityAttributes.Accountant,
    SecurityAttributes.Admin,
    SecurityAttributes.Clerk,
    SecurityAttributes.Manager,
    SecurityAttributes.User,
  ];

  constructor(private store: Store) {}

  onUserSelected(userSelected: User): void {
    if (userSelected.status === 'Active') {
      this.user = { ...userSelected };
      this.showUserForm = true;
    }
  }

  setSearchValue(searchValue: string): void {
    this.store.dispatch(new SetFilteredUsers(searchValue));
  }

  queryUsers(usersSelected: User[]): void {
    this.store.dispatch(new QueryUsers(usersSelected));
  }

  addNewUser(): void {
    this.user = new User();
    this.showUserForm = true;
  }

  saveUser(user: User): void {
    this.showUserForm = false;
    console.log(user);
  }
}
