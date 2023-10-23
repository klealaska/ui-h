import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { MOCK_ENV } from '../../shared';
import { HttpConfigService } from '../../../services';
import { UpdateCustomRoleRequest } from '../../models';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [RolesController],
      providers: [RolesService, HttpConfigService, { provide: MOCK_ENV, useValue: true }],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call rolesService getRoles', () => {
    const spy = jest.spyOn(service, 'getRoles').mockImplementation();
    controller.getRoles({});
    expect(spy).toHaveBeenCalled();
  });

  it('should call rolesService updateCustomRole', () => {
    const spy = jest.spyOn(service, 'updateCustomRole').mockImplementation();
    controller.updateCustomRole('1234', {} as UpdateCustomRoleRequest, {});
    expect(spy).toHaveBeenCalled();
  });
});
