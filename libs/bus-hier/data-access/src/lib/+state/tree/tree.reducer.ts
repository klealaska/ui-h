import { createReducer, on } from '@ngrx/store';
import { IStatusEntity, ITreeNode } from '@ui-coe/bus-hier/shared/types';
import * as TreeActions from './tree.actions';
export const treeFeatureKey = 'tree';

export interface TreeState {
  tree: ITreeNode[];
  loading: boolean;
  error: unknown;
  orgs: IStatusEntity[];
  erps: IStatusEntity[];
}

export const initialTreeState: TreeState = {
  tree: [],
  loading: false,
  error: null,
  orgs: [],
  erps: [],
};

export const reducer = createReducer(
  initialTreeState,
  on(TreeActions.loadTree, state => {
    return { ...state, loading: true };
  }),
  on(TreeActions.loadTreeSuccess, (state, action) => ({
    ...state,
    loading: false,
    tree: action.response,
  })),
  on(TreeActions.loadTreeFailure, state => {
    return { ...state, error: 'error loading tree', loading: false };
  }),
  on(TreeActions.loadOrgsAndErps, state => {
    return { ...state, loading: true };
  }),
  on(TreeActions.loadOrgsAndErpsSuccess, (state, action) => {
    return {
      ...state,
      erps: action.response?.erps,
      orgs: action.response?.organizations,
      loading: false,
    };
  }),
  on(TreeActions.loadOrgsAndErpsFailure, state => {
    return { ...state, error: 'error', loading: false };
  }),
  on(TreeActions.activateTreeNode, (state, action) => {
    const newT = state.tree.map(treeNode => {
      const predicate: boolean = !action.payload.id
        ? false
        : typeof action.payload.id === 'string'
        ? treeNode.id === action.payload.id || treeNode.businessLevelId === action.payload.id
        : treeNode.level === action.payload.id;

      if (predicate) {
        return { ...treeNode, isActive: true };
      }
      return { ...treeNode, isActive: false };
    });
    return { ...state, tree: newT };
  }),
  // TODO: change types for erp and org from IStatusEntity to appropriate type
  /**
   * @summary
   * clickOrgItem suggest selecting or unselecting the clicked organization like a toggle.
   * This will disable/enable the associated ERPs that belong to the clicked Org (one Org has many ERPs),
   * and will also disable all other orgs, since no more than one org can be selected at a time to view the heirarchy
   */
  on(TreeActions.clickOrgItem, (state, action) => {
    const anErpIsSelected = state.erps.some(erp => erp.isSelected);
    return {
      ...state,
      erps: state.erps.map((erp: any) => {
        let isDisabled: boolean;

        if (action.isSelected) {
          if (anErpIsSelected) {
            isDisabled = erp.isDisabled;
          } else {
            isDisabled = action.id !== erp.orgId;
          }
        } else {
          if (anErpIsSelected) {
            isDisabled = erp.isDisabled;
          } else {
            isDisabled = false;
          }
        }
        return { ...erp, isDisabled };
      }),
      orgs: state.orgs.map((org: any) => {
        let isDisabled: boolean;

        if (action.isSelected) {
          isDisabled = action.id !== org.id;
        } else {
          isDisabled = anErpIsSelected ? org.isDisabled : false;
        }
        return {
          ...org,
          isDisabled,
          isSelected: action.isSelected ? action.id == org.id : false,
        };
      }),
    };
  }),
  /**
   * @summary
   * clickErpItem will toggle the selection of the clicked ERP, just like when clicking an organization
   * This will disable/enable the associated orgs respectively (an ERP has just one org)
   * This will also disable/enable the unassociated ERPs since you cannot select two ERPs at once
   */
  on(TreeActions.clickErpItem, (state, action) => {
    const anOrgIsSelected = state.orgs.some(org => org.isSelected);
    const selectedOrg = { ...state.orgs.find(org => org.isSelected) };
    const selectedErp: any = { ...state.erps.find(erp => action.id === erp.id) };
    return {
      ...state,
      erps: state.erps.map((erp: any) => {
        let isDisabled: boolean;
        if (action.isSelected) {
          isDisabled = action.id !== erp.id;
        } else {
          isDisabled = anOrgIsSelected ? selectedOrg.id !== erp.orgId : false;
        }
        return { ...erp, isDisabled, isSelected: action.isSelected ? action.id === erp.id : false };
      }),
      orgs: state.orgs.map((org: any) => {
        let isDisabled: boolean;
        if (action.isSelected) {
          isDisabled = anOrgIsSelected ? org.isDisabled : selectedErp.orgId !== org.id;
        } else {
          isDisabled = anOrgIsSelected ? org.isDisabled : false;
        }
        return { ...org, isDisabled };
      }),
    };
  })
);
