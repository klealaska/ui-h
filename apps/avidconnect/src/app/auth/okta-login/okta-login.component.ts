import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as OktaSignIn from '@okta/okta-signin-widget';
import { OktaSignInConfig, OktaSignInWidget } from './okta-login';
@Component({
  selector: 'avc-okta-login',
  templateUrl: './okta-login.component.html',
  styleUrls: ['./okta-login.component.scss'],
})
export class OktaLoginComponent implements OnInit, OnDestroy {
  @Input() config: OktaSignInConfig;

  widget: OktaSignInWidget;

  ngOnInit(): void {
    this.config.el = '#okta-signin-container';
    this.config.logo = '/assets/images/avidxchange_logo.png';
    this.widget = new OktaSignIn(this.config);
    this.widget.showSignInAndRedirect();
  }

  ngOnDestroy(): void {
    this.widget.remove();
  }
}
