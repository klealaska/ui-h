import { Injectable, inject } from '@angular/core';
import { select, Store, Action } from '@ngrx/store';

import * as ShellActions from './shell.actions';
import * as ShellFeature from './shell.reducer';
import * as ShellSelectors from './shell.selectors';

@Injectable()
export class ShellFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(ShellSelectors.selectShellLoaded));
  allShell$ = this.store.pipe(select(ShellSelectors.selectAllShell));
  selectedShell$ = this.store.pipe(select(ShellSelectors.selectEntity));

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(ShellActions.initShell());
  }
}
