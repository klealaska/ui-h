import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';
import { CoreState } from '../state/core.state';
import { UserRoles } from '../enums/user-roles';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard {
  constructor(private store: Store) {}

  canActivate(): Observable<boolean> {
    return this.store
      .select(CoreState.userRoles)
      .pipe(map((roles: string[]) => roles.includes(UserRoles.PortalAdmin)));
  }
}
