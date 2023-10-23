import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShellConfigService } from '@ui-coe/shared/util/services';
import { AuthConfig, AuthFacade } from '@ui-coe/shell/navigation/data-access';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'ui-coe-login-callback',
  templateUrl: './login-callback.component.html',
})
export class LoginCallbackComponent implements OnInit {
  state = '';
  code = '';

  constructor(
    public authFacade: AuthFacade,
    private route: ActivatedRoute,
    private shellConfigService: ShellConfigService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        take(1),
        tap(params => {
          this.state = params.get('state') || null;
          this.code = params.get('code') || null;
          const authConfig = this.shellConfigService.authConfig as AuthConfig;

          if (this.state != null && this.code != null && authConfig?.avidAuthBaseUrl) {
            this.authFacade.handleSsoCallback({
              avidAuthBaseUrl: authConfig.avidAuthBaseUrl,
              state: this.state,
              code: this.code,
              redirectUrl: authConfig.redirectUrl,
            });
          }
        })
      )
      .subscribe();
  }
}
