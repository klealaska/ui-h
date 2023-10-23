import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';

import { HttpConfigService } from '../../../services/http-config.service';
import { MOCK_ENV } from '../../shared';
import {
  AssignTenantEntitlementDto,
  IListWrapper,
  IProductEntitlementAPI,
  ITenantEntitlementAPI,
  ProductEntitlement,
  ProductEntitlementMapped,
  TenantEntitlementMapped,
} from '../models';
import { ProductEntitlementService } from './product-entitlement.service';
import { HttpException } from '@nestjs/common';
import { IListWrapperAPI } from '@ui-coe/shared/bff/types';
import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';

describe('ProductEntitlementService', () => {
  let service: ProductEntitlementService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [
        ProductEntitlementService,
        HttpConfigService,
        { provide: MOCK_ENV, useValue: true },
      ],
    }).compile();

    service = module.get<ProductEntitlementService>(ProductEntitlementService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProductEntitlements', () => {
    it('should get product entitlements', () => {
      const response: IListWrapperAPI<IProductEntitlementAPI> = {
        items_requested: 10,
        items_returned: 10,
        items_total: 10,
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

      const camelCaseResponse: IListWrapper<ProductEntitlement> = camelCaseObjectKeys(response);
      const mappedResponse: ProductEntitlementMapped[] = camelCaseResponse.items.map(
        (item: ProductEntitlement) => ({
          id: item.id,
          name: item.name,
          status: item.status,
        })
      );
      const expected = cold('(a|)', { a: mappedResponse });
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: response }) as any);

      expect(service.getProductEntitlements({}, {})).toBeObservable(expected);
    });

    it('should catch error when getProductEntitlements returns error', () => {
      const response = cold(
        '#',
        {},
        {
          message: 'foo',
          code: 'ERR_BAD_REQUEST',
          response: { status: 400, statusText: 'bad request', data: 'foobar' },
        }
      );
      const expected = cold(
        '#',
        {},
        new HttpException(
          {
            message: 'foo',
            code: 'ERR_BAD_REQUEST',
            response: { status: 400, statusText: 'bad request', data: 'foobar' },
          },
          400
        )
      );

      jest.spyOn(httpService, 'get').mockReturnValue(response);

      expect(service.getProductEntitlements({}, {})).toBeObservable(expected);
    });
  });

  describe('getProductEntitlementsByTenantId', () => {
    it('should get the product entitlements for a tenant', () => {
      const response: ITenantEntitlementAPI[] = [
        {
          tenant_id: 'string',
          product_entitlement_id: 'string',
          product_entitlement_name: 'string',
          tenant_entitlement_status: 'Active',
          assignment_date: 'string',
          amount: 0,
          assignment_source: 'string',
          source_system: 'string',
          created_date: 'string',
          last_modified_date: 'string',
          created_by_user_id: 'string',
          last_modified_by_user_id: 'string',
        },
      ];

      const camelCaseResponse: TenantEntitlementMapped[] = [
        {
          tenantId: 'string',
          productEntitlementId: 'string',
          productEntitlementName: 'string',
          tenantEntitlementStatus: 'Active',
        },
      ];

      const expected = cold('(a|)', { a: camelCaseResponse });
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: response }) as any);

      expect(service.getProductEntitlementsByTenantId('foo', {})).toBeObservable(expected);
    });

    it('should return empty array if the product entitlements for a tenant is null', () => {
      const response: ITenantEntitlementAPI[] = null;

      const camelCaseResponse: TenantEntitlementMapped[] = [];

      const expected = cold('(a|)', { a: camelCaseResponse });
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: response }) as any);

      expect(service.getProductEntitlementsByTenantId('foo', {})).toBeObservable(expected);
    });

    it('should catch error when getProductEntitlementsByTenantId throws an error', () => {
      const response = cold(
        '#',
        {},
        {
          message: 'foo',
          code: 'ERR_BAD_REQUEST',
          response: { status: 400, statusText: 'bad request', data: 'foobar' },
        }
      );
      const expected = cold(
        '#',
        {},
        new HttpException(
          {
            message: 'foo',
            code: 'ERR_BAD_REQUEST',
            response: { status: 400, statusText: 'bad request', data: 'foobar' },
          },
          400
        )
      );

      jest.spyOn(httpService, 'get').mockReturnValue(response);

      expect(service.getProductEntitlementsByTenantId('id', {})).toBeObservable(expected);
    });
  });

  describe('assignEntitlement', () => {
    const body: AssignTenantEntitlementDto = {
      assignment_date: 'string',
      amount: 0,
      assignment_source: 'string',
      source_system: 'string',
    };

    it('should assign an entitlement to a tenant', () => {
      const response: ITenantEntitlementAPI = {
        tenant_id: 'string',
        product_entitlement_id: 'string',
        product_entitlement_name: 'string',
        tenant_entitlement_status: 'Active',
        assignment_date: 'string',
        amount: 0,
        assignment_source: 'string',
        source_system: 'string',
        created_date: 'string',
        last_modified_date: 'string',
        created_by_user_id: 'string',
        last_modified_by_user_id: 'string',
      };

      const camelCaseResponse: TenantEntitlementMapped = {
        tenantId: 'string',
        productEntitlementId: 'string',
        productEntitlementName: 'string',
        tenantEntitlementStatus: 'Active',
      };

      const expected = cold('(a|)', { a: camelCaseResponse });
      jest.spyOn(httpService, 'post').mockReturnValue(of({ data: response }) as any);

      expect(service.assignEntitlement('123', '456', body, {})).toBeObservable(expected);
    });

    it('should catch error when assignEntitlement throws an error', () => {
      const response = cold(
        '#',
        {},
        {
          message: 'foo',
          code: 'ERR_BAD_REQUEST',
          response: { status: 400, statusText: 'bad request', data: 'foobar' },
        }
      );
      const expected = cold(
        '#',
        {},
        new HttpException(
          {
            message: 'foo',
            code: 'ERR_BAD_REQUEST',
            response: { status: 400, statusText: 'bad request', data: 'foobar' },
          },
          400
        )
      );

      jest.spyOn(httpService, 'post').mockReturnValue(response);

      expect(service.assignEntitlement('id', 'id2', body, {})).toBeObservable(expected);
    });
  });

  describe('activateTenantEntitlement', () => {
    it('should activate the entitlement for the tenant', () => {
      const expected = cold('(a|)', {});

      jest.spyOn(httpService, 'patch').mockReturnValue(of({}) as any);

      expect(service.activateTenantEntitlement('abc', '123', {})).toBeObservable(expected);
    });

    it('should catch error when activateTenantEntitlement throws an error', () => {
      const response = cold(
        '#',
        {},
        {
          message: 'foo',
          code: 'ERR_BAD_REQUEST',
          response: { status: 400, statusText: 'bad request', data: 'foobar' },
        }
      );
      const expected = cold(
        '#',
        {},
        new HttpException(
          {
            message: 'foo',
            code: 'ERR_BAD_REQUEST',
            response: { status: 400, statusText: 'bad request', data: 'foobar' },
          },
          400
        )
      );

      jest.spyOn(httpService, 'patch').mockReturnValue(response);

      expect(service.activateTenantEntitlement('123', '234', {})).toBeObservable(expected);
    });
  });

  describe('deactivateTenantEntitlement', () => {
    it('should deactivate the entitlement for the tenant', () => {
      const expected = cold('(a|)', {});

      jest.spyOn(httpService, 'patch').mockReturnValue(of({}) as any);

      expect(service.deactivateTenantEntitlement('abc', '123', {})).toBeObservable(expected);
    });

    it('should catch error when deactivateTenantEntitlement throws an error', () => {
      const response = cold(
        '#',
        {},
        {
          message: 'foo',
          code: 'ERR_BAD_REQUEST',
          response: { status: 400, statusText: 'bad request', data: 'foobar' },
        }
      );
      const expected = cold(
        '#',
        {},
        new HttpException(
          {
            message: 'foo',
            code: 'ERR_BAD_REQUEST',
            response: { status: 400, statusText: 'bad request', data: 'foobar' },
          },
          400
        )
      );

      jest.spyOn(httpService, 'patch').mockReturnValue(response);

      expect(service.deactivateTenantEntitlement('123', '234', {})).toBeObservable(expected);
    });
  });
});
