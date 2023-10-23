import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import {
  AddressType,
  HierarchyType,
  IDetails,
  IEntity,
  IMappedEntitiesResponse,
  IOrganization,
} from '@ui-coe/bus-hier/shared/types';
import { EntityService, ErpService, OrganizationService } from '../../services';
import * as DetailsActions from './details.actions';
import * as TreeActions from '../tree/tree.actions';
import { DetailsEffects } from './details.effects';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from '@ui-coe/shared/util/services';

describe('DetailsEffects', () => {
  let actions$: Observable<any>;
  let effects: DetailsEffects;
  let service: ErpService;
  let orgService: OrganizationService;
  let erpService: ErpService;
  let entityService: EntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DetailsEffects,
        ConfigService,
        provideMockActions(() => actions$),
        {
          provide: TranslateService,
          useValue: {
            get: jest.fn(() =>
              of({
                'entityDetails.toaster': {
                  update: {
                    title: {
                      success: 'Changes Saved',
                      error: 'Error! Changes not saved',
                    },
                  },
                },
              })
            ),
          },
        },
      ],
      imports: [HttpClientTestingModule],
    });

    effects = TestBed.inject(DetailsEffects);
    service = TestBed.inject(ErpService);
    orgService = TestBed.inject(OrganizationService);
    entityService = TestBed.inject(EntityService);
    erpService = TestBed.inject(ErpService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should load ERP Details when loadDetails action is dispatched with corresponding type', () => {
    const getErpById = {
      organizationId: null,
      erpId: '2pdhsigrx3z9us8g2jji',
      erpName: 'Sage Intacct',
      erpCode: '123',
      companyDatabaseName: null,
      companyDatabaseId: null,
      isCrossCompanyCodingAllowed: null,
      isActive: true,
      purchaseOrderPrefix: null,
      startingPurchaseOrderNumber: null,
      createdTimestamp: '2023-04-12T21:08:17Z',
      createdByUserId: 'kr1rkw2ymzknri8kgo8m',
      lastModifiedTimestamp: '2023-04-12T21:08:17Z',
      lastModifiedByUserId: 'h2k49ykoue9jm733d4rj',
    };

    const details: IDetails = {
      id: '2pdhsigrx3z9us8g2jji',
      name: 'Sage Intacct',
      code: '123',
      status: 'Active',
      type: HierarchyType.ERP,
    };

    actions$ = hot('-a', {
      a: DetailsActions.loadDetails({
        payload: { id: details.id, hierarchyType: details.type },
      }),
    });
    const response = cold('-a|', { a: getErpById });
    const expected = cold('--b', {
      b: DetailsActions.loadDetailsSuccess({ response: details }),
    });

    service.getErpById = jest.fn(() => response);
    expect(effects.loadDetails$).toBeObservable(expected);
  });

  it('should load Organization Details when loadDetails action is dispatched with corresponding type', () => {
    const getOrganizations: IOrganization = {
      organizationId: 'jdohqtuu0w33fsvc6hvf',
      organizationName: 'Stark Industries',
      organizationCode: 'SI',
      isActive: true,
      createdTimestamp: '2023-05-01T06:05:44Z',
      createdByUserId: 'jha8k13l3gd90mls3o01',
      lastModifiedTimestamp: '2023-05-01T06:05:44Z',
      lastModifiedByUserId: 'rwdg9d3g0kmb0va28t9j',
      erps: [],
      organizationAddresses: [],
    };

    const details: IDetails = {
      id: 'jdohqtuu0w33fsvc6hvf',
      name: 'Stark Industries',
      code: 'SI',
      status: 'Active',
      type: HierarchyType.ORGANIZATION,
      shipToAddresses: [],
      billToAddresses: [],
    };

    actions$ = hot('-a', {
      a: DetailsActions.loadDetails({
        payload: { id: details.id, hierarchyType: details.type },
      }),
    });
    const response = cold('-a|', { a: getOrganizations });
    const expected = cold('--b', {
      b: DetailsActions.loadDetailsSuccess({ response: details }),
    });

    orgService.getOrganization = jest.fn(() => response);
    expect(effects.loadDetails$).toBeObservable(expected);
  });

  it('should load entities', () => {
    const getEntities: IMappedEntitiesResponse = {
      items: [
        {
          businessLevel: 1,
          entityCode: 'COMPC',
          entityId: 'cadlbfshs605o7i35wl3',
          entityName: 'Company C',
          erpId: '9ng7ljo918qvqunwworx',
          isActive: true,
          parentEntityId: null,
          entityAddresses: [],
        },
      ],
    };

    const entities: IEntity[] = [
      {
        name: 'Company C',
        id: 'cadlbfshs605o7i35wl3',
        isActive: true,
        level: 1,
        parentEntityId: null,
      },
    ];

    actions$ = hot('-a', {
      a: DetailsActions.loadEntities({
        payload: { erpId: '123', level: 1 },
      }),
    });
    const response = cold('-a|', { a: getEntities });
    const expected = cold('--b', {
      b: DetailsActions.loadEntitiesSuccess({ response: entities }),
    });

    entityService.getEntities = jest.fn(() => response);
    expect(effects.loadEntities$).toBeObservable(expected);
  });

  it('should load Organization Details when editDetails action is dispatched with corresponding type', () => {
    const id = 'jdohqtuu0w33fsvc6hvf';
    const editOrganizationResponse: IOrganization = {
      organizationId: id,
      organizationName: 'Stark Industries',
      organizationCode: 'SI',
      isActive: true,
      createdTimestamp: '2023-05-01T06:05:44Z',
      createdByUserId: 'jha8k13l3gd90mls3o01',
      lastModifiedTimestamp: '2023-05-01T06:05:44Z',
      lastModifiedByUserId: 'rwdg9d3g0kmb0va28t9j',
      erps: [],
      organizationAddresses: [],
    };

    const details: IDetails = {
      id,
      name: 'Stark Industries',
      code: 'SI',
      status: 'Active',
      type: HierarchyType.ORGANIZATION,
      billToAddresses: [],
      shipToAddresses: [],
    };

    actions$ = hot('-a', {
      a: DetailsActions.editDetails({
        id,
        body: { name: 'bar', code: 'baz' },
        hierarchyType: HierarchyType.ORGANIZATION,
        erpId: '123',
        orgId: id,
      }),
    });
    const response = cold('-a|', { a: editOrganizationResponse });
    const expected = cold('--(bcd)', {
      b: DetailsActions.editDetailsSuccess({ response: details }),
      c: DetailsActions.toggleEditDetailsMode(),
      d: TreeActions.loadTree({
        payload: { orgId: id, erpId: '123', selectedNode: id },
      }),
    });

    orgService.editOrganization = jest.fn(() => response);
    expect(effects.editDetails$).toBeObservable(expected);
  });

  it('should load ERP Details when editDetails action is dispatched with corresponding type', () => {
    const id = 'jdohqtuu0w33fsvc6hvf';
    const editERPResponse = {
      erpId: id,
      erpName: 'New ERP name',
      erpCode: 'NEN',
      isActive: true,
      createdTimestamp: '2023-05-01T06:05:44Z',
      createdByUserId: 'jha8k13l3gd90mls3o01',
      lastModifiedTimestamp: '2023-05-01T06:05:44Z',
      lastModifiedByUserId: 'rwdg9d3g0kmb0va28t9j',
    };

    const details: IDetails = {
      id,
      name: 'New ERP name',
      code: 'NEN',
      status: 'Active',
      type: HierarchyType.ERP,
    };

    actions$ = hot('-a', {
      a: DetailsActions.editDetails({
        id,
        body: { name: 'another name', code: '123' },
        hierarchyType: HierarchyType.ERP,
        orgId: '123',
        erpId: id,
      }),
    });
    const response = cold('-a|', { a: editERPResponse });
    const expected = cold('--(bcd)', {
      b: DetailsActions.editDetailsSuccess({ response: details }),
      c: DetailsActions.toggleEditDetailsMode(),
      d: TreeActions.loadTree({
        payload: { orgId: '123', erpId: id, selectedNode: id },
      }),
    });

    erpService.editERP = jest.fn(() => response);
    expect(effects.editDetails$).toBeObservable(expected);
  });

  it('should load Entity Details when editDetails action is dispatched with corresponding type', () => {
    const id = 'jdohqtuu0w33fsvc6hvf';

    const editEntityResponse = {
      businessLevel: 1,
      entityCode: 'Code',
      entityId: id,
      isActive: true,
      erpId: '343432',
      entityName: 'My Entity Name',
      parentEntityId: null,
      entityAddresses: [],
    };

    const details: IDetails = {
      id,
      name: 'My Entity Name',
      code: 'Code',
      status: 'Active',
      type: HierarchyType.ENTITIES,
      level: 1,
      shipToAddresses: [],
      billToAddresses: [],
    };

    actions$ = hot('-a', {
      a: DetailsActions.editDetails({
        id,
        body: { name: 'another name', code: '123' },
        hierarchyType: HierarchyType.ENTITIES,
        orgId: '123',
        erpId: '343432',
        level: 1,
      }),
    });
    const response = cold('-a|', { a: editEntityResponse });
    const expected = cold('--(bcd)', {
      b: TreeActions.loadTree({
        payload: { orgId: '123', erpId: '343432', entityId: id, selectedNode: 1 },
      }),
      c: DetailsActions.editDetailsSuccess({ response: details }),
      d: DetailsActions.toggleEditDetailsMode(),
    });

    entityService.editEntity = jest.fn(() => response);
    expect(effects.editDetails$).toBeObservable(expected);
  });

  describe('activateItem', () => {
    it('should activate an ERP and dispatch activateItemSuccess action', () => {
      const details: IDetails = {
        id: '2pdhsigrx3z9us8g2jji',
        name: 'Sage Intacct',
        code: '123',
        status: 'Inactive',
        type: HierarchyType.ERP,
      };

      actions$ = hot('-a', {
        a: DetailsActions.activateItem({
          id: details.id,
          name: details.name,
          hierarchyType: details.type,
        }),
      });
      const response = cold('-a|', {});
      const expected = cold('--b', {
        b: DetailsActions.activateItemSuccess({
          status: 'Active',
          itemName: details.name,
        }),
      });

      service.activateErp = jest.fn(() => response);
      expect(effects.activateItem$).toBeObservable(expected);
    });

    it(`should activate an organizataion and dispatch activateItemSuccess action`, () => {
      const details: IDetails = {
        id: '2pdhsigrx3z9us8g2jji',
        name: 'Sage Intacct',
        code: '123',
        status: 'Inactive',
        type: HierarchyType.ORGANIZATION,
      };

      actions$ = hot('-a', {
        a: DetailsActions.activateItem({
          id: details.id,
          name: details.name,
          hierarchyType: details.type,
        }),
      });

      const response = cold('-a|', {});
      const expected = cold('--b', {
        b: DetailsActions.activateItemSuccess({
          status: 'Active',
          itemName: details.name,
        }),
      });

      orgService.activateOrganization = jest.fn(() => response);
      expect(effects.activateItem$).toBeObservable(expected);
    });

    it('should activate an entity and dispatch activateItemSuccess action', () => {
      const details: IDetails = {
        id: '2pdhsigrx3z9us8g2jji',
        name: 'Sage Intacct',
        code: '123',
        status: 'Inactive',
        type: HierarchyType.ENTITIES,
      };

      actions$ = hot('-a', {
        a: DetailsActions.activateItem({
          id: details.id,
          hierarchyType: details.type,
          name: details.name,
        }),
      });

      const response = cold('-a|', {});
      const expected = cold('--b', {
        b: DetailsActions.activateItemSuccess({
          status: 'Active',
          itemName: details.name,
        }),
      });
      entityService.activeEntity = jest.fn(() => response);

      expect(effects.activateItem$).toBeObservable(expected);
    });

    it('should fail to activate an Erp and dispatch activateItemFailure action', () => {
      const details: IDetails = {
        id: '2pdhsigrx3z9us8g2jji',
        name: 'Sage Intacct',
        code: '123',
        status: 'Inactive',
        type: HierarchyType.ERP,
      };

      actions$ = hot('-a', {
        a: DetailsActions.activateItem({
          id: details.id,
          name: details.name,
          hierarchyType: details.type,
        }),
      });

      const response = cold('-#', {}, 'error');
      service.activateErp = jest.fn(() => response);
      const expected = cold('--b', {
        b: DetailsActions.activateItemFailure({
          error: 'error',
          itemName: details.name,
        }),
      });
      expect(effects.activateItem$).toBeObservable(expected);
    });

    it('should fail to activate an organization and dispatch activateItemFailure action', () => {
      const details: IDetails = {
        id: '2pdhsigrx3z9us8g2jji',
        name: 'Sage Intacct',
        code: '123',
        status: 'Inactive',
        type: HierarchyType.ORGANIZATION,
      };

      actions$ = hot('-a', {
        a: DetailsActions.activateItem({
          id: details.id,
          hierarchyType: details.type,
          name: details.name,
        }),
      });

      const response = cold('-#', {}, 'error');
      const expected = cold('--b', {
        b: DetailsActions.activateItemFailure({
          error: 'error',
          itemName: details.name,
        }),
      });

      orgService.activateOrganization = jest.fn(() => response);
      expect(effects.activateItem$).toBeObservable(expected);
    });

    it('should fail to activate and entity and dispatch activateItemFailure action', () => {
      const details: IDetails = {
        id: '2pdhsigrx3z9us8g2jji',
        name: 'Sage Intacct',
        code: '123',
        status: 'Inactive',
        type: HierarchyType.ENTITIES,
      };

      actions$ = hot('-a', {
        a: DetailsActions.activateItem({
          id: details.id,
          hierarchyType: details.type,
          name: details.name,
        }),
      });

      const response = cold('-#', {}, 'error');
      const expected = cold('--b', {
        b: DetailsActions.activateItemFailure({
          error: 'error',
          itemName: details.name,
        }),
      });
      entityService.activeEntity = jest.fn(() => response);

      expect(effects.activateItem$).toBeObservable(expected);
    });
  });

  describe('deactivateItem', () => {
    it('should deactivate an ERP and diapatch deactivateItemSuccess action', () => {
      const details: IDetails = {
        id: '2pdhsigrx3z9us8g2jji',
        name: 'Sage Intacct',
        code: '123',
        status: 'Active',
        type: HierarchyType.ERP,
      };

      actions$ = hot('-a', {
        a: DetailsActions.deactivateItem({
          id: details.id,
          name: details.name,
          hierarchyType: details.type,
        }),
      });
      const response = cold('-a|', {});
      const expected = cold('--b', {
        b: DetailsActions.deactivateItemSuccess({
          status: 'Inactive',
          itemName: details.name,
        }),
      });

      service.deactivateErp = jest.fn(() => response);
      expect(effects.deactivateItem$).toBeObservable(expected);
    });

    it('should deactivate an organization and dispatch deactivateItemSuccess action', () => {
      const details: IDetails = {
        id: '2pdhsigrx3z9us8g2jji',
        name: 'Sage Intacct',
        code: '123',
        status: 'Active',
        type: HierarchyType.ORGANIZATION,
      };

      actions$ = hot('-a|', {
        a: DetailsActions.deactivateItem({
          id: details.id,
          hierarchyType: details.type,
          name: details.name,
        }),
      });

      const response = cold('-a', {});
      const expected = cold('--b', {
        b: DetailsActions.deactivateItemSuccess({
          status: 'Inactive',
          itemName: details.name,
        }),
      });

      orgService.deactivateOrganization = jest.fn(() => response);
      expect(effects.deactivateItem$).toBeObservable(expected);
    });

    it('should deactivate an entity and dispatch deactivateItemSuccess action', () => {
      const details: IDetails = {
        id: '2pdhsigrx3z9us8g2jji',
        name: 'Sage Intacct',
        code: '123',
        status: 'Active',
        type: HierarchyType.ENTITIES,
      };

      actions$ = hot('-a', {
        a: DetailsActions.deactivateItem({
          id: details.id,
          hierarchyType: details.type,
          name: details.name,
        }),
      });

      const response = cold('-a|', {});
      const expected = cold('--b', {
        b: DetailsActions.deactivateItemSuccess({
          status: 'Inactive',
          itemName: details.name,
        }),
      });

      entityService.deactiveEntity = jest.fn(() => response);
      expect(effects.deactivateItem$).toBeObservable(expected);
    });

    it('should fail to deactivate an ERP and dispatch deactivateItemFailure action', () => {
      const details: IDetails = {
        id: '2pdhsigrx3z9us8g2jji',
        name: 'Sage Intacct',
        code: '123',
        status: 'Active',
        type: HierarchyType.ERP,
      };

      actions$ = hot('-a', {
        a: DetailsActions.deactivateItem({
          id: details.id,
          name: details.name,
          hierarchyType: details.type,
        }),
      });

      const response = cold('-#', {}, 'error');
      const expected = cold('--b', {
        b: DetailsActions.deactivateItemFailure({
          error: 'error',
          itemName: details.name,
        }),
      });
      service.deactivateErp = jest.fn(() => response);
      expect(effects.deactivateItem$).toBeObservable(expected);
    });

    it('should fail to deactivate an organization and dispatch deactivateItemFailure action', () => {
      const details: IDetails = {
        id: '2pdhsigrx3z9us8g2jji',
        name: 'Sage Intacct',
        code: '123',
        status: 'Active',
        type: HierarchyType.ORGANIZATION,
      };

      actions$ = hot('-a', {
        a: DetailsActions.deactivateItem({
          id: details.id,
          hierarchyType: details.type,
          name: details.name,
        }),
      });

      const response = cold('-#', {}, 'error');
      const expected = cold('--b', {
        b: DetailsActions.deactivateItemFailure({
          error: 'error',
          itemName: details.name,
        }),
      });

      orgService.deactivateOrganization = jest.fn(() => response);
      expect(effects.deactivateItem$).toBeObservable(expected);
    });

    it('should fail to deactivate an entity and dispatch activateOrDeactivateItemFailure action', () => {
      const details: IDetails = {
        id: '2pdhsigrx3z9us8g2jji',
        name: 'Sage Intacct',
        code: '123',
        status: 'Active',
        type: HierarchyType.ENTITIES,
      };

      actions$ = hot('-a', {
        a: DetailsActions.deactivateItem({
          id: details.id,
          hierarchyType: details.type,
          name: details.name,
        }),
      });

      const response = cold('-#', {}, 'error');
      const expected = cold('--b', {
        b: DetailsActions.deactivateItemFailure({
          error: 'error',
          itemName: details.name,
        }),
      });

      entityService.deactiveEntity = jest.fn(() => response);
      expect(effects.deactivateItem$).toBeObservable(expected);
    });
  });

  describe('activate Address and deactivate ', () => {
    it('should activate an entity Address activateAddress action', () => {
      actions$ = hot('-a', {
        a: DetailsActions.activateAddress({
          id: '2343432',
          addressId: '123',
          hierarchyType: HierarchyType.ENTITIES,
          addressType: AddressType.BILL_TO,
        }),
      });
      const response = cold('-a|', {});
      const expected = cold('--b', {
        b: DetailsActions.activateAddressSuccess({
          isActive: true,
          addressId: '123',
          addressType: AddressType.BILL_TO,
        }),
      });

      entityService.activeEntityAddress = jest.fn(() => response);
      expect(effects.activateAddress$).toBeObservable(expected);
    });

    it('should activate an entity Address deactivateAddress action', () => {
      actions$ = hot('-a', {
        a: DetailsActions.deactivateAddress({
          id: '2343432',
          addressId: '123',
          hierarchyType: HierarchyType.ENTITIES,
          addressType: AddressType.BILL_TO,
        }),
      });
      const response = cold('-a|', {});
      const expected = cold('--b', {
        b: DetailsActions.deactivateAddressSuccess({
          isActive: false,
          addressId: '123',
          addressType: AddressType.BILL_TO,
        }),
      });

      entityService.deactiveEntityAddress = jest.fn(() => response);
      expect(effects.deactivateAddress$).toBeObservable(expected);
    });

    it('should activate an organization Address activateAddress action', () => {
      actions$ = hot('-a', {
        a: DetailsActions.activateAddress({
          id: '2343432',
          addressId: '123',
          hierarchyType: HierarchyType.ORGANIZATION,
          addressType: AddressType.BILL_TO,
        }),
      });
      const response = cold('-a|', {});
      const expected = cold('--b', {
        b: DetailsActions.activateAddressSuccess({
          isActive: true,
          addressId: '123',
          addressType: AddressType.BILL_TO,
        }),
      });

      orgService.activateOrganizationAddress = jest.fn(() => response);
      expect(effects.activateAddress$).toBeObservable(expected);
    });

    it('should deactivate an organization Address deactivateAddress action', () => {
      actions$ = hot('-a', {
        a: DetailsActions.deactivateAddress({
          id: '2343432',
          addressId: '123',
          hierarchyType: HierarchyType.ORGANIZATION,
          addressType: AddressType.BILL_TO,
        }),
      });
      const response = cold('-a|', {});
      const expected = cold('--b', {
        b: DetailsActions.deactivateAddressSuccess({
          isActive: false,
          addressId: '123',
          addressType: AddressType.BILL_TO,
        }),
      });

      orgService.deactivateOrganizationAddress = jest.fn(() => response);
      expect(effects.deactivateAddress$).toBeObservable(expected);
    });
  });

  describe('edit an Address ', () => {
    it('should edit an organization Address', () => {
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
      actions$ = hot('-a', {
        a: DetailsActions.editAddress({
          id: '2343432',
          hierarchyType: HierarchyType.ORGANIZATION,
          addressType: AddressType.BILL_TO,
          address,
        }),
      });
      const response = cold('-a|', { a: address });
      const expected = cold('--(b)', {
        b: DetailsActions.editAddressSuccess({
          payload: address,
          addressType: AddressType.BILL_TO,
        }),
      });

      orgService.editOrganizationAddress = jest.fn(() => response);
      expect(effects.editAddress$).toBeObservable(expected);
    });
    it('should fail edit an organization Address', () => {
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
      actions$ = hot('-a', {
        a: DetailsActions.editAddress({
          id: '2343432',
          hierarchyType: HierarchyType.ORGANIZATION,
          addressType: AddressType.BILL_TO,
          address,
        }),
      });
      const response = cold('-#', {}, 'error');
      const expected = cold('--b', {
        b: DetailsActions.editAddressFailure({ error: 'error' }),
      });

      orgService.editOrganizationAddress = jest.fn(() => response);
      expect(effects.editAddress$).toBeObservable(expected);
    });
    it('should edit an entity Address', () => {
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
      actions$ = hot('-a', {
        a: DetailsActions.editAddress({
          id: '2343432',
          hierarchyType: HierarchyType.ENTITIES,
          addressType: AddressType.SHIP_TO,
          address,
        }),
      });
      const response = cold('-a|', { a: address });
      const expected = cold('--b', {
        b: DetailsActions.editAddressSuccess({
          payload: address,
          addressType: AddressType.SHIP_TO,
        }),
      });

      entityService.editEntityAddress = jest.fn(() => response);
      expect(effects.editAddress$).toBeObservable(expected);
    });
    it('should fail edit an entity Address', () => {
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
      actions$ = hot('-a', {
        a: DetailsActions.editAddress({
          id: '2343432',
          hierarchyType: HierarchyType.ENTITIES,
          addressType: AddressType.SHIP_TO,
          address,
        }),
      });
      const response = cold('-#', {}, 'error');
      const expected = cold('--b', {
        b: DetailsActions.editAddressFailure({ error: 'error' }),
      });

      entityService.editEntityAddress = jest.fn(() => response);
      expect(effects.editAddress$).toBeObservable(expected);
    });
  });
});
