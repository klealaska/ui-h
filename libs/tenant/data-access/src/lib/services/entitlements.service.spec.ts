import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from '@ui-coe/shared/util/services';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';
import {
  IAssignProductEntitlementToTenant,
  IGetProductEntitlementsParams,
  IProductEntitlementMapped,
  ITenantEntitlementMapped,
} from '@ui-coe/tenant/shared/types';

import { EntitlementsService } from './entitlements.service';

describe('EntitlementsService', () => {
  let service: EntitlementsService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'mockURL'),
          },
        },
      ],
    });
    service = TestBed.inject(EntitlementsService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProductEntitlementData', () => {
    it('should return observable of type GetProductEntitlementInterface', () => {
      const id = '7hp0nqlpvwg0dyyehi1m';

      const getReturnData: IProductEntitlementMapped[] = [
        {
          id: id,
          name: 'Purchase Workflow Automation',
          status: 'Active',
        },
      ];
      const expected = cold('(a|)', { a: getReturnData });

      jest.spyOn(httpClient, 'get').mockReturnValue(of(getReturnData));
      expect(service.getEntitlementsData()).toBeObservable(expected);
    });

    it('should called httpClient get with params', () => {
      const productEntitlementsParmas: IGetProductEntitlementsParams = {
        name: 'baz',
        status: 'foo',
        sortBy: 'asc:status',
      };
      jest.spyOn(service, 'getEntitlementsData');
      jest.spyOn(httpClient, 'get');

      const paramsMap = new Map([
        ['name', ['baz']],
        ['status', ['foo']],
        ['sortBy', ['asc:status']],
        ['limit', ['100']],
      ]);

      service.getEntitlementsData(productEntitlementsParmas);
      expect(httpClient.get).toBeCalledWith('mockURL/product-entitlement', {
        params: { cloneFrom: null, encoder: {}, map: paramsMap, updates: null },
      });
    });
  });

  describe('getEntitlementsByTenantId', () => {
    it('should return an observable of type ITenantEntitlementMapped ', () => {
      const id = 'u2foihaa61tql4k6ydii';
      const tenantEntitlements: ITenantEntitlementMapped[] = [
        {
          tenantId: id,
          productEntitlementId: 'u2foihaa61tql4k6ydii',
          productEntitlementName: 'Purchase Workflow Automation',
          tenantEntitlementStatus: 'Active',
        },
      ];

      const expected = cold('(a|)', { a: tenantEntitlements });

      jest.spyOn(httpClient, 'get').mockReturnValue(of(tenantEntitlements));
      expect(service.getEntitlementsByTenantId(id)).toBeObservable(expected);
    });
  });

  describe('assignProductEntitlement', () => {
    it('should return an observable of type ITenantEntitlementMapped', () => {
      const productId = 'iidy6k4lqt16aahiof2u';
      const tenantId = 'u2foihaa61tql4k6ydii';
      const reqBody: IAssignProductEntitlementToTenant = {
        assignmentDate: 'now',
        amount: 0,
        assignmentSource: 'somewhere',
        sourceSystem: 'the matrix',
      };

      const tenantEntitlements: ITenantEntitlementMapped = {
        tenantId: tenantId,
        productEntitlementId: 'u2foihaa61tql4k6ydii',
        productEntitlementName: 'Purchase Workflow Automation',
        tenantEntitlementStatus: 'Active',
      };

      const expected = cold('(a|)', { a: tenantEntitlements });

      jest.spyOn(httpClient, 'post').mockReturnValue(of(tenantEntitlements));
      expect(service.assignProductEntitlement(productId, tenantId, reqBody)).toBeObservable(
        expected
      );
    });
  });
});
