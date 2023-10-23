import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import { map, switchMap } from 'rxjs/operators';

import * as AuthActions from './auth.actions';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  initAuth$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.initAuth),
        map(action => this.authService.logIn(action.authUrl, action.appName))
      ),
    { dispatch: false }
  );

  handleSsoCallback$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.handleSsoCallback),
      switchMap(action =>
        this.authService
          .getAuthToken(
            `${action.callbackData.avidAuthBaseUrl}sso/tokens?code=${action.callbackData.code}&state=${action.callbackData.state}`
          )
          .pipe(
            map(res => {
              console.log(res);
              this.authService.saveToken(JSON.stringify(res?.return_data?.tokens));
              this.router.navigate(['/dashboard']);
              // this.router.navigateByUrl(res.return_data.requested_url);
              return AuthActions.loadAuthSuccess({ res });
            })
          )
      )
    )
  );

  loadAuthToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadAuthToken),
      map(action => AuthActions.loadAuthTokenSuccess({ token: this.authService.getAccessToken() }))
    )
  );

  signOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signOut),
        switchMap(action => this.authService.logout().pipe(map(res => console.log(res))))
      ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
