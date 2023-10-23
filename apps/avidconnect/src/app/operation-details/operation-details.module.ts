import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationDetailsComponent } from './components/container/operation-details/operation-details.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { OperationInfoComponent } from './components/presentation/operation-info/operation-info.component';
import { OperationState } from './operation.state';
import { CoreState } from '../core/state/core.state';
import { SharedModule } from '../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { OperationDataComponent } from './components/presentation/operation-data/operation-data.component';
import { MatTabsModule } from '@angular/material/tabs';
import { OperationLogsComponent } from './components/presentation/operation-logs/operation-logs.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AdminGuard } from '../core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: OperationDetailsComponent,
  },
];

@NgModule({
  declarations: [
    OperationDetailsComponent,
    OperationInfoComponent,
    OperationDataComponent,
    OperationLogsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([OperationState, CoreState]),
    SharedModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
})
export class OperationDetailsModule {}
