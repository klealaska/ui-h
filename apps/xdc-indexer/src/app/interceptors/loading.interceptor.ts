import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { HttpRequestActive, HttpRequestComplete } from '@ui-coe/avidcapture/core/data-access';
import { LookupApiUrls } from '@ui-coe/avidcapture/shared/types';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private count = 0;

  constructor(private store: Store) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const excludedRequestUrls = [
      `${environment.lookupApiBaseUri}${LookupApiUrls.GET_PROPERTIES.split('?')[0]}`,
      `${environment.lookupApiBaseUri}${LookupApiUrls.GET_CUSTOMERACCOUNTS.split('?')[0]}`,
      `${environment.lookupApiBaseUri}${LookupApiUrls.GET_SUPPLIERS.split('?')[0]}`,
    ];

    const requestUrl = req.url.split('?')[0];

    if (excludedRequestUrls.includes(requestUrl)) {
      return next.handle(req);
    } else {
      this.store.dispatch(new HttpRequestActive());
      this.count++;

      return next.handle(req).pipe(
        finalize(() => {
          this.count--;

          if (this.count === 0) {
            this.store.dispatch(new HttpRequestComplete());
          }
        })
      );
    }
  }
}
