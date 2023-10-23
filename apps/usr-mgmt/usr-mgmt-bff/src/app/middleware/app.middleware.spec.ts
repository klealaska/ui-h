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

  it('should call the next function', () => {
    const req = {
      headers: {
        'content-length': 123,
        host: 'localhost',
      },
      body: {
        foo: 'bar',
      },
    };

    const next = jest.fn();
    appMiddlewareInstance.use(req, '', next);

    expect(next).toHaveBeenCalled();
  });
});
