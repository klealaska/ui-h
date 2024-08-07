/**
 * @file This file was generated by ax-app generator.
 * @copyright AvidXchange Inc.
 */
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;
  let appController: AppController;
  let service: AppService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    service = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should call AppService health method', () => {
      jest.spyOn(service, 'health').mockImplementation();
      appController.health();
      expect(service.health).toHaveBeenCalled();
    });
  });
});
