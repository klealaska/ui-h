import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Host,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';

@Directive({
  selector: '[xdcViewportNotifier]',
})
export class ViewportNotifierDirective implements AfterViewInit, OnDestroy {
  @Input() viewportPage: number;
  @Output() visibilityChange = new EventEmitter<number>();

  private observer: IntersectionObserver;

  constructor(@Host() private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    const options = { root: null, rootMargin: '5px', threshold: 0.45 };
    this.observer = new IntersectionObserver(this.callback, options);
    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  private callback = (entries): void => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.visibilityChange.emit(this.viewportPage);
      }
    });
  };
}
