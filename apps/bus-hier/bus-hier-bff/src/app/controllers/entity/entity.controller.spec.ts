import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { EntityController } from './entity.controller';
import { EntityService } from './entity.service';
import { HttpConfigService } from '../../../services/http-config.service';
import { MOCK_ENV } from '../../shared';

describe('EntityController', () => {
  let controller: EntityController;
  let service: EntityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [EntityController],
      providers: [
        EntityService,
        HttpConfigService,
        ConfigService,
        { provide: MOCK_ENV, useValue: true },
      ],
    }).compile();

    controller = module.get<EntityController>(EntityController);
    service = module.get<EntityService>(EntityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEntitiesByErpId', () => {
    it('should call getEntitiesByErpId in service', () => {
      jest.spyOn(service, 'getEntitiesByErpId').mockImplementation();

      controller.getEntitiesByErpId('123', {}, {});

      expect(service.getEntitiesByErpId).toHaveBeenCalled();
    });
  });

  describe('getEntityByEntityId', () => {
    it('should call getEntityByEntityId in service', () => {
      jest.spyOn(service, 'getEntityByEntityId').mockImplementation();

      controller.getEntityByEntityId('123', {}, {});

      expect(service.getEntityByEntityId).toHaveBeenCalled();
    });
  });

  describe('getEntityByBusinessLevel', () => {
    it('should call getEntityByBusinessLevel in service', () => {
      jest.spyOn(service, 'getEntitiesByBusinessLevel').mockImplementation();

      controller.getEntitiesByBusinessLevel('123', '456', {}, {});

      expect(service.getEntitiesByBusinessLevel).toHaveBeenCalled();
    });
  });

  describe('getChildEntitiesByChildLevel', () => {
    it('should call getChildEntitiesByChildLevel in service', () => {
      jest.spyOn(service, 'getChildEntitiesByChildLevel').mockImplementation();

      controller.getChildEntitiesByChildLevel('123', '456', '789', {}, {});

      expect(service.getChildEntitiesByChildLevel).toHaveBeenCalled();
    });
  });

  describe('getAllChildEntities', () => {
    it('should call getAllChildEntities in service', () => {
      jest.spyOn(service, 'getAllChildEntities').mockImplementation();

      controller.getAllChildEntities('123', '456', {}, {});

      expect(service.getAllChildEntities).toHaveBeenCalled();
    });
  });

  describe('updateEntity', () => {
    it('should call updateEntity', () => {
      jest.spyOn(service, 'updateEntity').mockImplementation();
      const id = '1234';
      controller.updateEntity(id, {}, {} as any);
      expect(service.updateEntity).toHaveBeenCalled();
    });
  });

  describe('activate/deactivate entity', () => {
    it('should call activateEntity', () => {
      jest.spyOn(service, 'activateEntity').mockImplementation();
      const id = '1234';
      controller.activateEntity(id, {});
      expect(service.activateEntity).toHaveBeenCalled();
    });

    it('should call deactivateEntity', () => {
      jest.spyOn(service, 'deactivateEntity').mockImplementation();
      const id = '1234';
      controller.deactivateEntity(id, {});
      expect(service.deactivateEntity).toHaveBeenCalled();
    });
  });

  describe('updateEntityAddress', () => {
    it('should call updateEntityAddress', () => {
      jest.spyOn(service, 'updateEntityAddress').mockImplementation();
      const id = '1234';
      const addressId = '1234';
      controller.updateEntityAddress(id, addressId, {} as any, {} as any);
      expect(service.updateEntityAddress).toHaveBeenCalled();
    });
  });

  describe('activate/deactivate entity address', () => {
    it('should call activateEntityAddress', () => {
      jest.spyOn(service, 'activateEntityAddress').mockImplementation();
      const id = '1234';
      const addressId = '1234';
      controller.activateEntityAddress(id, addressId, {});
      expect(service.activateEntityAddress).toHaveBeenCalled();
    });

    it('should call deactivateEntityAddress', () => {
      jest.spyOn(service, 'deactivateEntityAddress').mockImplementation();
      const id = '1234';
      const addressId = '1234';
      controller.deactivateEntityAddress(id, addressId, {});
      expect(service.deactivateEntityAddress).toHaveBeenCalled();
    });
  });
});
