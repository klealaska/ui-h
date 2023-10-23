import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleSyncComponent } from './components/container/schedule-sync/schedule-sync.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from '../shared/shared.module';
import { ScheduleListComponent } from './components/presentation/schedule-list/schedule-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ScheduleSyncState } from './schedule-sync.state';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScheduleModalComponent } from './components/presentation/schedule-modal/schedule-modal.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreState } from '../core/state/core.state';

const routes: Routes = [
  {
    path: '',
    component: ScheduleSyncComponent,
  },
];

@NgModule({
  declarations: [ScheduleSyncComponent, ScheduleListComponent, ScheduleModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([ScheduleSyncState, CoreState]),
    ReactiveFormsModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatRadioModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
})
export class ScheduleSyncModule {}
