import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AvidcaptureSharedUtilModule } from '@ui-coe/avidcapture/shared/util';
import {
  ButtonComponent,
  DropdownComponent,
  InputComponent,
  SideSheetV2Component,
  SlideToggleComponent,
  TooltipDirective,
} from '@ui-coe/shared/ui-v2';
import { SharedUploaderFeatureModule } from '@ui-coe/shared/uploader/feature';
import { NgxEditorModule } from 'ngx-editor';

import { ActivityLogComponent } from './components/activity-log/activity-log.component';
import { AdvancedFilterComponent } from './components/advanced-filter/advanced-filter.component';
import { BarChartComponent } from './components/charts/bar-chart/bar-chart.component';
import { HalfPieChartComponent } from './components/charts/half-pie-chart/half-pie-chart.component';
import { HorizontalBarChartComponent } from './components/charts/horizontal-bar-chart/horizontal-bar-chart.component';
import { LineChartComponent } from './components/charts/line-chart/line-chart.component';
import { PieChartComponent } from './components/charts/pie-chart/pie-chart.component';
import { ChipsAutocompleteComponent } from './components/chips-autocomplete/chips-autocomplete.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { DocumentCanvasComponent } from './components/document-canvas/document-canvas.component';
import { DocumentCardSetComponent } from './components/document-card-set/document-card-set.component';
import { DocumentCommandBarComponent } from './components/document-command-bar/document-command-bar.component';
import { DocumentFieldLabelComponent } from './components/document-field-label/document-field-label.component';
import { DocumentViewerComponent } from './components/document-viewer/document-viewer.component';
import { LoadingSpinnerAppComponent } from './components/loading-spinner-app/loading-spinner-app.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { MaskedInputComponent } from './components/masked-input/masked-input.component';
import { BuyerComponent } from './components/modals/buyer/buyer.component';
import { ConfirmComponent } from './components/modals/confirm/confirm.component';
import { PdfPasswordComponent } from './components/modals/pdf-password/pdf-password.component';
import { TimeoutComponent } from './components/modals/timeout/timeout.component';
import { SnackbarBatchActionsComponent } from './components/snackbar-batch-actions/snackbar-batch-actions.component';
import { TextBoxComponent } from './components/text-box/text-box.component';
import { TextEditorComponent } from './components/text-editor/text-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonComponent,
    DropdownComponent,
    InputComponent,
    SideSheetV2Component,
    SlideToggleComponent,
    TooltipDirective,
    SharedUploaderFeatureModule,
    AvidcaptureSharedUtilModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatNativeDateModule,
    MatTooltipModule,
    ScrollingModule,
    TranslateModule,
    NgxEditorModule,
  ],
  declarations: [
    ActivityLogComponent,
    AdvancedFilterComponent,
    BarChartComponent,
    HalfPieChartComponent,
    HorizontalBarChartComponent,
    LineChartComponent,
    PieChartComponent,
    DocumentCardSetComponent,
    DocumentCommandBarComponent,
    DocumentCanvasComponent,
    DocumentViewerComponent,
    LoadingSpinnerComponent,
    BuyerComponent,
    PdfPasswordComponent,
    TimeoutComponent,
    ConfirmComponent,
    ChipsAutocompleteComponent,
    LoadingSpinnerAppComponent,
    DocumentFieldLabelComponent,
    MaskedInputComponent,
    TextBoxComponent,
    TextEditorComponent,
    SnackbarBatchActionsComponent,
    ContextMenuComponent,
  ],
  exports: [
    ActivityLogComponent,
    AdvancedFilterComponent,
    BarChartComponent,
    HalfPieChartComponent,
    HorizontalBarChartComponent,
    LineChartComponent,
    PieChartComponent,
    DocumentCardSetComponent,
    DocumentCommandBarComponent,
    DocumentCanvasComponent,
    DocumentViewerComponent,
    LoadingSpinnerComponent,
    BuyerComponent,
    PdfPasswordComponent,
    TimeoutComponent,
    ConfirmComponent,
    ChipsAutocompleteComponent,
    LoadingSpinnerAppComponent,
    DocumentFieldLabelComponent,
    MaskedInputComponent,
    TextBoxComponent,
    TextEditorComponent,
    SnackbarBatchActionsComponent,
    ContextMenuComponent,
  ],
})
export class AvidcaptureSharedUiModule {}
