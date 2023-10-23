import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { AvidcaptureSharedUiModule } from '@ui-coe/avidcapture/shared/ui';
import { AvidcaptureSharedUtilModule } from '@ui-coe/avidcapture/shared/util';
import {
  ButtonComponent,
  CheckboxComponent,
  LinkComponent,
  TableComponent,
  TooltipDirective,
} from '@ui-coe/shared/ui-v2';

import { PendingFilterComponent } from './components/pending-filter/pending-filter.component';
import { PendingGridComponent } from './components/pending-grid/pending-grid.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonComponent,
    CheckboxComponent,
    LinkComponent,
    TableComponent,
    TooltipDirective,
    AvidcaptureSharedUiModule,
    AvidcaptureSharedUtilModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    TranslateModule,
  ],
  declarations: [PendingGridComponent, PendingFilterComponent],
  exports: [PendingGridComponent, PendingFilterComponent],
})
export class AvidcapturePendingUiModule {}
