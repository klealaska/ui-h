import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { RefreshToken } from '@ui-coe/avidcapture/core/data-access';
import { SetPendingPageSignalEvents } from '@ui-coe/avidcapture/pending/data-access';
import { SetRecycleBinPageSignalEvents } from '@ui-coe/avidcapture/recycle-bin/data-access';
import { SetResearchPageSignalEvents } from '@ui-coe/avidcapture/research/data-access';
import { AppPages } from '@ui-coe/avidcapture/shared/types';
import { AuthService } from '@ui-coe/shared/util/auth';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, take, tap } from 'rxjs/operators';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  private isRefreshingToken = false;
  private refreshTokenSubject = new BehaviorSubject<string>(null);

  constructor(private store: Store, private authService: AuthService) {}

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
          if (error.status === 401) {
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
          tap(state => {
            const token = this.authService.getAccessToken();
            this.isRefreshingToken = false;
            this.refreshTokenSubject.next(token);
            this.restoreSignalREvents(state.core.currentPage);
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

  private restoreSignalREvents(currentPage: string): void {
    switch (currentPage) {
      case AppPages.Queue:
        this.store.dispatch(new SetPendingPageSignalEvents());
        break;
      case AppPages.Research:
        this.store.dispatch(new SetResearchPageSignalEvents());
        break;
      case AppPages.RecycleBin:
        this.store.dispatch(new SetRecycleBinPageSignalEvents());
        break;
    }
  }
}
