import { Inject, Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthConfig } from '../models';
import { AuthService } from '../services/auth.service';
import { AuthFacade } from '../+state/auth/auth.facade';
import { ConfigService, ShellConfigService } from '@ui-coe/shared/util/services';

@Injectable({
  providedIn: 'root',
})
export class TokenGuard {
  constructor(
    private authService: AuthService,
    private authFacade: AuthFacade,
    private shellConfigService: ShellConfigService
  ) {}

  canMatch(route: Route): Observable<boolean> {
    if (!this.authService.isLoggedIn() && !window['Cypress' as any]) {
      const authConfig = this.shellConfigService.authConfig as AuthConfig;
      if (!authConfig || !authConfig.avidAuthLoginUrl || !authConfig.appName) {
        throw new Error('Please pass a valid AuthConfig in your app module.');
      }
      this.authFacade.init(authConfig.avidAuthLoginUrl, authConfig.appName);
      return of(false);
    }
    return of(true);
  }
}
