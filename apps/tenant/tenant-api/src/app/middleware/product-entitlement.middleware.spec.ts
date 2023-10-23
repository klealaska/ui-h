import { Test } from '@nestjs/testing';

import { ProductEntitlementMiddleware } from './product-entitlement.middleware';

describe('ProductEntitlementMiddleware', () => {
  const next = jest.fn();
  let middleware: ProductEntitlementMiddleware;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ProductEntitlementMiddleware],
    }).compile();

    middleware = module.get<ProductEntitlementMiddleware>(ProductEntitlementMiddleware);
  });

  it('should be defined', () => {
    expect(new ProductEntitlementMiddleware()).toBeDefined();
  });

  it('should add the accept and content-type headers', () => {
    const headers = {
      accept: 'application/x.avidxchange.productentitlements+json;version=1.0.0',
      'content-type': 'application/x.avidxchange.productentitlements+json',
    };
    middleware.use({ headers } as any, {} as any, next);

    // TODO: how can we test if the headers were added?
    expect(next).toHaveBeenCalled();
  });
});
