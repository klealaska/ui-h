import { createAction, props } from '@ngrx/store';
import {
  AppActions,
  eventTrackingKey,
  IDetails,
  IRequest,
  IGetDetails,
  IGetEntities,
  IEntity,
  IEditEntityBody,
  IActivateOrDeactivateItem,
  HierarchyType,
  IActivateOrDeactivateAddress,
  AddressType,
  IAddress,
  IEditAddress,
} from '@ui-coe/bus-hier/shared/types';
import { withTracking } from '../../utils/ngrx-utils';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { IToastConfigData } from '@ui-coe/shared/types';

export const loadDetails = createAction(
  AppActions.LOAD_DETAILS,
  function prepare(payload?: IRequest<IGetDetails>) {
    return withTracking({ [eventTrackingKey]: AppActions.LOAD_DETAILS }, payload);
  }
);

export const loadDetailsSuccess = createAction(
  AppActions.LOAD_DETAILS_SUCCESS,
  props<{ response: IDetails }>()
);

export const loadDetailsFailure = createAction(
  AppActions.LOAD_DETAILS_FAILURE,
  props<{ error: unknown }>()
);

export const activateItem = createAction(
  AppActions.ACTIVATE_ITEM,
  props<IActivateOrDeactivateItem>()
);

export const deactivateItem = createAction(
  AppActions.DEACTIVATE_ITEM,
  props<IActivateOrDeactivateItem>()
);

export const activateItemSuccess = createAction(
  AppActions.ACTIVATE_ITEM_SUCCESS,
  props<{ status: 'Active'; itemName: string }>()
);

export const deactivateItemSuccess = createAction(
  AppActions.DEACTIVATE_ITEM_SUCCESS,
  props<{ status: 'Inactive'; itemName: string }>()
);

export const activateItemFailure = createAction(
  AppActions.ACTIVATE_ITEM_FAILURE,
  props<{ error: unknown; itemName: string }>()
);

export const deactivateItemFailure = createAction(
  AppActions.DEACTIVATE_ITEM_FAILURE,
  props<{ error: unknown; itemName: string }>()
);

export const loadEntities = createAction(
  AppActions.LOAD_ENTITIES,
  function prepare(payload?: IRequest<IGetEntities>) {
    return withTracking({ [eventTrackingKey]: AppActions.LOAD_ENTITIES }, payload);
  }
);

export const loadEntitiesSuccess = createAction(
  AppActions.LOAD_ENTITIES_SUCCESS,
  props<{ response: IEntity[] }>()
);

export const loadEntitiesFailure = createAction(
  AppActions.LOAD_ENTITIES_FAILURE,
  props<{ error: unknown }>()
);

export const resetDetails = createAction(AppActions.RESET_DETAILS);

export const editDetails = createAction(
  AppActions.EDIT_DETAILS,
  props<{
    id: string;
    body: IEditEntityBody;
    hierarchyType: HierarchyType;
    orgId?: string;
    erpId?: string;
    level?: number;
  }>()
);

export const editDetailsSuccess = createAction(
  AppActions.EDIT_DETAILS_SUCCESS,
  props<{ response: IDetails }>()
);

export const editDetailsFailure = createAction(
  AppActions.EDIT_DETAILS_FAILURE,
  props<{ error: unknown }>()
);

export const displayToast = createAction(
  AppActions.DISPLAY_TOAST,
  props<{ config: MatSnackBarConfig<IToastConfigData> }>()
);

export const activateAddress = createAction(
  AppActions.ACTIVATE_ADDRESS,
  props<IActivateOrDeactivateAddress>()
);

export const activateAddressSuccess = createAction(
  AppActions.ACTIVATE_ADDRESS_SUCCESS,
  props<{ isActive: boolean; addressId: string; addressType: AddressType }>()
);

export const activateAddressFailure = createAction(
  AppActions.ACTIVATE_ADDRESS_FAILURE,
  props<{ error: unknown }>()
);

export const deactivateAddress = createAction(
  AppActions.DEACTIVATE_ADDRESS,
  props<IActivateOrDeactivateAddress>()
);

export const deactivateAddressSuccess = createAction(
  AppActions.DEACTIVATE_ADDRESS_SUCCESS,
  props<{ isActive: boolean; addressId: string; addressType: AddressType }>()
);

export const deactivateAddressFailure = createAction(
  AppActions.DEACTIVATE_ADDRESS_FAILURE,
  props<{ error: unknown }>()
);

export const toggleEditDetailsMode = createAction(AppActions.TOGGLE_EDIT_DETAILS_MODE);

export const dismissToast = createAction(AppActions.DISMISS_TOAST);

export const editAddress = createAction(AppActions.EDIT_ADDRESS, props<IEditAddress>());

export const editAddressSuccess = createAction(
  AppActions.EDIT_ADDRESS_SUCCESS,
  props<{ payload: IAddress; addressType: AddressType }>()
);

export const editAddressFailure = createAction(
  AppActions.EDIT_ADDRESS_FAILURE,
  props<{ error: unknown }>()
);
