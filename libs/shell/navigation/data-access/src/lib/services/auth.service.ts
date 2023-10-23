import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RefreshTokenResponse, TokenDetail, TokenResponse, UserAccount } from '../models';
import jwt_decode from 'jwt-decode';
import { AppName } from '../enums/app-name';
import { CallbackData } from '../models/login-callback-config';
import { ShellConfigService } from '@ui-coe/shared/util/services';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private subscriptions: Subscription[] = [];
  private sessionStorageTokenName = 'tokens';
  private localStorageRefreshTokenName = 'refreshToken';
  isAuthenticated$: Observable<boolean> = of(
    sessionStorage.getItem(this.sessionStorageTokenName) ? true : false
  );

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private shellConfigService: ShellConfigService
  ) {}

  isLoggedIn(): boolean {
    return sessionStorage.getItem(this.sessionStorageTokenName) ? true : false;
  }

  logout(): any {
    sessionStorage.removeItem(this.sessionStorageTokenName);
    localStorage.removeItem(this.localStorageRefreshTokenName);
    const allCookies = document.cookie.split(';');
    for (let i = 0; i < allCookies.length; i++)
      document.cookie = allCookies[i] + '=;expires=' + new Date(0).toUTCString();
    window.location.replace(
      this.getAvidAuthLoginUrl(this.shellConfigService.get('avidAuthUrl'), AppName.Shell)
    );
    return of(null);
  }

  logIn(authUrl: string, appName: AppName) {
    window.location.href = this.getAvidAuthLoginUrl(authUrl, appName);
  }

  getAccessToken(): string {
    return this.getTokenDetail().access_token || '';
  }

  getUserInfo(): UserAccount | null {
    const idToken = this.getTokenDetail().id_token;
    return idToken ? jwt_decode(idToken) : null;
  }

  getAvidAuthLoginUrl(avidAuthLoginBaseUrl: string, appName: AppName): string {
    const avidAuthLoginUrl = new URL(
      `${avidAuthLoginBaseUrl}/auth/login?to_app=${appName}&sso_callback=${window.location.origin}/login/callback`
    );
    return avidAuthLoginUrl.href;
  }

  handleSsoCallback(callbackData: CallbackData): void {
    this.subscriptions.push(
      this.getAuthToken(
        `${callbackData.avidAuthBaseUrl}sso/tokens?code=${callbackData.code}&state=${callbackData.state}`
      )
        .pipe(
          tap(data => {
            if (data?.return_data?.tokens) {
              this.saveToken(JSON.stringify(data.return_data.tokens));
              this.redirectToPath(data.return_data.requested_url, callbackData.redirectUrl);
            }
          }),
          catchError((err: HttpErrorResponse) => {
            throw err;
          })
        )
        .subscribe(res => console)
    );
  }

  refreshToken(avidAuthBaseUrl: string): Observable<any> {
    return this.httpClient
      .post<RefreshTokenResponse>(`${avidAuthBaseUrl}jwt/refresh`, {
        access_token: this.getTokenDetail().access_token,
        refresh_token: this.getRefreshToken(),
      })
      .pipe(
        tap(data => {
          if (data?.return_data) {
            this.saveToken(JSON.stringify(data.return_data));
          }
        })
      );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private redirectToPath(savedRedirectUrl: string, defaultRedirectRoute: string): void {
    this.router.navigateByUrl(savedRedirectUrl);

    // if (savedRedirectUrl) {
    //   window.location.href = decodeURIComponent(savedRedirectUrl);
    // } else {
    //   this.router.navigateByUrl(savedRedirectUrl);
    // }
  }

  getAuthToken(url: string): Observable<TokenResponse> {
    return this.httpClient.post<TokenResponse>(url, null);
  }

  private getTokenDetail(): TokenDetail {
    return JSON.parse(sessionStorage.getItem(this.sessionStorageTokenName) || '{}') as TokenDetail;
  }

  saveToken(authToken: string): void {
    const refreshToken = JSON.parse(authToken) as TokenDetail;

    sessionStorage.removeItem(this.sessionStorageTokenName);
    sessionStorage.setItem(this.sessionStorageTokenName, authToken);

    localStorage.removeItem(this.localStorageRefreshTokenName);
    localStorage.setItem(this.localStorageRefreshTokenName, refreshToken.refresh_token);
  }

  private getRefreshToken(): string {
    return localStorage.getItem(this.localStorageRefreshTokenName) || '';
  }
}
