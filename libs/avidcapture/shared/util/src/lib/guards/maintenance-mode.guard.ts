import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AppPages, FeatureFlags } from '@ui-coe/avidcapture/shared/types';
import { FeatureFlagValue } from '@ui-coe/shared/types';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceModeGuard {
  featureFlags$: Observable<FeatureFlagValue[]>;

  constructor(private router: Router, private store: Store) {}

  canMatch(): Observable<boolean> {
    return this.checkMaintenanceFlag();
  }

  canActivateChild(): Observable<boolean> {
    return this.checkMaintenanceFlag();
  }

  checkMaintenanceFlag(): Observable<boolean> {
    this.featureFlags$ = this.store.select(state => state.core.featureFlags);

    return this.featureFlags$.pipe(
      mergeMap(ff => ff),
      filter(featureFlag => featureFlag.id === FeatureFlags.maintenanceModeIsActive),
      map(flag => {
        if (flag.enabled) {
          this.router.navigate([AppPages.MaintenancePage]);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
