import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AppPages, FeatureFlags } from '@ui-coe/avidcapture/shared/types';
import { FeatureFlagValue } from '@ui-coe/shared/types';
import { Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagGuard {
  featureFlags$: Observable<FeatureFlagValue[]>;

  constructor(private router: Router, private store: Store) {}

  canLoad(route: Route): Observable<boolean> {
    this.featureFlags$ = this.store.select(state => state.core.featureFlags);

    if (route.path === 'admin/users') {
      return this.featureFlags$.pipe(
        mergeMap(ff => ff),
        filter(featureFlag => featureFlag.id === FeatureFlags.adminIsActive),
        map(flag => {
          if (flag.enabled) {
            return true;
          } else {
            this.router.navigate([AppPages.Queue]);
            return false;
          }
        })
      );
    }

    return of(false);
  }
}
