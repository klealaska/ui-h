import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { CoreState } from './state/core.state';
import { CatalogsState } from './state/catalogs.state';
import { ConfigService } from '@ui-coe/shared/util/services';

@NgModule({
  declarations: [],
  providers: [ConfigService],
  imports: [CommonModule, NgxsModule.forFeature([CoreState, CatalogsState])],
})
export class CoreModule {}
