import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HttpConfigService } from '../../../services/http-config.service';
import { MOCK_ENV } from '../../shared';

describe('UserAccountsController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [UsersController],
      providers: [
        UsersService,
        HttpConfigService,
        ConfigService,
        { provide: MOCK_ENV, useValue: true },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUserAccount', () => {
    it('should call userAccountsService createUserAccount', () => {
      jest.spyOn(service, 'createUser').mockImplementation();
      controller.createUser({} as any, {});
      expect(service.createUser).toHaveBeenCalled();
    });
  });

  describe('getUserAccounts', () => {
    it('should call userAccountsService getUserAccounts', () => {
      jest.spyOn(service, 'getUsers').mockImplementation();
      controller.getUsers({} as any);
      expect(service.getUsers).toHaveBeenCalled();
    });
  });

  describe('getUserAccountById', () => {
    it('should call userAccountsService getUserAccountById', () => {
      jest.spyOn(service, 'getUserById').mockImplementation();
      controller.getUserById('123', {});
      expect(service.getUserById).toHaveBeenCalled();
    });
  });

  describe('updateUserAccountById', () => {
    it('should call userAccountsService updateUserAccountById', () => {
      jest.spyOn(service, 'updateUserById').mockImplementation();
      controller.updateUserById('123', {}, {});
      expect(service.updateUserById).toHaveBeenCalled();
    });
  });

  describe('updateUserLifecycleById', () => {
    it('should call userAccountService resetUserPasswordById', () => {
      jest.spyOn(service, 'updateUserLifecycleById').mockImplementation();
      controller.updateUserLifecycleById('123aa', { name: 'Activate' }, {});
      expect(service.updateUserLifecycleById).toHaveBeenCalledTimes(1);
    });
  });

  describe('inviteUserById', () => {
    it('should call userAccountService activateUserById', () => {
      jest.spyOn(service, 'inviteUserById').mockImplementation();
      controller.inviteUserById('123aa', {});
      expect(service.inviteUserById).toHaveBeenCalledTimes(1);
    });
  });
});
