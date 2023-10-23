import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { httpInterceptors } from './interceptors';
import { LayoutModule } from './layout/layout.module';
import { applicationRoutes } from './shared/app-routes';
import { StoreModule } from '@ngrx/store';
import { SharedDataAccessContentModule } from '@ui-coe/shared/data-access/content';
import { EffectsModule } from '@ngrx/effects';
import { ConfigService } from '@ui-coe/shared/util/services';
import { TranslateLoader, TranslateModule, TranslateStore } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SharedDataAccessContentModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    HttpClientModule,
    RouterModule.forRoot(applicationRoutes, {
      useHash: false,
      scrollPositionRestoration: 'enabled',
    }),
    HttpClientModule,
    BrowserAnimationsModule,
    NgxsModule.forRoot([], {
      developmentMode: !environment.production,
      selectorOptions: {
        suppressErrors: false,
      },
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: !environment.production,
    }),
    CoreModule,
    LayoutModule,
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
  ],
  providers: [
    ...httpInterceptors, // Injectable for libraries
    {
      provide: 'environment',
      useValue: environment,
    },
    ConfigService,
    TranslateStore,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
