import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Directive({
  selector: '[uiCoeMarkAsterisk]',
  standalone: true,
})
export class MarkAsteriskDirective implements OnChanges {
  @Input('uiCoeMarkAsterisk') showRequired = true;
  @ViewChild('uiCoeMarkAsterisk') el: ElementRef;
  asterisk: any;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  private update() {
    if (this.showRequired) {
      this.asterisk = this.renderer.createElement('span');
      const text = this.renderer.createText('*');
      this.renderer.appendChild(this.asterisk, text);
      this.renderer.addClass(this.asterisk, 'asterisk');
      this.renderer.insertBefore(
        this.elementRef.nativeElement,
        this.asterisk,
        this.elementRef.nativeElement.firstChild
      );
    } else {
      if (this.asterisk) {
        this.renderer.removeChild(this.elementRef.nativeElement, this.asterisk);
      }
    }
  }
}
