import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthConfig } from '../models';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TokenGuard {
  constructor(private authService: AuthService) {}

  canLoad(route: Route): Observable<boolean> {
    if (!this.authService.isLoggedIn() && !window['Cypress' as any]) {
      this.authService.logout();

      const authConfig = route.data as AuthConfig;
      if (!authConfig || !authConfig.avidAuthLoginUrl || !authConfig.appName) {
        throw new Error('Please pass a valid AuthConfig in your routes data property');
      }

      location.href = this.authService.getAvidAuthLoginUrl(
        authConfig.avidAuthLoginUrl,
        authConfig.appName
      );
      return of(false);
    }
    return of(true);
  }
}
