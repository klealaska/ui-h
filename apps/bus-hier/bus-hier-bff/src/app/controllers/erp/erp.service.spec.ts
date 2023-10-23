import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';

import { HttpConfigService } from '../../../services/http-config.service';
import { MOCK_ENV, busHierErrorMapper } from '../../shared';
import { ErpController } from './erp.controller';
import { ErpService } from './erp.service';
import { IErpAPI, IErpMapped, IErp, UpdateErpDto, IListWrapper } from '../models';
import { IListWrapperAPI } from '@ui-coe/shared/bff/types';
import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';

describe('ErpService', () => {
  let service: ErpService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      controllers: [ErpController],
      providers: [ErpService, HttpConfigService, { provide: MOCK_ENV, useValue: true }],
    }).compile();

    service = module.get<ErpService>(ErpService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getErps', () => {
    it('should return GetErpResponsesInterface data', () => {
      const returnData: IListWrapperAPI<IErpAPI> = {
        items_requested: 10,
        items_returned: 10,
        items_total: 20,
        offset: 0,
        items: [
          {
            organization_id: null,
            erp_id: 'lzgtdjdyv7es8skxoueo',
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
          },
        ],
      };
      const camelCaseResponse: IListWrapper<IErp> = camelCaseObjectKeys(returnData);
      const items: IErpMapped[] = camelCaseResponse.items.map((item: IErp) => ({
        erpId: item.erpId,
        erpName: item.erpName,
        organizationId: item.organizationId,
        erpCode: item.erpCode,
        isActive: item.isActive,
      }));

      const expected = cold('(a|)', { a: { ...camelCaseResponse, items } });
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: returnData }) as any);
      expect(service.getErps('', {}, {})).toBeObservable(expected);
    });

    it('should catch error when get returns error', () => {
      const response = cold(
        '(#|)',
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

      expect(service.getErps('', {}, {})).toBeObservable(expected);
    });
  });

  describe('getErpById', () => {
    it('should return IErp data', () => {
      const returnData: IErpAPI = {
        organization_id: null,
        erp_id: 'lzgtdjdyv7es8skxoueo',
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
      const expected = cold('(a|)', { a: camelCaseObjectKeys(returnData) });
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: returnData }) as any);
      expect(service.getErpById('lzgtdjdyv7es8skxoueo', {})).toBeObservable(expected);
    });

    it('should catch error when getErpById returns error', () => {
      const response = cold(
        '(#|)',
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

      expect(service.getErpById('', {})).toBeObservable(expected);
    });
  });

  describe('updateErp', () => {
    it('should update an erp', () => {
      const returnData: IErpAPI = {
        organization_id: null,
        erp_id: 'lzgtdjdyv7es8skxoueo',
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
      const request: UpdateErpDto = {
        erp_name: 'foo',
        erp_code: 'bar',
        company_database_name: 'baz',
        company_database_id: 'raz',
      };
      const expected = cold('(a|)', { a: camelCaseObjectKeys(returnData) });
      jest.spyOn(httpService, 'put').mockReturnValue(of({ data: returnData }) as any);
      expect(service.updateErp('lzgtdjdyv7es8skxoueo', {}, request)).toBeObservable(expected);
    });

    it('should catch error when put returns error', () => {
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

      httpService.put = jest.fn(() => response);

      expect(service.updateErp('1234', {}, {} as any)).toBeObservable(expected);
    });
  });

  describe('deactivateErp', () => {
    it('should deactivate Erp', () => {
      const expected = cold('(a|)', {});

      jest.spyOn(httpService, 'patch').mockReturnValue(of({}) as any);

      expect(service.deactivateErp('123', {})).toBeObservable(expected);
    });

    it('should catch error when deactivateErp returns error', () => {
      const error = {
        message: 'foo',
        code: 'ERR_BAD_REQUEST',
        response: {
          status: 400,
          statusText: 'bad request',
          data: 'foobar',
        },
      };

      const parsedError = new HttpException(error, error.response.status);

      const response = cold('(#|)', {}, error);
      const expected = cold('#', {}, parsedError);

      httpService.patch = jest.fn(() => response);

      expect(service.deactivateErp('111', {} as any)).toBeObservable(expected);
    });
  });

  describe('activateErp', () => {
    it('should activate Erp', () => {
      const expected = cold('(a|)', {});

      jest.spyOn(httpService, 'patch').mockReturnValue(of({}) as any);
      expect(service.activateErp('111', {} as any)).toBeObservable(expected);
    });

    it('should catch error when activateErp returns error', () => {
      const error = {
        message: 'foo',
        code: 'ERR_BAD_REQUEST',
        response: {
          status: 400,
          statusText: 'bad request',
          data: 'foobar',
        },
      };

      const parsedError = new HttpException(error, error.response.status);

      const response = cold('(#|)', {}, error);
      const expected = cold('#', {}, parsedError);

      httpService.patch = jest.fn(() => response);

      expect(service.activateErp('111', {} as any)).toBeObservable(expected);
    });
  });
});
