import { ProductEntitlementService } from './product-entitlement.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Pact } from '@pact-foundation/pact';
import { like, regex } from '@pact-foundation/pact/src/dsl/matchers';
import { lastValueFrom } from 'rxjs';
import { HttpConfigService } from '../../../services/http-config.service';
import {
  IAssignTenantEntitlementAPI,
  IProductEntitlementAPI,
  ITenantEntitlement,
  ProductEntitlementMapped,
  TenantEntitlementMapped,
} from '../models';
import { IListWrapperAPI } from '@ui-coe/shared/bff/types';
import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';

const mockProvider = new Pact({
  consumer: 'AvidPay Network',
  provider: 'ProductEntitlement.Api',
  dir: './pact/product-entitlements/',
});

const requestHeaders = {
  'Content-Type': 'application/x.avidxchange.productentitlements+json;version=1.0.0',
  Accept: 'application/x.avidxchange.productentitlements+json;version=1.0.0',
  Authorization:
    'Bearer eyJraWQiOiJEY1prUmxHcHF2TmR0YVN0V0syTzE1VEFYZ0JRVzlwV0o5anp3R3FYODRvIiwiYWxnIjoiUlMyNTYifQ.eyJ1aWQiOiJscjl2MjRpdzY3OWE0MzNtaDU3MCIsImVudGVycHJpc2VJZCI6WyI3cXZtbnc1bmZ1cG1iNmo5Z3A2bSJdfQ==.kHCf3fPM4UfhVoAaOQToZQ6eRB9DA55FVszLEvvfidLGbbUbxVJSOGVqMXvrcfodzNsmtGwKdJqUMPX6RZYh1wF9f57E2ZqGg18D4nzFAhADKYNbipsHF2ioXtcSyY7Le0hob_0COJh5_QXSiEID8lqYgTyThrtF8ltL99xdr2JgclR63nTGkMwF-zsbF8Mb4Bykr7MbuDHtN63AlxVuHjdaWmHola7vgqqHYS0M1IIb2I0S_8DwZHGncFVh_o5JV7Qq4G8qDTn_YiR7FC45QHRB0qitI480Sr_9IganidPmGIY5ZVJJNQRV7ghF5uLXcbkP-0GzYITg57cKOJpYKA',
  'x-tenant-id': '7qvmnw5nfupmb6j9gp6m',
};

const responseHeaders = {
  'Content-Type': regex({
    generate: 'application/x.avidxchange.productentitlements+json;charset=utf-8;version=1.0.0',
    // eslint-disable-next-line prettier/prettier
    matcher:
      'application\\/x\\.avidxchange\\.productentitlements\\+json;charset=utf-8;version=([0-9]\\.?){3}',
  }),
};

describe('Product Entitlements Pact', () => {
  let service: ProductEntitlementService;

  beforeAll(async () => await mockProvider.setup());
  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      providers: [
        ProductEntitlementService,
        HttpConfigService,
        {
          provide: 'MOCK_ENV',
          useValue: false,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'TENANT_PRODUCT_ENTITLEMENT_BASE_URL') {
                return mockProvider.mockService.baseUrl;
              }
            }),
          },
        },
      ],
    }).compile();

    service = app.get<ProductEntitlementService>(ProductEntitlementService);
  });

  describe('getEntitlements', () => {
    const responseBody: IListWrapperAPI<IProductEntitlementAPI> = {
      items_requested: 10,
      items_returned: 10,
      items_total: 20,
      offset: 0,
      items: [
        {
          id: 'string',
          name: 'string',
          description: 'string',
          status: 'Active',
          unit_of_measure: 'string',
          source_system: 'string',
        },
      ],
    };

    const mappedResponse: ProductEntitlementMapped[] = [
      { id: 'string', name: 'string', status: 'Active' },
    ];

    it('should return the correct data from GET entitlements call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'a list of product entitlement exists',
          params: {},
        }),
        uponReceiving: 'a request to get entitlements',
        withRequest: {
          method: 'GET',
          path: '/productentitlements',
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(responseBody),
        },
      });

      const entitlements = await lastValueFrom(service.getProductEntitlements(requestHeaders, {}));

      expect(entitlements).toStrictEqual(mappedResponse);
    });
  });

  describe('getEntitlements by Tenant id', () => {
    const id = 'u8urgaytnypskpit13es';
    const responseBody: ITenantEntitlement[] = [
      {
        tenantId: 'u8urgaytnypskpit13es',
        productEntitlementId: 'TFAW8Gis0VDI6D3aDzCK',
        productEntitlementName: 'ACME Inc.',
        tenantEntitlementStatus: 'Active',
        assignmentDate: '',
        amount: 12,
        assignmentSource: '',
        sourceSystem: '',
        createdDate: '',
        lastModifiedDate: '',
        createdByUserId: '',
        lastModifiedByUserId: '',
      },
    ];

    const mappedResponse: TenantEntitlementMapped[] = [
      {
        tenantId: 'u8urgaytnypskpit13es',
        productEntitlementId: 'TFAW8Gis0VDI6D3aDzCK',
        productEntitlementName: 'ACME Inc.',
        tenantEntitlementStatus: 'Active',
      },
    ];

    it('should return the correct data from GET entitlements by tenant id call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify([
          {
            name: 'a list of product entitlement by tenant id',
            params: { tenant_id: 'u8urgaytnypskpit13es' },
          },
        ]),
        uponReceiving: 'a request to get product entitlements by tenant id',
        withRequest: {
          method: 'GET',
          path: '/productentitlements/tenants/u8urgaytnypskpit13es',
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(responseBody),
        },
      });
      const entitlements = await lastValueFrom(
        service.getProductEntitlementsByTenantId(id, requestHeaders)
      );
      expect(entitlements).toStrictEqual(mappedResponse);
    });
  });

  describe('assign product entitlement to tenant', () => {
    const tenantId = 'u8urgaytnypskpit13es';
    const entitlementId = 'TFAW8Gis0VDI6D3aDzCK';
    const reqBody: IAssignTenantEntitlementAPI = {
      assignment_date: '',
      amount: 123,
      assignment_source: '',
      source_system: '',
    };

    const responseBody: ITenantEntitlement = {
      tenantId: 'u8urgaytnypskpit13es',
      productEntitlementId: 'TFAW8Gis0VDI6D3aDzCK',
      productEntitlementName: 'ACME Inc.',
      tenantEntitlementStatus: 'Active',
      assignmentDate: '',
      amount: 12,
      assignmentSource: '',
      sourceSystem: '',
      createdDate: '',
      lastModifiedDate: '',
      createdByUserId: '',
      lastModifiedByUserId: '',
    };

    const mappedResponseBody: TenantEntitlementMapped = {
      tenantId: 'u8urgaytnypskpit13es',
      productEntitlementId: 'TFAW8Gis0VDI6D3aDzCK',
      productEntitlementName: 'ACME Inc.',
      tenantEntitlementStatus: 'Active',
    };

    it('should return the correct data from POST call', async () => {
      await mockProvider.addInteraction({
        state: '[]',
        uponReceiving: 'a request to assign entitlement to a tenant',
        withRequest: {
          method: 'POST',
          path: `/productentitlements/${entitlementId}/tenants/${tenantId}`,
          body: like(reqBody),
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 201,
          headers: responseHeaders,
          body: like(responseBody),
        },
      });

      const entitlement = await lastValueFrom(
        service.assignEntitlement(entitlementId, tenantId, reqBody, requestHeaders)
      );
      expect(entitlement).toStrictEqual(camelCaseObjectKeys(mappedResponseBody));
    });
  });

  describe('activateTenantEntitlement', () => {
    const id = 'upcd981lg8z84tozng3w';

    it('should return correct data from PATCH call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'an ERP exists with id ' + id + '',
          params: { erp_id: id },
        }),
        uponReceiving: 'a request to activate an ERP',
        withRequest: {
          method: 'PATCH',
          path: `/productentitlements/${id}/tenants/${id}/activate`,
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 204,
          headers: responseHeaders,
          body: null,
        },
      });
      const response = await lastValueFrom(
        service.activateTenantEntitlement(id, id, requestHeaders)
      );
      expect(response).toBe('');
    });
  });

  describe('deactivateTenantEntitlement', () => {
    const id = 'upcd981lg8z84tozng3w';

    it('should return correct data from PATCH call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'an ERP exists with id ' + id + '',
          params: { erp_id: id },
        }),
        uponReceiving: 'a request to deactivate an ERP',
        withRequest: {
          method: 'PATCH',
          path: `/productentitlements/${id}/tenants/${id}/deactivate`,
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 204,
          headers: responseHeaders,
          body: null,
        },
      });
      const response = await lastValueFrom(
        service.deactivateTenantEntitlement(id, id, requestHeaders)
      );
      expect(response).toBe('');
    });
  });

  afterEach(() => mockProvider.verify());
  afterAll(() => mockProvider.finalize());
});
