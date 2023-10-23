import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import { AuthService } from '@ui-coe/shared/util/auth';
import { Store } from '@ngxs/store';
import { CoreSelectors } from '../state/core.selectors';
import { UserRoles } from '../../shared/enums';
@Injectable({
  providedIn: 'root',
})
export class AdminGuard {
  constructor(public authService: AuthService, private store: Store) {}

  canLoad(): Observable<boolean> {
    return this.store
      .select(CoreSelectors.userRoles)
      .pipe(map((roles: string[]) => roles.includes(UserRoles.PortalAdmin)));
  }
}
