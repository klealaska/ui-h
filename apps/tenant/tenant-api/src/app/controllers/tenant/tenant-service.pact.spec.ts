import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Pact } from '@pact-foundation/pact';
import { like, regex } from '@pact-foundation/pact/src/dsl/matchers';
import { lastValueFrom } from 'rxjs';

import { HttpConfigService } from '../../../services/http-config.service';
import { CreateTenantDto, ITenantAPI, UpdateTenantDto } from '../models';
import { TenantService } from './tenant.service';
import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';
import { IListWrapperAPI } from '@ui-coe/shared/bff/types';

const mockProvider = new Pact({
  consumer: 'AvidPay Network',
  provider: 'Tenant.Api',
  dir: './pact/tenant/',
});

const requestHeaders = {
  'Content-Type': 'application/x.avidxchange.tenant+json;version=1.0.0',
  Accept: 'application/x.avidxchange.tenant+json;version=1.0.0',
  Authorization:
    'Bearer eyJraWQiOiJEY1prUmxHcHF2TmR0YVN0V0syTzE1VEFYZ0JRVzlwV0o5anp3R3FYODRvIiwiYWxnIjoiUlMyNTYifQ.eyJ1aWQiOiJscjl2MjRpdzY3OWE0MzNtaDU3MCIsImVudGVycHJpc2VJZCI6WyI3cXZtbnc1bmZ1cG1iNmo5Z3A2bSJdfQ==.kHCf3fPM4UfhVoAaOQToZQ6eRB9DA55FVszLEvvfidLGbbUbxVJSOGVqMXvrcfodzNsmtGwKdJqUMPX6RZYh1wF9f57E2ZqGg18D4nzFAhADKYNbipsHF2ioXtcSyY7Le0hob_0COJh5_QXSiEID8lqYgTyThrtF8ltL99xdr2JgclR63nTGkMwF-zsbF8Mb4Bykr7MbuDHtN63AlxVuHjdaWmHola7vgqqHYS0M1IIb2I0S_8DwZHGncFVh_o5JV7Qq4G8qDTn_YiR7FC45QHRB0qitI480Sr_9IganidPmGIY5ZVJJNQRV7ghF5uLXcbkP-0GzYITg57cKOJpYKA',
  'x-tenant-id': '7qvmnw5nfupmb6j9gp6m',
};

const responseHeaders = {
  'Content-Type': regex({
    generate: 'application/x.avidxchange.tenant+json;charset=utf-8;version=1.0.0',
    matcher: 'application\\/x\\.avidxchange\\.tenant\\+json;charset=utf-8;version=([0-9]\\.?){3}',
  }),
};

describe('Tenant Service', () => {
  let service: TenantService;

  beforeAll(async () => await mockProvider.setup());
  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      providers: [
        TenantService,
        HttpConfigService,
        {
          provide: 'MOCK_ENV',
          useValue: false,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'TENANT_BASE_URL') {
                return mockProvider.mockService.baseUrl;
              }
            }),
          },
        },
      ],
    }).compile();

    service = app.get<TenantService>(TenantService);
  });
  afterEach(() => mockProvider.verify());
  afterAll(() => mockProvider.finalize());

  describe('createTenant', () => {
    const reqBody: CreateTenantDto = {
      site_name: 'foo101',
      storage_region: 'eastus',
      tenant_type: 'Sandbox',
      owner_type: 'Buyer',
      cmp_id: 'avidxchange123456789',
      partner_name: '',
      source_system: 'PactTests',
    };

    const responseBody: ITenantAPI = {
      tenant_id: 'pckkszp90pyne181qk6t',
      site_name: 'foo101',
      storage_region: 'eastus',
      tenant_type: 'Sandbox',
      owner_type: 'Buyer',
      tenant_status: 'Active',
      cmp_id: 'avidxchange123456789',
      customer_name: 'On The Rise L.L.C',
      partner_name: null,
      source_system: 'PactTests',
      created_date: '2022-09-29T17:57:42Z',
      last_modified_date: '2022-09-29T17:57:42Z',
      created_by_user_id: 'rga65bb6c00f3b1wmidn',
      last_modified_by_user_id: 'rga65bb6c00f3b1wmidn',
    };

    it('should return the correct data from POST call', async () => {
      await mockProvider.addInteraction({
        state: '[]',
        uponReceiving: 'a request to create a tenant',
        withRequest: {
          method: 'POST',
          path: '/tenants',
          body: like(reqBody),
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 201,
          headers: responseHeaders,
          body: like(responseBody),
        },
      });

      const tenant = await lastValueFrom(service.createTenant(requestHeaders, reqBody));
      expect(tenant).toStrictEqual(camelCaseObjectKeys(responseBody));
    });
  });

  describe('getTenants', () => {
    const responseBody: IListWrapperAPI<ITenantAPI> = {
      items_requested: 10,
      items_returned: 10,
      items_total: 20,
      offset: 0,
      items: [],
    };

    it('should return the correct data from GET call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'a list of tenants exists',
          params: {},
        }),
        uponReceiving: 'a request to get tenants',
        withRequest: {
          method: 'GET',
          path: '/tenants',
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(responseBody),
        },
      });
      const tenants = await lastValueFrom(service.getTenants(requestHeaders, {}));
      expect(tenants).toStrictEqual(camelCaseObjectKeys(responseBody));
    });
  });

  describe('updateTenant', () => {
    const reqBody: UpdateTenantDto = {
      site_name: 'foo10',
    };
    // TODO: update for when Platform returns entire modified object
    const responseBody: ITenantAPI = {
      tenant_id: 'tenantnanoid12345678',
      site_name: 'foo101',
      storage_region: 'eastus',
      tenant_type: 'Sandbox',
      owner_type: 'Buyer',
      tenant_status: 'Active',
      cmp_id: 'avidxchange123456789',
      customer_name: 'On The Rise L.L.C',
      partner_name: null,
      source_system: 'PactTests',
      created_date: '2022-09-29T17:57:42Z',
      last_modified_date: '2022-09-29T17:57:42Z',
      created_by_user_id: 'rga65bb6c00f3b1wmidn',
      last_modified_by_user_id: 'rga65bb6c00f3b1wmidn',
    };
    const id = 'tenantnanoid12345678';

    it('should return the correct data from UPDATE call', async () => {
      await mockProvider.addInteraction({
        state: 'a tenant object is to be received',
        uponReceiving: 'a request to update a tenant',
        withRequest: {
          method: 'PUT',
          path: `/tenants/${id}`,
          body: like(reqBody),
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(responseBody),
        },
      });
      const tenants = await lastValueFrom(service.updateTenant(id, requestHeaders, reqBody));
      expect(tenants).toStrictEqual(camelCaseObjectKeys(responseBody));
    });
  });

  describe('getTenantById', () => {
    const id = 'tenantnanoid12345678';

    const responseBody: ITenantAPI = {
      tenant_id: 'tenantnanoid12345678',
      site_name: 'foo101',
      storage_region: 'eastus',
      tenant_type: 'Sandbox',
      owner_type: 'Buyer',
      tenant_status: 'Active',
      cmp_id: 'avidxchange123456789',
      customer_name: 'On The Rise L.L.C',
      partner_name: null,
      source_system: 'PactTests',
      created_date: '2022-09-29T17:57:42Z',
      last_modified_date: '2022-09-29T17:57:42Z',
      created_by_user_id: 'rga65bb6c00f3b1wmidn',
      last_modified_by_user_id: 'rga65bb6c00f3b1wmidn',
    };

    it('should return the correct data from GET TenantById call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify([
          {
            name: 'a tenant with a specified id and status exists',
            params: { tenant_id: 'tenantnanoid12345678', tenant_status: 'Active' },
          },
        ]),
        uponReceiving: 'a request to get a tenant',
        withRequest: {
          method: 'GET',
          path: '/tenants/tenantnanoid12345678',
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(responseBody),
        },
      });
      const tenants = await lastValueFrom(service.getTenantById(id, requestHeaders));
      expect(tenants).toStrictEqual(camelCaseObjectKeys(responseBody));
    });
  });
});
