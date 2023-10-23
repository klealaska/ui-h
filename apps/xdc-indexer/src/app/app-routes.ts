import { Injector } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AvidcaptureAdminFeatureModule } from '@ui-coe/avidcapture/admin/feature';
import { AvidcaptureArchiveFeatureModule } from '@ui-coe/avidcapture/archive/feature';
import { AvidcaptureDashboardFeatureModule } from '@ui-coe/avidcapture/dashboard/feature';
import { AvidcaptureErrorPageComponent } from '@ui-coe/avidcapture/error-page/feature';
import { AvidcaptureMaintenancePageComponent } from '@ui-coe/avidcapture/maintenance-page/feature';
import { AvidcaptureIndexingFeatureModule } from '@ui-coe/avidcapture/indexing/feature';
import { AvidcaptureMyUploadsFeatureModule } from '@ui-coe/avidcapture/my-uploads/feature';
import { AvidcapturePendingFeatureModule } from '@ui-coe/avidcapture/pending/feature';
import { AvidcaptureRecycleBinFeatureModule } from '@ui-coe/avidcapture/recycle-bin/feature';
import { AvidcaptureResearchFeatureModule } from '@ui-coe/avidcapture/research/feature';
import { AppPages } from '@ui-coe/avidcapture/shared/types';
import {
  AdminGuard,
  ClaimsGuard,
  FeatureFlagGuard,
  MaintenanceModeGuard,
} from '@ui-coe/avidcapture/shared/util';
import { LoginCallbackComponent } from '@ui-coe/shared/ui';
import { AppName, AuthConfig, TokenGuard } from '@ui-coe/shared/util/auth';

import { environment } from '../environments/environment';
import { LayoutComponent } from './layout/components/layout/layout.component';

export function onAuthRequired(injector: Injector): void {
  const router = injector.get(Router);

  router.navigate(['/login']);
}

const authConfig: AuthConfig = {
  avidAuthBaseUrl: environment.avidAuthBaseUri,
  avidAuthLoginUrl: environment.avidAuthLoginUrl,
  appName: AppName.DataCapture,
  redirectUrl: AppPages.Queue,
};

export const applicationRoutes: Route[] = [
  {
    path: 'sso/callback',
    component: LoginCallbackComponent,
    data: authConfig,
  },
  {
    path: '',
    pathMatch: 'full',
    canLoad: [TokenGuard, ClaimsGuard],
    redirectTo: AppPages.Queue,
    data: authConfig,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivateChild: [MaintenanceModeGuard],
    children: [
      {
        path: AppPages.Archive,
        canLoad: [TokenGuard, ClaimsGuard],
        data: authConfig,
        title: 'AvidCapture - Archive',
        loadChildren: (): Promise<typeof AvidcaptureArchiveFeatureModule> =>
          import('@ui-coe/avidcapture/archive/feature').then(
            m => m.AvidcaptureArchiveFeatureModule
          ),
      },
      {
        path: AppPages.Dashboard,
        canLoad: [TokenGuard, ClaimsGuard],
        data: authConfig,
        title: 'AvidCapture - Dashboard',
        loadChildren: (): Promise<typeof AvidcaptureDashboardFeatureModule> =>
          import('@ui-coe/avidcapture/dashboard/feature').then(
            m => m.AvidcaptureDashboardFeatureModule
          ),
      },
      {
        path: `${AppPages.IndexingPage}/:docId`,
        canLoad: [TokenGuard],
        data: authConfig,
        title: 'AvidCapture - Indexing',
        loadChildren: (): Promise<typeof AvidcaptureIndexingFeatureModule> =>
          import('@ui-coe/avidcapture/indexing/feature').then(
            m => m.AvidcaptureIndexingFeatureModule
          ),
      },
      {
        path: AppPages.Queue,
        canLoad: [TokenGuard, ClaimsGuard],
        data: authConfig,
        title: 'AvidCapture - Pending',
        loadChildren: (): Promise<typeof AvidcapturePendingFeatureModule> =>
          import('@ui-coe/avidcapture/pending/feature').then(
            m => m.AvidcapturePendingFeatureModule
          ),
      },
      {
        path: AppPages.Research,
        canLoad: [TokenGuard, ClaimsGuard],
        data: authConfig,
        title: 'AvidCapture - Research',
        loadChildren: (): Promise<typeof AvidcaptureResearchFeatureModule> =>
          import('@ui-coe/avidcapture/research/feature').then(
            m => m.AvidcaptureResearchFeatureModule
          ),
      },
      {
        path: AppPages.RecycleBin,
        canLoad: [TokenGuard, ClaimsGuard],
        data: authConfig,
        title: 'AvidCapture - Recycle Bin',
        loadChildren: (): Promise<typeof AvidcaptureRecycleBinFeatureModule> =>
          import('@ui-coe/avidcapture/recycle-bin/feature').then(
            m => m.AvidcaptureRecycleBinFeatureModule
          ),
      },
      {
        path: `${AppPages.Admin}/users`,
        canLoad: [AdminGuard, TokenGuard, FeatureFlagGuard],
        data: authConfig,
        loadChildren: (): Promise<typeof AvidcaptureAdminFeatureModule> =>
          import('@ui-coe/avidcapture/admin/feature').then(m => m.AvidcaptureAdminFeatureModule),
      },
      {
        path: AppPages.UploadsQueue,
        canLoad: [TokenGuard],
        data: authConfig,
        title: 'AvidCapture - My Uploads',
        loadChildren: (): Promise<typeof AvidcaptureMyUploadsFeatureModule> =>
          import('@ui-coe/avidcapture/my-uploads/feature').then(
            m => m.AvidcaptureMyUploadsFeatureModule
          ),
      },
    ],
  },
  {
    path: AppPages.ErrorPage,
    canLoad: [TokenGuard, ClaimsGuard],
    canMatch: [MaintenanceModeGuard],
    data: authConfig,
    loadComponent: (): Promise<typeof AvidcaptureErrorPageComponent> =>
      import('@ui-coe/avidcapture/error-page/feature').then(m => m.AvidcaptureErrorPageComponent),
  },
  {
    path: AppPages.MaintenancePage,
    canLoad: [TokenGuard, ClaimsGuard],
    data: authConfig,
    loadComponent: (): Promise<typeof AvidcaptureMaintenancePageComponent> =>
      import('@ui-coe/avidcapture/maintenance-page/feature').then(
        m => m.AvidcaptureMaintenancePageComponent
      ),
  },
  {
    path: '**',
    pathMatch: 'full',
    canLoad: [TokenGuard, ClaimsGuard],
    canMatch: [MaintenanceModeGuard],
    redirectTo: AppPages.Queue,
  },
];
