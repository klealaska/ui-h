import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { SharedUiV2Module } from '@ui-coe/shared/ui-v2';

import { CoreState } from './state/core.state';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [CommonModule, NgxsModule.forFeature([CoreState]), SharedUiV2Module, TranslateModule],
})
export class CoreModule {}
