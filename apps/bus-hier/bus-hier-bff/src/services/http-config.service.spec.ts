import { Test, TestingModule } from '@nestjs/testing';
import { MOCK_ENV } from '../app/shared';
import { HttpConfigService } from './http-config.service';
import { ConfigService } from '@nestjs/config';

describe('HttpConfigService', () => {
  let service: HttpConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpConfigService,
        {
          provide: MOCK_ENV,
          useValue: true,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<HttpConfigService>(HttpConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
