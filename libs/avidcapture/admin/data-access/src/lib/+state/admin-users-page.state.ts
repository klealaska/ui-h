import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { XdcService } from '@ui-coe/avidcapture/core/util';
import { User } from '@ui-coe/shared/ui';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import * as actions from './admin-users-page.actions';
import { AdminUsersStateModel } from './admin-users-page.model';

const defaults: AdminUsersStateModel = {
  users: [],
  filteredUsers: [],
  searchValue: '',
};

@State<AdminUsersStateModel>({
  name: 'adminUsersPage',
  defaults,
})
@Injectable()
export class AdminUsersPageState implements NgxsOnInit {
  constructor(private xdcService: XdcService) {}

  @Selector()
  static data(state: AdminUsersStateModel): AdminUsersStateModel {
    return state;
  }

  ngxsOnInit({ dispatch }: StateContext<AdminUsersStateModel>): void {
    dispatch(new actions.InitAdminUsersPage());
  }

  @Action(actions.InitAdminUsersPage)
  initAdminUsersPage({ patchState }: StateContext<AdminUsersStateModel>): Observable<User[]> {
    return this.xdcService.getUsers().pipe(
      tap(users => {
        patchState({ users });
      })
    );
  }

  @Action(actions.SetFilteredUsers)
  setFilteredUsers(
    { getState, patchState }: StateContext<AdminUsersStateModel>,
    { searchValue }: actions.SetFilteredUsers
  ): void {
    //TODO - Implement API get users filtered by search value
    console.log('value is ', searchValue);
    patchState({ filteredUsers: getState().users });
  }

  @Action(actions.QueryUsers)
  queryUsers(
    { getState, patchState }: StateContext<AdminUsersStateModel>,
    { usersSelected }: actions.QueryUsers
  ): void {
    //TODO - Implement aPI filter to filtering data with usersSelected
    console.log('users selected is ', usersSelected);
    patchState({ users: getState().users, filteredUsers: [] });
  }
}
