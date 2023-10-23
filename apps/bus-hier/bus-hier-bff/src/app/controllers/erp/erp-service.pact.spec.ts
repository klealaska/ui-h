import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Pact } from '@pact-foundation/pact';
import { like, regex } from '@pact-foundation/pact/src/dsl/matchers';
import { lastValueFrom } from 'rxjs';

import { HttpConfigService } from '../../../services/http-config.service';
import { IErpAPI, UpdateErpDto } from '../models';
import { ErpService } from './erp.service';
import { IListWrapperAPI } from '@ui-coe/shared/bff/types';
import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';

const mockProvider = new Pact({
  consumer: 'AvidPay Network',
  provider: 'Erp.Api',
  dir: './pact/erp/',
});

const requestHeaders = {
  'Content-Type': 'application/x.avidxchange.accounting+json;version=1.0.0',
  Accept: 'application/x.avidxchange.accounting+json;version=1.0.0',
  Authorization:
    'Bearer eyJraWQiOiJEY1prUmxHcHF2TmR0YVN0V0syTzE1VEFYZ0JRVzlwV0o5anp3R3FYODRvIiwiYWxnIjoiUlMyNTYifQ.eyJ1aWQiOiJscjl2MjRpdzY3OWE0MzNtaDU3MCIsImVudGVycHJpc2VJZCI6WyI3cXZtbnc1bmZ1cG1iNmo5Z3A2bSJdfQ==.kHCf3fPM4UfhVoAaOQToZQ6eRB9DA55FVszLEvvfidLGbbUbxVJSOGVqMXvrcfodzNsmtGwKdJqUMPX6RZYh1wF9f57E2ZqGg18D4nzFAhADKYNbipsHF2ioXtcSyY7Le0hob_0COJh5_QXSiEID8lqYgTyThrtF8ltL99xdr2JgclR63nTGkMwF-zsbF8Mb4Bykr7MbuDHtN63AlxVuHjdaWmHola7vgqqHYS0M1IIb2I0S_8DwZHGncFVh_o5JV7Qq4G8qDTn_YiR7FC45QHRB0qitI480Sr_9IganidPmGIY5ZVJJNQRV7ghF5uLXcbkP-0GzYITg57cKOJpYKA',
  'x-tenant-id': '7qvmnw5nfupmb6j9gp6m',
};

const responseHeaders = {
  'Content-Type': regex({
    generate: 'application/x.avidxchange.accounting+json;charset=utf-8;version=1.0.0',
    matcher:
      'application\\/x\\.avidxchange\\.accounting\\+json;charset=utf-8;version=([0-9]\\.?){3}',
  }),
};

describe('Erp Service', () => {
  let service: ErpService;

  beforeAll(async () => await mockProvider.setup());
  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      providers: [
        ErpService,
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

    service = app.get<ErpService>(ErpService);
  });
  afterEach(() => mockProvider.verify());
  afterAll(() => mockProvider.finalize());

  describe('getErps', () => {
    const responseBody: IListWrapperAPI<IErpAPI> = {
      items_requested: 10,
      items_returned: 10,
      items_total: 20,
      offset: 0,
      items: [],
    };

    it('should return the correct data from GET call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'a list of erps exists',
          params: {},
        }),
        uponReceiving: 'a request to get erps',
        withRequest: {
          method: 'GET',
          path: '/accounting/erp/organization/',
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(responseBody),
        },
      });
      const erps = await lastValueFrom(service.getErps('', requestHeaders, {}));
      expect(erps).toStrictEqual(camelCaseObjectKeys(responseBody));
    });
  });

  describe('updateErp', () => {
    const reqBody: UpdateErpDto = {
      erp_name: 'foo10',
    };
    const responseBody: IErpAPI = {
      organization_id: null,
      erp_id: 'erpnanoid12345678',
      erp_name: 'Sage Intacct0',
      erp_code: null,
      company_database_name: null,
      company_database_id: null,
      is_cross_company_coding_allowed: null,
      is_active: 'true',
      purchase_order_prefix: null,
      starting_purchase_order_number: null,
      created_timestamp: '2023-04-12T21:08:17Z',
      created_by_user_id: '7nsxqpkecdggnk3i1wqj',
      last_modified_timestamp: '2023-04-12T21:08:17Z',
      last_modified_by_user_id: 'ktgt8esvnjvstz2oujd3',
    };
    const id = 'erpnanoid12345678';

    it('should return the correct data from UPDATE call', async () => {
      await mockProvider.addInteraction({
        state: 'an erp object is to be received',
        uponReceiving: 'a request to update an erp',
        withRequest: {
          method: 'PUT',
          path: `/accounting/erp/${id}`,
          body: like(reqBody),
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(responseBody),
        },
      });
      const erps = await lastValueFrom(service.updateErp(id, requestHeaders, reqBody));
      expect(erps).toStrictEqual(camelCaseObjectKeys(responseBody));
    });
  });

  describe('getErpById', () => {
    const id = 'erpnanoid12345678';

    const responseBody: IErpAPI = {
      organization_id: null,
      erp_id: 'erpnanoid12345678',
      erp_name: 'Sage Intacct0',
      erp_code: null,
      company_database_name: null,
      company_database_id: null,
      is_cross_company_coding_allowed: null,
      is_active: 'true',
      purchase_order_prefix: null,
      starting_purchase_order_number: null,
      created_timestamp: '2023-04-12T21:08:17Z',
      created_by_user_id: '7nsxqpkecdggnk3i1wqj',
      last_modified_timestamp: '2023-04-12T21:08:17Z',
      last_modified_by_user_id: 'ktgt8esvnjvstz2oujd3',
    };

    it('should return the correct data from GET ErpById call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify([
          {
            name: 'an erp with a specified id and status exists',
            params: { erp_id: id, erp_status: 'Active' },
          },
        ]),
        uponReceiving: 'a request to get an erp',
        withRequest: {
          method: 'GET',
          path: '/accounting/erp/' + id,
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(responseBody),
        },
      });
      const erps = await lastValueFrom(service.getErpById(id, requestHeaders));
      expect(erps).toStrictEqual(camelCaseObjectKeys(responseBody));
    });
  });

  describe('activateErp', () => {
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
          path: '/accounting/erp/' + id + '/activate',
        },
        willRespondWith: {
          status: 204,
          headers: responseHeaders,
          body: {},
        },
      });
      const response = await lastValueFrom(service.activateErp(id, requestHeaders));
      expect(response).toBe('');
    });
  });

  describe('deactivateErp', () => {
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
          path: '/accounting/erp/' + id + '/deactivate',
        },
        willRespondWith: {
          status: 204,
          headers: responseHeaders,
          body: null,
        },
      });
      const response = await lastValueFrom(service.deactivateErp(id, requestHeaders));
      expect(response).toBe('');
    });
  });
});
