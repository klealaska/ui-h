import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialUiModule } from './material-ui.module';
import { SharedUtilPipesModule } from '@ui-coe/shared/util/pipes';

@NgModule({
  imports: [
    CommonModule,
    MaterialUiModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUtilPipesModule,
  ],
  declarations: [],
  exports: [MaterialUiModule, SharedUtilPipesModule],
})
export class SharedUiV2Module {}
