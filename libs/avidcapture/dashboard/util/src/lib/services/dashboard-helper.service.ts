import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardHelperService {
  getWeekendTime(startDate: string, endDate: string): number {
    let count = 0;
    let breakLoop = 0;

    const minDate = new Date(startDate);
    const maxDate = new Date(endDate);

    while (minDate <= maxDate && breakLoop < 100) {
      const dayOfWeek = minDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) count++;
      minDate.setDate(minDate.getDate() + 1);
      breakLoop++;
    }

    return count * 24 * 60 * 60;
  }
}
