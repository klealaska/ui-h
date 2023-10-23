import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Auth, GroupSettings, Property } from '../../../../models';
import { ConnectorSettingsState } from '../../../connector-settings.state';
import * as actions from '../../../connector-settings.actions';
import { Observable } from 'rxjs';
import { MatInput } from '@angular/material/input';
import { CoreState } from '../../../../core/state/core.state';

@Component({
  selector: 'avc-auth-property',
  templateUrl: './auth-property.component.html',
  styleUrls: ['./auth-property.component.scss'],
})
export class AuthPropertyComponent implements OnInit {
  @Input() property: Property;
  @Input() value: any = '';
  @Output() authChanged = new EventEmitter<string>();
  @Select(CoreState.isLoading) isLoading$: Observable<boolean>;
  @ViewChild('#authInput') authInput: MatInput;

  propertyFormControl: UntypedFormControl;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.propertyFormControl = new UntypedFormControl({ disabled: true });
    this.initializeAuth();
  }

  initializeAuth() {
    this.store.dispatch(new actions.InitializeAuth(this.property.AuthProfile));
  }

  LoginSuccess() {
    this.store.dispatch(new actions.CheckAuth(this.property.AuthProfile)).subscribe(result => {
      this.authFinalized(result);
    });
  }

  authFinalized(result: any): boolean {
    if (result.connectorSettings.jsonSchema.Auth.Finalized) {
      this.saveSettings();
      this.value = 'Authorized on ' + new Date().toLocaleString();
      this.authChanged.emit(this.value);
      this.authInput.focus();
    }
    return result.connectorSettings.jsonSchema.Auth.Finalized;
  }

  saveSettings(): void {
    const changedSettings = this.store.selectSnapshot<GroupSettings[]>(
      ConnectorSettingsState.changedSettings
    );
    const registrationId = this.store.selectSnapshot<number>(CoreState.registrationId);
    this.store.dispatch(new actions.PostConnectorSettings(changedSettings, registrationId));
  }

  signInAuthProfile() {
    const authProfile = this.store.selectSnapshot<Auth>(ConnectorSettingsState.getAuthProperty);
    const sighInWindow = this.openWindow(authProfile.RedirectUrl);

    console.log('Window: ', window.closed);
    const interval = setInterval(() => {
      this.isWindowClosed(interval, sighInWindow);
    }, 500);
  }

  isWindowClosed(interval: any, window: Window): boolean {
    if (window.closed == true) {
      clearInterval(interval);
      this.LoginSuccess();
    }
    return window.closed;
  }

  openWindow = (url: string): any => {
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

    const width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width;
    const height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - 700) / 2 / systemZoom + dualScreenLeft;
    const top = (height - 850) / 2 / systemZoom + dualScreenTop;
    const newWindow = window.open(
      url,
      'Sign in',
      `
      scrollbars=yes,
      width=${700 / systemZoom},
      height=${850 / systemZoom},
      top=${top},
      left=${left}
      `
    );

    // newWindow.focus();
    return newWindow;
  };
}
