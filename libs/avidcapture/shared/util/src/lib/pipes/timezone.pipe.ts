import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'timezone',
})
export class TimeZonePipe implements PipeTransform {
  transform(dateString: string): string {
    return DateTime.fromISO(dateString).toFormat('ZZZZ').toUpperCase();
  }
}
