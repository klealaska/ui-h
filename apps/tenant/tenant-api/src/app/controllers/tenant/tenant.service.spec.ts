import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';

import { HttpConfigService } from '../../../services/http-config.service';
import { MOCK_ENV, tenantErrorMapper } from '../../shared';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import {
  CreateTenantDto,
  ITenantAPI,
  ITenantMapped,
  ITenant,
  UpdateTenantDto,
  IListWrapper,
} from '../models';
import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';
import { IListWrapperAPI } from '@ui-coe/shared/bff/types';

describe('TenantService', () => {
  let service: TenantService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      controllers: [TenantController],
      providers: [TenantService, HttpConfigService, { provide: MOCK_ENV, useValue: true }],
    }).compile();

    service = module.get<TenantService>(TenantService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTenants', () => {
    it('should return GetTenantResponsesInterface data', () => {
      const returnData: IListWrapperAPI<ITenantAPI> = {
        items_requested: 10,
        items_returned: 10,
        items_total: 20,
        offset: 0,
        items: [
          {
            tenant_id: 'upcd981lg8z84tozng3w',
            site_name: 'ECO-TECH, LLC',
            storage_region: 'eastus',
            tenant_type: 'Sandbox',
            owner_type: 'Buyer',
            tenant_status: 'Active',
            cmp_id: 'ubxpdg0tp2zhnzg6uqk4',
            customer_name: 'DIEDRICHS AND ASSOCIATES',
            partner_name: 'MasterCard',
            source_system: 'AcceptanceTests',
            created_date: '2022-09-06T13:19:25Z',
            last_modified_date: '2022-09-27T14:40:46Z',
            created_by_user_id: '00u12u14clkvl9mwp1d7',
            last_modified_by_user_id: 'rga65bb6c00f3b1wmidn',
          },
        ],
      };
      const camelCaseResponse: IListWrapper<ITenant> = camelCaseObjectKeys(returnData);
      const items: ITenantMapped[] = camelCaseResponse.items.map((item: ITenant) => ({
        tenantId: item.tenantId,
        siteName: item.siteName,
        createdDate: item.createdDate,
        tenantStatus: item.tenantStatus,
      }));

      const expected = cold('(a|)', { a: { ...camelCaseResponse, items } });
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: returnData }) as any);
      expect(service.getTenants({}, {})).toBeObservable(expected);
    });

    it('should catch error when get returns error', () => {
      const error = {
        message: 'foo',
        code: 'ERR_BAD_REQUEST',
        response: {
          status: 400,
          statusText: 'bad request',
          data: 'foobar',
        },
      };

      const parsedError = new HttpException(
        {
          message: 'foo',
          code: 'ERR_BAD_REQUEST',
          status: 400,
          statusText: 'bad request',
          data: 'foobar',
        },
        400
      );
      const response = cold('#', {}, error);
      const expected = cold('#', {}, parsedError);

      httpService.get = jest.fn(() => response);

      expect(service.getTenants({}, {})).toBeObservable(expected);
    });
  });

  describe('getTenantById', () => {
    it('should return ITenant data', () => {
      const returnData: ITenantAPI = {
        tenant_id: 'upcd981lg8z84tozng3w',
        site_name: 'ECO-TECH, LLC',
        storage_region: 'eastus',
        tenant_type: 'Sandbox',
        owner_type: 'Buyer',
        tenant_status: 'Active',
        cmp_id: 'ubxpdg0tp2zhnzg6uqk4',
        customer_name: 'DIEDRICHS AND ASSOCIATES',
        partner_name: 'MasterCard',
        source_system: 'AcceptanceTests',
        created_date: '2022-09-06T13:19:25Z',
        last_modified_date: '2022-09-27T14:40:46Z',
        created_by_user_id: '00u12u14clkvl9mwp1d7',
        last_modified_by_user_id: 'rga65bb6c00f3b1wmidn',
      };
      const expected = cold('(a|)', { a: camelCaseObjectKeys(returnData) });
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: returnData }) as any);
      expect(service.getTenantById('upcd981lg8z84tozng3w', {})).toBeObservable(expected);
    });

    it('should catch error when getTenantById returns error', () => {
      const error = {
        message: 'foo',
        code: 'ERR_BAD_REQUEST',
        response: {
          status: 400,
          statusText: 'bad request',
          data: 'foobar',
        },
      };

      const parsedError = new HttpException(
        {
          message: 'foo',
          code: 'ERR_BAD_REQUEST',
          status: 400,
          statusText: 'bad request',
          data: 'foobar',
        },
        400
      );
      const response = cold('#', {}, error);
      const expected = cold('#', {}, parsedError);

      httpService.get = jest.fn(() => response);

      expect(service.getTenantById('upcd981lg8z84tozng3w', {})).toBeObservable(expected);
    });
  });

  describe('createTenant', () => {
    it('should create a new tenant', () => {
      const request: CreateTenantDto = {
        site_name: 'foo',
        storage_region: 'eastus',
        tenant_type: 'Sandbox',
        owner_type: 'Buyer',
        cmp_id: '1',
        partner_name: 'foobarbaz',
        source_system: 'abc',
      };
      const returnData: ITenantAPI = {
        tenant_id: '1',
        site_name: 'foo',
        storage_region: 'eastus',
        tenant_type: 'Sandbox',
        owner_type: 'Buyer',
        tenant_status: 'Active',
        cmp_id: '1',
        customer_name: 'foo bar',
        partner_name: 'foobarbaz',
        source_system: 'abc',
        created_date: '2022-01-01',
        last_modified_date: '2022-01-01',
        created_by_user_id: 'foo',
        last_modified_by_user_id: 'foo',
      };
      const expected = cold('(a|)', { a: camelCaseObjectKeys(returnData) });
      jest.spyOn(httpService, 'post').mockReturnValue(of({ data: returnData }) as any);
      expect(service.createTenant({}, request)).toBeObservable(expected);
    });

    it('should catch error when post returns error', () => {
      const error = {
        message: 'foo',
        code: 'ERR_BAD_REQUEST',
        response: {
          status: 400,
          statusText: 'bad request',
          data: 'foobar',
        },
      };

      const parsedError = new HttpException(tenantErrorMapper(error), error.response.status);

      const response = cold('#', {}, error);
      const expected = cold('#', {}, parsedError);

      httpService.post = jest.fn(() => response);

      expect(service.createTenant(null, {} as any)).toBeObservable(expected);
    });
  });

  describe('updateTenant', () => {
    it('should update a tenant', () => {
      const returnData: ITenantAPI = {
        tenant_id: '1',
        site_name: 'foo',
        storage_region: 'eastus',
        tenant_type: 'Sandbox',
        owner_type: 'Buyer',
        tenant_status: 'Active',
        cmp_id: '1',
        customer_name: 'foo bar',
        partner_name: 'foobarbaz',
        source_system: 'abc',
        created_date: '2022-01-01',
        last_modified_date: '2022-01-01',
        created_by_user_id: 'foo',
        last_modified_by_user_id: 'foo',
      };
      const request: UpdateTenantDto = {
        site_name: 'foo',
      };
      const expected = cold('(a|)', { a: camelCaseObjectKeys(returnData) });
      jest.spyOn(httpService, 'put').mockReturnValue(of({ data: returnData }) as any);
      expect(service.updateTenant('1234', {}, request)).toBeObservable(expected);
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

      const parsedError = new HttpException(tenantErrorMapper(error), error.response.status);

      const response = cold('#', {}, error);
      const expected = cold('#', {}, parsedError);

      httpService.put = jest.fn(() => response);

      expect(service.updateTenant('1234', {}, {} as any)).toBeObservable(expected);
    });
  });
});
