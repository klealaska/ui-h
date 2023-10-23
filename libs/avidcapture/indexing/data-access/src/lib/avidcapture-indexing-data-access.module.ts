import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { IndexingDocumentFieldsState } from './+state/indexing-document-fields';
import { IndexingPageState } from './+state/indexing-page';
import { IndexingUtilityState } from './+state/indexing-utility';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([IndexingPageState, IndexingDocumentFieldsState, IndexingUtilityState]),
  ],
})
export class AvidcaptureIndexingDataAccessModule {}
