import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';

import { IListWrapperAPI } from '@ui-coe/shared/bff/types';
import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';

import { HttpConfigService } from '../../../services/http-config.service';
import { MOCK_ENV } from '../../shared';
import { IBusinessLevelAPI, ListWrapper, BusinessLevel, BusinessLevelMapped } from '../models';
import { BusinessLevelService } from './business-level.service';
import { BusinessLevelController } from './business-level.controller';

describe('BusinessLevelService', () => {
  let service: BusinessLevelService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      controllers: [BusinessLevelController],
      providers: [BusinessLevelService, HttpConfigService, { provide: MOCK_ENV, useValue: true }],
    }).compile();

    service = module.get<BusinessLevelService>(BusinessLevelService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBusinessLevelByErpId', () => {
    it('should return GetBusinessLevelResponsesInterface data', () => {
      const returnData: IListWrapperAPI<IBusinessLevelAPI> = {
        items_requested: 10,
        items_returned: 10,
        items_total: 20,
        offset: 0,
        items: [
          {
            business_level_id: 'rl8orh2oib03bgviu9k3',
            erp_id: 'hw0g34yt7f3mmd3q7gic',
            business_level_name_singular: 'Company',
            business_level_name_plural: 'Companies',
            level: 1,
            is_active: true,
            created_timestamp: '2023-05-04T15:53:57Z',
            created_by_user_id: '3n9f6k6yx9h300h0bso0',
            last_modified_timestamp: '2023-05-04T15:53:57Z',
            last_modified_by_user_id: 'vtu1rhpjyah8zc6sor3i',
          },
        ],
      };
      const camelCaseResponse: ListWrapper<BusinessLevel> = camelCaseObjectKeys(returnData);
      const items: BusinessLevelMapped[] = camelCaseResponse.items.map((item: BusinessLevel) => ({
        businessLevelId: item.businessLevelId,
        level: item.level,
        erpId: item.erpId,
        businessLevelNamePlural: item.businessLevelNamePlural,
        businessLevelNameSingular: item.businessLevelNameSingular,
        isActive: item.isActive,
      }));

      const expected = cold('(a|)', { a: { ...camelCaseResponse, items } });
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: returnData }) as any);
      expect(service.getBusinessLevelsByErpId('', {}, {})).toBeObservable(expected);
    });

    it('should catch error when getBusinessLevelByErpId returns error', () => {
      const response = cold(
        '(#)',
        {},
        {
          message: 'error',
          code: 'ERR_BAD_REQUEST',
          response: { status: 400, statusText: 'bad request', data: 'foobar' },
        }
      );
      const expected = cold(
        '#',
        {},
        new HttpException(
          {
            message: 'error',
            code: 'ERR_BAD_REQUEST',
            response: { status: 400, statusText: 'bad request', data: 'foobar' },
          },
          400
        )
      );

      httpService.get = jest.fn(() => response);

      expect(service.getBusinessLevelsByErpId('', {}, {})).toBeObservable(expected);
    });
  });

  describe('createBusinessLevel', () => {
    const requestBody = {
      business_level_name_singular: 'Company',
      business_level_name_plural: 'Companies',
      source_system: 'test',
    };

    it('should return IBusinessLevel data', () => {
      const returnData: IBusinessLevelAPI = {
        business_level_id: 'sy0h85fgxkirc8qd8ldb',
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
      const expected = cold('(a|)', { a: camelCaseObjectKeys(returnData) });
      jest.spyOn(httpService, 'post').mockReturnValue(of({ data: returnData }) as any);
      expect(service.createBusinessLevel('', requestBody, {})).toBeObservable(expected);
    });

    it('should catch error when createBusinessLevel returns error', () => {
      const response = cold(
        '(#)',
        {},
        {
          message: 'error',
          code: 'ERR_BAD_REQUEST',
          response: { status: 400, statusText: 'bad request', data: 'foobar' },
        }
      );
      const expected = cold(
        '#',
        {},
        new HttpException(
          {
            message: 'error',
            code: 'ERR_BAD_REQUEST',
          },
          400
        )
      );
      httpService.post = jest.fn(() => response);
      expect(service.createBusinessLevel('', requestBody, {})).toBeObservable(expected);
    });
  });

  describe('getBusinessLevel', () => {
    it('should return IBusinessLevel data', () => {
      const returnData: IBusinessLevelAPI = {
        business_level_id: 'sy0h85fgxkirc8qd8ldb',
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
      const expected = cold('(a|)', { a: camelCaseObjectKeys(returnData) });
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: returnData }) as any);
      expect(service.getBusinessLevel('sy0h85fgxkirc8qd8ldb', {})).toBeObservable(expected);
    });

    it('should catch error when getBusinessLevel returns error', () => {
      const response = cold(
        '(#)',
        {},
        {
          message: 'error',
          code: 'ERR_BAD_REQUEST',
          response: { status: 400, statusText: 'bad request', data: 'foobar' },
        }
      );
      const expected = cold(
        '#',
        {},
        new HttpException(
          {
            message: 'error',
            code: 'ERR_BAD_REQUEST',
            response: { status: 400, statusText: 'bad request', data: 'foobar' },
          },
          400
        )
      );

      httpService.get = jest.fn(() => response);

      expect(service.getBusinessLevel('', {})).toBeObservable(expected);
    });
  });

  describe('updateBusinessLevel', () => {
    it('should update the business level name', () => {
      const returnData: IBusinessLevelAPI = {
        business_level_id: 'sy0h85fgxkirc8qd8ldb',
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
      const expected = cold('(a|)', { a: camelCaseObjectKeys(returnData) });

      jest.spyOn(httpService, 'put').mockReturnValue(of({ data: returnData }) as any);

      expect(
        service.updateBusinessLevel(
          'sy0h85fgxkirc8qd8ldb',
          { business_level_name_singular: 'Company', business_level_name_plural: 'Companies' },
          {}
        )
      ).toBeObservable(expected);
    });

    it('should catch error when updateBusinessLevel returns error', () => {
      const response = cold(
        '(#)',
        {},
        {
          message: 'error',
          code: 'ERR_BAD_REQUEST',
          response: { status: 400, statusText: 'bad request', data: 'foobar' },
        }
      );
      const expected = cold(
        '#',
        {},
        new HttpException(
          {
            message: 'error',
            code: 'ERR_BAD_REQUEST',
            response: { status: 400, statusText: 'bad request', data: 'foobar' },
          },
          400
        )
      );

      httpService.put = jest.fn(() => response);

      expect(
        service.updateBusinessLevel(
          '',
          { business_level_name_singular: '', business_level_name_plural: '' },
          {}
        )
      ).toBeObservable(expected);
    });
  });
});
