import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AvidcaptureCoreUtilModule } from '@ui-coe/avidcapture/core/util';
import { AvidcaptureIndexingDataAccessModule } from '@ui-coe/avidcapture/indexing/data-access';
import { AvidcaptureIndexingUiModule } from '@ui-coe/avidcapture/indexing/ui';
import { AvidcaptureIndexingUtilModule } from '@ui-coe/avidcapture/indexing/util';
import { AvidcaptureSharedUiModule } from '@ui-coe/avidcapture/shared/ui';
import { ButtonComponent, InputComponent, LinkComponent } from '@ui-coe/shared/ui-v2';

import { DocumentFieldsComponent } from './containers/document-fields/document-fields.component';
import { IndexingPageComponent } from './containers/indexing-page/indexing-page.component';
import { CreateAccountComponent } from './modals/create-account/create-account.component';
import { DuplicateDetectionComponent } from './modals/duplicate-detection/duplicate-detection.component';
import { RejectToSenderCrudComponent } from './modals/reject-to-sender-crud/reject-to-sender-crud.component';

const routes: Routes = [
  {
    path: '',
    component: IndexingPageComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ButtonComponent,
    InputComponent,
    LinkComponent,
    DragDropModule,
    AvidcaptureSharedUiModule,
    AvidcaptureCoreUtilModule,
    AvidcaptureIndexingDataAccessModule,
    AvidcaptureIndexingUiModule,
    AvidcaptureIndexingUtilModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    TranslateModule,
  ],
  declarations: [
    IndexingPageComponent,
    DocumentFieldsComponent,
    CreateAccountComponent,
    DuplicateDetectionComponent,
    RejectToSenderCrudComponent,
  ],
})
export class AvidcaptureIndexingFeatureModule {}
