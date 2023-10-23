/**
 * @file This file was generated by ax-lib generator.
 * @copyright AvidXchange Inc.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { UsrMgmtFeatureRoutingModule } from './routing/usr-mgmt-feature-routing.module';
import { UsrMgmtFeatureContainerComponent } from './containers/usr-mgmt-feature-container/usr-mgmt-feature-container.component';
import { UsrMgmtListContainerComponent } from './containers/usr-mgmt-list-container/usr-mgmt-list-container.component';
import { UsrMgmtUiModule } from '@ui-coe/usr-mgmt/ui';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';
import { AxTranslatePipe } from '@ui-coe/shared/util/pipes';
import { UsrMgmtDataAccessModule } from '@ui-coe/usr-mgmt/data-access';
import { ConfigService } from '@ui-coe/shared/util/services';

@NgModule({
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule,
    UsrMgmtDataAccessModule,
    UsrMgmtFeatureRoutingModule,
    UsrMgmtUiModule,
    TranslateModule,
    ButtonComponent,
    AxTranslatePipe,
  ],
  providers: [ConfigService], // TODO: Remove this
  declarations: [UsrMgmtFeatureContainerComponent, UsrMgmtListContainerComponent],
})
export class UsrMgmtFeatureModule {}
