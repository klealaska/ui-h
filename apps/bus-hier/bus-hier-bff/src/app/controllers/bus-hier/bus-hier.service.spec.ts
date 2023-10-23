import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';

import { HttpConfigService } from '../../../services/http-config.service';
import { MOCK_ENV } from '../../shared';
import { BusinessLevelService } from '../business-level';
import { ErpService } from '../erp';
import { OrganizationService } from '../organization';
import { EntityService } from '../entity';
import {
  BusinessHierarchyBusinessLevel,
  BusinessHierarchyCount,
  BusinessHierarchyList,
  BusinessLevelMappedList,
  EntityFullList,
  EntityList,
  EntityMapped,
  Erp,
  IBusinessHierarchyNavData,
  Organization,
} from '../models';
import { BusHierCountService } from './bus-hier-count';
import { BusHierController } from './bus-hier.controller';
import { BusHierService } from './bus-hier.service';

const query = {
  orgId: 'org1',
  erpId: 'erp1',
};

const bhNavData: IBusinessHierarchyNavData = {
  navData: {
    organization: {
      count: 1,
      id: 'org1',
      name: 'org1',
      code: 'org1',
      isActive: true,
    },
    erp: {
      count: 1,
      id: 'erp1',
      name: 'erp1',
      code: 'erp1',
      isActive: true,
    },
    businessLevel: {
      depth: 2,
      businessLevels: [
        {
          level: 1,
          id: 'bl1',
          count: 1,
          name: {
            singular: 'bl',
            plural: 'bls',
          },
          selectedEntity: null,
        },
        {
          level: 2,
          id: 'bl2',
          count: 1,
          name: {
            singular: 'bl2',
            plural: 'bl2s',
          },
          selectedEntity: {
            name: 'se2',
            id: 'se2',
            code: 'se2',
            isActive: true,
            parentEntityId: null,
          },
        },
      ],
    },
  },
  entityData: {
    currentSelectedEntity: {
      entityName: 'se2',
      entityCode: 'se2',
      entityId: 'se2',
      erpId: 'erp1',
      parentEntityId: 'se1',
      businessLevel: 2,
      isActive: true,
      entityAddresses: [],
    },
    numberOfCurrentSelectedEntityChildLevels: 0,
  },
};

describe('BusHierService', () => {
  let service: BusHierService;
  let orgService: OrganizationService;
  let erpService: ErpService;
  let countService: BusHierCountService;
  let entityService: EntityService;
  let busLevService: BusinessLevelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [BusHierController],
      providers: [
        BusHierService,
        BusinessLevelService,
        BusHierCountService,
        EntityService,
        ErpService,
        OrganizationService,
        HttpConfigService,
        ConfigService,
        { provide: MOCK_ENV, useValue: true },
      ],
    }).compile();

    service = module.get<BusHierService>(BusHierService);
    orgService = module.get<OrganizationService>(OrganizationService);
    erpService = module.get<ErpService>(ErpService);
    countService = module.get<BusHierCountService>(BusHierCountService);
    entityService = module.get<EntityService>(EntityService);
    busLevService = module.get<BusinessLevelService>(BusinessLevelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBusHierList', () => {
    const orgList = {
      itemsRequested: 1,
      itemsReturned: 1,
      itemsTotal: 1,
      offset: 0,
      items: [
        {
          organizationId: 'org123',
          organizationName: 'orgABC',
          organizationCode: 'orgCode',
          isActive: true,
        },
      ],
    };

    const erpList = {
      itemsRequested: 1,
      itemsReturned: 1,
      itemsTotal: 1,
      offset: 0,
      items: [
        {
          organizationId: 'org123',
          erpId: 'erp123',
          erpName: 'erp1',
          erpCode: 'erpCode',
          isActive: true,
        },
      ],
    };

    const orgErpList: BusinessHierarchyList = {
      organizations: [
        {
          ...orgList.items[0],
          erps: ['erp123'],
        },
      ],
      erps: [erpList.items[0]],
    };

    it('should return a BusinessHierarchyList', () => {
      jest.spyOn(orgService, 'getOrganizations').mockReturnValue(of(orgList));
      jest.spyOn(erpService, 'getErps').mockReturnValue(of(erpList));

      const expected = cold('(a|)', { a: orgErpList });
      expect(service.getBusHierList({ foo: 'bar' }, { entityId: '123' })).toBeObservable(expected);
    });
  });

  describe('getBusHierNav', () => {
    it('should return BusinessHierarchyNav', () => {
      service['getBusHierNavData'] = jest.fn(() => of(bhNavData));
      const expected = cold('(a|)', { a: bhNavData.navData });
      expect(service.getBusHierNav({}, query)).toBeObservable(expected);
    });

    it('should return BusinessHierarchyNav with child and parent data when given an entityId', () => {
      const queryWithEntity = {
        ...query,
        entityId: 'se2',
      };

      service['getBusHierNavData'] = jest.fn(() => of(bhNavData));

      service['getBusHierNavEntityParentData'] = jest.fn(() =>
        of([
          {
            entityName: 'se1',
            entityCode: 'se1',
            entityId: 'se1',
            erpId: 'erp1',
            parentEntityId: null,
            businessLevel: 1,
            isActive: true,
            entityAddresses: [],
          },
          {
            entityName: 'se2',
            entityCode: 'se2',
            entityId: 'se2',
            erpId: 'erp1',
            parentEntityId: 'se1',
            businessLevel: 2,
            isActive: true,
            entityAddresses: [],
          },
        ])
      );

      service['getBusHierNavChildLevelCount'] = jest.fn(() =>
        of([
          { businessLevel: 1, count: 1 },
          { businessLevel: 2, count: 1 },
        ])
      );
      const expected = cold('(a|)', { a: bhNavData.navData });
      expect(service.getBusHierNav({}, queryWithEntity)).toBeObservable(expected);
    });
  });

  describe('getBusinessHierarchyNavData', () => {
    const count: BusinessHierarchyCount = {
      numberOfOrganizations: 1,
      numberOfErps: 1,
      maximumDepthOfBusinessLevels: 2,
      numberOfEntitiesByBusinessLevel: [
        {
          businessLevel: 1,
          numberOfEntities: 1,
        },
        {
          businessLevel: 2,
          numberOfEntities: 1,
        },
      ],
    };

    const organization: Organization = {
      organizationId: 'org1',
      organizationName: 'org1',
      organizationCode: 'org1',
      organizationAddresses: [],
      isActive: true,
      createdTimestamp: '01-01-2525',
      createdByUserId: '01-01-2525',
      lastModifiedTimestamp: '01-01-2525',
      lastModifiedByUserId: '01-01-2525',
    };

    const erp: Erp = {
      organizationId: 'org1',
      erpId: 'erp1',
      erpName: 'erp1',
      erpCode: 'erp1',
      companyDatabaseName: 'cdb1',
      companyDatabaseId: 1,
      isCrossCompanyCodingAllowed: true,
      isActive: true,
      purchaseOrderPrefix: 'po',
      startingPurchaseOrderNumber: 1,
      createdTimestamp: '01-01-2525',
      createdByUserId: '01-01-2525',
      lastModifiedTimestamp: '01-01-2525',
      lastModifiedByUserId: '01-01-2525',
    };

    const busLevList: BusinessLevelMappedList = {
      itemsRequested: 2,
      itemsReturned: 2,
      itemsTotal: 2,
      offset: 0,
      items: [
        {
          businessLevelId: 'bl1',
          erpId: 'erp1',
          businessLevelNameSingular: 'bl',
          businessLevelNamePlural: 'bls',
          level: 1,
          isActive: true,
        },
        {
          businessLevelId: 'bl2',
          erpId: 'erp1',
          businessLevelNameSingular: 'bl2',
          businessLevelNamePlural: 'bl2s',
          level: 2,
          isActive: true,
        },
      ],
    };

    const entityList: EntityList = {
      itemsRequested: 1,
      itemsReturned: 1,
      itemsTotal: 1,
      offset: 0,
      items: [
        {
          entityName: 'se2',
          entityCode: 'se2',
          entityId: 'se2',
          erpId: 'erp1',
          parentEntityId: 'se1',
          businessLevel: 2,
          isActive: true,
          entityAddresses: [],
        },
      ],
    };

    const bhNavDataWithOutSelectedEntities: IBusinessHierarchyNavData = {
      navData: {
        ...bhNavData.navData,
        businessLevel: {
          ...bhNavData.navData.businessLevel,
          businessLevels: bhNavData.navData.businessLevel.businessLevels.map(
            (bl: BusinessHierarchyBusinessLevel) => ({
              ...bl,
              selectedEntity: null,
            })
          ),
        },
      },
      entityData: {
        ...bhNavData.entityData,
      },
    };

    it('should return an observable of IBusinessHierarchyNavData', () => {
      jest.spyOn(countService, 'getBusinessHierarchyCount').mockReturnValue(of(count));
      jest.spyOn(orgService, 'getOrganizationById').mockReturnValue(of(organization));
      jest.spyOn(erpService, 'getErpById').mockReturnValue(of(erp));
      jest.spyOn(busLevService, 'getBusinessLevelsByErpId').mockReturnValue(of(busLevList));
      jest.spyOn(entityService, 'getAllChildEntities').mockReturnValue(of(entityList));

      const expected = cold('(a|)', { a: bhNavDataWithOutSelectedEntities });
      expect(service['getBusHierNavData']('org1', 'erp1', 'se2', {}, {})).toBeObservable(expected);
    });
  });

  describe('getBusHierarchyChildLevelCount', () => {
    it('should return an empty array if `numChildLevels` is falsy', () => {
      const expected = cold('(a|)', { a: [] });
      expect(service['getBusHierNavChildLevelCount']('erp1', 'ent1', 0, {}, {})).toBeObservable(
        expected
      );
    });

    it('should return an observable containing a list of the counts per child business level', () => {
      const entityFullList: EntityFullList = {
        itemsRequested: 1,
        itemsReturned: 1,
        itemsTotal: 1,
        offset: 0,
        items: [
          {
            entityName: 'ent1',
            entityCode: 'ent1',
            entityId: 'ent1',
            erpId: 'erp1',
            parentEntityId: null,
            businessLevel: 1,
            entityAddresses: [],
            isActive: true,
            createdTimestamp: '01-01-2525',
            createdByUserId: '01-01-2525',
            lastModifiedTimestamp: '01-01-2525',
            lastModifiedByUserId: '01-01-2525',
          },
        ],
      };
      jest.spyOn(entityService, 'getChildEntitiesByChildLevel').mockReturnValue(of(entityFullList));
      const expected = cold('(a|)', { a: [{ businessLevel: 1, count: 1 }] });

      expect(service['getBusHierNavChildLevelCount']('erp1', 'ent1', 1, {}, {})).toBeObservable(
        expected
      );
    });
  });

  describe('getBusHierNavEntityParentData', () => {
    const ent1: EntityMapped = {
      entityName: 'ent1',
      entityCode: 'ent1',
      entityId: 'ent1',
      erpId: 'erp1',
      parentEntityId: null,
      businessLevel: 1,
      isActive: true,
      entityAddresses: [],
    };

    const ent2: EntityMapped = {
      entityName: 'ent2',
      entityCode: 'ent2',
      entityId: 'ent2',
      erpId: 'erp1',
      parentEntityId: 'ent1',
      businessLevel: 2,
      isActive: true,
      entityAddresses: [],
    };

    it('should return the parent data for the given entity', () => {
      jest
        .spyOn(entityService, 'getEntityByEntityId')
        .mockReturnValueOnce(of(ent2))
        .mockReturnValueOnce(of(ent1));

      const expected = cold('(a|)', { a: [ent2, ent1] });

      expect(service['getBusHierNavEntityParentData']('ent2', {}, {})).toBeObservable(expected);
    });
  });
});
