import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@ui-coe/shared/ui';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PortalDashboardModule } from '../portal-dashboard/portal-dashboard.module';
import { PortalMessageModule } from '../portal-message/portal-message.module';
import { CustomerDashboardModule } from '../customer-dashboard/customer-dashboard.module';
import { DataSelectionModule } from '../data-selection/data-selection.module';
import { SyncModule } from '../sync/sync.module';
import { ScheduleSyncModule } from '../schedule-sync/schedule-sync.module';
import { ConnectorDetailModule } from '../connector-detail/connector-detail.module';
import { OperationDetailsModule } from '../operation-details/operation-details.module';
import { LoginCallbackComponent } from '../shared/components/login-callback/login-callback.component';
import { TokenGuard } from '../core/guards/token.guard';
import { PortalAdminCanActivateGuard } from '../core/guards/portal-admin-can-activate.guard';

const routes: Routes = [
  {
    path: 'sso/callback',
    component: LoginCallbackComponent,
  },
  { path: '', pathMatch: 'full', redirectTo: 'portal-dashboard/customers-list' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'portal-dashboard',
        canLoad: [TokenGuard],
        canActivate: [PortalAdminCanActivateGuard],
        loadChildren: (): Promise<typeof PortalDashboardModule> =>
          import('../portal-dashboard/portal-dashboard.module').then(m => m.PortalDashboardModule),
      },
      {
        path: 'customer-dashboard',
        canLoad: [TokenGuard],

        loadChildren: (): Promise<typeof CustomerDashboardModule> =>
          import('../customer-dashboard/customer-dashboard.module').then(
            m => m.CustomerDashboardModule
          ),
      },
      {
        path: 'connector-detail',
        canLoad: [TokenGuard],

        loadChildren: (): Promise<typeof ConnectorDetailModule> =>
          import('../connector-detail/connector-detail.module').then(m => m.ConnectorDetailModule),
      },
      {
        path: 'operation-details',
        canLoad: [TokenGuard],

        loadChildren: (): Promise<typeof OperationDetailsModule> =>
          import('../operation-details/operation-details.module').then(
            m => m.OperationDetailsModule
          ),
      },
      {
        path: 'data-selection',
        canLoad: [TokenGuard],

        loadChildren: (): Promise<typeof DataSelectionModule> =>
          import('../data-selection/data-selection.module').then(m => m.DataSelectionModule),
      },
      {
        path: 'schedule-sync',
        canLoad: [TokenGuard],

        loadChildren: (): Promise<typeof ScheduleSyncModule> =>
          import('../schedule-sync/schedule-sync.module').then(m => m.ScheduleSyncModule),
      },
      {
        path: 'logged-out',
        canLoad: [TokenGuard],

        loadChildren: (): Promise<typeof PortalMessageModule> =>
          import('../portal-message/portal-message.module').then(m => m.PortalMessageModule),
      },
    ],
  },
  {
    path: '',
    children: [
      {
        path: 'sync-now',
        canLoad: [TokenGuard],
        loadChildren: (): Promise<typeof SyncModule> =>
          import('../sync/sync.module').then(m => m.SyncModule),
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'portal-dashboard/customers-list',
  },
];

@NgModule({
  declarations: [LayoutComponent, HeaderComponent, FooterComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedUiModule, MatDialogModule],
  exports: [RouterModule],
})
export class LayoutModule {}
