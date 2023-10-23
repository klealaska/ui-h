import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Pact } from '@pact-foundation/pact';
import { like, regex } from '@pact-foundation/pact/src/dsl/matchers';
import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';
import { lastValueFrom } from 'rxjs';
import { HttpConfigService } from '../../../../services/http-config.service';
import { IBusinessHierarchyCountAPI } from '../../models';
import { BusHierCountService } from './bus-hier-count.service';

const mockProvider = new Pact({
  consumer: 'AvidPay Network',
  provider: 'BusinessHierarchyCount.Api',
  dir: './pact/bus-hier-count/',
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

describe('Business Hierarchy Count Service', () => {
  let service: BusHierCountService;

  beforeAll(async () => await mockProvider.setup());
  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule],
      providers: [
        BusHierCountService,
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

    service = app.get<BusHierCountService>(BusHierCountService);
  });

  afterEach(async () => mockProvider.verify());
  afterAll(async () => mockProvider.finalize());

  describe('getBusinessHierarchyCount', () => {
    const responseBody: IBusinessHierarchyCountAPI = {
      number_of_organizations: 1,
      number_of_erps: 1,
      maximum_depth_of_business_levels: 2,
      number_of_entities_by_business_level: [
        {
          business_level: 1,
          number_of_entities: 1,
        },
        {
          business_level: 2,
          number_of_entities: 1,
        },
      ],
    };

    it('should return business hierarchy count', async () => {
      await mockProvider.addInteraction({
        state: JSON.stringify({
          name: 'business hierarchy count',
          params: {},
        }),
        uponReceiving: 'a request to GET business hierarchy count',
        withRequest: {
          method: 'GET',
          path: '/accounting/business-hierarchy/counts',
          headers: requestHeaders,
        },
        willRespondWith: {
          status: 200,
          headers: responseHeaders,
          body: like(responseBody),
        },
      });

      const response = await lastValueFrom(service.getBusinessHierarchyCount(requestHeaders));
      expect(response).toStrictEqual(camelCaseObjectKeys(responseBody));
    });
  });
});
