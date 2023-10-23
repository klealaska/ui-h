import { Test } from '@nestjs/testing';
import { AppMiddleware } from './app.middleware';

describe('AppMiddleware', () => {
  let appMiddlewareInstance: AppMiddleware;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AppMiddleware],
    }).compile();

    appMiddlewareInstance = new AppMiddleware();
  });

  it('should be defined', () => {
    expect(new AppMiddleware()).toBeDefined();
  });
});
