import { createAction, props } from '@ngrx/store';
import {
  AppActions,
  eventTrackingKey,
  IActivateTreeNode,
  IGetTree,
  IItemSelection,
  IRequest,
  IStatusOrgErpEntitiesMapped,
  ITreeNode,
} from '@ui-coe/bus-hier/shared/types';
import { withTracking } from '../../utils/ngrx-utils';

export const loadOrgsAndErps = createAction(AppActions.LOAD_ORGS_ERPS);

export const loadOrgsAndErpsSuccess = createAction(
  AppActions.LOAD_ORGS_ERPS_SUCCESS,
  props<{ response: IStatusOrgErpEntitiesMapped }>()
);

export const loadOrgsAndErpsFailure = createAction(
  AppActions.LOAD_ORGS_ERPS_FAILURE,
  props<{ error: unknown }>()
);

export const loadTree = createAction(
  AppActions.LOAD_TREE,
  function prepare(payload?: IRequest<IGetTree>) {
    return withTracking({ [eventTrackingKey]: AppActions.LOAD_TREE }, payload);
  }
);

export const loadTreeSuccess = createAction(
  AppActions.LOAD_TREE_SUCCESS,
  props<{ response: ITreeNode[] }>()
);

export const loadTreeFailure = createAction(
  AppActions.LOAD_TREE_FAILURE,
  props<{ error: unknown }>()
);

export const activateTreeNode = createAction(
  AppActions.ACTIVATE_TREE_NODE,
  function prepare(payload?: IRequest<IActivateTreeNode>) {
    return withTracking({ [eventTrackingKey]: AppActions.ACTIVATE_TREE_NODE }, payload);
  }
);

export const clickOrgItem = createAction(AppActions.CLICK_ORG_ITEM, props<IItemSelection>());

export const clickErpItem = createAction(AppActions.CLICK_ERP_ITEM, props<IItemSelection>());
