import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minmax',
})
export class MinmaxPipe implements PipeTransform {
  transform(
    value: number,
    minLength: number,
    maxLength: number,
    fallback: number | string
  ): number | string {
    if (value >= minLength && value <= maxLength) {
      return value;
    } else {
      return fallback;
    }
  }
}
