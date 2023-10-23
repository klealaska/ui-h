/**
 * @file This file was generated by ax-app generator.
 * @copyright AvidXchange Inc.
 */

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  ProductEntitlementController,
  ProductEntitlementService,
  TenantController,
  TenantService,
} from './controllers';
import { AppMiddleware, ProductEntitlementMiddleware, TenantMiddleware } from './middleware';
import { MOCK_ENV } from './shared';
import { TenantApiHttpModule } from './tenant-api-http/tenant-api-http.module';
import { environment } from '../environments/environment';
import { HttpConfigService } from '../services/http-config.service';

@Module({
  imports: [ConfigModule.forRoot(), TenantApiHttpModule.register(environment.mock)],
  controllers: [AppController, TenantController, ProductEntitlementController],
  providers: [
    AppService,
    AppMiddleware,
    HttpConfigService,
    TenantMiddleware,
    TenantService,
    {
      provide: MOCK_ENV,
      useValue: environment.mock,
    },
    ProductEntitlementMiddleware,
    ProductEntitlementService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AppMiddleware)
      .exclude(
        { path: 'api/health', method: RequestMethod.GET },
        { path: 'api/config', method: RequestMethod.GET }
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL })
      .apply(TenantMiddleware)
      .forRoutes(TenantController)
      .apply(ProductEntitlementMiddleware)
      .forRoutes(ProductEntitlementController);
  }
}