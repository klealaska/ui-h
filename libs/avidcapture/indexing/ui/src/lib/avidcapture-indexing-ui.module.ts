import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AvidcaptureSharedUiModule } from '@ui-coe/avidcapture/shared/ui';
import {
  ButtonComponent,
  DropdownComponent,
  DropzoneComponent,
  DropzoneDirective,
  InputComponent,
  TextareaComponent,
  TooltipDirective,
} from '@ui-coe/shared/ui-v2';
import { SharedUploaderFeatureModule } from '@ui-coe/shared/uploader/feature';
import { NgxEditorModule } from 'ngx-editor';

import { DropdownFieldComponent } from './components/dropdown-field/dropdown-field.component';
import { EscalationReasonComponent } from './components/escalation-reason/escalation-reason.component';
import { IndexingHeaderComponent } from './components/indexing-header/indexing-header.component';
import { LookupFieldsComponent } from './components/lookup-fields/lookup-fields.component';
import {
  DocumentSwapComponent,
  EscalationSelectionComponent,
  RejectToSenderComponent,
} from './components/modals';
import { NonLookupFieldComponent } from './components/non-lookup-field/non-lookup-field.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SharedUploaderFeatureModule,
    AvidcaptureSharedUiModule,
    ButtonComponent,
    DropdownComponent,
    DropzoneComponent,
    DropzoneDirective,
    InputComponent,
    TextareaComponent,
    TooltipDirective,

    MatAutocompleteModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatTooltipModule,
    NgxEditorModule,
    DragDropModule,
    TranslateModule,
  ],
  declarations: [
    IndexingHeaderComponent,
    DropdownFieldComponent,
    EscalationReasonComponent,
    LookupFieldsComponent,
    NonLookupFieldComponent,
    DocumentSwapComponent,
    EscalationSelectionComponent,
    RejectToSenderComponent,
  ],
  exports: [
    IndexingHeaderComponent,
    DropdownFieldComponent,
    EscalationReasonComponent,
    LookupFieldsComponent,
    NonLookupFieldComponent,
    DocumentSwapComponent,
    EscalationSelectionComponent,
    RejectToSenderComponent,
  ],
})
export class AvidcaptureIndexingUiModule {}
