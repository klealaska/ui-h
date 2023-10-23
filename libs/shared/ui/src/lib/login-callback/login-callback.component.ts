import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, AuthConfig } from '@ui-coe/shared/util/auth';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'ax-login-callback',
  templateUrl: './login-callback.component.html',
})
export class LoginCallbackComponent implements OnInit {
  state = '';
  code = '';

  constructor(public authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        take(1),
        tap(params => {
          this.state = params.get('state') || null;
          this.code = params.get('code') || null;
        })
      )
      .subscribe();

    this.route.data
      .pipe(
        take(1),
        tap((params: AuthConfig) => {
          if (this.state != null && this.code != null && params?.avidAuthBaseUrl) {
            this.authService.handleSsoCallback(
              params.avidAuthBaseUrl,
              this.state,
              this.code,
              params.redirectUrl
            );
          }
        })
      )
      .subscribe();
  }
}
