import { IBusinessLevelDetails } from '@ui-coe/bus-hier/shared/types';
import { createReducer, on } from '@ngrx/store';
import * as BusinessLevelActions from './business-level.actions';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { IToastConfigData } from '@ui-coe/shared/types';

export const businessLevelFeatureKey = 'businessLevel';

export interface BusinessLevelState {
  businessLevel?: IBusinessLevelDetails;
  loading: boolean;
  error: unknown;
  toast: MatSnackBarConfig<IToastConfigData>;
}

export const InitialBusinessLevelState: BusinessLevelState = {
  businessLevel: null,
  loading: false,
  error: null,
  toast: null,
};

export const reducer = createReducer(
  InitialBusinessLevelState,

  on(BusinessLevelActions.updateBusinessLevelName, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(BusinessLevelActions.updateBusinessLevelNameSuccess, (state, action) => {
    return {
      ...state,
      businessLevel: action.response,
      loading: false,
      error: null,
    };
  }),
  on(BusinessLevelActions.updateBusinessLevelNameFailure, (state, action) => {
    return {
      ...state,
      businessLevel: null,
      loading: false,
      error: action.error,
    };
  }),
  on(BusinessLevelActions.displayToast, (state, action) => {
    return {
      ...state,
      toast: action.config,
    };
  }),
  on(BusinessLevelActions.dismissToast, state => {
    return {
      ...state,
      toast: null,
    };
  })
);
