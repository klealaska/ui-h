import {
  HttpInterceptor,
  HttpHandler,
  HttpEvent,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, take, filter } from 'rxjs/operators';
import { AuthFacade } from '../+state/auth/auth.facade';
import { AuthService } from '../services/auth.service';
import { ShellConfigService } from '@ui-coe/shared/util/services';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshingToken = false;
  private refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private authFacade: AuthFacade,
    private authService: AuthService,
    private shellConfigService: ShellConfigService
  ) {}

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (/\/assets\/(i18|config)/.test(httpRequest.url)) {
      return next.handle(httpRequest.clone());
    } else {
      return this.authFacade.authToken$.pipe(
        take(1),
        switchMap(token => {
          const clonedRequest = this.addTokenHeader(httpRequest, token);
          return next.handle(clonedRequest).pipe(
            catchError(error => {
              if (error.status === 401) {
                return this.handle401Error(httpRequest, next);
              } else {
                return throwError(() => error);
              }
            })
          );
        })
      );
    }
  }

  private handle401Error(httpRequest: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken(this.shellConfigService.get('authBaseUrl')).pipe(
        switchMap((res: any) => {
          this.authFacade.refreshTokenSuccess(res);
          const newToken = res?.return_data?.tokens?.access_token;
          if (newToken) {
            this.refreshTokenSubject.next(newToken);
            this.isRefreshingToken = false;

            return next.handle(this.addTokenHeader(httpRequest, newToken));
          }
          return throwError(() => new Error('Error refreshing token'));
        }),
        catchError(error => {
          this.authService.logout();
          return throwError(error);
        })
      );
    } else {
      // If refreshToken is in progress, wait for it to complete and then retry
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addTokenHeader(httpRequest, token));
        })
      );
    }
  }

  private addTokenHeader(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
