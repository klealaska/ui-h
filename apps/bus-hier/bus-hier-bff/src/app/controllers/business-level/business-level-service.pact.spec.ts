import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Pact } from '@pact-foundation/pact';
import { like, regex } from '@pact-foundation/pact/src/dsl/matchers';
import { lastValueFrom } from 'rxjs';

import { IListWrapperAPI } from '@ui-coe/shared/bff/types';
import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';

import { HttpConfigService } from '../../../services/http-config.service';
import { BusinessLevelService } from './business-level.service';
import { CreateBusinessLevelDto, IBusinessLevelAPI, UpdateBusinessLevelDto } from '../models';

const mockProvider = new Pact({
  consumer: 'AvidPay Network',
  provider: 'BusinessLevel.Api',
  dir: './pact/business-level/',
});

const requestHeaders = {
  'Content-Type': 'application/x.avidxchange.accounting+json;version=1.0.0',
  Accept: 'application/x.avidxchange.accounting+json;version=1.0.0',
  Authorization:
    'Bearer eyJraWQiOiJEY1prUmxHcHF2TmR0YVN0V0syTzE1VEFYZ0JRVzlwV0o5anp3R3FYODRvIiwiYWxnIjoiUlMyNTYifQ.eyJ1aWQiOiJscjl2MjRpdzY3OWE0MzNtaDU3MCIsImVudGVycHJpc2VJZCI6WyI3cXZtbnc1bmZ1cG1iNmo5Z3A2bSJdfQ==.kHCf3fPM4UfhVoAaOQToZQ6eRB9DA55FVszLEvvfidLGbbUbxVJSOGVqMXvrcfodzNsmtGwKdJqUMPX6RZYh1wF9f57E2ZqGg18D4nzFAhADKYNbipsHF2ioXtcSyY7Le0hob_0COJh5_QXSiEID8lqYgTyThrtF8ltL99xdr2JgclR63nTGkMwF-zsbF8Mb4Bykr7MbuDHtN63AlxVuHjdaWmHola7vgqqHYS0M1IIb2I0S_8DwZHGncFVh_o5JV7Qq4G8qDTn_YiR7FC45QHRB0qitI480Sr_9IganidPmGIY5ZVJJNQRV7ghF5uLXcbkP-0GzYITg57cKOJpYKA',
  'x-tenant-id': 'cvhkzj2wcdfc4igei0q2',
};

const responseHeaders = {
  'Content-Type': regex({
    generate: 'application/x.avidxchange.accounting+json;charset=utf-8;version=1.0.0',
    matcher:
      'application\\/x\\.avidxchange\\.accounting\\+json;charset=utf-8;version=([0-9]\\.?){3}',
  }),
};

describe('BusinessLevel Service', () => {
  let service: BusinessLevelService;

  beforeAll(async () => await mockProvider.setup());
  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      providers: [
        BusinessLevelService,
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

    service = app.get<BusinessLevelService>(BusinessLevelService);
  });
  afterEach(() => mockProvider.verify());
  afterAll(() => mockProvider.finalize());

  describe('getBusinessLevelByErpId', () => {
    const responseBody: IListWrapperAPI<IBusinessLevelAPI> = {
      items_requested: 10,
      items_returned: 10,
      items_total: 20,
      offset: 0,
      items: [],
    };

    const erpId = 'hw0g34yt7f3mmd3q7gic';

    it('should return the correct data from GET BusinessLevelByErpId call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'Get the business levels for an ERP',
          params: {},
        }),
        uponReceiving: 'a request to get business levels for an erp',
        withRequest: {
          method: 'GET',
          path: `/accounting/erp/${erpId}/business-level`,
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(responseBody),
        },
      });
      const businessLevels = await lastValueFrom(
        service.getBusinessLevelsByErpId(erpId, requestHeaders, {})
      );
      expect(businessLevels).toStrictEqual(camelCaseObjectKeys(responseBody));
    });
  });

  describe('createBusinessLevel', () => {
    const erpId = 'hw0g34yt7f3mmd3q7gic';

    const requestBody: CreateBusinessLevelDto = new CreateBusinessLevelDto({
      businessLevelNameSingular: 'Company',
      businessLevelNamePlural: 'Companies',
      sourceSystem: 'test',
    });

    const responseBody: IBusinessLevelAPI = {
      business_level_id: 'sy0h85fgxkirc8qd8ldb',
      erp_id: erpId,
      business_level_name_singular: 'Company',
      business_level_name_plural: 'Companies',
      level: 1,
      is_active: true,
      created_timestamp: '2023-05-04T15:53:57Z',
      created_by_user_id: 'hvxlogl45o1tqc6yqbw9',
      last_modified_timestamp: '2023-05-04T15:53:57Z',
      last_modified_by_user_id: '1gre2daqqgssw8vob9ea',
    };

    it('should return the correct data from POST BusinessLevel call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'Create a business level',
          params: {},
        }),
        uponReceiving: 'a request to create a business level',
        withRequest: {
          method: 'POST',
          path: `/accounting/erp/${erpId}/business-level`,
          headers: requestHeaders,
          body: like(requestBody),
        },
        willRespondWith: {
          status: 201,
          headers: responseHeaders,
          body: like(responseBody),
        },
      });
      const businessLevel = await lastValueFrom(
        service.createBusinessLevel(erpId, requestBody, requestHeaders)
      );
      expect(businessLevel).toStrictEqual(camelCaseObjectKeys(responseBody));
    });
  });

  describe('getBusinessLevel', () => {
    const businessLevelId = 'sy0h85fgxkirc8qd8ldb';

    const responseBody: IBusinessLevelAPI = {
      business_level_id: businessLevelId,
      erp_id: '7ivupiibtdnrc1beczpt',
      business_level_name_singular: 'Company',
      business_level_name_plural: 'Companies',
      level: 1,
      is_active: true,
      created_timestamp: '2023-05-04T15:53:57Z',
      created_by_user_id: 'hvxlogl45o1tqc6yqbw9',
      last_modified_timestamp: '2023-05-04T15:53:57Z',
      last_modified_by_user_id: '1gre2daqqgssw8vob9ea',
    };

    it('should return the correct data from GET BusinessLevel call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify([
          {
            name: 'an erp with a specified id and status exists',
            params: { business_level_id: businessLevelId },
          },
        ]),
        uponReceiving: 'a request to get the business-level',
        withRequest: {
          method: 'GET',
          path: `/accounting/business-level/${businessLevelId}`,
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(responseBody),
        },
      });
      const erps = await lastValueFrom(service.getBusinessLevel(businessLevelId, requestHeaders));
      expect(erps).toStrictEqual(camelCaseObjectKeys(responseBody));
    });
  });

  describe('updateBusinessLevel', () => {
    const businessLevelId = 'sy0h85fgxkirc8qd8ldb';

    const requestBody: UpdateBusinessLevelDto = new UpdateBusinessLevelDto({
      businessLevelNameSingular: 'Company',
      businessLevelNamePlural: 'Companies',
    });

    const responseBody: IBusinessLevelAPI = {
      business_level_id: businessLevelId,
      erp_id: '7ivupiibtdnrc1beczpt',
      business_level_name_singular: 'Company',
      business_level_name_plural: 'Companies',
      level: 1,
      is_active: true,
      created_timestamp: '2023-05-04T15:53:57Z',
      created_by_user_id: 'hvxlogl45o1tqc6yqbw9',
      last_modified_timestamp: '2023-05-04T15:53:57Z',
      last_modified_by_user_id: '1gre2daqqgssw8vob9ea',
    };

    it('should return the updated data from PUT BusinessLevel call', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify([
          {
            name: 'a business level with a specified id',
            params: { business_level_id: businessLevelId },
          },
        ]),
        uponReceiving: 'a request to update the business-level',
        withRequest: {
          method: 'PUT',
          path: `/accounting/business-level/${businessLevelId}`,
          headers: requestHeaders,
          body: requestBody,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(responseBody),
        },
      });
      const erps = await lastValueFrom(
        service.updateBusinessLevel(businessLevelId, requestBody, requestHeaders)
      );
      expect(erps).toStrictEqual(camelCaseObjectKeys(responseBody));
    });
  });
});
