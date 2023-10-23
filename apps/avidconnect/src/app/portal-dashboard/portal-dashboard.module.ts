import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SharedUiModule } from '@ui-coe/shared/ui';

import { PortalDashboardComponent } from './components/container/portal-dashboard/portal-dashboard.component';
import { CustomersListComponent } from './components/presentation/customers-list/customers-list.component';
import { NgxsModule } from '@ngxs/store';
import { PortalDashboardState } from './portal-dashboard.state';
import { ConnectorsListComponent } from './components/presentation/connectors-list/connectors-list.component';
import { PortalDashboardCustomersComponent } from './components/container/portal-dashboard-customers/portal-dashboard-customers.component';
import { PortalDashboardConnectorsComponent } from './components/container/portal-dashboard-connectors/portal-dashboard-connectors.component';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { CustomerDashboardState } from '../customer-dashboard/customer-dashboard.state';
import { AdminGuard } from '../core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: PortalDashboardComponent,
    children: [
      {
        path: 'customers-list',
        component: PortalDashboardCustomersComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'connectors-list',
        component: PortalDashboardConnectorsComponent,
        canActivate: [AdminGuard],
      },
    ],
  },
];

@NgModule({
  declarations: [
    PortalDashboardComponent,
    CustomersListComponent,
    ConnectorsListComponent,
    PortalDashboardCustomersComponent,
    PortalDashboardConnectorsComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    NgxsModule.forFeature([PortalDashboardState, CustomerDashboardState]),
    CommonModule,
    FormsModule,
    SharedModule,
    SharedUiModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
  ],
})
export class PortalDashboardModule {}
