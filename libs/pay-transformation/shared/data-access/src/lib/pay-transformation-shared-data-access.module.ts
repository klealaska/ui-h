import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentFacade } from './content';
@NgModule({
  imports: [CommonModule],
  providers: [ContentFacade],
})
export class PayTransformationSharedDataAccessModule {}
