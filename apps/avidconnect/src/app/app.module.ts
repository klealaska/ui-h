import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import { OktaAuth, OktaAuthOptions } from '@okta/okta-auth-js';
import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { CacheRouteStrategy } from './core/cache-route-strategy';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { environment } from '../environments/environment';
import { ConfigService } from '@ui-coe/shared/util/services';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

//Testing deploy
const oktaAuth = new OktaAuth({
  issuer: 'https://avidxchange.oktapreview.com/oauth2/aus1gxgc39wUFexQp1d7',
} as OktaAuthOptions);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    HttpClientModule,
    LayoutModule,
    CoreModule,
    OktaAuthModule,
    BrowserAnimationsModule,
    NgxsModule.forRoot([], {
      developmentMode: !environment.production, // TODO set this back to !environment.production
    }),
    // NgxsReduxDevtoolsPluginModule.forRoot(), // uncomment this to enable redux devtools during development
    NgxsStoragePluginModule.forRoot({
      key: [
        'core.customerId',
        'core.connectorId',
        'core.registration',
        'core.operationId',
        'core.platform',
      ],
      storage: StorageOption.SessionStorage,
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ConfigService],
      useFactory: (configService: ConfigService) => (): Promise<void> =>
        configService.loadAppConfig(),
    },
    {
      provide: OKTA_CONFIG, //change this back if we want to make the api avid connect work
      useValue: oktaAuth,
    },
    { provide: RouteReuseStrategy, useClass: CacheRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
