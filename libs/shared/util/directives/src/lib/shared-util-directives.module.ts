import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollService } from './scroll/services/scroll.service';
import { ScrollSectionDirective } from './scroll/scroll-section.directive';
import { ScrollAnchorDirective } from './scroll/scroll-anchor.directive';
import { KeepTrackDirective } from './scroll/keep-track.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [ScrollSectionDirective, ScrollAnchorDirective, KeepTrackDirective],
  exports: [ScrollSectionDirective, ScrollAnchorDirective, KeepTrackDirective],
  providers: [ScrollService],
})
export class SharedUtilDirectivesModule {}
