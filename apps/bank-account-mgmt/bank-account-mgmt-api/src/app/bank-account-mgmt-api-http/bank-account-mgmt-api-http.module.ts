/**
 * @file This file was generated by ax-app generator.
 * @copyright AvidXchange Inc.
 */
import { HttpModule, HttpService } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { MockHttpService, defaultSortFilterConfig } from '@ui-coe/shared/bff/data-access';
import { MOCK_FILE_PATH } from '../shared';
import { environment } from '../../environments/environment';

@Module({})
export class BankAccountMgmtApiHttpModule {
  static register(): DynamicModule {
    return environment.mock
      ? {
          module: BankAccountMgmtApiHttpModule,
          providers: [
            {
              provide: HttpService,
              useClass: MockHttpService,
            },
            {
              provide: MOCK_FILE_PATH,
              useValue: 'assets/mock/json',
            },
            {
              provide: 'SORT_FILTER_CONFIG',
              useValue: defaultSortFilterConfig,
            },
          ],
          exports: [HttpService, MOCK_FILE_PATH],
        }
      : {
          module: BankAccountMgmtApiHttpModule,
          imports: [HttpModule],
          exports: [HttpModule],
        };
  }
}
