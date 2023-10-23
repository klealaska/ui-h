import { Injectable } from '@angular/core';
import { Actions, InitState, ofActionSuccessful, Store, UpdateState } from '@ngxs/store';
import { take } from 'rxjs/operators';

import { LogoutService } from './logout.service';

@Injectable({
  providedIn: 'root',
})
export class LogoutHandler {
  constructor(
    private actions$: Actions,
    private store: Store,
    private logoutService: LogoutService
  ) {
    this.actions$
      .pipe(ofActionSuccessful(InitState), take(1))
      .subscribe(() => (this.logoutService.initialState = this.store.snapshot()));

    this.actions$.pipe(ofActionSuccessful(UpdateState)).subscribe(({ addedStates }) => {
      // const queuePageFilters = this.logoutService.initialState.pendingPage.filters;

      this.logoutService.initialState = {
        ...this.logoutService.initialState,
        ...addedStates,
      };

      // this.logoutService.initialState.pendingPage.filters = queuePageFilters;
    });
  }
}
