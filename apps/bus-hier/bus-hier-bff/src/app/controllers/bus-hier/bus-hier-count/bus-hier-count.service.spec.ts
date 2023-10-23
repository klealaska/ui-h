import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { HttpConfigService } from '../../../../services/http-config.service';
import { busHierErrorMapper, MOCK_ENV } from '../../../shared';
import {
  IBusinessHierarchyCount,
  IBusinessHierarchyCountAPI,
  IEntitiesByBusinessLevel,
} from '../../models';
import { BusHierCountService } from './bus-hier-count.service';

describe('BusHierCountService', () => {
  let service: BusHierCountService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [BusHierCountService, HttpConfigService, { provide: MOCK_ENV, useValue: true }],
    }).compile();

    service = module.get<BusHierCountService>(BusHierCountService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBusinessHierarchyCount', () => {
    it('should get business hierarchy count', () => {
      const returnData: IBusinessHierarchyCountAPI = {
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
            number_of_entities: 0,
          },
        ],
      };

      const camelCaseResponse: IBusinessHierarchyCount = camelCaseObjectKeys(returnData);
      const numberOfEntitiesByBusinessLevel: IEntitiesByBusinessLevel[] =
        camelCaseResponse.numberOfEntitiesByBusinessLevel.map((item: IEntitiesByBusinessLevel) => ({
          businessLevel: item.businessLevel,
          numberOfEntities: item.numberOfEntities,
        }));

      const expected = cold('(a|)', {
        a: { ...camelCaseResponse, numberOfEntitiesByBusinessLevel },
      });
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: returnData }) as any);
      expect(service.getBusinessHierarchyCount({})).toBeObservable(expected);
    });

    it('should throw an error', () => {
      const error = {
        message: 'foo',
        code: 'ERR_BAD_REQUEST',
        response: {
          status: 400,
          statusText: 'bad request',
          data: 'foobar',
        },
      };

      const parsedError = new HttpException(busHierErrorMapper(error), error.response.status);

      const response = cold('#', {}, error);
      const expected = cold('#', {}, parsedError);

      httpService.get = jest.fn(() => response);

      expect(service.getBusinessHierarchyCount({} as any)).toBeObservable(expected);
    });
  });
});
