import { Route } from '@angular/router';
import { AppGuard } from '@ui-coe/shared/util/guards';

export const remoteRoutes: Route[] = [
  {
    path: '',
    data: { app: 'bus-hier-spa' },
    canMatch: [AppGuard],
    loadChildren: () => import('@ui-coe/bus-hier/feature').then(m => m.BusHierFeatureModule),
  },
];
