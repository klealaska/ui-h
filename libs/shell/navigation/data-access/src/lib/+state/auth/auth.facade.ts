import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import * as AuthSelectors from './auth.selectors';
import { Observable } from 'rxjs';
import { AppName } from '../../enums/app-name';
import { CallbackData } from '../../models/login-callback-config';
import { AuthService } from '../../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  constructor(private readonly store: Store, private authService: AuthService) {}
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(AuthSelectors.getAuthLoaded));
  allAuth$ = this.store.pipe(select(AuthSelectors.getAllAuth));
  selectedAuth$ = this.store.pipe(select(AuthSelectors.getSelected));
  authToken$ = this.store.pipe(select(AuthSelectors.getAuthToken));
  isAuthenticated: boolean = this.authService.isLoggedIn();
  isAuthenticated$: Observable<boolean> = this.authService.isAuthenticated$;

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init(authUrl: string, appName: AppName) {
    this.store.dispatch(AuthActions.initAuth({ authUrl, appName }));
  }

  handleSsoCallback(callbackData: CallbackData) {
    this.store.dispatch(AuthActions.handleSsoCallback({ callbackData }));
  }

  loadAuthToken() {
    this.store.dispatch(AuthActions.loadAuthToken());
  }

  refreshTokenSuccess(res: any) {
    this.store.dispatch(AuthActions.refreshTokenSuccess({ res }));
  }

  signOut() {
    this.store.dispatch(AuthActions.signOut());
  }
}
