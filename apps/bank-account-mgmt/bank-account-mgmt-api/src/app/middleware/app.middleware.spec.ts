import { Test } from '@nestjs/testing';
import { AppMiddleware } from './app.middleware';
import { MOCK_ENV } from '../shared';

describe('AppMiddleware', () => {
  let appMiddlewareInstance: AppMiddleware;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AppMiddleware, { provide: MOCK_ENV, useValue: 'false' }],
      imports: [],
    }).compile();

    appMiddlewareInstance = moduleRef.get<AppMiddleware>(AppMiddleware);
  });
  it('should be defined', () => {
    expect(appMiddlewareInstance).toBeDefined();
  });
});
