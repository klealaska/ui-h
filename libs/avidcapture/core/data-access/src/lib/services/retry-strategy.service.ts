import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { ToastService } from '@ui-coe/avidcapture/core/util';
import { RetryStrategy } from '@ui-coe/avidcapture/shared/types';
import { Observable, throwError, timer } from 'rxjs';
import { finalize, mergeMap } from 'rxjs/operators';

import { HttpRequestComplete } from '../+state/core.actions';

@Injectable({
  providedIn: 'root',
})
export class RetryStrategyService {
  constructor(private toast: ToastService, private store: Store) {}

  retryApiCall(
    attempts: Observable<HttpErrorResponse>,
    retryStrategy: RetryStrategy = {
      excludedStatusCodes: [401, 404, 0],
      excludedStatusCodesToastMessage: [],
      duration: 1000,
    }
  ): Observable<number> {
    return attempts.pipe(
      mergeMap((error: HttpErrorResponse) => {
        // if response is a status code we don't wish to retry, throw error
        if (retryStrategy.excludedStatusCodes?.includes(error.status)) {
          return throwError(() => error);
        }

        if (!retryStrategy.excludedStatusCodesToastMessage?.includes(error.status)) {
          const toastMessage = `Failure to Load API: Error Status ${error.status}`;
          this.toast.error(toastMessage);
        }
        // retry after duration length
        return timer(retryStrategy.duration);
      }),
      finalize(() => this.store.dispatch(new HttpRequestComplete()))
    );
  }
}
