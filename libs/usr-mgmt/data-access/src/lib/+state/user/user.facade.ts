import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ICreateEditUser, IUser, ToastContent } from '@ui-coe/usr-mgmt/shared/types';
import * as UserActions from './user.actions';
import * as UserSelectors from './user.selectors';

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  constructor(private store: Store) {}

  isLoading$ = this.store.pipe(select(UserSelectors.selectUserLoading));
  users$: Observable<IUser[]> = this.store.pipe(select(UserSelectors.selectUsers));
  error$ = this.store.pipe(select(UserSelectors.selectUserError));
  toast$ = this.store.pipe(select(UserSelectors.selectToast));

  getUsers() {
    this.store.dispatch(UserActions.loadUsers({}));
  }

  addUser(user: ICreateEditUser, content: ToastContent) {
    this.store.dispatch(UserActions.addUser({ body: user, toastContent: content }));
  }

  editUser(id: string, body: ICreateEditUser, toastContent: ToastContent) {
    this.store.dispatch(UserActions.editUser({ id, body, toastContent }));
  }

  dismissToast() {
    this.store.dispatch(UserActions.dismissToast());
  }
  deactivateUser(userId: string) {
    this.store.dispatch(UserActions.deactivateUser({ userId }));
  }
}
