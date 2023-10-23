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
import { ButtonComponent, LinkComponent, TableComponent } from '@ui-coe/shared/ui-v2';

import { ArchiveFieldsComponent } from './components/archive-fields/archive-fields.component';
import { ArchiveFilterComponent } from './components/archive-filter/archive-filter.component';
import { ArchiveGridComponent } from './components/archive-grid/archive-grid.component';
import { ArchiveInvoiceHeaderComponent } from './components/archive-invoice-header/archive-invoice-header.component';

@NgModule({
  imports: [
    CommonModule,
    TableComponent,
    ButtonComponent,
    LinkComponent,
    AvidcaptureSharedUiModule,
    AvidcaptureSharedUtilModule,
    MatChipsModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MatSortModule,
    MatTableModule,
    TranslateModule,
  ],
  declarations: [
    ArchiveFieldsComponent,
    ArchiveFilterComponent,
    ArchiveGridComponent,
    ArchiveInvoiceHeaderComponent,
  ],
  exports: [
    ArchiveFieldsComponent,
    ArchiveFilterComponent,
    ArchiveGridComponent,
    ArchiveInvoiceHeaderComponent,
  ],
})
export class AvidcaptureArchiveUiModule {}
