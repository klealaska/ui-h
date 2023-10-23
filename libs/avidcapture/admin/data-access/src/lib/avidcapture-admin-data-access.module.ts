import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { AdminUsersPageState } from './+state/admin-users-page.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([AdminUsersPageState])],
})
export class AvidcaptureAdminDataAccessModule {}
