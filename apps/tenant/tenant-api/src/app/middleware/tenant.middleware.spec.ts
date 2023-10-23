import { Test } from '@nestjs/testing';

import { TenantMiddleware } from './tenant.middleware';

describe('TenantMiddleware', () => {
  const next = jest.fn();
  let middleware: TenantMiddleware;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TenantMiddleware],
    }).compile();

    middleware = module.get<TenantMiddleware>(TenantMiddleware);
  });

  it('should be defined', () => {
    expect(new TenantMiddleware()).toBeDefined();
  });

  it('should add the accept and content-type headers', () => {
    const headers = {
      accept: 'application/x.avidxchange.tenant+json;version=1.0.0',
      'content-type': 'application/x.avidxchange.tenant+json;version=1.0.0',
    };

    middleware.use({ headers } as any, {} as any, next);

    // TODO: how can we test if the headers were added?
    expect(next).toHaveBeenCalled();
  });
});
