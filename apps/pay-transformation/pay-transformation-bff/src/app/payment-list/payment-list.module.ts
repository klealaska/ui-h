import { Module } from '@nestjs/common';
import { HttpConfigService } from '../../services/http-config.service';
import { MockHttpService, defaultSortFilterConfig } from '@ui-coe/shared/bff/data-access';
import { environment } from '../../environments/environment';
import { PayTransformationBffHttpModule } from '../pay-transformation-bff-http/pay-transformation-bff-http.module';
import { MOCK_ENV, MOCK_FILE_PATH } from '../shared';
import { PaymentListController } from './payment-list.controller';
import { PaymentListService } from './payment-list.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PayTransformationBffHttpModule.register(), ConfigModule.forRoot()],
  controllers: [PaymentListController],
  providers: [
    HttpConfigService,
    PaymentListService,
    MockHttpService,
    {
      provide: MOCK_FILE_PATH,
      useValue: 'assets/mock/json',
    },
    {
      provide: MOCK_ENV,
      useValue: environment.mock,
    },
    {
      provide: 'SORT_FILTER_CONFIG',
      useValue: defaultSortFilterConfig,
    },
  ],
})
export class PaymentListModule {}
