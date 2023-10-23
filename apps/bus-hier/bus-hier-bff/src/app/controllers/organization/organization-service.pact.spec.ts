import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Pact } from '@pact-foundation/pact';
import { like, regex } from '@pact-foundation/pact/src/dsl/matchers';
import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';
import { lastValueFrom } from 'rxjs';
import { HttpConfigService } from '../../../services/http-config.service';
import {
  CreateOrganizationDto,
  IListWrapperAPI,
  IOrganizationAPI,
  OrganizationAddressAPI,
  UpdateAddressDto,
  UpdateOrganizationDto,
} from '../models';
import { OrganizationService } from './organization.service';

const mockProvider = new Pact({
  consumer: 'AvidPay Network',
  provider: 'Organization.Api',
  dir: './pact/orgaization/',
});

const requestHeaders = {
  'Content-Type': 'application/x.avidxchange.accounting+json;version=1.0.0',
  Accept: 'application/x.avidxchange.accounting+json;version=1.0.0',
  Authorization:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIwMHUxMnR5bWNnMHk3OHJUejFkNyIsInRlbmFudElkIjoiY3Zoa3pqMndjZGZjNGlnZWkwcTIiLCJuYmYiOjE2ODE5MTE4MjYsImV4cCI6MTcxMzQ0NzgyNiwiaWF0IjoxNjgxOTExODI2LCJpc3MiOiJBY2NvdW50aW5nQXV0aFNlcnZlciIsImF1ZCI6IkFjY291bnRpbmcifQ.QNcP0fo0fmIm3UQ85tgpQzz6AHlk621JrCtt_XRHLPY',
  'x-tenant-id': '7qvmnw5nfupmb6j9gp6m',
};

const responseHeaders = {
  'Content-Type': regex({
    generate: 'application/x.avidxchange.accounting+json;charset=utf-8;version=1.0.0',
    matcher:
      'application\\/x\\.avidxchange\\.accounting\\+json;charset=utf-8;version=([0-9]\\.?){3}',
  }),
};

describe('Organization Service', () => {
  let service: OrganizationService;

  beforeAll(async () => await mockProvider.setup());
  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      providers: [
        OrganizationService,
        HttpConfigService,
        {
          provide: 'MOCK_ENV',
          useValue: false,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'ACCOUNTING_BASE_URL') return mockProvider.mockService.baseUrl;
            }),
          },
        },
      ],
    }).compile();

    service = app.get<OrganizationService>(OrganizationService);
  });
  afterEach(async () => mockProvider.verify());
  afterAll(async () => mockProvider.finalize());

  describe('createOrganization', () => {
    const reqBody: CreateOrganizationDto = {
      organization_name: 'Stark Industries',
      organization_code: 'SI',
      source_system: 'Swagger-UI',
    };

    const returnData: IOrganizationAPI = {
      organization_id: 'upcd981lg8z84tozng3w',
      organization_name: 'Stark Industries',
      organization_code: 'SI',
      is_active: 'true',
      created_timestamp: '2023-04-28T00:00:00.000Z',
      created_by_user_id: '7nsxqpkecdggnk3i1wqj',
      last_modified_timestamp: '2023-04-28T00:00:00.000Z',
      last_modified_by_user_id: '7nsxqpkecdggnk3i1wqj',
    };

    it('should return the correct data from POST call', async () => {
      await mockProvider.addInteraction({
        state: '[]',
        uponReceiving: 'a request to create an organization',
        withRequest: {
          method: 'POST',
          path: '/accounting/organization',
          headers: requestHeaders,
          body: like(reqBody),
        },
        willRespondWith: {
          status: 201,
          headers: responseHeaders,
          body: like(returnData),
        },
      });

      const response = await lastValueFrom(service.createOrganization(requestHeaders, reqBody));
      expect(response).toStrictEqual(camelCaseObjectKeys(returnData));
    });
  });

  describe('getOrganization', () => {
    const returnData: IListWrapperAPI<IOrganizationAPI> = {
      items_requested: 10,
      items_returned: 10,
      items_total: 10,
      offset: 0,
      items: [],
    };

    it('should return the correct data from GET call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'a list of tenants exists',
          params: {},
        }),
        uponReceiving: 'a request to get organizations',
        withRequest: {
          method: 'GET',
          path: '/accounting/organization',
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(returnData),
        },
      });

      const response = await lastValueFrom(service.getOrganizations(requestHeaders, {}));
      expect(response).toStrictEqual(camelCaseObjectKeys(returnData));
    });
  });

  describe('getOrganizationById', () => {
    const id = 'upcd981lg8z84tozng3w';

    const returnData: IOrganizationAPI = {
      organization_id: 'upcd981lg8z84tozng3w',
      organization_name: 'Stark Industries',
      organization_code: 'SI',
      is_active: 'true',
      created_timestamp: '2023-04-28T00:00:00.000Z',
      created_by_user_id: '7nsxqpkecdggnk3i1wqj',
      last_modified_timestamp: '2023-04-28T00:00:00.000Z',
      last_modified_by_user_id: '7nsxqpkecdggnk3i1wqj',
    };

    it('should return the correct data from getOrganizationById call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'a organization exists with id ' + id + '',
          params: { organization_id: id, is_active: 'true' },
        }),
        uponReceiving: 'a request to get organizations',
        withRequest: {
          method: 'GET',
          path: '/accounting/organization/' + id,
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(returnData),
        },
      });

      const response = await lastValueFrom(service.getOrganizationById(id, requestHeaders));
      expect(response).toStrictEqual(camelCaseObjectKeys(returnData));
    });
  });

  describe('updateOrganization', () => {
    const id = 'upcd981lg8z84tozng3w';

    const reqBody: UpdateOrganizationDto = {
      organization_name: 'New Stark Industries',
    };

    const returnData: IOrganizationAPI = {
      organization_id: 'upcd981lg8z84tozng3w',
      organization_name: 'New Stark Industries',
      organization_code: 'SI',
      is_active: 'true',
      created_timestamp: '2023-04-28T00:00:00.000Z',
      created_by_user_id: '7nsxqpkecdggnk3i1wqj',
      last_modified_timestamp: '2023-04-28T00:00:00.000Z',
      last_modified_by_user_id: '7nsxqpkecdggnk3i1wqj',
    };

    it('should return the correct data from PUT call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'a organization exists with id ' + id + '',
          params: { organization_id: id, is_active: 'true' },
        }),
        uponReceiving: 'a request to update an organization',
        withRequest: {
          method: 'PUT',
          path: '/accounting/organization/' + id,
          headers: requestHeaders,
          body: like(reqBody),
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(returnData),
        },
      });

      const response = await lastValueFrom(service.updateOrganization(id, requestHeaders, reqBody));
      expect(response).toStrictEqual(camelCaseObjectKeys(returnData));
    });
  });

  describe('activateOrganization', () => {
    const id = 'upcd981lg8z84tozng3w';

    it('should return correct data from PATCH call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'an Organiation exists with id ' + id + '',
          params: { erp_id: id },
        }),
        uponReceiving: 'a request to activate an Organization',
        withRequest: {
          method: 'PATCH',
          path: '/accounting/organization/' + id + '/activate',
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 204,
          headers: responseHeaders,
          body: null,
        },
      });
      const response = await lastValueFrom(service.activateOrganization(id, requestHeaders));
      expect(response).toBe('');
    });
  });

  describe('deactivateOrganization', () => {
    const id = 'upcd981lg8z84tozng3w';

    it('should return correct data from PATCH call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'an Organiation exists with id ' + id + '',
          params: { erp_id: id },
        }),
        uponReceiving: 'a request to deactivate an Organization',
        withRequest: {
          method: 'PATCH',
          path: '/accounting/organization/' + id + '/deactivate',
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 204,
          headers: responseHeaders,
          body: null,
        },
      });
      const response = await lastValueFrom(service.deactivateOrganization(id, requestHeaders));
      expect(response).toBe('');
    });
  });

  describe('updateOrganizationAddress', () => {
    it('should return correct data from PUT call', async () => {
      const orgId = 'upcd981lg8z84tozng3w';
      const addressId = 'w3gnzot48z8gl189dcpu';

      const reqBody: UpdateAddressDto = {
        address_code: 'qwerty',
        address_line1: '11 Main St',
        address_line2: 'Suite 100',
        address_line3: '',
        address_line4: '',
        locality: 'New York',
        region: 'NY',
        country: 'US',
        postal_code: '10001',
        is_primary: true,
        address_type: 'ShipTo',
      };

      const returnData: OrganizationAddressAPI = {
        ...reqBody,
        organization_id: orgId,
        address_id: addressId,
        is_active: true,
        created_timestamp: '2023-04-28T00:00:00.000Z',
        created_by_user_id: '7nsxqpkecdggnk3i1wqj',
        last_modified_timestamp: '2023-04-28T00:00:00.000Z',
        last_modified_by_user_id: '7nsxqpkecdggnk3i1wqj',
      };

      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: `an Organiation exists with id ${orgId} and an address exists with id ${addressId}`,
          params: { org_id: orgId, address_id: addressId },
        }),
        uponReceiving: 'a request to update an Organization Address',
        withRequest: {
          method: 'PUT',
          path: `/accounting/organization/${orgId}/address/${addressId}`,
          headers: requestHeaders,
          body: like(reqBody),
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(returnData),
        },
      });

      const response = await lastValueFrom(
        service.updateOrganizationAddress(orgId, addressId, requestHeaders, reqBody)
      );

      expect(response).toStrictEqual(camelCaseObjectKeys(returnData));
    });
  });

  describe('activateOrganizationAddress', () => {
    const orgId = 'upcd981lg8z84tozng3w';
    const addressId = 'w3gnzot48z8gl189dcpu';

    it('should return correct data from PATCH call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: `an Organiation exists with id ${orgId} and an address exists with id ${addressId}`,
          params: { org_id: orgId, address_id: addressId },
        }),
        uponReceiving: 'a request to activate an Organization Address',
        withRequest: {
          method: 'PATCH',
          path: `/accounting/organization/${orgId}/address/${addressId}/activate`,
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 204,
          headers: responseHeaders,
          body: null,
        },
      });

      const response = await lastValueFrom(
        service.activateOrganizationAddress(orgId, addressId, requestHeaders)
      );

      expect(response).toBe('');
    });
  });

  describe('deactivateOrganizationAddress', () => {
    const orgId = 'upcd981lg8z84tozng3w';
    const addressId = 'w3gnzot48z8gl189dcpu';

    it('should return correct data from PATCH call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: `an Organiation exists with id ${orgId} and an address exists with id ${addressId}`,
          params: { org_id: orgId, address_id: addressId },
        }),
        uponReceiving: 'a request to deactivate an Organization Address',
        withRequest: {
          method: 'PATCH',
          path: `/accounting/organization/${orgId}/address/${addressId}/deactivate`,
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 204,
          headers: responseHeaders,
          body: null,
        },
      });

      const response = await lastValueFrom(
        service.deactivateOrganizationAddress(orgId, addressId, requestHeaders)
      );

      expect(response).toBe('');
    });
  });
});
