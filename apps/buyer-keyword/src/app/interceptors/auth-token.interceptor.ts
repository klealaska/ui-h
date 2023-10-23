import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthService } from '@ui-coe/shared/util/auth';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, take, tap } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { RefreshToken } from '../core/state/core.actions';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  private isRefreshingToken = false;
  private refreshTokenSubject = new BehaviorSubject<string>(null);

  constructor(private authService: AuthService, private store: Store) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getAccessToken();

    if (
      token &&
      !this.isRefreshingToken &&
      request.url.indexOf('tokens') < 1 &&
      request.url.indexOf('callback') < 1
    ) {
      return next.handle(this.addTokenHeader(request, token)).pipe(
        catchError(error => {
          if (
            error.status === 401 &&
            !this.isTokenExpired(token) &&
            request.url.indexOf('void') > 1
          ) {
            delete error.status;
          } else if (error.status === 401) {
            this.refreshToken();
          }
          return throwError(() => error);
        })
      );
    } else {
      return next.handle(this.addTokenHeader(request, token));
    }
  }

  private refreshToken(): void {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.refreshTokenSubject.next(null);

      this.store
        .dispatch(new RefreshToken())
        .pipe(
          tap(() => {
            const token = this.authService.getAccessToken();
            this.isRefreshingToken = false;
            this.refreshTokenSubject.next(token);
          }),
          take(1),
          finalize(() => {
            this.isRefreshingToken = false;
          })
        )
        .subscribe();
    }
  }

  private addTokenHeader(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private isTokenExpired(token: string): boolean {
    const decodedToken: any = jwt_decode(token);
    const expirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();
    return expirationTime < currentTime;
  }
}
