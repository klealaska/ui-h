import { HttpException } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';

import { IListWrapperAPI } from '@ui-coe/shared/bff/types';
import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';

import { EntityService } from './entity.service';
import {
  EntityFull,
  EntityFullList,
  EntityMapped,
  IEntityAddressApi,
  IEntityApi,
  UpdateAddressDto,
  UpdateEntityDTO,
} from '../models';
import { MOCK_ENV, entityMapper, busHierErrorMapper } from '../../shared';
import { HttpConfigService } from '../../../services/http-config.service';
import entityList from '../../../assets/mock/json/get-all-child-entities-cadlbfshs605o7i35wl3.json';

describe('EntityService', () => {
  let service: EntityService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        EntityService,
        HttpConfigService,
        ConfigService,
        {
          provide: MOCK_ENV,
          useValue: true,
        },
      ],
    }).compile();

    service = module.get<EntityService>(EntityService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEntitiesByErpId', () => {
    it('should get the entities for an Erp Id', () => {
      const response: IListWrapperAPI<IEntityApi> = entityList;

      const camelCaseResponse: EntityFullList = camelCaseObjectKeys<
        IListWrapperAPI<IEntityApi>,
        EntityFullList
      >(response);

      const mappedResponse = {
        ...camelCaseResponse,
        items: camelCaseResponse.items.map(item => entityMapper(item)),
      };

      const expected = cold('(a|)', { a: mappedResponse });
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: response }) as any);

      expect(service.getEntitiesByErpId('foo', {}, {})).toBeObservable(expected);
    });

    it('should catch error when getEntitiesByErpId throws an error', () => {
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

      expect(service.getEntitiesByErpId('id', {}, {})).toBeObservable(expected);
    });
  });

  describe('getEntityByEntityId', () => {
    it('should get the entity for an entity Id', () => {
      const response: IEntityApi = entityList.items[0];

      const mappedResponse: EntityMapped = entityMapper(
        camelCaseObjectKeys<IEntityApi, EntityFull>(response)
      );

      const expected = cold('(a|)', { a: mappedResponse });
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: response }) as any);

      expect(service.getEntityByEntityId('foo', {}, {})).toBeObservable(expected);
    });

    it('should catch error when getEntityByEntityId throws an error', () => {
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

      expect(service.getEntityByEntityId('id', {}, {})).toBeObservable(expected);
    });
  });

  describe('getEntitiesByBusinessLevel', () => {
    it('should get the entities for an Erp Id and business level', () => {
      const response: IListWrapperAPI<IEntityApi> = entityList;

      const camelCaseResponse: EntityFullList = camelCaseObjectKeys<
        IListWrapperAPI<IEntityApi>,
        EntityFullList
      >(response);

      const mappedResponse = {
        ...camelCaseResponse,
        items: camelCaseResponse.items.map(item => entityMapper(item)),
      };

      const expected = cold('(a|)', { a: mappedResponse });
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: response }) as any);

      expect(service.getEntitiesByBusinessLevel('foo', '1', {}, {})).toBeObservable(expected);
    });

    it('should catch error when getEntitiesByBusinessLevel throws an error', () => {
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

      expect(service.getEntitiesByBusinessLevel('id', '1', {}, {})).toBeObservable(expected);
    });
  });

  describe('getChildEntitiesByChildLevel', () => {
    it('should get the child entities for an Erp Id, entity Id and child level', () => {
      const response: IListWrapperAPI<IEntityApi> = entityList;

      const camelCaseResponse: EntityFullList = camelCaseObjectKeys<
        IListWrapperAPI<IEntityApi>,
        EntityFullList
      >(response);

      const expected = cold('(a|)', { a: camelCaseResponse });
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: response }) as any);

      expect(service.getChildEntitiesByChildLevel('foo', 'bar', '1', {}, {})).toBeObservable(
        expected
      );
    });

    it('should catch error when getChildEntitiesByChildLevel throws an error', () => {
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

      expect(service.getChildEntitiesByChildLevel('id', 'erpId', '1', {}, {})).toBeObservable(
        expected
      );
    });
  });

  describe('getAllChildEntities', () => {
    it('should get all child entities for an entity Id and Erp Id', () => {
      const response: IListWrapperAPI<IEntityApi> = entityList;

      const camelCaseResponse: EntityFullList = camelCaseObjectKeys<
        IListWrapperAPI<IEntityApi>,
        EntityFullList
      >(response);

      const mappedResponse = {
        ...camelCaseResponse,
        items: camelCaseResponse.items.map(item => entityMapper(item)),
      };

      const expected = cold('(a|)', { a: mappedResponse });
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: response }) as any);

      expect(service.getAllChildEntities('foo', 'bar', {}, {})).toBeObservable(expected);
    });

    it('should catch error when getAllChildEntities throws an error', () => {
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

      expect(service.getAllChildEntities('id', 'erpId', {}, {})).toBeObservable(expected);
    });
  });
  describe('updateEntity', () => {
    it('should update an entity', () => {
      const returnData: IEntityApi = {
        entity_id: '0ir8yvra65b7ktb4fd51',
        entity_name: 'Entity123',
        erp_id: '9ng7ljo918qvqunwworx',
        entity_code: 'EntityCode123',
        parent_entity_id: null,
        business_level: 1,
        entity_addresses: [],
        is_active: true,
        created_timestamp: '2023-04-20T22:31:04Z',
        created_by_user_id: '00u12tymcg0y78rTz1d7',
        last_modified_timestamp: '2023-05-18T15:36:02Z',
        last_modified_by_user_id: '00u12tymcg0y78rTz1d7',
      };
      const request: UpdateEntityDTO = {
        entity_name: 'foo',
        entity_code: 'bar',
      };
      const expected = cold('(a|)', { a: camelCaseObjectKeys(returnData) });
      jest.spyOn(httpService, 'put').mockReturnValue(of({ data: returnData }) as any);
      expect(service.updateEntity('0ir8yvra65b7ktb4fd51', {}, request)).toBeObservable(expected);
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

      expect(service.updateEntity('1234', {}, {} as any)).toBeObservable(expected);
    });
  });

  describe('activateEntity', () => {
    it('should activate an entity', () => {
      const expected = cold('(a|)', {});

      jest.spyOn(httpService, 'patch').mockReturnValue(of({}) as any);

      expect(service.activateEntity('1234', {})).toBeObservable(expected);
    });

    it('should catch error when activeEntity return an error', () => {
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

      httpService.patch = jest.fn(() => response);

      expect(service.activateEntity('1234', {} as any)).toBeObservable(expected);
    });
  });

  describe('deactivaEntity', () => {
    it('should deactivate an entity', () => {
      const expected = cold('(a|)', {});

      jest.spyOn(httpService, 'patch').mockReturnValue(of({}) as any);

      expect(service.deactivateEntity('1234', {})).toBeObservable(expected);
    });

    it('should catch error when deactivateEntity return an error', () => {
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

      const response = cold('(#|)', {}, error);
      const expected = cold('#', {}, parsedError);

      httpService.patch = jest.fn(() => response);

      expect(service.deactivateEntity('1234', {} as any)).toBeObservable(expected);
    });
  });

  describe('updateEntityAddress', () => {
    it('should update an entity address', () => {
      const addressId = '0ir8yvra65b7ktb4fd51';
      const entityId = '9ng7ljo918qvqunwworx';

      const returnData: IEntityAddressApi = {
        address_id: addressId,
        address_code: 'Entity123',
        entity_id: entityId,
        address_line1: 'bar',
        address_line2: 'baz',
        address_line3: 'qux',
        address_line4: 'qux',
        locality: 'qux',
        region: 'quux',
        country: 'grault',
        postal_code: 'corge',
        is_primary: true,
        address_type: 'ShipTo',
        is_active: true,
        created_timestamp: '2023-04-20T22:31:04Z',
        created_by_user_id: '00u12tymcg0y78rTz1d7',
        last_modified_timestamp: '2023-05-18T15:36:02Z',
        last_modified_by_user_id: '00u12tymcg0y78rTz1d7',
      };

      const request: UpdateAddressDto = {
        address_code: 'Entity123',
        address_line1: 'bar',
        address_line2: 'baz',
        address_line3: 'qux',
        address_line4: '',
        locality: 'qux',
        region: 'quux',
        country: 'grault',
        postal_code: 'corge',
        is_primary: true,
        address_type: 'ShipTo',
      };

      const expected = cold('(a|)', { a: camelCaseObjectKeys(returnData) });
      jest.spyOn(httpService, 'put').mockReturnValue(of({ data: returnData }) as any);

      expect(service.updateEntityAddress(entityId, addressId, request, {})).toBeObservable(
        expected
      );
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

      expect(service.updateEntityAddress('1234', '5678', {} as any, {})).toBeObservable(expected);
    });
  });

  describe('activateEntityAddress', () => {
    it('should activate an entity address', () => {
      const expected = cold('(a|)', {});

      jest.spyOn(httpService, 'patch').mockReturnValue(of({}) as any);

      expect(service.activateEntityAddress('1234', '5678', {})).toBeObservable(expected);
    });

    it('should catch error when activateEntityAddress return an error', () => {
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

      httpService.patch = jest.fn(() => response);

      expect(service.activateEntityAddress('1234', '5678', {} as any)).toBeObservable(expected);
    });
  });

  describe('deactivateEntityAddress', () => {
    it('should deactivate an entity address', () => {
      const expected = cold('(a|)', {});

      jest.spyOn(httpService, 'patch').mockReturnValue(of({}) as any);

      expect(service.deactivateEntityAddress('1234', '5678', {})).toBeObservable(expected);
    });

    it('should catch error when deactivateEntityAddress return an error', () => {
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

      httpService.patch = jest.fn(() => response);

      expect(service.deactivateEntityAddress('1234', '5678', {} as any)).toBeObservable(expected);
    });
  });
});
