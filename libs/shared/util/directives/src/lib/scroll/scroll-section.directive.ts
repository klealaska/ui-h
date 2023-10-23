import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ScrollService } from './services/scroll.service';

@Directive({
  selector: '[uiCoeScrollSection]',
})
export class ScrollSectionDirective implements OnInit, OnDestroy {
  @Input('uiCoeScrollSection') id: string | number;

  constructor(private host: ElementRef<HTMLElement>, private manager: ScrollService) {}

  ngOnInit() {
    this.manager.register(this);
  }

  ngOnDestroy() {
    this.manager.remove(this);
  }

  scroll() {
    this.host?.nativeElement.scrollIntoView({
      behavior: 'smooth',
    });
  }
}
