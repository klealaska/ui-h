/**
 * @file This file was generated by ax-lib generator.
 * @copyright AvidXchange Inc.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  InputComponent,
  CheckboxComponent,
  SharedUiV2Module,
  TagComponent,
  TableComponent,
} from '@ui-coe/shared/ui-v2';
import { TitleComponent } from './components';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { TenantListComponent } from './components/tenant-list/tenant-list.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import { SharedUtilPipesModule } from '@ui-coe/shared/util/pipes';
import { PageLayoutAddEditComponent } from './components/page-layout-add-edit/page-layout-add-edit.component';
import { SideMenuComponent } from './components/page-layout-add-edit/side-menu/side-menu.component';
import { MatCardModule } from '@angular/material/card';
import { MenuItemComponent } from './components/page-layout-add-edit/side-menu/menu-item/menu-item.component';
import { SharedUtilDirectivesModule } from '@ui-coe/shared/util/directives';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputBackgroundDirective } from './components/customer-details/mat-input-background.directive';
import { TenantListFilterBarComponent } from './components/tenant-list-filter-bar/tenant-list-filter-bar.component';
import { MatSortModule } from '@angular/material/sort';
import { EntitlementsComponent } from './components/entitlements/entitlements.component';

@NgModule({
  imports: [
    CdkTableModule,
    CommonModule,
    MatTableModule,
    InputComponent,
    TagComponent,
    SharedUiV2Module,
    SharedUtilPipesModule,
    ScrollingModule,
    MatCardModule,
    SharedUtilDirectivesModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSortModule,
    CheckboxComponent,
    TableComponent,
  ],
  declarations: [
    TitleComponent,
    PageLayoutComponent,
    PageHeaderComponent,
    TenantListComponent,
    PageLayoutAddEditComponent,
    SideMenuComponent,
    MenuItemComponent,
    CustomerDetailsComponent,
    MatInputBackgroundDirective,
    TenantListFilterBarComponent,
    EntitlementsComponent,
  ],
  exports: [
    TitleComponent,
    PageLayoutComponent,
    PageHeaderComponent,
    TenantListComponent,
    PageLayoutAddEditComponent,
    SideMenuComponent,
    MatCardModule,
    MatFormFieldModule,
    MenuItemComponent,
    CustomerDetailsComponent,
    TenantListFilterBarComponent,
    EntitlementsComponent,
  ],
})
export class TenantUiModule {}