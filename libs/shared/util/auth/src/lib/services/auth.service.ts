import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RefreshTokenResponse, TokenDetail, TokenResponse, UserAccount } from '../models';
import jwt_decode from 'jwt-decode';
import { AppName } from '../enums/app-name';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private subscriptions: Subscription[] = [];
  private sessionStorageTokenName = 'tokens';
  private localStorageRefreshTokenName = 'refreshToken';

  constructor(public router: Router, public httpClient: HttpClient) {}

  isLoggedIn(): boolean {
    return sessionStorage.getItem(this.sessionStorageTokenName) ? true : false;
  }

  logout(): void {
    sessionStorage.removeItem(this.sessionStorageTokenName);
    localStorage.removeItem(this.localStorageRefreshTokenName);
    const allCookies = document.cookie.split(';');

    for (let i = 0; i < allCookies.length; i++)
      document.cookie = allCookies[i] + '=;expires=' + new Date(0).toUTCString();
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
      `${avidAuthLoginBaseUrl}/auth/login?to_app=${appName}&sso_callback=${window.location.origin}/sso/callback&to_url=${window.location.href}`
    );
    return avidAuthLoginUrl.href;
  }

  handleSsoCallback(
    avidAuthBaseUrl: string,
    state: string,
    code: string,
    redirectUrl: string
  ): void {
    this.subscriptions.push(
      this.getAuthToken(`${avidAuthBaseUrl}sso/tokens?code=${code}&state=${state}`)
        .pipe(
          tap(data => {
            if (data?.return_data?.tokens) {
              this.saveToken(JSON.stringify(data.return_data.tokens));
              this.redirectToPath(data.return_data.requested_url, redirectUrl);
            }
          }),
          catchError((err: HttpErrorResponse) => {
            throw err;
          })
        )
        .subscribe()
    );
  }

  refreshToken(avidAuthBaseUrl: string): Observable<RefreshTokenResponse> {
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
    if (savedRedirectUrl) {
      window.location.href = decodeURIComponent(savedRedirectUrl);
    } else {
      this.router.navigate([defaultRedirectRoute]);
    }
  }

  private getAuthToken(url: string): Observable<TokenResponse> {
    return this.httpClient.post<TokenResponse>(url, null);
  }

  private getTokenDetail(): TokenDetail {
    return JSON.parse(sessionStorage.getItem(this.sessionStorageTokenName) || '{}') as TokenDetail;
  }

  private saveToken(authToken: string): void {
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
