import { Test } from '@nestjs/testing';
import { AppMiddleware } from './app.middleware';

describe('AppMiddleware', () => {
  let appMiddlewareInstance: AppMiddleware;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AppMiddleware],
    }).compile();

    appMiddlewareInstance = moduleRef.get<AppMiddleware>(AppMiddleware);
  });
  it('should be defined', () => {
    expect(new AppMiddleware()).toBeDefined();
  });

  it('should call next when header is provided', () => {
    const next = jest.fn();
    const headers = {
      authorization: 'testAuth',
      'x-tenant-id': 'testId',
    };
    appMiddlewareInstance.use({ headers } as any, {} as any, next);
    expect(next).toHaveBeenCalled();
  });

  it('should throw error when authorization header is null', () => {
    const next = jest.fn();
    const headers = {
      authorization: null,
      'x-tenant-id': 'testId',
    };
    expect(() => {
      appMiddlewareInstance.use({ headers } as any, {} as any, next);
    }).toThrow();
  });
});
