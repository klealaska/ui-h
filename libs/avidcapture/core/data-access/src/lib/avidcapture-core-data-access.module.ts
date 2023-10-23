import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AvidcaptureCoreUtilModule } from '@ui-coe/avidcapture/core/util';

import { CoreState } from './+state/core.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([CoreState]), AvidcaptureCoreUtilModule],
})
export class AvidcaptureCoreDataAccessModule {}
