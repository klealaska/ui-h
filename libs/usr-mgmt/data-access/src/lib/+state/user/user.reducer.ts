import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { IUser } from '@ui-coe/usr-mgmt/shared/types';
import { IToastConfigData } from '@ui-coe/shared/types';
import * as UserActions from './user.actions';

export const userFeatureKey = 'user';

export interface State extends EntityState<IUser> {
  loading: boolean;
  error?: any;
  toast?: MatSnackBarConfig<IToastConfigData>;
}

export const adapter: EntityAdapter<IUser> = createEntityAdapter<IUser>({
  selectId: (model: IUser) => model.userId,
});

export const initialState: State = adapter.getInitialState({
  error: null,
  loading: false,
});

export const reducer = createReducer(
  initialState,
  on(UserActions.loadUsers, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(UserActions.loadUsersSuccess, (state, action) => {
    return adapter.addMany(action.response, { ...state, loading: false });
  }),
  on(UserActions.loadUsersFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
      loading: false,
    };
  }),
  on(UserActions.addUser, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(UserActions.addUserSuccess, (state, action) => {
    return adapter.addOne(action.response, { ...state, loading: false });
  }),
  on(UserActions.addUserFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
      loading: false,
    };
  }),
  on(UserActions.editUser, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(UserActions.editUserSuccess, (state, action) => {
    return adapter.updateOne(
      { id: action.response.userId, changes: action.response },
      {
        ...state,
        loading: false,
      }
    );
  }),
  on(UserActions.editUserFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.error,
    };
  }),
  on(UserActions.displayToast, (state, action) => {
    return {
      ...state,
      toast: action.config,
    };
  }),
  on(UserActions.dismissToast, state => {
    return {
      ...state,
      toast: null,
    };
  }),
  on(UserActions.deactivateUser, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(UserActions.deactivateUserSuccess, (state, action) => {
    return adapter.updateOne(
      { id: action.response.userId, changes: action.response },
      { ...state, loading: false }
    );
  }),
  on(UserActions.deactivateUserFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
      loading: false,
    };
  })
);
