import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { CoreState } from '../core/state/core.state';
import * as coreActions from '../core/actions/core.actions';
import { ConfigService } from '@ui-coe/shared/util/services';
import { AuthService } from '@ui-coe/shared/util/auth';
import { ToastStatus } from '../core/enums';
import { ToastService } from '../core/services/toast.service';
import { UserRoles } from '../core/enums/user-roles';
import { map } from 'rxjs/operators';

@Component({
  selector: 'avc-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  constructor(
    private store: Store,
    private configService: ConfigService,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  @Select(CoreState.userDisplayName) userDisplayName$: Observable<string>;
  roles = [];

  ngOnInit(): void {
    this.roles = this.store.selectSnapshot(CoreState.userRoles);
    if (
      !this.roles ||
      (!this.roles.includes(UserRoles.PortalAdmin) && !this.roles.includes(UserRoles.CustomerAdmin))
    ) {
      this.toast.open(
        'The User does not contain any roles, please contact support.',
        ToastStatus.Warning
      );
      setTimeout(() => {
        this.onLogout();
      }, 5000);
    }
  }
  onLogout(): void {
    const subscription = this.store.dispatch(new coreActions.Logout()).subscribe(() => {
      window.location.href = this.configService.get('avidAuthLogoutUrl');
    });
    subscription.unsubscribe();
  }
}
