import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  IActivateTreeNode,
  IGetTree,
  IItemSelection,
  IRequest,
  IStatusEntity,
  ITreeNode,
} from '@ui-coe/bus-hier/shared/types';
import * as TreeActions from './tree.actions';
import { TreeState } from './tree.reducer';
import * as TreeSelector from './tree.selectors';

@Injectable({
  providedIn: 'root',
})
export class TreeFacade {
  constructor(private store: Store, private actions$: Actions) {}

  tree$: Observable<ITreeNode[]> = this.store.pipe(select(TreeSelector.selectTree));
  loading$: Observable<boolean> = this.store.pipe(select(TreeSelector.selectLoadingState));
  treeState$: Observable<TreeState> = this.store.pipe(select(TreeSelector.selectTreeState));
  orgs$: Observable<IStatusEntity[]> = this.store.pipe(select(TreeSelector.selectOrgs));
  erps$: Observable<IStatusEntity[]> = this.store.pipe(select(TreeSelector.selectErps));
  viewHierBtnEnabled$: Observable<boolean> = this.store.pipe(
    select(TreeSelector.selectViewHierBtnEnabled)
  );
  viewHierarchy$: Observable<IGetTree> = this.store.pipe(select(TreeSelector.selectViewHierarchy));
  selectedNodeId$: Observable<string> = this.store.pipe(select(TreeSelector.selectedNodeId));
  selectEntityIdForTreeRedraw$: Observable<string> = this.store.pipe(
    select(TreeSelector.selectEntityIdForTreeRedraw)
  );

  getTree(params?: IRequest<IGetTree>) {
    this.store.dispatch(TreeActions.loadTree(params));
  }

  getOrgsAndErps() {
    this.store.dispatch(TreeActions.loadOrgsAndErps());
  }

  activateTreeNode(params: IRequest<IActivateTreeNode>) {
    this.store.dispatch(TreeActions.activateTreeNode(params));
  }

  clickOrgItem(event: IItemSelection) {
    this.store.dispatch(TreeActions.clickOrgItem(event));
  }

  clickErpItem(event: IItemSelection) {
    this.store.dispatch(TreeActions.clickErpItem(event));
  }
}
