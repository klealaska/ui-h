import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';

import { AppName, AuthService, TokenDetail, TokenResponse } from '@ui-coe/shared/util/auth';
import { ConfigService } from '@ui-coe/shared/util/services';

@Injectable({ providedIn: 'root' })
export class AvcAuthService extends AuthService {
  private _sessionStorageTokenName = 'tokens';

  constructor(
    public router: Router,
    public httpClient: HttpClient,
    private configService: ConfigService
  ) {
    super(router, httpClient);
  }

  public isLoggedIn(): boolean {
    const token = sessionStorage.getItem(this._sessionStorageTokenName);
    return token && !this.isTokenExpired() ? true : false;
  }

  public isTokenExpired(): boolean {
    return Date.now() >= this.getTokenExpirationDate() * 1000;
  }

  public isRefreshTokenExpired(): boolean {
    // according to AvidAuth:
    //   Normal settings (all environments - with refresh) are:
    //   AccessTokens expires after 13mins
    //   RefreshToken expires after 17mins
    // so we need to add 240 seconds to the access token expiration
    const exp = (this.getTokenExpirationDate() + 240) * 1000;
    return Date.now() >= exp;
  }

  // overwriting this method to return an observable
  // in order to create some determinism in the sequence of events
  // and to ensure that the token is returned and saved before
  // we try to check which roles the user has
  public handleSsoCallback(
    avidAuthBaseUrl: string,
    state: string,
    code: string,
    redirectUrl: string
  ): Observable<any> {
    return this.getAvcAuthToken(`${avidAuthBaseUrl}sso/tokens?code=${code}&state=${state}`).pipe(
      map(data => {
        if (data?.return_data?.tokens) {
          this.saveAvcToken(JSON.stringify(data.return_data.tokens));
          this.router.navigate([redirectUrl]);
        }
      }),
      catchError((err: HttpErrorResponse) => {
        throw err;
      })
    );
  }

  public getAvidAuthLoginUrl(avidAuthLoginBaseUrl: string, appName: AppName): string {
    const isProd = this.configService.get('production');

    let loginUrl = `${avidAuthLoginBaseUrl}/auth/login?to_app=${appName}`;
    if (!isProd) {
      loginUrl += `&sso_callback=${window.location.origin}/sso/callback`;
    }
    return loginUrl;
  }

  public getTokenExpirationDate(): number {
    const decodedToken = this.avcGetTokenDetail();
    if (decodedToken.access_token) {
      const accessToken = jwt_decode(decodedToken.access_token);
      return accessToken['exp'];
    }
    return 0;
  }

  private getAvcAuthToken(url: string): Observable<TokenResponse> {
    return this.httpClient.post<TokenResponse>(url, null);
  }

  private saveAvcToken(authToken: string): void {
    sessionStorage.setItem(this._sessionStorageTokenName, authToken);
  }

  private avcGetTokenDetail(): TokenDetail {
    return JSON.parse(sessionStorage.getItem(this._sessionStorageTokenName) || '{}') as TokenDetail;
  }
}
