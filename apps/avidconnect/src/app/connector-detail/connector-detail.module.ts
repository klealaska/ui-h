import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { ConnectorOperationsComponent } from './components/presentation/connector-operations/connector-operations.component';
import { ConnectorCustomersComponent } from './components/presentation/connector-customers/connector-customers.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ConnectorDetailComponent } from './components/container/connector-detail/connector-detail.component';
import { ConnectorDetailState } from './connector-detail.state';

const routes: Routes = [
  {
    path: '',
    component: ConnectorDetailComponent,
  },
];

@NgModule({
  declarations: [
    ConnectorDetailComponent,
    ConnectorOperationsComponent,
    ConnectorCustomersComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([ConnectorDetailState]),
    SharedModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
})
export class ConnectorDetailModule {}
