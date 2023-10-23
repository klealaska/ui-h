import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { AvidcaptureDashboardDataAccessModule } from '@ui-coe/avidcapture/dashboard/data-access';
import { AvidcaptureDashboardUiModule } from '@ui-coe/avidcapture/dashboard/ui';
import { AvidcaptureSharedUiModule } from '@ui-coe/avidcapture/shared/ui';

import { DashboardPageComponent } from './containers/dashboard/dashboard-page.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    AvidcaptureDashboardDataAccessModule,
    AvidcaptureDashboardUiModule,
    AvidcaptureSharedUiModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    TranslateModule,
  ],
  declarations: [DashboardPageComponent],
})
export class AvidcaptureDashboardFeatureModule {}
