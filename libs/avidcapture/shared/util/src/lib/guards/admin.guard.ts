import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AppPages, SecurityAttributes } from '@ui-coe/avidcapture/shared/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard {
  userRoles$: Observable<string[]>;

  constructor(private router: Router, private store: Store) {}

  canLoad(): Observable<boolean> {
    this.userRoles$ = this.store.select(state => state.core.userRoles);

    return this.userRoles$.pipe(
      map(userRoles => {
        if (userRoles.includes(SecurityAttributes.Admin)) {
          return true;
        } else {
          this.router.navigate([AppPages.Queue]);
          return false;
        }
      })
    );
  }
}
