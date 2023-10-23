import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import * as TreeActions from './tree.actions';
import * as fromTree from './tree.reducer';
import { TreeFacade } from './tree.facade';
import { IItemSelection } from '@ui-coe/bus-hier/shared/types';

describe('TreeFacade', () => {
  let facade: TreeFacade;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(fromTree.treeFeatureKey, fromTree.reducer),
      ],
      providers: [TreeFacade],
    });
    facade = TestBed.inject(TreeFacade);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should get Tree', () => {
    const spy = jest.spyOn(store, 'dispatch');
    facade.getTree();
    expect(spy).toHaveBeenCalledWith(TreeActions.loadTree());
  });

  it('should get orgs and erps', () => {
    const spy = jest.spyOn(store, 'dispatch');
    facade.getOrgsAndErps();
    expect(spy).toHaveBeenCalledWith(TreeActions.loadOrgsAndErps());
  });

  it('should dispatch clickOrgItem action when clickOrgItem is called', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const data: IItemSelection = {
      id: 'foo',
      isSelected: true,
    };
    facade.clickOrgItem(data);
    expect(spy).toHaveBeenCalledWith(TreeActions.clickOrgItem(data));
  });

  it('should dispatch clickErpItem action when clickErpItem is called', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const data: IItemSelection = {
      id: 'foo',
      isSelected: true,
    };
    facade.clickErpItem(data);
    expect(spy).toHaveBeenCalledWith(TreeActions.clickErpItem(data));
  });
});
