import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';

import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';

import { HttpConfigService } from '../../../services/http-config.service';
import { MOCK_ENV } from '../../shared';
import {
  CreateOrganizationDto,
  IListWrapper,
  IListWrapperAPI,
  IOrganizationAPI,
  IOrganizationMapped,
  OrganizationAddressAPI,
  UpdateAddressDto,
  UpdateOrganizationDto,
} from '../models';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { IOrganization } from '../models';

describe('OrganizationService', () => {
  let service: OrganizationService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [OrganizationService, HttpConfigService, { provide: MOCK_ENV, useValue: true }],
      controllers: [OrganizationController],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrganization', () => {
    it('should create a new organization', () => {
      const request: CreateOrganizationDto = {
        source_system: 'Swagger-UI',
        organization_name: 'Stark Industries',
        organization_code: 'SI',
      };

      const returnData: IOrganizationAPI = {
        organization_id: 'upcd981lg8z84tozng3w',
        organization_name: 'Stark Industries',
        organization_code: 'SI',
        is_active: 'true',
        created_timestamp: '2023-04-28T00:00:00.000Z',
        created_by_user_id: '7nsxqpkecdggnk3i1wqj',
        last_modified_timestamp: '2023-04-28T00:00:00.000Z',
        last_modified_by_user_id: '7nsxqpkecdggnk3i1wqj',
      };

      const expected = cold('(a|)', { a: camelCaseObjectKeys(returnData) });
      jest.spyOn(httpService, 'post').mockReturnValue(of({ data: returnData }) as any);
      expect(service.createOrganization({}, request)).toBeObservable(expected);
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

      const parsedError = new HttpException(error, error.response.status);

      const response = cold('(#|)', {}, error);
      const expected = cold('#', {}, parsedError);

      httpService.post = jest.fn(() => response);

      expect(service.createOrganization(null, {} as any)).toBeObservable(expected);
    });
  });

  describe('getOrganizations', () => {
    it('should get all organizations', () => {
      const returnData: IListWrapperAPI<IOrganizationAPI> = {
        items_requested: 10,
        items_returned: 10,
        items_total: 20,
        offset: 0,
        items: [
          {
            organization_id: 'upcd981lg8z84tozng3w',
            organization_name: 'Stark Industries',
            organization_code: 'SI',
            is_active: 'true',
            created_timestamp: '2023-04-28T00:00:00.000Z',
            created_by_user_id: '7nsxqpkecdggnk3i1wqj',
            last_modified_timestamp: '2023-04-28T00:00:00.000Z',
            last_modified_by_user_id: '7nsxqpkecdggnk3i1wqj',
          },
        ],
      };

      const camelCaseResponse: IListWrapper<IOrganization> = camelCaseObjectKeys(returnData);
      const items: IOrganizationMapped[] = camelCaseResponse.items.map((item: IOrganization) => ({
        organizationId: item.organizationId,
        organizationName: item.organizationName,
        organizationCode: item.organizationCode,
        isActive: item.isActive,
      }));

      const expected = cold('(a|)', { a: { ...camelCaseResponse, items } });
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: returnData }) as any);
      expect(service.getOrganizations({}, {} as any)).toBeObservable(expected);
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

      const parsedError = new HttpException(error, error.response.status);

      const response = cold('(#|)', {}, error);
      const expected = cold('#', {}, parsedError);

      httpService.get = jest.fn(() => response);

      expect(service.getOrganizations(null, {} as any)).toBeObservable(expected);
    });
  });

  describe('getOrganizationById', () => {
    it('should return organization data by id', () => {
      const returnData: IOrganizationAPI = {
        organization_id: 'upcd981lg8z84tozng3w',
        organization_name: 'Stark Industries',
        organization_code: 'SI',
        is_active: 'true',
        created_timestamp: '2023-04-28T00:00:00.000Z',
        created_by_user_id: '7nsxqpkecdggnk3i1wqj',
        last_modified_timestamp: '2023-04-28T00:00:00.000Z',
        last_modified_by_user_id: '7nsxqpkecdggnk3i1wqj',
      };
      const expected = cold('(a|)', { a: camelCaseObjectKeys(returnData) });
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: returnData }) as any);
      expect(service.getOrganizationById('upcd981lg8z84tozng3w', {})).toBeObservable(expected);
    });

    it('should catch error when getOrganizationById returns error', () => {
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

      httpService.get = jest.fn(() => response);

      expect(service.getOrganizationById(null, {} as any)).toBeObservable(expected);
    });
  });

  describe('updateOrganization', () => {
    it('should update organization data', () => {
      const returnData: IOrganizationAPI = {
        organization_id: 'upcd981lg8z84tozng3w',
        organization_name: 'Stark Industries',
        organization_code: 'SI',
        is_active: 'true',
        created_timestamp: '2023-04-28T00:00:00.000Z',
        created_by_user_id: '7nsxqpkecdggnk3i1wqj',
        last_modified_timestamp: '2023-04-28T00:00:00.000Z',
        last_modified_by_user_id: '7nsxqpkecdggnk3i1wqj',
      };

      const request: UpdateOrganizationDto = {
        organization_name: 'New Stark Industries',
      };

      const expected = cold('(a|)', { a: camelCaseObjectKeys(returnData) });
      jest.spyOn(httpService, 'put').mockReturnValue(of({ data: returnData }) as any);
      expect(service.updateOrganization('upcd981lg8z84tozng3w', {}, request)).toBeObservable(
        expected
      );
    });

    it('should catch error when updateOrganization returns error', () => {
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

      httpService.put = jest.fn(() => response);

      expect(service.updateOrganization(null, {} as any, {} as any)).toBeObservable(expected);
    });
  });

  describe('deactivateOrganization', () => {
    it('should deactivate organization', () => {
      const expected = cold('(a|)', {});

      jest.spyOn(httpService, 'patch').mockReturnValue(of({}) as any);

      expect(service.deactivateOrganization('123', {})).toBeObservable(expected);
    });

    it('should catch error when deactivateOrganization returns error', () => {
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

      expect(service.deactivateOrganization('111', {} as any)).toBeObservable(expected);
    });
  });

  describe('activateOrganization', () => {
    it('should activate organization', () => {
      const expected = cold('(a|)', {});

      jest.spyOn(httpService, 'patch').mockReturnValue(of({}) as any);
      expect(service.activateOrganization('111', {} as any)).toBeObservable(expected);
    });

    it('should catch error when activateOrganization returns error', () => {
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

      expect(service.activateOrganization('111', {} as any)).toBeObservable(expected);
    });
  });

  describe('updateOrganizationAddress', () => {
    it('should update organization address', () => {
      const request: UpdateAddressDto = {
        address_code: 'qwerty',
        address_line1: '11 Main St',
        address_line2: 'Suite 100',
        address_line3: '',
        address_line4: '',
        locality: 'New York',
        region: 'NY',
        country: 'US',
        postal_code: '10001',
        is_primary: true,
        address_type: 'ShipTo',
      };

      const returnData: OrganizationAddressAPI = {
        ...request,
        organization_id: 'upcd981lg8z84tozng3w',
        address_id: 'upcd981lg8z84tozng3w',
        is_active: true,
        created_timestamp: '2023-04-28T00:00:00.000Z',
        created_by_user_id: '7nsxqpkecdggnk3i1wqj',
        last_modified_timestamp: '2023-04-28T00:00:00.000Z',
        last_modified_by_user_id: '7nsxqpkecdggnk3i1wqj',
      };

      const expected = cold('(a|)', { a: camelCaseObjectKeys(returnData) });
      jest.spyOn(httpService, 'put').mockReturnValue(of({ data: returnData }) as any);

      expect(
        service.updateOrganizationAddress(
          'upcd981lg8z84tozng3w',
          'upcd981lg8z84tozng3w',
          {},
          request
        )
      ).toBeObservable(expected);
    });

    it('should catch error when updateOrganizationAddress returns error', () => {
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

      const response = cold('#', {}, error);
      const expected = cold('#', {}, parsedError);

      httpService.put = jest.fn(() => response);

      expect(service.updateOrganizationAddress(null, null, {} as any, {} as any)).toBeObservable(
        expected
      );
    });
  });

  describe('activateOrganizationAddress', () => {
    it('should activate organization address', () => {
      const expected = cold('(a|)', {});

      jest.spyOn(httpService, 'patch').mockReturnValue(of({}) as any);

      expect(service.activateOrganizationAddress('111', '222', {} as any)).toBeObservable(expected);
    });

    it('should catch error when activateOrganizationAddress returns error', () => {
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

      const response = cold('#', {}, error);
      const expected = cold('#', {}, parsedError);

      httpService.patch = jest.fn(() => response);

      expect(service.activateOrganizationAddress('111', '222', {} as any)).toBeObservable(expected);
    });
  });

  describe('deactivateOrganizationAddress', () => {
    it('should deactivate organization address', () => {
      const expected = cold('(a|)', {});

      jest.spyOn(httpService, 'patch').mockReturnValue(of({}) as any);

      expect(service.deactivateOrganizationAddress('111', '222', {} as any)).toBeObservable(
        expected
      );
    });

    it('should catch error when deactivateOrganizationAddress returns error', () => {
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

      const response = cold('#', {}, error);
      const expected = cold('#', {}, parsedError);

      httpService.patch = jest.fn(() => response);

      expect(service.deactivateOrganizationAddress('111', '222', {} as any)).toBeObservable(
        expected
      );
    });
  });
});
