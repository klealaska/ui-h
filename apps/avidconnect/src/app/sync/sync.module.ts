import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncNowComponent } from './components/container/sync-now/sync-now.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from '../shared/shared.module';
import { SyncState } from './sync.state';
import { CoreState } from '../core/state/core.state';
import { OperationItemComponent } from './components/presentation/operation-item/operation-item.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  {
    path: '',
    component: SyncNowComponent,
  },
];

@NgModule({
  declarations: [SyncNowComponent, OperationItemComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([SyncState, CoreState]),
    SharedModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
  ],
})
export class SyncModule {}
