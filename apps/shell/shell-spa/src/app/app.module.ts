import { NgModule, APP_INITIALIZER, InjectionToken } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import {
  ConfigService,
  SharedUtilServicesModule,
  ShellConfigService,
} from '@ui-coe/shared/util/services';
import { firstValueFrom } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  AuthFacade,
  ShellEffects,
  AuthEffects,
  ShellNavigationDataAccessModule,
  AuthConfig,
  AppName,
  TokenInterceptor,
} from '@ui-coe/shell/navigation/data-access';
import { SharedDataAccessContentModule } from '@ui-coe/shared/data-access/content';
import { AppRoutingModule } from './app-routing.module';
import { SharedUiV2Module } from '@ui-coe/shared/ui-v2';
import { AppInitService } from './app-init.service';
import { environment } from '../environments/environment';
import { AppGuard } from '@ui-coe/shared/util/guards';
import { SharedDataAccessEventHubModule } from 'libs/shared/data-access/event-hub/src/lib/shared-data-access-event-hub.module';

export const AUTH_CONFIG = new InjectionToken<Promise<AuthConfig>>('authConfig');

export function initializeApp(
  configService: ShellConfigService,
  appInitService: AppInitService
): () => Promise<void> {
  return async () => {
    await firstValueFrom(configService.loadShellConfig());
    await configService.loadRoutes(environment.production).then(res => {
      return appInitService.init(res);
    });
    const authConfig: AuthConfig = {
      avidAuthBaseUrl: configService.get('authBaseUrl'),
      avidAuthLoginUrl: configService.get('avidAuthUrl'),
      appName: AppName.Shell,
      redirectUrl: window.location.origin + '/login/callback',
    };
    configService.authConfig = authConfig;
  };
}
// comment

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ router: routerReducer }),
    EffectsModule.forRoot([ShellEffects, AuthEffects]),
    StoreRouterConnectingModule.forRoot(),
    MaterialModule,
    SharedUiV2Module,
    ToastrModule.forRoot(),
    HttpClientModule,
    NoopAnimationsModule,
    AppRoutingModule,
    StoreDevtoolsModule.instrument(),
    SharedDataAccessContentModule,
    SharedDataAccessEventHubModule,
    ShellNavigationDataAccessModule,
    SharedUtilServicesModule,
  ],
  providers: [
    AppGuard,
    AuthFacade,
    AppInitService,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [ShellConfigService, AppInitService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: 'environment',
      useValue: environment,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
