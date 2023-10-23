/**
 * @file This file was generated by ax-app generator.
 * @copyright AvidXchange Inc.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PayTransformationBffHttpModule } from './pay-transformation-bff-http/pay-transformation-bff-http.module';
import { PaymentListModule } from './payment-list/payment-list.module';

@Module({
  imports: [ConfigModule.forRoot(), PayTransformationBffHttpModule.register(), PaymentListModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
