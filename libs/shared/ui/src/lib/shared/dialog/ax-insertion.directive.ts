import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[axAppInsertion]',
})
export class AxInsertionDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
