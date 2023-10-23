import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';

import { ConfigService } from '@ui-coe/shared/util/services';
import {
  ICreateTenant,
  IGetTenant,
  IGetTenantParams,
  ITenant,
  ITenantMapped,
  IUpdateTenant,
} from '@ui-coe/tenant/shared/types';
import { TenantService } from './tenant.service';

describe('TenantService', () => {
  let service: TenantService;
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
    service = TestBed.inject(TenantService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTenantData', () => {
    it('should return observable of type GetTenantInterface', () => {
      const getReturnData: IGetTenant<ITenantMapped> = {
        itemsRequested: 5,
        items: [
          {
            tenantId: 'syn9jaqeyiu352243ckw',
            siteName: 'Burger Bling',
            createdDate: '2022-11-02T14:43:11Z',
            tenantStatus: 'Active',
          },
        ],
        offset: 5,
        itemsReturned: 5,
        itemsTotal: 10,
      };
      const expected = cold('(a|)', { a: getReturnData });

      jest.spyOn(httpClient, 'get').mockReturnValue(of(getReturnData));
      expect(service.getTenantData()).toBeObservable(expected);
    });

    it('should called httpClient get with params', () => {
      const tenantParams: IGetTenantParams = {
        siteName: 'bar',
        dateCreated: 'baz',
        status: 'maz',
        sortBy: 'asc:tenant_status',
      };

      jest.spyOn(service, 'getTenantData');
      jest.spyOn(httpClient, 'get');

      const paramsMap = new Map([
        ['siteName', ['bar']],
        ['dateCreated', ['baz']],
        ['status', ['maz']],
        ['limit', ['100']],
        ['sortBy', ['asc:tenant_status']],
      ]);

      service.getTenantData(tenantParams);
      expect(httpClient.get).toBeCalledWith('mockURL/tenants', {
        params: { cloneFrom: null, encoder: {}, map: paramsMap, updates: null },
      });
    });
  });

  describe('getTenantById', () => {
    it('should return an observable of type ITenant', () => {
      const id = '7hp0nqlpvwg0dyyehi1m';
      const tenant: ITenant = {
        tenantId: id,
        siteName: 'Burger Bling',
        storageRegion: 'eastus',
        tenantType: 'Buyer',
        tenantStatus: 'Active',
        cmpId: 'c5szq6tsto075wstvi9m',
        customerName: 'Burger King Franchise',
        partnerName: 'Mastercard',
        sourceSystem: 'Swagger-UI',
        createdDate: '2022-09-16T16:00:33Z',
        lastModifiedDate: '2022-09-16T16:00:33Z',
        createdByUserId: 'jg4nh6in638l29wxur4e',
        lastModifiedByUserId: 'fhh9rgm0qhn8pgaq0u28',
      };

      const expected = cold('(a|)', { a: tenant });

      jest.spyOn(httpClient, 'get').mockReturnValue(of(tenant));
      expect(service.getTenantById(id)).toBeObservable(expected);
    });
  });

  describe('postTenantData', () => {
    it('should return observable of type TenantInterface', () => {
      const request: ICreateTenant = {
        siteName: 'bar',
        storageRegion: 'eastus',
        tenantType: 'buyer',
        cmpId: '1',
        ownerType: 'foobarbaz',
        sourceSystem: 'abc',
      };

      const postReturnData: ITenant = {
        tenantId: '7hp0nqlpvwg0dyyehi1m',
        siteName: 'Burger Bling',
        storageRegion: 'eastus',
        tenantType: 'Buyer',
        tenantStatus: 'Active',
        cmpId: 'c5szq6tsto075wstvi9m',
        customerName: 'Burger King Franchise',
        partnerName: 'Mastercard',
        sourceSystem: 'Swagger-UI',
        createdDate: '2022-09-16T16:00:33Z',
        lastModifiedDate: '2022-09-16T16:00:33Z',
        createdByUserId: 'jg4nh6in638l29wxur4e',
        lastModifiedByUserId: 'fhh9rgm0qhn8pgaq0u28',
      };

      const expected = cold('(a|)', { a: postReturnData });
      jest.spyOn(httpClient, 'post').mockReturnValue(of(postReturnData));
      expect(service.postTenantData(request)).toBeObservable(expected);
    });
  });

  describe('updateTenant', () => {
    it('should return an observable of type TenantInterface', () => {
      const id = '7hp0nqlpvwg0dyyehi1m';
      const request: IUpdateTenant = {
        siteName: 'bar',
      };

      const updateReturnData: ITenant = {
        tenantId: id,
        siteName: 'Burger Bling',
        storageRegion: 'eastus',
        tenantType: 'Buyer',
        tenantStatus: 'Active',
        cmpId: 'c5szq6tsto075wstvi9m',
        customerName: 'Burger King Franchise',
        partnerName: 'Mastercard',
        sourceSystem: 'Swagger-UI',
        createdDate: '2022-09-16T16:00:33Z',
        lastModifiedDate: '2022-09-16T16:00:33Z',
        createdByUserId: 'jg4nh6in638l29wxur4e',
        lastModifiedByUserId: 'fhh9rgm0qhn8pgaq0u28',
      };

      const expected = cold('(a|)', { a: updateReturnData });
      jest.spyOn(httpClient, 'put').mockReturnValue(of(updateReturnData));
      expect(service.updateTenant(id, request)).toBeObservable(expected);
    });
  });
});
