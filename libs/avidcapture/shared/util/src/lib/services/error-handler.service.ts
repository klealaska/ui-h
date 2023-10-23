import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';

import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService extends ErrorHandler {
  constructor(private loggingService: LoggingService) {
    super();
  }

  handleError(error: Error): void {
    const httpError = error as HttpErrorResponse;
    if (httpError?.status === 404 && httpError?.url?.indexOf('/search') > 1) {
      return;
    } else {
      this.loggingService.logException(error);
    }
  }
}
