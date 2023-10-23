/**
 * @file This file was generated by ax-app generator.
 * @copyright AvidXchange Inc.
 */

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { BankAccountMgmtApiHttpModule } from './bank-account-mgmt-api-http/bank-account-mgmt-api-http.module';
import { BankAccountsController } from './bank-accounts/bank-accounts.controller';
import { BankAccountsModule } from './bank-accounts/bank-accounts.module';
import { AppMiddleware } from './middleware/app.middleware';
import { MOCK_ENV } from './shared';
import { environment } from '../environments/environment';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BankAccountMgmtApiHttpModule.register(),
    CacheModule.register(),
    BankAccountsModule,
  ],
  controllers: [],
  providers: [
    AppMiddleware,
    {
      provide: MOCK_ENV,
      useValue: environment.mock,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (!environment.mock) {
      consumer.apply(AppMiddleware).forRoutes(BankAccountsController);
    }
  }
}
