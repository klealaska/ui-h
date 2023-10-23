import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { AvidcaptureSharedUiModule } from '@ui-coe/avidcapture/shared/ui';
import { AvidcaptureSharedUtilModule } from '@ui-coe/avidcapture/shared/util';
import {
  ButtonComponent,
  LinkComponent,
  TableComponent,
  TooltipDirective,
} from '@ui-coe/shared/ui-v2';

import { RecycleBinFilterComponent } from './components/recycle-bin-filter/recycle-bin-filter.component';
import { RecycleBinGridComponent } from './components/recycle-bin-grid/recycle-bin-grid.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonComponent,
    LinkComponent,
    TableComponent,
    TooltipDirective,
    MatChipsModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    AvidcaptureSharedUiModule,
    AvidcaptureSharedUtilModule,
    TranslateModule,
  ],
  declarations: [RecycleBinGridComponent, RecycleBinFilterComponent],
  exports: [RecycleBinGridComponent, RecycleBinFilterComponent],
})
export class AvidcaptureRecycleBinUiModule {}
