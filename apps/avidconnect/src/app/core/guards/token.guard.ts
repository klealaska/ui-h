import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { AppName, AuthConfig } from '@ui-coe/shared/util/auth';
import { ConfigService } from '@ui-coe/shared/util/services';
import { AvcAuthService } from '../services/avc-auth.service';
import * as actions from '../actions/core.actions';

@Injectable({
  providedIn: 'root',
})
export class TokenGuard {
  constructor(
    private authService: AvcAuthService,
    private configService: ConfigService,
    private store: Store
  ) {}

  canLoad(route: Route): Observable<boolean> {
    if (!this.authService.isLoggedIn() && !window['Cypress' as any]) {
      this.store.dispatch(new actions.Logout());

      const authConfig: AuthConfig = {
        avidAuthBaseUrl: this.configService.get('avidAuthBaseUri'),
        avidAuthLoginUrl: this.configService.get('avidAuthLoginUrl'),
        appName: this.configService.get('appName') as AppName,
        redirectUrl: this.configService.get('redirectUrl'),
      };

      if (!authConfig || !authConfig.avidAuthLoginUrl || !authConfig.appName) {
        throw new Error('Please pass a valid AuthConfig in your routes data property');
      }

      window.location.href = this.authService.getAvidAuthLoginUrl(
        authConfig.avidAuthLoginUrl,
        authConfig.appName
      );
      return of(false);
    }
    return of(true);
  }
}
