import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Pact } from '@pact-foundation/pact';
import { like, regex } from '@pact-foundation/pact/src/dsl/matchers';
import { lastValueFrom } from 'rxjs';

import { IListWrapperAPI } from '@ui-coe/shared/bff/types';
import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';

import { HttpConfigService } from '../../../services/http-config.service';
import { EntityService } from './entity.service';
import {
  EntityFull,
  EntityFullList,
  EntityList,
  IEntityAddress,
  IEntityAddressApi,
  IEntityApi,
  UpdateAddressDto,
  UpdateEntityDTO,
} from '../models';
import { entityMapper } from '../../shared';

const mockProvider = new Pact({
  consumer: 'AvidPay Network',
  provider: 'Entity.Api',
  dir: './pact/entity/',
});

const requestHeaders = {
  'Content-Type': 'application/x.avidxchange.accounting+json;version=1.0.0',
  Accept: 'application/x.avidxchange.accounting+json;version=1.0.0',
  Authorization:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIwMHUxMnR5bWNnMHk3OHJUejFkNyIsInRlbmFudElkIjoiY3Zoa3pqMndjZGZjNGlnZWkwcTIiLCJuYmYiOjE2ODE5MTE4MjYsImV4cCI6MTcxMzQ0NzgyNiwiaWF0IjoxNjgxOTExODI2LCJpc3MiOiJBY2NvdW50aW5nQXV0aFNlcnZlciIsImF1ZCI6IkFjY291bnRpbmcifQ.QNcP0fo0fmIm3UQ85tgpQzz6AHlk621JrCtt_XRHLPY',
  'x-tenant-id': 'cvhkzj2wcdfc4igei0q2',
};

const responseHeaders = {
  'Content-Type': regex({
    generate: 'application/x.avidxchange.accounting+json;charset=utf-8;version=1.0.0',
    matcher:
      'application\\/x\\.avidxchange\\.accounting\\+json;charset=utf-8;version=([0-9]\\.?){3}',
  }),
};

const entityId = 'n8c7d6zdpou3mtyfepmh';
const erpId = 'erpnanoid12345678';

const entityList: IListWrapperAPI<IEntityApi> = {
  items_requested: 0,
  items_returned: 0,
  items_total: 0,
  offset: 0,
  items: [
    {
      entity_name: 'string',
      entity_code: 'string',
      entity_id: erpId,
      erp_id: 'string',
      parent_entity_id: 'string',
      business_level: 0,
      entity_addresses: [
        {
          address_code: 'string',
          address_line1: 'string',
          address_line2: 'string',
          address_line3: 'string',
          address_line4: 'string',
          locality: 'string',
          region: 'string',
          country: 'string',
          postal_code: 'string',
          is_primary: true,
          address_type: 'BillTo',
          address_id: 'string',
          entity_id: 'string',
          is_active: true,
          created_timestamp: '2023-05-05T18:06:24.554Z',
          created_by_user_id: 'string',
          last_modified_timestamp: '2023-05-05T18:06:24.554Z',
          last_modified_by_user_id: 'string',
        },
      ],
      is_active: true,
      created_timestamp: '2023-05-05T18:06:24.554Z',
      created_by_user_id: 'string',
      last_modified_timestamp: '2023-05-05T18:06:24.554Z',
      last_modified_by_user_id: 'string',
    },
  ],
};

describe('Entity Service', () => {
  let service: EntityService;

  beforeAll(async () => await mockProvider.setup());
  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      providers: [
        EntityService,
        HttpConfigService,
        {
          provide: 'MOCK_ENV',
          useValue: false,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'ACCOUNTING_BASE_URL') {
                return mockProvider.mockService.baseUrl;
              }
            }),
          },
        },
      ],
    }).compile();

    service = app.get<EntityService>(EntityService);
  });
  afterEach(() => mockProvider.verify());
  afterAll(() => mockProvider.finalize());

  describe('getEntitiesByErpId', () => {
    it('should return the correct data from GET call', async () => {
      const camelCaseResponse: EntityFullList = camelCaseObjectKeys<
        IListWrapperAPI<IEntityApi>,
        EntityFullList
      >(entityList);

      const mappedResponse: EntityList = {
        ...camelCaseResponse,
        items: camelCaseResponse.items.map((item: EntityFull) => entityMapper(item)),
      };

      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'a list of entities exists',
          params: {},
        }),
        uponReceiving: 'a request to get entities by erpId',
        withRequest: {
          method: 'GET',
          path: `/accounting/entity/erp/${erpId}`,
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(entityList),
        },
      });
      const entities = await lastValueFrom(service.getEntitiesByErpId(erpId, requestHeaders, {}));

      expect(entities).toStrictEqual(mappedResponse);
    });
  });

  describe('getEntityByEntityId', () => {
    const responseBody: IEntityApi = entityList.items[0];

    it('should return the correct data from GET call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'an entity exists',
          params: {},
        }),
        uponReceiving: 'a request to get an entity by entityId',
        withRequest: {
          method: 'GET',
          path: `/accounting/entity/${entityId}`,
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(responseBody),
        },
      });
      const erps = await lastValueFrom(service.getEntityByEntityId(entityId, requestHeaders, {}));
      expect(erps).toStrictEqual(entityMapper(camelCaseObjectKeys(responseBody)));
    });
  });

  describe('getEntitiesByBusinessLevel', () => {
    it('should return the correct data from GET call', async () => {
      const camelCaseResponse: EntityFullList = camelCaseObjectKeys<
        IListWrapperAPI<IEntityApi>,
        EntityFullList
      >(entityList);

      const mappedResponse: EntityList = {
        ...camelCaseResponse,
        items: camelCaseResponse.items.map((item: EntityFull) => entityMapper(item)),
      };

      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'a list of entities exists',
          params: {},
        }),
        uponReceiving: 'a request to get entities by business level',
        withRequest: {
          method: 'GET',
          path: `/accounting/entity/erp/${erpId}/business-level/1`,
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(entityList),
        },
      });
      const erps = await lastValueFrom(
        service.getEntitiesByBusinessLevel(erpId, '1', requestHeaders, {})
      );
      expect(erps).toStrictEqual(mappedResponse);
    });
  });

  describe('getChildEntitiesByChildLevel', () => {
    it('should return the correct data from GET call', async () => {
      const camelCaseResponse: EntityFullList = camelCaseObjectKeys<
        IListWrapperAPI<IEntityApi>,
        EntityFullList
      >(entityList);

      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'a list of entities exists',
          params: {},
        }),
        uponReceiving: 'a request to get entities by child level',
        withRequest: {
          method: 'GET',
          path: `/accounting/entity/${entityId}/erp/${erpId}/child-level/1`,
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(entityList),
        },
      });
      const erps = await lastValueFrom(
        service.getChildEntitiesByChildLevel(entityId, erpId, '1', requestHeaders, {})
      );
      expect(erps).toStrictEqual(camelCaseResponse);
    });
  });

  describe('getAllChildEntities', () => {
    it('should return the correct data from GET call', async () => {
      const camelCaseResponse: EntityFullList = camelCaseObjectKeys<
        IListWrapperAPI<IEntityApi>,
        EntityFullList
      >(entityList);

      const mappedResponse: EntityList = {
        ...camelCaseResponse,
        items: camelCaseResponse.items.map((item: EntityFull) => entityMapper(item)),
      };

      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'a list of entities exists',
          params: {},
        }),
        uponReceiving: 'a request to get all child entities by entityId and erpId',
        withRequest: {
          method: 'GET',
          path: `/accounting/entity/${entityId}/erp/${erpId}/all-children`,
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(entityList),
        },
      });
      const erps = await lastValueFrom(
        service.getAllChildEntities(entityId, erpId, requestHeaders, {})
      );
      expect(erps).toStrictEqual(mappedResponse);
    });
  });

  describe('updateEntity', () => {
    const reqBody: UpdateEntityDTO = {
      entity_name: 'foo7',
    };
    const responseBody: IEntityApi = {
      entity_id: '0ir8yvra65b7ktb4fd51',
      entity_name: 'Entity123',
      erp_id: '9ng7ljo918qvqunwworx',
      entity_code: 'EntityCode123',
      parent_entity_id: null,
      business_level: 1,
      is_active: true,
      entity_addresses: [
        {
          address_code: 'string',
          address_line1: 'string',
          address_line2: 'string',
          address_line3: 'string',
          address_line4: 'string',
          locality: 'string',
          region: 'string',
          country: 'string',
          postal_code: 'string',
          is_primary: true,
          address_type: 'BillTo',
          address_id: 'string',
          entity_id: 'string',
          is_active: true,
          created_timestamp: '2023-05-05T18:06:24.554Z',
          created_by_user_id: 'string',
          last_modified_timestamp: '2023-05-05T18:06:24.554Z',
          last_modified_by_user_id: 'string',
        },
      ],
      created_timestamp: '2023-04-20T22:31:04Z',
      created_by_user_id: '00u12tymcg0y78rTz1d7',
      last_modified_timestamp: '2023-05-18T15:36:02Z',
      last_modified_by_user_id: '00u12tymcg0y78rTz1d7',
    };
    const id = '0ir8yvra65b7ktb4fd51';

    it('should return the correct data from UPDATE call', async () => {
      await mockProvider.addInteraction({
        state: 'an entity object is to be received',
        uponReceiving: 'a request to update an entity',
        withRequest: {
          method: 'PUT',
          path: `/accounting/entity/${id}`,
          body: like(reqBody),
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(responseBody),
        },
      });
      const entity = await lastValueFrom(service.updateEntity(id, requestHeaders, reqBody));
      expect(entity).toStrictEqual(camelCaseObjectKeys(responseBody));
    });
  });

  describe('activateEntity', () => {
    const id = '0ir8yvra65b7ktb4fd51';

    it('should activate an entity with patch call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'a entity exists with id ' + id + ' and is not active',
          params: { entity_id: id, is_active: 'true' },
        }),
        uponReceiving: 'a request to activate an entity',
        withRequest: {
          method: 'PATCH',
          path: `/accounting/entity/${id}/activate`,
        },
        willRespondWith: {
          status: 204,
          headers: responseHeaders,
        },
      });

      const response = await lastValueFrom(service.activateEntity(id, requestHeaders));
      expect(response).toBe('');
    });
  });

  describe('deactivateEntity', () => {
    const id = '0ir8yvra65b7ktb4fd51';

    it('should deactivate an entity with patch call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'a entity exists with id ' + id + ' and is not active',
          params: { entity_id: id, is_active: 'true' },
        }),
        uponReceiving: 'a request to activate an organization',
        withRequest: {
          method: 'PATCH',
          path: `/accounting/entity/${id}/deactivate`,
        },
        willRespondWith: {
          status: 204,
          headers: responseHeaders,
        },
      });

      const response = await lastValueFrom(service.deactivateEntity(id, requestHeaders));
      expect(response).toBe('');
    });
  });

  describe('updateEntityAddress', () => {
    const entityId = '9ng7ljo918qvqunwworx';
    const addressId = '0ir8yvra65b7ktb4fd51';

    const reqBody: UpdateAddressDto = {
      address_code: 'string',
      address_line1: 'string',
      address_line2: 'string',
      address_line3: 'string',
      address_line4: 'string',
      locality: 'string',
      region: 'string',
      country: 'string',
      postal_code: 'string',
      is_primary: true,
      address_type: 'ShipTo',
    };

    const responseBody: IEntityAddressApi = {
      address_id: addressId,
      address_code: 'string',
      address_line1: 'string',
      address_line2: 'string',
      address_line3: 'string',
      address_line4: 'string',
      locality: 'string',
      region: 'string',
      country: 'string',
      postal_code: 'string',
      is_primary: true,
      address_type: 'ShipTo',
      entity_id: entityId,
      is_active: true,
      created_timestamp: '2023-05-05T18:06:24.554Z',
      created_by_user_id: 'string',
      last_modified_timestamp: '2023-05-05T18:06:24.554Z',
      last_modified_by_user_id: 'string',
    };

    it('should return the correct data from UPDATE call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: `an entity with the id: ${entityId} with an address object with id: ${addressId} exists`,
          params: {},
        }),
        uponReceiving: 'a request to update an entity address',
        withRequest: {
          method: 'PUT',
          path: `/accounting/entity/${entityId}/address/${addressId}`,
          body: like(reqBody),
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(responseBody),
        },
      });
      const entity = await lastValueFrom(
        service.updateEntityAddress(entityId, addressId, reqBody, requestHeaders)
      );
      expect(entity).toStrictEqual(camelCaseObjectKeys(responseBody));
    });
  });

  describe('activateEntityAddress', () => {
    const entityId = '9ng7ljo918qvqunwworx';
    const addressId = '0ir8yvra65b7ktb4fd51';

    it('should activate an entity address with patch call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: `an entity with the id: ${entityId} with an address object with id: ${addressId} exists`,
          params: {},
        }),
        uponReceiving: 'a request to activate an entity address',
        withRequest: {
          method: 'PATCH',
          path: `/accounting/entity/${entityId}/address/${addressId}/activate`,
        },
        willRespondWith: {
          status: 204,
          headers: responseHeaders,
        },
      });

      const response = await lastValueFrom(
        service.activateEntityAddress(entityId, addressId, requestHeaders)
      );
      expect(response).toBe('');
    });
  });

  describe('deactivateEntityAddress', () => {
    const entityId = '9ng7ljo918qvqunwworx';
    const addressId = '0ir8yvra65b7ktb4fd51';

    it('should deactivate an entity address with patch call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: `an entity with the id: ${entityId} with an address object with id: ${addressId} exists`,
          params: {},
        }),
        uponReceiving: 'a request to deactivate an entity address',
        withRequest: {
          method: 'PATCH',
          path: `/accounting/entity/${entityId}/address/${addressId}/deactivate`,
        },
        willRespondWith: {
          status: 204,
          headers: responseHeaders,
        },
      });

      const response = await lastValueFrom(
        service.deactivateEntityAddress(entityId, addressId, requestHeaders)
      );
      expect(response).toBe('');
    });
  });
});
