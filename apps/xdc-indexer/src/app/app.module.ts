import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, TitleStrategy } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NGXS_PLUGINS, NgxsModule } from '@ngxs/store';
import { AvidcaptureCoreDataAccessModule } from '@ui-coe/avidcapture/core/data-access';
import {
  AvidcaptureCoreUtilModule,
  LogoutHandler,
  NgxsErrorHandlerPlugin,
  NgxsLogoutPlugin,
} from '@ui-coe/avidcapture/core/util';
import { ErrorHandlerService, TitlePageStrategy } from '@ui-coe/avidcapture/shared/util';
import { SharedDataAccessContentModule } from '@ui-coe/shared/data-access/content';
import { ConfigService } from '@ui-coe/shared/util/services';

import { environment } from '../environments/environment';
import { applicationRoutes } from './app-routes';
import { AppComponent } from './app.component';
import { httpInterceptors } from './interceptors';
import { LayoutModule } from './layout/layout.module';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedDataAccessContentModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    RouterModule.forRoot(applicationRoutes, {
      useHash: false,
      initialNavigation: window['Cypress']
        ? undefined
        : window !== window.parent && !window.opener
        ? 'disabled'
        : undefined,
      scrollPositionRestoration: 'enabled',
    }),
    NgxsModule.forRoot([], {
      developmentMode: environment.macroEnvGroup.toLowerCase() !== 'prod',
      selectorOptions: {
        suppressErrors: false,
      },
    }),
    NgxsStoragePluginModule.forRoot({
      key: ['indexingPage.disableHighlight', 'indexingPage.pageFilters'],
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.macroEnvGroup.toLowerCase() === 'prod',
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
        // useClass: CustomTranslateLoader,
        // deps: [HttpClient, FeatureFlagService, ConfigService, ContentFacade, 'environment'],
      },
      defaultLanguage: 'en',
    }),
    LayoutModule,
    BrowserAnimationsModule,
    AvidcaptureCoreDataAccessModule,
    AvidcaptureCoreUtilModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ConfigService, LogoutHandler],
      useFactory: (configService: ConfigService) => (): Promise<void> =>
        configService.loadAppConfig(),
    },
    ...httpInterceptors,
    {
      provide: NGXS_PLUGINS,
      useClass: NgxsLogoutPlugin,
      multi: true,
    },
    {
      provide: NGXS_PLUGINS,
      useClass: NgxsErrorHandlerPlugin,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService,
    },
    // Injectable for libraries
    {
      provide: 'environment',
      useValue: environment,
    },
    {
      provide: TitleStrategy,
      useClass: TitlePageStrategy,
    },
    ConfigService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
