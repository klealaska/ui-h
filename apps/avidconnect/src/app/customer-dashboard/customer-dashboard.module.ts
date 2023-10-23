import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDashboardComponent } from './components/container/customer-dashboard/customer-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { RecentActivityComponent } from './components/container/recent-activity/recent-activity.component';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxsModule } from '@ngxs/store';
import { CustomerDashboardState } from './customer-dashboard.state';
import { OperationsListComponent } from './components/presentation/operations-list/operations-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomerConnectorsComponent } from './components/container/customer-connectors/customer-connectors.component';
import { ConnectorItemComponent } from './components/presentation/connector-item/connector-item.component';
import { AccountingSystemComponent } from './components/presentation/accounting-system/accounting-system.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { ConnectorSettingsModule } from '../connector-settings/connector-settings.module';
import { CoreState } from '../core/state/core.state';
import { PortalDashboardState } from '../portal-dashboard/portal-dashboard.state';

const routes: Routes = [
  {
    path: '',
    component: CustomerDashboardComponent,
    children: [
      {
        path: 'activity',
        component: RecentActivityComponent,
      },
      {
        path: 'connectors',
        component: CustomerConnectorsComponent,
      },
      {
        path: 'connectors/settings',
        loadChildren: (): Promise<typeof ConnectorSettingsModule> =>
          import('../connector-settings/connector-settings.module').then(
            m => m.ConnectorSettingsModule
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [
    CustomerDashboardComponent,
    RecentActivityComponent,
    OperationsListComponent,
    CustomerConnectorsComponent,
    ConnectorItemComponent,
    AccountingSystemComponent,
  ],
  imports: [
    CommonModule,
    NgxsModule.forFeature([CustomerDashboardState, CoreState, PortalDashboardState]),
    RouterModule.forChild(routes),
    SharedModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
  ],
})
export class CustomerDashboardModule {}
