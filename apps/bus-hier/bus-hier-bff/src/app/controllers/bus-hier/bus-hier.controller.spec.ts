import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { HttpConfigService } from '../../../services/http-config.service';
import { MOCK_ENV } from '../../shared';
import { BusinessLevelService } from '../business-level';
import { ErpService } from '../erp';
import { OrganizationService } from '../organization';
import { BusHierController } from './bus-hier.controller';
import { BusHierService } from './bus-hier.service';
import { BusHierCountService } from './bus-hier-count';
import { EntityService } from '../entity';

describe('BusHierController', () => {
  let controller: BusHierController;
  let service: BusHierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [BusHierController],
      providers: [
        BusHierService,
        BusinessLevelService,
        BusHierCountService,
        EntityService,
        ErpService,
        OrganizationService,
        HttpConfigService,
        ConfigService,
        { provide: MOCK_ENV, useValue: true },
      ],
    }).compile();

    controller = module.get<BusHierController>(BusHierController);
    service = module.get<BusHierService>(BusHierService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getBusHierNav', () => {
    it('should call getBusHierNav', () => {
      jest.spyOn(service, 'getBusHierNav').mockImplementation();
      controller.getBusHierNav({}, {});
      expect(service.getBusHierNav).toHaveBeenCalled();
    });
  });

  describe('getBusHierList', () => {
    it('should call getBusHierList', () => {
      jest.spyOn(service, 'getBusHierList').mockImplementation();
      controller.getBusHierList({}, {});
      expect(service.getBusHierList).toHaveBeenCalled();
    });
  });
});
