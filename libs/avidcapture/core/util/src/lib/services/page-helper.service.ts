import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Buyer, Environment, PdfJsRequest } from '@ui-coe/avidcapture/shared/types';
import { BuyerComponent, ConfirmComponent } from '@ui-coe/avidcapture/shared/ui';
import { DateTime } from 'luxon';
import { Observable, Subscription, timer } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class PageHelperService {
  subscriptions: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    @Inject('environment') private environment: Environment,
    private toastService: ToastService
  ) {}

  setTimeoutForPageRefresh(): Observable<number> {
    return timer(3000);
  }

  getDateRange(days: number): string[] {
    const startDate: string = DateTime.local()
      .minus({ days })
      .set({
        hour: 0,
        minute: 0,
        second: 0,
      })
      .toString();
    const endDate: string = DateTime.local()
      .set({
        hour: 23,
        minute: 59,
        second: 59,
      })
      .toString();

    return [startDate, endDate];
  }

  getPdfFileRequest(documentId: string, token: string): PdfJsRequest {
    return {
      url: `${this.environment.apiBaseUri}api/file/${documentId}`,
      httpHeaders: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    };
  }

  openFilteredBuyersModal(orgNames: Buyer[]): Observable<Buyer[]> {
    return this.dialog
      .open(BuyerComponent, {
        width: '49.875em',
        disableClose: true,
        data: {
          orgNames,
        },
      })
      .afterClosed();
  }

  openUnlockDocumentModal(): Observable<boolean> {
    return this.dialog
      .open(ConfirmComponent, {
        data: {
          title: 'Unlock document',
          message: 'Are you sure you want to unlock this document?',
        },
      })
      .afterClosed();
  }

  getAllMonthsBetweenDates(dates: string[]): string[] {
    let startDate = DateTime.fromJSDate(new Date(dates[0]));
    const endDate = DateTime.fromJSDate(new Date(dates[1])).endOf('month');

    const allMonthsInDatePeriod = [];

    while (endDate > startDate) {
      allMonthsInDatePeriod.push(startDate.toFormat('yyyy/MM'));
      startDate = startDate.plus({ month: 1 });
    }

    return allMonthsInDatePeriod;
  }

  openUploadErrorToast(message: string): void {
    this.toastService.error(message);
  }
}
