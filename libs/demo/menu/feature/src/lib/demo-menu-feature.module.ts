import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MenuComponent } from './containers/menu/menu.component';
import { SharedUiModule } from '@ui-coe/shared/ui';
import { DemoMenuUiModule } from '@ui-coe/demo/menu/ui';
import { DemoSharedUiModule } from '@ui-coe/demo/shared/ui';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    SharedUiModule,
    DemoMenuUiModule,
    DemoSharedUiModule,
    RouterModule.forChild([{ path: '', pathMatch: 'full', component: MenuComponent }]),
    ButtonComponent,
  ],
  declarations: [MenuComponent],
  exports: [MenuComponent],
})
export class DemoMenuFeatureModule {}
