/**
 * @file This file was generated by ax-app generator.
 * @copyright AvidXchange Inc.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ConfigService } from '@ui-coe/shared/util/services';

import { RemoteEntryComponent } from './entry.component';
import { AppGuard } from '@ui-coe/shared/util/guards';

export function createTranslateLoaderRemote(http: HttpClient, config: ConfigService) {
  return new TranslateHttpLoader(http, `${config.get('baseUrl')}/assets/i18n/`, '.json');
}

@NgModule({
  declarations: [RemoteEntryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: RemoteEntryComponent,
        canActivate: [AppGuard],
      },
    ]),
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
  providers: [AppGuard],
  exports: [],
})
export class RemoteEntryModule {}