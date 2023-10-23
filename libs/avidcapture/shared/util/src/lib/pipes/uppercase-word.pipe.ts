import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercaseWord',
})
export class UppercaseWordPipe implements PipeTransform {
  transform(value: string): string {
    return `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`;
  }
}
