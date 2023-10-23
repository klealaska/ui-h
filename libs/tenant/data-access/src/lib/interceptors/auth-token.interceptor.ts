import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { AuthFacade } from '@ui-coe/shell/navigation/data-access';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private authFacade: AuthFacade) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (/\/assets\/(i18|config)/.test(request.url)) {
      return next.handle(request.clone());
    } else {
      return this.authFacade.authToken$.pipe(
        take(1),
        switchMap(token =>
          next.handle(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))
        )
      );
    }
  }
}
