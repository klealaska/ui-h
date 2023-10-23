import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizedDatePipe } from './localized-date.pipe';
import { MinmaxPipe } from './minmax.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [LocalizedDatePipe, MinmaxPipe],
  exports: [LocalizedDatePipe, MinmaxPipe],
})
export class SharedUtilPipesModule {}
