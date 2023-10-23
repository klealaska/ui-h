import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusHierManageContainerComponent } from './bus-hier-manage-container.component';
import { BusHierTreeComponent, BusHierUiModule } from '@ui-coe/bus-hier/ui';
import { TranslateModule } from '@ngx-translate/core';
import { TreeEffects } from '@ui-coe/bus-hier/data-access';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, take } from 'rxjs';
import {
  AddressType,
  AppActions,
  eventTrackingKey,
  HierarchyType,
  IGetTree,
  IItemSelection,
  IOrgsErpsTreeMapped,
  IRequest,
} from '@ui-coe/bus-hier/shared/types';
import { cold } from 'jasmine-marbles';
import { AxTranslatePipe } from '@ui-coe/shared/util/pipes';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('BusHierManageContainerComponent', () => {
  let component: BusHierManageContainerComponent;
  let fixture: ComponentFixture<BusHierManageContainerComponent>;
  let actions$: Observable<any>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BusHierUiModule,
        TranslateModule.forRoot(),
        BusHierTreeComponent,
        AxTranslatePipe,
        MatSnackBarModule,
      ],
      declarations: [BusHierManageContainerComponent],
      providers: [provideMockStore(), TreeEffects, provideMockActions(() => actions$)],
    }).compileComponents();

    fixture = TestBed.createComponent(BusHierManageContainerComponent);
    component = fixture.componentInstance;
    component.tree$ = of([]);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should  get orgs and erps nothing found getTree not called', () => {
    const response: IOrgsErpsTreeMapped = { organizations: [], erps: [] };
    const spyGetOrgsAndErp = jest
      .spyOn(component['treeFacade'], 'getOrgsAndErps')
      .mockImplementationOnce(() => of({ response }));
    const spyGetTree = jest.spyOn(component['treeFacade'], 'getTree');
    component.ngOnInit();
    expect(spyGetOrgsAndErp).toHaveBeenCalled();
    expect(spyGetTree).toHaveBeenCalledTimes(0);
  });
  it('should fire select node click event select ERP Details', () => {
    const spy = jest.spyOn(component['detailsFacade'], 'getDetails');
    const spyActivateNode = jest.spyOn(component['treeFacade'], 'activateTreeNode');

    component.onSelectNode({ id: '1', type: HierarchyType.ERP, isEntitySelected: false });
    expect(spy).toHaveBeenCalled();
    expect(spyActivateNode).toHaveBeenCalled();
  });
  it('should fire select node click event select Entities', () => {
    const spy = jest.spyOn(component['detailsFacade'], 'getEntities');
    const spyActivateNode = jest.spyOn(component['treeFacade'], 'activateTreeNode');

    component.onSelectNode({
      id: '1',
      type: HierarchyType.ENTITIES,
      isEntitySelected: false,
      erpId: '22',
      level: 1,
    });
    expect(spy).toHaveBeenCalled();
    expect(spyActivateNode).toHaveBeenCalled();
  });
  it('should fire select node click event select Entity Details', () => {
    const spy = jest.spyOn(component['detailsFacade'], 'getDetails');
    const spyActivateNode = jest.spyOn(component['treeFacade'], 'activateTreeNode');

    component.onSelectNode({
      id: '1',
      type: HierarchyType.ENTITIES,
      isEntitySelected: true,
    });
    expect(spy).toHaveBeenCalled();
    expect(spyActivateNode).toHaveBeenCalled();
  });
  it('should fire select node click event select Org Details', () => {
    const spy = jest.spyOn(component['detailsFacade'], 'getDetails');
    const spyActivateNode = jest.spyOn(component['treeFacade'], 'activateTreeNode');
    component.onSelectNode({
      id: '1',
      type: HierarchyType.ORGANIZATION,
      isEntitySelected: true,
    });
    expect(spy).toHaveBeenCalled();
    expect(spyActivateNode).toHaveBeenCalled();
  });
  it('should call editDetails facade when onSaveDetails is called', () => {
    const spy = jest.spyOn(component['detailsFacade'], 'editDetails');
    component.onSaveDetails({});
    expect(spy).toHaveBeenCalled();
  });
  it('should send request to activate and ERP', () => {
    const item = {
      id: '1',
      name: 'ERP',
      hierarchyType: HierarchyType.ERP,
    };
    const spy = jest.spyOn(component['detailsFacade'], 'activateItem');

    component.onActivateItem(item);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(item);
  });
  it('should send request to deactivte and ERP', () => {
    const item = {
      id: '1',
      name: 'ERP',
      hierarchyType: HierarchyType.ERP,
    };
    const spy = jest.spyOn(component['detailsFacade'], 'deactivateItem');

    component.onDeactivateItem(item);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(item);
  });
  it('should fire back button click event', () => {
    const spy = jest.spyOn(component['historyFacade'], 'updateHistoryEvents');
    component.historyEvents$ = cold('a', { a: [] });
    component.backBtnClick();
    expect(component.historyEvents$).toBeObservable(cold('a', { a: [] }));
    expect(spy).toHaveBeenCalled();
  });

  it('should fire back the details Facade getDetails', () => {
    const spy = jest.spyOn(component['detailsFacade'], 'getDetails');
    const historyEventsList = [
      [],
      [
        {
          [eventTrackingKey]: AppActions.LOAD_DETAILS,
          type: HierarchyType.ORGANIZATION,
          payload: {},
          correlationId: {},
        },
      ],
    ];
    component.historyEvents$ = cold('a', {
      a: historyEventsList,
    });
    component.backBtnClick();
    expect(component.historyEvents$).toBeObservable(cold('a', { a: historyEventsList }));
    expect(spy).toHaveBeenCalled();
  });

  it('should fire back the details Facade getEntities', () => {
    const spy = jest.spyOn(component['detailsFacade'], 'getEntities');
    const historyEventsList = [
      [],
      [
        {
          [eventTrackingKey]: AppActions.LOAD_ENTITIES,
          type: HierarchyType.ENTITIES,
          payload: {},
          correlationId: {},
        },
      ],
    ];
    component.historyEvents$ = cold('a', {
      a: historyEventsList,
    });
    component.backBtnClick();
    expect(component.historyEvents$).toBeObservable(cold('a', { a: historyEventsList }));
    expect(spy).toHaveBeenCalled();
  });
  it('should fire the active tree node ', () => {
    const spy = jest.spyOn(component['treeFacade'], 'activateTreeNode');
    const historyEventsList = [
      [],
      [
        {
          [eventTrackingKey]: AppActions.ACTIVATE_TREE_NODE,
          payload: {},
          correlationId: {},
        },
      ],
    ];
    component.historyEvents$ = cold('a', {
      a: historyEventsList,
    });
    component.backBtnClick();
    expect(component.historyEvents$).toBeObservable(cold('a', { a: historyEventsList }));
    expect(spy).toHaveBeenCalled();
  });
  it('should fire the tree facade to getTree and retrun landing page ', () => {
    const spyOn = jest.spyOn(component['detailsFacade'], 'resetDetails');
    const spy = jest.spyOn(component['treeFacade'], 'getTree');
    const historyEventsList = [
      [],
      [
        {
          [eventTrackingKey]: AppActions.LOAD_TREE,
          payload: {},
          correlationId: {},
        },
      ],
    ];
    component.historyEvents$ = cold('a', {
      a: historyEventsList,
    });
    component.backBtnClick();
    expect(component.historyEvents$).toBeObservable(cold('a', { a: historyEventsList }));
    expect(spy).toHaveBeenCalled();
    expect(spyOn).toHaveBeenCalled();
  });

  it('should call toggleEditDetailsMode when onToggleEditDetailsMode is called', () => {
    const spy = jest.spyOn(component['detailsFacade'], 'toggleEditDetailsMode');
    component.onToggleEditDetailsMode();
    expect(spy).toHaveBeenCalled();
  });
  it('should return true if the word starts with a vowel', () => {
    const result = component['beginsWithVowel']('ERP');
    expect(result).toBe(true);
  });
  it('should return false if the word does not start with a vowel', () => {
    const result = component['beginsWithVowel']('BAZ');
    expect(result).toBe(false);
  });

  it('should build error message list when buildValidationErrors is called', () => {
    component.buildValidationErrors();
    expect(component.validationErrors$.getValue()).toEqual([
      'detailsPage.requiredErrorMessage',
      'detailsPage.maxLengthErrorMessage',
    ]);
  });

  it('should dispatch deactivate address when onDeactivateAddress is called', () => {
    const spy = jest.spyOn(component['detailsFacade'], 'deactivateAddress');
    component.onDeactivateAddress({
      id: '1',
      addressId: '2',
      type: AddressType.BILL_TO,
      hierarchyType: HierarchyType.ENTITIES,
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should dispatch activate address when onActivateAddress is called', () => {
    const spy = jest.spyOn(component['detailsFacade'], 'activateAddress');
    component.onActivateAddress({
      id: '1',
      addressId: '2',
      type: AddressType.BILL_TO,
      hierarchyType: HierarchyType.ENTITIES,
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should dispatch edit address when onEditAddress is called', () => {
    const spy = jest.spyOn(component['detailsFacade'], 'editAddress');
    const address = {
      addressId: '1',
      addressCode: '222',
      addressLine1: '123 Elm Street',
      locality: 'sandiego',
      region: 'CA',
      postalCode: '12344',
      isActive: true,
      addressType: 'BillTo',
      country: 'USA',
      isPrimary: true,
    };
    component.onEditAddress({
      id: '123',
      type: HierarchyType.ORGANIZATION,
      addressType: AddressType.BILL_TO,
      address,
    });
    expect(spy).toHaveBeenCalledWith({
      id: '123',
      hierarchyType: HierarchyType.ORGANIZATION,
      address,
      addressType: AddressType.BILL_TO,
    });
  });

  it('should throw not implemented exception when onAddAddress is called', () => {
    expect(() => {
      component.onAddAddress(AddressType.BILL_TO);
    }).toThrow('onAddAddress not implemented');
  });

  it('should call clickOrgItem in tree facade when toggleOrgSelection is called', () => {
    const spy = jest.spyOn(component['treeFacade'], 'clickOrgItem');
    const itemSelectionData: IItemSelection = {
      id: 'foo',
      isSelected: true,
    };
    component.toggleOrgSelection(itemSelectionData);
    expect(spy).toHaveBeenCalled();
  });

  it('should call clickErpItem in tree facade when toggleErpSelection is called', () => {
    const spy = jest.spyOn(component['treeFacade'], 'clickErpItem');
    const itemSelectionData: IItemSelection = {
      id: 'foo',
      isSelected: true,
    };
    component.toggleErpSelection(itemSelectionData);
    expect(spy).toHaveBeenCalled();
  });

  it('should call getTree in tree facade when viewHierBtnClick is called', () => {
    const getTreeSpy = jest.spyOn(component['treeFacade'], 'getTree');
    const correlationId = 'foo';
    const req: IRequest<IGetTree> = {
      payload: {
        erpId: 'foo',
        orgId: 'bar',
      },
      correlationId,
    };
    component.viewHierBtnClick();
    component.viewHierarchy$.pipe(take(1)).subscribe(() => {
      expect(getTreeSpy).toHaveBeenCalledWith(req);
    });
  });
});
