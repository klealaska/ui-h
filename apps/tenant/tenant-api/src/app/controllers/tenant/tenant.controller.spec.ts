import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { HttpConfigService } from '../../../services/http-config.service';
import { MOCK_ENV } from '../../shared';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

describe('TenantController', () => {
  let controller: TenantController;
  let tenantService: TenantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [TenantController],
      providers: [
        TenantService,
        HttpConfigService,
        ConfigService,
        { provide: MOCK_ENV, useValue: true },
      ],
    }).compile();

    controller = module.get<TenantController>(TenantController);
    tenantService = module.get<TenantService>(TenantService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getTenants', () => {
    jest.spyOn(tenantService, 'getTenants').mockImplementation();
    controller.getTenants({}, {});
    expect(tenantService.getTenants).toHaveBeenCalled();
  });

  it('should call getTenantById', () => {
    jest.spyOn(tenantService, 'getTenantById').mockImplementation();
    controller.getTenantById('1234', {});
    expect(tenantService.getTenantById).toHaveBeenCalled();
  });

  it('should call createTenant', () => {
    jest.spyOn(tenantService, 'createTenant').mockImplementation();
    controller.createTenant({}, {} as any);
    expect(tenantService.createTenant).toHaveBeenCalled();
  });

  it('should call updateTenant', () => {
    jest.spyOn(tenantService, 'updateTenant').mockImplementation();
    const id = '1234';
    controller.updateTenant(id, {}, {} as any);
    expect(tenantService.updateTenant).toHaveBeenCalled();
  });
});
