import { createFeatureSelector } from '@ngrx/store';
import * as fromRoles from './roles.reducer';

export const selectRolesState = createFeatureSelector<fromRoles.State>(fromRoles.rolesFeatureKey);
