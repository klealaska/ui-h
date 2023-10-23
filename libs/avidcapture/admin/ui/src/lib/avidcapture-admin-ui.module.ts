import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedUiModule } from '@ui-coe/shared/ui';

import { AdminUsersFilterComponent } from './components/admin-users-filter/admin-users-filter.component';
import { AdminUsersGridComponent } from './components/admin-users-grid/admin-users-grid.component';

@NgModule({
  imports: [CommonModule, SharedUiModule],
  declarations: [AdminUsersFilterComponent, AdminUsersGridComponent],
  exports: [AdminUsersFilterComponent, AdminUsersGridComponent],
})
export class AvidcaptureAdminUiModule {}
