import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration } from './shared/testing';

describe('AppController', () => {
  let app: TestingModule;
  let appController: AppController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [AppService],
      controllers: [AppController],
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
    }).compile();
  });

  beforeEach(() => {
    appController = app.get<AppController>(AppController);
  });

  describe('getConfig', () => {
    it('should return config', () => {
      expect(appController.config()).toEqual({
        config: {
          env: 'Dev',
          baseUrl: 'https://api-qa01.devavidxcloud.com/AvTen/Ten/tenapi',
        },
      });
    });
  });

  describe('get health', () => {
    it('should return dummy string', () => {
      const dummyString = 'Ok';
      appController.health();
      expect(appController.health()).toEqual(dummyString);
    });
  });
});
