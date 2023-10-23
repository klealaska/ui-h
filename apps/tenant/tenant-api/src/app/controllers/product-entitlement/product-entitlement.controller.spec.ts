import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { ProductEntitlementService } from './product-entitlement.service';
import { HttpConfigService } from '../../../services/http-config.service';
import { MOCK_ENV } from '../../shared';
import { ProductEntitlementController } from './product-entitlement.controller';
import { AssignTenantEntitlementDto } from '../models';

describe('ProductEntitlementController', () => {
  let controller: ProductEntitlementController;
  let service: ProductEntitlementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [ProductEntitlementController],
      providers: [
        ProductEntitlementService,
        HttpConfigService,
        ConfigService,
        { provide: MOCK_ENV, useValue: true },
      ],
    }).compile();

    controller = module.get<ProductEntitlementController>(ProductEntitlementController);
    service = module.get<ProductEntitlementService>(ProductEntitlementService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getProductEntitlements', () => {
    jest.spyOn(service, 'getProductEntitlements').mockImplementation();
    controller.getProductEntitlements({}, {});
    expect(service.getProductEntitlements).toHaveBeenCalled();
  });

  it('should call getProductEntitlementsByTenantId', () => {
    jest.spyOn(service, 'getProductEntitlementsByTenantId').mockImplementation();
    controller.getProductEntitlementsByTenantId('123', {});
    expect(service.getProductEntitlementsByTenantId).toHaveBeenCalled();
  });

  it('should call assignEntitlement', () => {
    const body: AssignTenantEntitlementDto = {
      assignment_date: 'string',
      amount: 0,
      assignment_source: 'string',
      source_system: 'string',
    };

    jest.spyOn(service, 'assignEntitlement').mockImplementation();
    controller.assignProductEntitlement('123', '234', body, {});
    expect(service.assignEntitlement).toHaveBeenCalled();
  });

  it('should call activateTenantEntitlements', () => {
    jest.spyOn(service, 'activateTenantEntitlement').mockImplementation();
    controller.activateTenantEntitlement('123', '234', {});
    expect(service.activateTenantEntitlement).toHaveBeenCalled();
  });

  it('should call deactivateTenantEntitlements', () => {
    jest.spyOn(service, 'deactivateTenantEntitlement').mockImplementation();
    controller.deactivateTenantEntitlement('123', '234', {});
    expect(service.deactivateTenantEntitlement).toHaveBeenCalled();
  });
});
