import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[avcActivateCode]',
})
export class ActivateCodeDirective {
  @HostListener('input', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    const trimmed = input.value.replace(/\s+/g, '');

    const numbers = [];
    for (let i = 0; i < trimmed.length; i += 4) {
      numbers.push(trimmed.substr(i, 4));
    }

    input.value = numbers.join(' ');
  }
}
