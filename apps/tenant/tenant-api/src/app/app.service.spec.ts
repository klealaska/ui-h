import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppService } from './app.service';
import { configuration } from './shared/testing';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getConfig', () => {
    it('should return config"', () => {
      expect(service.getConfig()).toEqual({
        config: {
          env: 'Dev',
          baseUrl: 'https://api-qa01.devavidxcloud.com/AvTen/Ten/tenapi',
        },
      });
    });
  });
});
