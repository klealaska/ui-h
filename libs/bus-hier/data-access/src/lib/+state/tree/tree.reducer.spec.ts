import { reducer, initialTreeState } from './tree.reducer';
import * as TenantAction from './tree.actions';
import { HierarchyType, ITreeNode } from '@ui-coe/bus-hier/shared/types';

describe('Tree Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialTreeState, action);

      expect(result).toBe(initialTreeState);
    });
    it('should update the state when loadtree is dispached', () => {
      const action = TenantAction.loadTree();
      const state = {
        ...initialTreeState,
        loading: true,
      };
      const result = reducer(initialTreeState, action);

      expect(result).toEqual(state);
    });
    it('should update the state when loadtree is done', () => {
      const tree: ITreeNode[] = [
        {
          id: '',
          name: 'foo',
          count: 1,
          type: HierarchyType.ORGANIZATION,
        },
      ];
      const action = TenantAction.loadTreeSuccess({ response: tree });
      const state = {
        ...initialTreeState,
        tree,
        loading: false,
      };
      const result = reducer(initialTreeState, action);

      expect(result).toEqual(state);
    });

    it('should update the state when loadtree is dispatched and it fails', () => {
      const action = TenantAction.loadTreeFailure({ error: 'error loading tree' });
      const state = {
        ...initialTreeState,
        loading: false,
        error: 'error loading tree',
      };
      const result = reducer(initialTreeState, action);

      expect(result).toEqual(state);
    });

    it('should update the state when clickOrgItem is dispatched', () => {
      const action = TenantAction.clickOrgItem({ id: 'foo', isSelected: true });
      const state = {
        ...initialTreeState,
      };
      const result = reducer(initialTreeState, action);

      expect(result).toEqual(state);
    });
  });
});
