import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { AppName, AuthService, RefreshTokenResponse } from '@ui-coe/shared/util/auth';
import jwt_decode from 'jwt-decode';
import { Observable, catchError, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ToastService } from '../services/toast-service';
import * as actions from './core.actions';
import { CoreStateModel } from './core.model';
import { TranslateService } from '@ngx-translate/core';

const defaults: CoreStateModel = {
  token: null,
  userRoles: [],
  orgIds: [],
};

@State<CoreStateModel>({
  name: 'core',
  defaults,
})
@Injectable()
export class CoreState implements NgxsOnInit {
  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {}

  @Selector()
  static data(state: CoreStateModel): CoreStateModel {
    return state;
  }

  ngxsOnInit({ dispatch }: StateContext<CoreStateModel>): void {
    dispatch(new actions.SetToken());
  }

  @Action(actions.SetToken)
  setToken({ dispatch, patchState }: StateContext<CoreStateModel>): void {
    const token = this.authService.getAccessToken();
    if (token) {
      patchState({ token });
      dispatch([new actions.QueryUserRoles()]);
    }
  }

  @Action(actions.QueryUserRoles)
  queryUserRoles({ getState, patchState }: StateContext<CoreStateModel>): void {
    const decodedToken: { roles: string[]; orgId: string[] } = jwt_decode(getState().token);
    patchState({
      userRoles: decodedToken.roles,
      orgIds: decodedToken.orgId,
    });

    if (decodedToken.orgId.length === 0) {
      this.toastService.warning(this.translate.instant('bkws.coreState.noBuyerWarning'));
    }
  }

  @Action(actions.RefreshToken)
  refreshToken({
    dispatch,
    patchState,
  }: StateContext<CoreStateModel>): Observable<RefreshTokenResponse> {
    return this.authService.refreshToken(environment.avidAuthBaseUri).pipe(
      tap((response: RefreshTokenResponse) => {
        if (!jwt_decode(response.return_data.access_token).hasOwnProperty('roles')) {
          this.toastService.warning(this.translate.instant('bkws.coreState.sessionExpired'));

          dispatch(new actions.Logout());
          window.location.replace(
            this.authService.getAvidAuthLoginUrl(environment.avidAuthLoginUrl, AppName.DataCapture)
          );
        } else {
          patchState({
            token: response.return_data.access_token,
          });
        }
      }),
      catchError(err => {
        dispatch(new actions.Logout());
        window.location.replace(
          this.authService.getAvidAuthLoginUrl(environment.avidAuthLoginUrl, AppName.Bkws)
        );
        throw err;
      })
    );
  }

  @Action(actions.Logout)
  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = environment.avidAuthLoginUrl;
  }
}
