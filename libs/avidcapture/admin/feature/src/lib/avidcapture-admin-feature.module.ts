import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvidcaptureAdminDataAccessModule } from '@ui-coe/avidcapture/admin/data-access';
import { AvidcaptureAdminUiModule } from '@ui-coe/avidcapture/admin/ui';
import { SharedUiModule } from '@ui-coe/shared/ui';

import { AdminUsersComponent } from './containers/admin-users/admin-users.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: AdminUsersComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedUiModule,
    AvidcaptureAdminDataAccessModule,
    AvidcaptureAdminUiModule,
    TranslateModule,
  ],
  declarations: [AdminUsersComponent],
})
export class AvidcaptureAdminFeatureModule {}
