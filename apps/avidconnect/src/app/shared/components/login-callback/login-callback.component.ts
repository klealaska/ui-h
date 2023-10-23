import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthConfig, AppName } from '@ui-coe/shared/util/auth';
import { ConfigService, SubscriptionManagerService } from '@ui-coe/shared/util/services';
import { take, tap } from 'rxjs/operators';
import { InitApplication } from '../../../core/actions/core.actions';
import { AvcAuthService } from '../../../core/services/avc-auth.service';

@Component({
  selector: 'avc-login-callback',
  template: '',
})
export class LoginCallbackComponent implements OnInit, OnDestroy {
  constructor(
    public authService: AvcAuthService,
    private route: ActivatedRoute,
    private configService: ConfigService,
    private store: Store,
    private subManager: SubscriptionManagerService
  ) {}

  private readonly _subKey = this.subManager.init();

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        take(1),
        tap(params => {
          const state = params.get('state');
          const code = params.get('code');

          const authConfig: AuthConfig = {
            avidAuthBaseUrl: this.configService.get('avidAuthBaseUri'),
            avidAuthLoginUrl: this.configService.get('avidAuthLoginUrl'),
            appName: this.configService.get('appName') as AppName,
            redirectUrl: this.configService.get('redirectUrl'),
          };

          if (state != null && code != null && authConfig.avidAuthBaseUrl) {
            this.subManager.add(
              this._subKey,
              this.authService.handleSsoCallback(
                authConfig.avidAuthBaseUrl,
                state,
                code,
                authConfig.redirectUrl
              ),
              () => this.store.dispatch(new InitApplication())
            );
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subManager.tearDown(this._subKey);
  }
}
