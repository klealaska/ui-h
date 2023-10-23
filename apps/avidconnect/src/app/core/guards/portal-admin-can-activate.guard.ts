import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserRoles } from '../enums/user-roles';
import { CoreState } from '../state/core.state';

@Injectable({ providedIn: 'root' })
export class PortalAdminCanActivateGuard {
  constructor(private store: Store, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(CoreState.userRoles).pipe(
      map((roles: string[]) => {
        return roles.includes(UserRoles.PortalAdmin)
          ? true
          : this.router.parseUrl('customer-dashboard/activity');
      })
    );
  }
}
