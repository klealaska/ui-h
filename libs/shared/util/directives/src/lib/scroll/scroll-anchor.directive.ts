import { Directive, HostListener, Input } from '@angular/core';
import { ScrollService } from './services/scroll.service';

@Directive({
  selector: '[uiCoeScrollAnchor]',
})
export class ScrollAnchorDirective {
  @Input('uiCoeScrollAnchor') id: string | number | any;

  constructor(private scrollService: ScrollService) {}

  @HostListener('click')
  navigate() {
    this.scrollService.scroll(this.id);
  }
}
