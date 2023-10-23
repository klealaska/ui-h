import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'dateMilli',
})
export class DateMilliPipe implements PipeTransform {
  transform(value: number, format: string): string {
    return DateTime.fromMillis(value * 1000).toFormat(format);
  }
}
