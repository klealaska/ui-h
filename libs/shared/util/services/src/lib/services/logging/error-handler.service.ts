import { ErrorHandler, Injectable } from '@angular/core';
import { LoggingService } from './logging.service';

@Injectable()
export class ErrorHandlerService extends ErrorHandler {
  constructor(private loggingService: LoggingService) {
    super();
  }

  public override handleError(error: any): void {
    this.loggingService.logException(error);
  }
}
