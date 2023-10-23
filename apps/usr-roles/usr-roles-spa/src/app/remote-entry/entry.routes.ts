import { Route } from '@angular/router';
import { AppGuard } from '@ui-coe/shared/util/guards';

export const remoteRoutes: Route[] = [
  {
    path: '',
    data: { app: 'usr-roles-spa' },
    canMatch: [AppGuard],
    loadChildren: () => import('@ui-coe/usr-roles/feature').then(m => m.UsrRolesFeatureModule),
  },
];
