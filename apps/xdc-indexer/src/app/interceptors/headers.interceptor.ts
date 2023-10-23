import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Headers } from '@ui-coe/avidcapture/shared/types';
import { Observable } from 'rxjs';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.indexOf('tokens') < 1 && request.url.indexOf('callback') < 1) {
      request = request.clone({
        setHeaders: {
          [Headers.CacheControl]: `${Headers.NoCache}, ${Headers.NoStore}`,
          [Headers.ContentSecurityPolicy]:
            "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://* wss://* data:;connect-src * ws: wss:; frame-ancestors 'self';",
          [Headers.StrictTransportSecurity]: 'max-age=31536000; includeSubDomains',
        },
      });
      return next.handle(request);
    }
    return next.handle(request);
  }
}
