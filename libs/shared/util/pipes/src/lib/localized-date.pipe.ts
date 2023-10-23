import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localizedDate',
})
export class LocalizedDatePipe implements PipeTransform {
  transform(value: Date | string): string {
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toLocaleDateString();
  }
}
