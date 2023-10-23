// TODO remove this directive when we have a component with background options from DSM
import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[uiCoeMatInputBackground]',
})
export class MatInputBackgroundDirective implements AfterViewInit {
  @Input() cssClass: string;
  constructor(private host: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const inputDiv = this.host.nativeElement.querySelector('.mat-form-field-outline');
    this.renderer.addClass(inputDiv, this.cssClass);
  }
}
