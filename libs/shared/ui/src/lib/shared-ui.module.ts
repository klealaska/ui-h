import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Libraries
import { AgGridModule } from 'ag-grid-angular';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ToastrModule } from 'ngx-toastr';

// Atoms
import { AxHeaderComponent } from './atoms/ax-header/ax-header.component';
import { AxIconComponent } from './atoms/ax-icon/ax-icon.component';
import { AxImageComponent } from './atoms/ax-image/ax-image.component';
import { AxLabelComponent } from './atoms/ax-label/ax-label.component';
import { AxLoadingSpinnerComponent } from './atoms/ax-loading-spinner/ax-loading-spinner.component';
import { AxTextBoxComponent } from './atoms/ax-text-box/ax-text-box.component';

// Molecules
import { AxAgGridCellComponent } from './molecules/ax-ag-grid-cell/ax-ag-grid-cell.component';
import { AxAgGridWrapperComponent } from './molecules/ax-ag-grid-wrapper/ax-ag-grid-wrapper.component';
import { AxCurrentUserComponent } from './molecules/ax-current-user/ax-current-user.component';
import { AxDashboardCardComponent } from './molecules/ax-dashboard-card/ax-dashboard-card.component';
import { AxGridComponent } from './molecules/ax-grid/ax-grid.component';
import { AxMaskedInputComponent } from './molecules/ax-masked-input/ax-masked-input.component';
import { AxPageTitleComponent } from './molecules/ax-page-title/ax-page-title.component';
import { AdminUsersGridComponent } from './admin-users/admin-users-grid/admin-users-grid.component';

// Organisms
import { AxDashboardCardSetComponent } from './organisms/ax-dashboard-card-set/ax-dashboard-card-set.component';
import { AxTopHeaderComponent } from './organisms/ax-top-header/ax-top-header.component';

// shared
import { AxDialogComponent } from './shared/dialog/ax-dialog.component';
import { AxInsertionDirective } from './shared/dialog/ax-insertion.directive';
import { AxDialogService } from './shared/dialog/ax-dialog.service';
import { AxDialogConfig } from './shared/dialog/ax-dialog-config';
import { AxDialogRef } from './shared/dialog/ax-dialog-ref';
import { AxToastService } from './shared/ax-toast/ax-toast.service';
import { AxLinkComponent } from './atoms/ax-link/ax-link.component';
import { AxSlidePanelComponent } from './slide-panel/slide-panel.component';
import { AddAdminUserComponent } from './admin-users/add-admin-user/add-admin-user.component';

// material
import { AutocompleteComponent } from './material/autocomplete/autocomplete.component';
import { ButtonComponent } from './material/button/button.component';
import { ButtonToggleComponent } from './material/button-toggle/button-toggle.component';
import { ChipsAutocompleteComponent } from './material/chips-autocomplete/chips-autocomplete.component';
import { IconComponent } from './material/icon/icon.component';
import { MenuComponent } from './material/menu/menu.component';
import { SlideToggleComponent } from './material/slide-toggle/slide-toggle.component';
import { InputComponent } from './material/input/input.component';
import { LinkComponent } from './material/link/link.component';
import { CheckboxComponent } from './material/checkbox/checkbox.component';
import { ChipComponent } from './material/chip/chip.component';
import { ProgressSpinnerComponent } from './material/progress-spinner/progress-spinner.component';
import { ButtonMenuComponent } from './material/button-menu/button-menu.component';
import { SelectComponent } from './material/select/select.component';
import { ProgressBarComponent } from './material/progress-bar/progress-bar.component';
import { PaginatorComponent } from './material/paginator/paginator.component';

import { LoginCallbackComponent } from './login-callback/login-callback.component';

// Snackbar
import { SnackbarComponent } from './snackbar/snackbar.component';

// Dialog
import { DialogComponent } from './dialog/dialog.component';

// Table
import {
  DynamicExpandableCellComponent,
  DynamicTableCellComponent,
  DynamicTableComponent,
  MobileTableComponent,
  NestedBottomSheetComponent,
  NestedTableComponent,
} from './dynamic-table';

// Material
import { MaterialUiModule } from './material-ui.module';
import { TextEditorComponent } from './rich-text-editor/text-editor/text-editor.component';

//Rich editor
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  declarations: [
    // Atoms
    AxHeaderComponent,
    AxIconComponent,
    AxImageComponent,
    AxLabelComponent,
    AxLoadingSpinnerComponent,
    AxTextBoxComponent,
    // Molecules
    AxAgGridCellComponent,
    AxAgGridWrapperComponent,
    AxCurrentUserComponent,
    AxDashboardCardComponent,
    AxGridComponent,
    AxMaskedInputComponent,
    AxPageTitleComponent,
    AdminUsersGridComponent,
    // Organisms
    AxDashboardCardSetComponent,
    AxTopHeaderComponent,
    // Shared
    AxDialogComponent,
    AxInsertionDirective,
    AxLinkComponent,
    AxSlidePanelComponent,
    AddAdminUserComponent,
    // Material
    AutocompleteComponent,
    ButtonComponent,
    ButtonToggleComponent,
    CheckboxComponent,
    ChipsAutocompleteComponent,
    IconComponent,
    MenuComponent,
    SlideToggleComponent,
    InputComponent,
    LinkComponent,
    ChipComponent,
    ProgressSpinnerComponent,
    ButtonMenuComponent,
    SelectComponent,
    ProgressBarComponent,
    PaginatorComponent,
    LoginCallbackComponent,
    // Snackbar
    SnackbarComponent,
    //dialog
    DialogComponent,
    DynamicTableComponent,
    DynamicTableCellComponent,
    DynamicExpandableCellComponent,
    MobileTableComponent,
    NestedTableComponent,
    NestedBottomSheetComponent,
    //rich text editor
    TextEditorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    AutocompleteLibModule,
    ToastrModule.forRoot(),
    MaterialUiModule,
    NgxEditorModule,
  ],
  exports: [
    // Atoms
    AxHeaderComponent,
    AxIconComponent,
    AxImageComponent,
    AxLabelComponent,
    AxLoadingSpinnerComponent,
    AxTextBoxComponent,
    // Molecules
    AxAgGridCellComponent,
    AxAgGridWrapperComponent,
    AxCurrentUserComponent,
    AxDashboardCardComponent,
    AxGridComponent,
    AxMaskedInputComponent,
    AxPageTitleComponent,
    AdminUsersGridComponent,
    // Organisms
    AxDashboardCardSetComponent,
    AxTopHeaderComponent,
    // Material
    AutocompleteComponent,
    ButtonComponent,
    ButtonToggleComponent,
    CheckboxComponent,
    ChipsAutocompleteComponent,
    IconComponent,
    MenuComponent,
    SlideToggleComponent,
    InputComponent,
    LinkComponent,
    ChipComponent,
    ProgressSpinnerComponent,
    ButtonMenuComponent,
    SelectComponent,
    ProgressBarComponent,
    PaginatorComponent,
    LoginCallbackComponent,
    // Snackbar
    SnackbarComponent,
    // Dialog
    DialogComponent,
    // Slide Panel
    AxSlidePanelComponent,
    // Add User
    AddAdminUserComponent,
    // Table
    DynamicTableComponent,
    DynamicTableCellComponent,
    DynamicExpandableCellComponent,
    MobileTableComponent,
    NestedTableComponent,
    NestedBottomSheetComponent,
    MaterialUiModule,
    // Rich text editor
    TextEditorComponent,
  ],
  providers: [AxDialogConfig, AxDialogRef, AxDialogService, AxToastService],
})
export class SharedUiModule {}
