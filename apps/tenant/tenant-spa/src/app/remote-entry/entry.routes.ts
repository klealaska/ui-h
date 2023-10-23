import { Route } from '@angular/router';
import { AppGuard } from '@ui-coe/shared/util/guards';

export const remoteRoutes: Route[] = [
  {
    path: '',
    data: { app: 'tenant-spa' },
    canMatch: [AppGuard],
    loadChildren: () => import('@ui-coe/tenant/feature').then(m => m.TenantFeatureModule),
  },
];
