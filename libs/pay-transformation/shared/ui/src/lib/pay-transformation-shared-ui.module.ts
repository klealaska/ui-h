import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PageBodyComponent } from './components/page-body/page-body.component';
import { TitleBarComponent } from './components/title-bar/title-bar.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule],
  declarations: [PageBodyComponent, TitleBarComponent, EmptyStateComponent],
  exports: [PageBodyComponent, TitleBarComponent, EmptyStateComponent],
})
export class PayTransformationSharedUiModule {}
