import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { HttpConfigService } from '../../../services/http-config.service';
import { MOCK_ENV } from '../../shared';
import { ErpController } from './erp.controller';
import { ErpService } from './erp.service';

describe('ErpController', () => {
  let controller: ErpController;
  let erpService: ErpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [ErpController],
      providers: [
        ErpService,
        HttpConfigService,
        ConfigService,
        { provide: MOCK_ENV, useValue: true },
      ],
    }).compile();

    controller = module.get<ErpController>(ErpController);
    erpService = module.get<ErpService>(ErpService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getErps', () => {
    jest.spyOn(erpService, 'getErps').mockImplementation();
    controller.getErps('', {}, {});
    expect(erpService.getErps).toHaveBeenCalled();
  });

  it('should call getErpById', () => {
    jest.spyOn(erpService, 'getErpById').mockImplementation();
    controller.getErpById('1234', {});
    expect(erpService.getErpById).toHaveBeenCalled();
  });

  it('should call updateErp', () => {
    jest.spyOn(erpService, 'updateErp').mockImplementation();
    const id = '1234';
    controller.updateErp(id, {}, {} as any);
    expect(erpService.updateErp).toHaveBeenCalled();
  });

  it('should call activateErp', () => {
    jest.spyOn(erpService, 'activateErp').mockImplementation();
    const id = '111';
    controller.activateErp(id, {} as any);
    expect(erpService.activateErp).toHaveBeenCalled();
  });

  it('should call deactivateErp', () => {
    jest.spyOn(erpService, 'deactivateErp').mockImplementation();
    const id = '111';
    controller.deactivateErp(id, {} as any);
    expect(erpService.deactivateErp).toHaveBeenCalled();
  });
});
