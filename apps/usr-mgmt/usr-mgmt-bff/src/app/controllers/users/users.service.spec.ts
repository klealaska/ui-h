import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { cold } from 'jasmine-marbles';

import { UsersService } from './users.service';
import { HttpConfigService } from '../../../services/http-config.service';
import { MOCK_ENV, userManagementErrorMapper } from '../../shared';
import { UserListResponse, UserListResponseAPI, UserResponse, UserResponseAPI } from '../../models';

describe('UserAccountsService', () => {
  const responseBodyAPI: UserResponseAPI = {
    user_id: 'u1yatai9lgtqxd128qho',
    first_name: 'John',
    last_name: 'Doe',
    full_name: 'John Doe',
    email: 'john.doe@abc.com',
    username: 'john.doe@abc.com',
    user_type: 'External',
    status: 'NotInvited',
    created_timestamp: '2021-10-03T12:22:13Z',
    created_by_actor_id: 'v1df1c37h7tp8u5dhzvn',
    last_modified_timestamp: '2021-10-06T12:22:13Z',
    last_modified_by_actor_id: 'qntg26kgs81ey5gtd04n',
  };

  const responseBody: UserResponse = {
    userId: 'u1yatai9lgtqxd128qho',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    email: 'john.doe@abc.com',
    username: 'john.doe@abc.com',
    userType: 'External',
    status: 'NotInvited',
    createdTimestamp: '2021-10-03T12:22:13Z',
    createdByActorId: 'v1df1c37h7tp8u5dhzvn',
    lastModifiedTimestamp: '2021-10-06T12:22:13Z',
    lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
  };

  let service: UsersService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        UsersService,
        ConfigService,
        HttpConfigService,
        { provide: MOCK_ENV, useValue: true },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    // TODO: update this it string when we know what the enpoints will be
    it('should POST to /user-accounts', () => {
      jest.spyOn(httpService, 'post').mockReturnValue(of({ data: responseBodyAPI }) as any);
      const expected = cold('(a|)', { a: responseBody });

      expect(service.createUser({} as any, {})).toBeObservable(expected);
    });

    it('should catch error when POST fails', () => {
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
        userManagementErrorMapper(error),
        error.response.status
      );

      const response = cold('#', {}, error);
      const expected = cold('#', {}, parsedError);

      jest.spyOn(httpService, 'post').mockReturnValue(response);

      expect(service.createUser({} as any, {})).toBeObservable(expected);
    });
  });

  describe('getUsers', () => {
    it('should GET /users', () => {
      const usersListAPI: UserListResponseAPI = {
        items_requested: 1,
        items_returned: 1,
        items_total: 1,
        offset: 0,
        items: [responseBodyAPI],
      };

      const usersList: UserListResponse = {
        itemsRequested: 1,
        itemsReturned: 1,
        itemsTotal: 1,
        offset: 0,
        items: [responseBody],
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: usersListAPI }) as any);
      const expected = cold('(a|)', { a: usersList });

      expect(service.getUsers({})).toBeObservable(expected);
    });

    it('should catch error when get fails', () => {
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
        userManagementErrorMapper(error),
        error.response.status
      );

      const response = cold('#', {}, error);
      const expected = cold('#', {}, parsedError);

      jest.spyOn(httpService, 'get').mockReturnValue(response);

      expect(service.getUsers({})).toBeObservable(expected);
    });
  });

  describe('getUserById', () => {
    // TODO: update this it string when we know what the enpoints will be
    it('should GET /user-accounts/:userId', () => {
      jest.spyOn(httpService, 'get').mockReturnValue(of({ data: responseBodyAPI }) as any);
      const expected = cold('(a|)', { a: responseBody });

      expect(service.getUserById('123', {})).toBeObservable(expected);
    });

    it('should catch error when GET fails', () => {
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
        userManagementErrorMapper(error),
        error.response.status
      );

      const response = cold('#', {}, error);
      const expected = cold('#', {}, parsedError);

      jest.spyOn(httpService, 'get').mockReturnValue(response);

      expect(service.getUserById('123', {})).toBeObservable(expected);
    });
  });

  describe('updateUserById', () => {
    // TODO: update this it string when we know what the enpoints will be
    it('should PATCH to /user-accounts/:userId', () => {
      jest.spyOn(httpService, 'patch').mockReturnValue(of({ data: responseBodyAPI }) as any);
      const expected = cold('(a|)', { a: responseBody });

      expect(service.updateUserById('123', {}, {})).toBeObservable(expected);
    });

    it('should catch error when PATCH fails', () => {
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
        userManagementErrorMapper(error),
        error.response.status
      );

      const response = cold('#', {}, error);
      const expected = cold('#', {}, parsedError);

      jest.spyOn(httpService, 'patch').mockReturnValue(response);

      expect(service.updateUserById('123', {}, {})).toBeObservable(expected);
    });
  });

  describe('updateUserLifecycleById', () => {
    it('should activate a user', () => {
      const activatedUserResponseAPI = {
        ...UserResponseAPI,
        status: 'Active',
      };

      const activatedUserResponse = {
        ...UserResponse,
        status: 'Active',
      };

      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(of({ data: activatedUserResponseAPI }) as any);
      const expected = cold('(a|)', { a: activatedUserResponse });

      expect(service.updateUserLifecycleById('123', { name: 'Activate' }, {})).toBeObservable(
        expected
      );
    });

    it('should deactivate a user', () => {
      const deactivatedUserResponseAPI = {
        ...UserResponseAPI,
        status: 'Inactive',
      };

      const activatedUserResponse = {
        ...UserResponse,
        status: 'Inactive',
      };

      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(of({ data: deactivatedUserResponseAPI }) as any);
      const expected = cold('(a|)', { a: activatedUserResponse });

      expect(service.updateUserLifecycleById('123', { name: 'Deactivate' }, {})).toBeObservable(
        expected
      );
    });

    it('should expire a users password', () => {
      const expirePasswordUserResponseAPI = {
        ...UserResponseAPI,
        status: 'Active',
      };

      const expirePasswordUserResponse = {
        ...UserResponse,
        status: 'Active',
      };

      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(of({ data: expirePasswordUserResponseAPI }) as any);
      const expected = cold('(a|)', { a: expirePasswordUserResponse });

      expect(service.updateUserLifecycleById('123', { name: 'ExpirePassword' }, {})).toBeObservable(
        expected
      );
    });

    it('should catch error when POST fails', () => {
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
        userManagementErrorMapper(error),
        error.response.status
      );

      const response = cold('#', {}, error);
      const expected = cold('#', {}, parsedError);

      jest.spyOn(httpService, 'post').mockReturnValue(response);

      expect(service.updateUserLifecycleById('123', { name: 'Activate' }, {})).toBeObservable(
        expected
      );
    });
  });

  describe('inviteUserById', () => {
    const inviteResponseAPI = {
      ...responseBodyAPI,
      status: 'Invited',
    };

    const inviteResponseBody = {
      ...responseBody,
      status: 'Invited',
    };

    it('should post to /user/:userId/invitations', () => {
      jest.spyOn(httpService, 'post').mockReturnValue(of({ data: inviteResponseAPI }) as any);
      const expected = cold('(a|)', { a: inviteResponseBody });

      expect(service.inviteUserById('123', {})).toBeObservable(expected);
    });

    it('should catch error when POST fails', () => {
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
        userManagementErrorMapper(error),
        error.response.status
      );

      const response = cold('#', {}, error);
      const expected = cold('#', {}, parsedError);

      jest.spyOn(httpService, 'post').mockReturnValue(response);

      expect(service.inviteUserById('123', {})).toBeObservable(expected);
    });
  });
});
