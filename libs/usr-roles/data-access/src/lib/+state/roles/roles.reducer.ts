import { createReducer, on } from '@ngrx/store';
import { RolesActions } from './roles.actions';

export const rolesFeatureKey = 'roles';

export interface State {
  loading: boolean;
  error?: any;
}

export const initialState: State = {
  loading: false,
  error: null,
};

export const reducer = createReducer(
  initialState,
  on(RolesActions.loadRoles, state => state)
);
