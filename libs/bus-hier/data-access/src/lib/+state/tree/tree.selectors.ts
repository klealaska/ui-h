import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HierarchyType } from '@ui-coe/bus-hier/shared/types';
import * as fromTree from './tree.reducer';

export const selectTreeState = createFeatureSelector<fromTree.TreeState>(fromTree.treeFeatureKey);

export const selectTree = createSelector(
  selectTreeState,
  (state: fromTree.TreeState) => state.tree
);

export const selectLoadingState = createSelector(
  selectTreeState,
  (state: fromTree.TreeState) => state.loading
);

export const selectOrgs = createSelector(
  selectTreeState,
  (state: fromTree.TreeState) => state.orgs
);

export const selectErps = createSelector(
  selectTreeState,
  (state: fromTree.TreeState) => state.erps
);

export const selectViewHierBtnEnabled = createSelector(
  selectTreeState,
  (state: fromTree.TreeState) =>
    state.erps.some(erp => erp.isSelected) && state.orgs.some(org => org.isSelected)
);

export const selectViewHierarchy = createSelector(selectTreeState, (state: fromTree.TreeState) => ({
  erpId: state.erps.find(erp => erp.isSelected).id,
  orgId: state.orgs.find(org => org.isSelected).id,
}));

export const selectedNodeId = createSelector(selectTreeState, (state: fromTree.TreeState) => {
  const node = state.tree.find(node => node.isActive);
  return node.id || node.businessLevelId;
});

export const selectEntityIdForTreeRedraw = createSelector(
  selectTreeState,
  (state: fromTree.TreeState) =>
    state.tree
      .filter(node => node.type === HierarchyType.ENTITIES)
      .find(entity => !entity.id && entity.parentEntityId)?.parentEntityId
);
