import { Routes } from '@angular/router';
import { LoginCallbackComponent } from '@ui-coe/shared/ui';
import { AppName, AuthConfig, TokenGuard } from '@ui-coe/shared/util/auth';

import { environment } from '../../environments/environment';
import { AdminGuard } from '../core/guards/admin.guard';
import { HomeModule } from '../home/home.module';
import { LayoutComponent } from '../layout/components/layout/layout.component';

const authConfig: AuthConfig = {
  avidAuthBaseUrl: environment.avidAuthBaseUri,
  avidAuthLoginUrl: environment.avidAuthLoginUrl,
  appName: AppName.DataCapture,
  redirectUrl: 'home',
};

export const applicationRoutes: Routes = [
  {
    path: 'sso/callback',
    component: LoginCallbackComponent,
    data: authConfig,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
    canLoad: [TokenGuard],
    data: authConfig,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        canLoad: [TokenGuard, AdminGuard],
        data: authConfig,
        loadChildren: (): Promise<typeof HomeModule> =>
          import('../home/home.module').then(m => m.HomeModule),
      },
    ],
  },
  { path: '**', pathMatch: 'full', redirectTo: '/home' },
];
