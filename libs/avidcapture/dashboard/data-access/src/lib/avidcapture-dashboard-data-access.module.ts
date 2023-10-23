import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AvidcaptureDashboardUtilModule } from '@ui-coe/avidcapture/dashboard/util';

import { DashboardPageState } from './+state/dashboard-page.state';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([DashboardPageState]),
    AvidcaptureDashboardUtilModule,
  ],
})
export class AvidcaptureDashboardDataAccessModule {}
