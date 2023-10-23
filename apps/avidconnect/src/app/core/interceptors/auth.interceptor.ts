import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { ConfigService } from '@ui-coe/shared/util/services';
import { AvcAuthService } from '../services/avc-auth.service';
import * as actions from '../actions/core.actions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshingToken = false;

  constructor(
    private authService: AvcAuthService,
    private configService: ConfigService,
    private store: Store
  ) {}

  intercept(httpRequest: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getAccessToken();

    // we need to allow these requests as are used to setup the configService and get/refresh the token
    if (
      httpRequest.url === '/assets/config/app.config.json' ||
      httpRequest.url.includes('/avidauth/sso/tokens') ||
      httpRequest.url.includes('/jwt/refresh')
    ) {
      return next.handle(httpRequest);
    }

    // if the refresh token has expired, we log them out automatically
    if (this.authService.isRefreshTokenExpired()) {
      this.store.dispatch(new actions.Logout()).subscribe(() => {
        window.location.href = this.configService.get('avidAuthLogoutUrl');
      });
      return EMPTY;
    }

    return next.handle(this.addTokenHeader(httpRequest, token)).pipe(
      finalize(() => {
        const tokenRefreshWindow = 300000; // 5 min
        const expirationDate = this.authService.getTokenExpirationDate();
        const tokenCanRefresh = expirationDate * 1000 - Date.now() <= tokenRefreshWindow;

        if (!this.isRefreshingToken && tokenCanRefresh) {
          this.isRefreshingToken = true;

          return this.store
            .dispatch(new actions.RefreshToken())
            .pipe(
              switchMap(() => {
                this.isRefreshingToken = false;
                return EMPTY;
              })
            )
            .subscribe();
        }
      })
    );
  }

  private addTokenHeader(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
