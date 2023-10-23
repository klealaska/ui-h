import * as fromTree from './tree.reducer';
import {
  selectTreeState,
  selectTree,
  selectOrgs,
  selectErps,
  selectViewHierBtnEnabled,
  selectViewHierarchy,
} from './tree.selectors';

describe('Tree Selectors', () => {
  const state: fromTree.TreeState = {
    tree: [],
    loading: false,
    error: null,
    erps: [],
    orgs: [],
  };
  it('should select the feature state', () => {
    const result = selectTreeState({
      [fromTree.treeFeatureKey]: {},
    });

    expect(result).toEqual({});
  });
  it('should select the Tree', () => {
    const result = selectTree.projector(state);
    expect(result).toBe(state.tree);
  });

  it('should select Orgs', () => {
    const newState = {
      tree: [],
      loading: false,
      error: null,
      erps: [],
      orgs: [
        {
          id: '123',
          name: 'Foo',
          isActive: true,
        },
      ],
    };

    const result = selectOrgs.projector(newState);
    expect(result).toBe(newState.orgs);
  });

  it('should select ERPs', () => {
    const newState = {
      tree: [],
      loading: false,
      error: null,
      erps: [
        {
          id: '123',
          name: 'Foo',
          isActive: true,
        },
      ],

      orgs: [],
    };

    const result = selectErps.projector(newState);
    expect(result).toBe(newState.erps);
  });

  it('should select ViewHierBtnEnabled', () => {
    const newState = {
      tree: [],
      loading: false,
      error: null,
      erps: [
        {
          id: '123',
          name: 'Foo',
          isActive: true,
          isSelected: true,
        },
      ],
      orgs: [
        {
          id: '234',
          name: 'Bar',
          isActive: true,
          isSelected: true,
        },
      ],
    };

    const result = selectViewHierBtnEnabled.projector(newState);
    expect(result).toBe(true);
  });

  it('should select ViewHierBtnEnabled', () => {
    const newState = {
      tree: [],
      loading: false,
      error: null,
      erps: [
        {
          id: '123',
          name: 'Foo',
          isActive: true,
          isSelected: true,
        },
      ],
      orgs: [
        {
          id: '234',
          name: 'Bar',
          isActive: true,
          isSelected: true,
        },
      ],
    };

    const result = selectViewHierarchy.projector(newState);
    expect(result).toStrictEqual({ erpId: '123', orgId: '234' });
  });
});
