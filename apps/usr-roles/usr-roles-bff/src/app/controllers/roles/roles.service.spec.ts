import { HttpException } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { cold } from 'jasmine-marbles';

import { camelCaseObjectKeys } from '@ui-coe/shared/bff/util';

import { HttpConfigService } from '../../../services';
import { UpdateCustomRoleRequestDTO, UserRoleAPI, UserRolesListAPI } from '../../models';
import { MOCK_ENV, userRolesErrorMapper } from '../../shared';
import { RolesService } from './roles.service';

describe('RolesService', () => {
  let service: RolesService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [RolesService, HttpConfigService, { provide: MOCK_ENV, useValue: true }],
    }).compile();

    service = module.get<RolesService>(RolesService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRoles', () => {
    it('should get a list of roles', () => {
      const rolesListResponse: UserRolesListAPI = {
        items_requested: 100,
        items_returned: 1,
        items_total: 1,
        offset: 0,
        items: [
          {
            role_id: 'u1yatai9lgtqxd128qho',
            role_name: 'User Administrator',
            role_description:
              'This role allows an administrator to manage user, roles and role-assignments.',
            role_type: 'Custom',
            actor_role_type: 'External',
            permissions: [
              {
                permission_id: 'v1df1c37h7tp8u5dhzvn',
                permission_name: 'Manage Users',
                permission_description: 'This is a description',
                created_timestamp: '2021-10-03T12:22:13Z',
                created_by_actor_id: 'v1df1c37h7tp8u5dhzvn',
                last_modified_timestamp: '2021-10-06T12:22:13Z',
                last_modified_by_actor_id: 'qntg26kgs81ey5gtd04n',
              },
            ],
            status: 'active',
            created_timestamp: '2021-10-03T12:22:13Z',
            created_by_actor_id: 'v1df1c37h7tp8u5dhzvn',
            last_modified_timestamp: '2021-10-06T12:22:13Z',
            last_modified_by_actor_id: 'qntg26kgs81ey5gtd04n',
          },
        ],
      };

      const response = cold('a', { a: { data: rolesListResponse } });
      jest.spyOn(httpService, 'get').mockReturnValue(response);
      const expected = cold('a', { a: camelCaseObjectKeys(rolesListResponse) });

      expect(service.getRoles({})).toBeObservable(expected);
    });

    it('should catch error when get call fails', () => {
      const error = {
        message: 'foo',
        code: 'ERR_BAD_REQUEST',
        response: {
          status: 400,
          statusText: 'bad request',
          data: 'foobar',
        },
      };

      const parsedError = new HttpException(userRolesErrorMapper(error), error.response.status);

      const response = cold('#', {}, error);
      const expected = cold('#', {}, parsedError);
      jest.spyOn(httpService, 'get').mockReturnValue(response);

      expect(service.getRoles({})).toBeObservable(expected);
    });
  });

  describe('updatCustomRole', () => {
    const requestBody: UpdateCustomRoleRequestDTO = {
      role_name: 'foo role',
      description: 'a clever description of what this role covers',
      permission_ids: ['abc', '123'],
    };

    const roleId = 'u1yatai9lgtqxd128qho';

    const updateCustomRoleResponse: UserRoleAPI = {
      role_id: roleId,
      role_name: 'User Administrator',
      role_description:
        'This role allows an administrator to manage user, roles and role-assignments.',
      role_type: 'Custom',
      actor_role_type: 'External',
      permissions: [
        {
          permission_id: 'v1df1c37h7tp8u5dhzvn',
          permission_name: 'Manage Users',
          permission_description: 'This is a description',
          created_timestamp: '2021-10-03T12:22:13Z',
          created_by_actor_id: 'v1df1c37h7tp8u5dhzvn',
          last_modified_timestamp: '2021-10-06T12:22:13Z',
          last_modified_by_actor_id: 'qntg26kgs81ey5gtd04n',
        },
      ],
      status: 'active',
      created_timestamp: '2021-10-03T12:22:13Z',
      created_by_actor_id: 'v1df1c37h7tp8u5dhzvn',
      last_modified_timestamp: '2021-10-06T12:22:13Z',
      last_modified_by_actor_id: 'qntg26kgs81ey5gtd04n',
    };

    it('should update a custom role', () => {
      const response = cold('a', { a: { data: updateCustomRoleResponse } });
      jest.spyOn(httpService, 'put').mockReturnValue(response);
      const expected = cold('a', { a: camelCaseObjectKeys(updateCustomRoleResponse) });

      expect(service.updateCustomRole(roleId, requestBody, {})).toBeObservable(expected);
    });

    it('should catch error when get call fails', () => {
      const error = {
        message: 'foo',
        code: 'ERR_BAD_REQUEST',
        response: {
          status: 400,
          statusText: 'bad request',
          data: 'foobar',
        },
      };

      const parsedError = new HttpException(userRolesErrorMapper(error), error.response.status);

      const response = cold('#', {}, error);
      const expected = cold('#', {}, parsedError);
      jest.spyOn(httpService, 'put').mockReturnValue(response);

      expect(service.updateCustomRole(roleId, requestBody, {})).toBeObservable(expected);
    });
  });
});
