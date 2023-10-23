import { businessLevelMapper, navEntityMapper, responseObjectMapper } from './bus-hier-nav.mapper';

const businessLevels = [
  {
    businessLevelId: 'jlnnp9e0r1chj3459uae',
    erpId: '9ng7ljo918qvqunwworx',
    businessLevelNameSingular: 'Company',
    businessLevelNamePlural: 'Companies',
    level: 1,
    isActive: true,
  },
  {
    businessLevelId: 'dssnw9tt6f3ou0xqjezy',
    erpId: '9ng7ljo918qvqunwworx',
    businessLevelNameSingular: 'Entity',
    businessLevelNamePlural: 'Entities',
    level: 2,
    isActive: true,
  },
  {
    businessLevelId: 'yzejqx0uo3f6tt9wnssd',
    erpId: '9ng7ljo918qvqunwworx',
    businessLevelNameSingular: 'Region',
    businessLevelNamePlural: 'Regions',
    level: 3,
    isActive: true,
  },
];

const count = {
  numberOfOrganizations: 1,
  numberOfErps: 1,
  maximumDepthOfBusinessLevels: 3,
  numberOfEntitiesByBusinessLevel: [
    {
      businessLevel: 1,
      numberOfEntities: 1,
    },
    {
      businessLevel: 2,
      numberOfEntities: 5,
    },
    {
      businessLevel: 3,
      numberOfEntities: 1,
    },
  ],
};

const org = {
  organizationId: 'hl0azeorqasc81qqckwi',
  organizationName: 'ACME Insurance',
  organizationCode: 'AI-123',
  organizationAddresses: [] as [],
  isActive: true,
  createdTimestamp: '2023-04-20T16:54:33Z',
  createdByUserId: '00u12tymcg0y78rTz1d7',
  lastModifiedTimestamp: '2023-04-20T16:54:33Z',
  lastModifiedByUserId: '00u12tymcg0y78rTz1d7',
};

const erp = {
  organizationId: 'hl0azeorqasc81qqckwi',
  erpId: '9ng7ljo918qvqunwworx',
  erpName: 'ERPNewName',
  erpCode: 'ERPCode123',
  companyDatabaseName: 'Database NA',
  companyDatabaseId: 1337,
  isCrossCompanyCodingAllowed: false,
  isActive: true,
  purchaseOrderPrefix: 'PO-',
  startingPurchaseOrderNumber: 1000,
  createdTimestamp: '2023-04-20T22:29:05Z',
  createdByUserId: '00u12tymcg0y78rTz1d7',
  lastModifiedTimestamp: '2023-05-18T15:20:57Z',
  lastModifiedByUserId: '00u12tymcg0y78rTz1d7',
};

describe('business hierarchy mappers', () => {
  describe('businessLevelMapper', () => {
    const mappedBusinessLevel = [
      {
        count: 1,
        id: 'jlnnp9e0r1chj3459uae',
        level: 1,
        name: { plural: 'Companies', singular: 'Company' },
        selectedEntity: null,
      },
      {
        count: 5,
        id: 'dssnw9tt6f3ou0xqjezy',
        level: 2,
        name: { plural: 'Entities', singular: 'Entity' },
        selectedEntity: null,
      },
      {
        count: 1,
        id: 'yzejqx0uo3f6tt9wnssd',
        level: 3,
        name: { plural: 'Regions', singular: 'Region' },
        selectedEntity: null,
      },
    ];

    it('should return mappedBusinessLevel with count', () => {
      expect(businessLevelMapper(businessLevels, count.numberOfEntitiesByBusinessLevel)).toEqual(
        mappedBusinessLevel
      );
    });

    it('should return mappedBusinessLevel without count', () => {
      const mappedBusinessLevelWithoutCount = mappedBusinessLevel.map(bl => ({
        ...bl,
        count: null,
      }));
      expect(businessLevelMapper(businessLevels, [])).toEqual(mappedBusinessLevelWithoutCount);
    });

    it('should return mappedBusinessLevel without count if no count is passed in', () => {
      const mappedBusinessLevelWithoutCount = mappedBusinessLevel.map(bl => ({
        ...bl,
        count: null,
      }));
      expect(businessLevelMapper(businessLevels)).toEqual(mappedBusinessLevelWithoutCount);
    });
  });

  describe('responseObjectMapper', () => {
    const bhNav = {
      businessLevel: { depth: 3 },
      erp: {
        code: 'ERPCode123',
        count: 1,
        id: '9ng7ljo918qvqunwworx',
        isActive: true,
        name: 'ERPNewName',
      },
      organization: {
        code: 'AI-123',
        count: 1,
        id: 'hl0azeorqasc81qqckwi',
        isActive: true,
        name: 'ACME Insurance',
      },
    };
    it('should return the BusinessHierarchyNav', () => {
      expect(responseObjectMapper({ count, org, erp })).toEqual(bhNav);
    });
  });

  describe('navEntityMapper', () => {
    const entity = {
      entityName: 'Company C',
      entityCode: 'COMPC',
      entityId: 'cadlbfshs605o7i35wl3',
      erpId: '9ng7ljo918qvqunwworx',
      parentEntityId: null,
      businessLevel: 1,
      isActive: true,
      entityAddresses: [],
    };

    const entityMapped = {
      name: 'Company C',
      id: 'cadlbfshs605o7i35wl3',
      code: 'COMPC',
      isActive: true,
      parentEntityId: null,
    };

    it('should return entityMapped', () => {
      expect(navEntityMapper(entity)).toEqual(entityMapped);
    });
  });
});
