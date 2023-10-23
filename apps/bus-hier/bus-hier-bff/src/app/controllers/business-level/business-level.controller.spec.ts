import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { HttpConfigService } from '../../../services/http-config.service';
import { MOCK_ENV } from '../../shared';
import { BusinessLevelController } from './business-level.controller';
import { BusinessLevelService } from './business-level.service';

describe('BusinessLevelController', () => {
  let controller: BusinessLevelController;
  let erpService: BusinessLevelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [BusinessLevelController],
      providers: [
        BusinessLevelService,
        HttpConfigService,
        ConfigService,
        { provide: MOCK_ENV, useValue: true },
      ],
    }).compile();

    controller = module.get<BusinessLevelController>(BusinessLevelController);
    erpService = module.get<BusinessLevelService>(BusinessLevelService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getBusinessLevelByErpId', () => {
    jest.spyOn(erpService, 'getBusinessLevelsByErpId').mockImplementation();
    controller.getBusinessLevelsByErpId('', {}, {});
    expect(erpService.getBusinessLevelsByErpId).toHaveBeenCalled();
  });

  it('should call createBusinessLevel', () => {
    jest.spyOn(erpService, 'createBusinessLevel').mockImplementation();
    controller.createBusinessLevel(
      '1234',
      {
        businessLevelNameSingular: 'test',
        businessLevelNamePlural: 'tests',
        sourceSystem: 'test',
      },
      {}
    );
    expect(erpService.createBusinessLevel).toHaveBeenCalled();
  });

  it('should call getBusinessLevel', () => {
    jest.spyOn(erpService, 'getBusinessLevel').mockImplementation();
    controller.getBusinessLevel('1234', {});
    expect(erpService.getBusinessLevel).toHaveBeenCalled();
  });

  it('should call updateBusinessLevel', () => {
    jest.spyOn(erpService, 'updateBusinessLevel').mockImplementation();
    controller.updateBusinessLevel(
      '1234',
      {},
      {
        businessLevelNameSingular: 'test',
        businessLevelNamePlural: 'tests',
      }
    );
    expect(erpService.updateBusinessLevel).toHaveBeenCalled();
  });
});
