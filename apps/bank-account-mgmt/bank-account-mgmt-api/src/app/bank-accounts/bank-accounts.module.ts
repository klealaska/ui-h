import { Module } from '@nestjs/common';
import { BankAccountMgmtApiHttpModule } from '../bank-account-mgmt-api-http/bank-account-mgmt-api-http.module';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountsService } from './bank-accounts.service';
import { MockHttpService, defaultSortFilterConfig } from '@ui-coe/shared/bff/data-access';
import { MOCK_ENV, MOCK_FILE_PATH } from '../shared';
import { HttpConfigService } from '../../services/http-config.service';
import { environment } from '../../environments/environment';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [BankAccountMgmtApiHttpModule.register(), ConfigModule.forRoot()],
  controllers: [BankAccountsController],
  providers: [
    HttpConfigService,
    BankAccountsService,
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
export class BankAccountsModule {}
