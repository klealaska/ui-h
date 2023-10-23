import { Route } from '@angular/router';
import { AppGuard } from '@ui-coe/shared/util/guards';

export const remoteRoutes: Route[] = [
  {
    path: '',
    data: { app: 'usr-mgmt-spa' },
    canMatch: [AppGuard],
    loadChildren: () => import('@ui-coe/usr-mgmt/feature').then(m => m.UsrMgmtFeatureModule),
  },
];
