import { Injectable } from '@angular/core';
import { ActionType, NgxsNextPluginFn, NgxsPlugin } from '@ngxs/store';
import { catchError } from 'rxjs/operators';

@Injectable()
export class NgxsErrorHandlerPlugin implements NgxsPlugin {
  handle(state: any, action: ActionType, next: NgxsNextPluginFn): NgxsNextPluginFn {
    return next(state, action).pipe(
      catchError(error => {
        console.error(error);
        throw error;
      })
    );
  }
}
