/**
 * @file This file was generated by ax-app generator.
 * @copyright AvidXchange Inc.
 */

import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfigService, ErrorHandlerService, LoggingService } from '@ui-coe/shared/util/services';
import { RemoteEntryComponent } from './entry.component';
import { AppGuard } from '@ui-coe/shared/util/guards';
import { RolesService } from '@ui-coe/usr-roles/data-access';
import { remoteRoutes } from './entry.routes';

export function createTranslateLoaderRemote(http: HttpClient, config: ConfigService) {
  return new TranslateHttpLoader(http, `${config.get('baseUrl')}/assets/i18n/`, '.json');
}

@NgModule({
  declarations: [RemoteEntryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(remoteRoutes),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoaderRemote,
        deps: [HttpClient, ConfigService],
      },
      defaultLanguage: 'en',
    }),
  ],
  providers: [
    ConfigService,
    AppGuard,
    LoggingService,
    RolesService,
    {
      provide: ErrorHandler,
      useValue: ErrorHandlerService,
    },
  ],
  exports: [],
})
export class RemoteEntryModule {}
