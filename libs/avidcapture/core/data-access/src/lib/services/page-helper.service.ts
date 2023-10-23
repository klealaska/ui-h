import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  AdvancedFilter,
  Buyer,
  Environment,
  EscalationCategoryTypes,
  IngestionTypes,
  PdfJsRequest,
  SortedColumnData,
} from '@ui-coe/avidcapture/shared/types';
import { BuyerComponent } from '@ui-coe/avidcapture/shared/ui';
import { GridColumn } from '@ui-coe/shared/ui';
import { DateTime } from 'luxon';
import { Observable, Subscription, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageHelperService {
  subscriptions: Subscription[] = [];

  constructor(private dialog: MatDialog, @Inject('environment') private environment: Environment) {}

  setTimeoutForPageRefresh(): Observable<number> {
    return timer(3000);
  }

  setPresortedColumnData(
    sortedColumnData: SortedColumnData,
    columnData: GridColumn[]
  ): GridColumn[] {
    return columnData.map(column => {
      const col = Object.keys(sortedColumnData).find(key => key === column.colId);
      const colIndex = Object.keys(sortedColumnData).indexOf(column.colId);

      if (col && colIndex > -1) {
        column.sortIndex = colIndex;
        column.sort = sortedColumnData[col];
      }
      return column;
    });
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

  getPendingPageFilters(state: any, orgIds: string[]): AdvancedFilter {
    if (state.pendingPage) {
      const filters = { ...state.pendingPage.filters, ...state.pendingPage.aggregateFilters };

      return {
        ...filters,
        buyerId:
          filters.buyerId.length === 0
            ? orgIds.slice(0, 10)
            : filters.buyerId.map(buyer => buyer.id),
        escalationCategoryIssue: [EscalationCategoryTypes.None],
        ingestionType: [IngestionTypes.Email, IngestionTypes.Scan],
        isSubmitted: [0],
      };
    } else {
      return {
        buyerId: orgIds.slice(0, 10) as any,
        escalationCategoryIssue: [EscalationCategoryTypes.None],
        ingestionType: [IngestionTypes.Email, IngestionTypes.Scan],
        isSubmitted: [0],
      };
    }
  }

  getResearchPageFilters(state: any, orgIds: string[], categoryList: string[]): AdvancedFilter {
    if (state.researchPage) {
      const filters = { ...state.researchPage.filters, ...state.researchPage.aggregateFilters };

      return {
        ...filters,
        buyerId:
          filters.buyerId.length === 0
            ? orgIds.slice(0, 10)
            : filters.buyerId.map(buyer => buyer.id),
      };
    } else {
      return {
        buyerId: orgIds.slice(0, 10) as any,
        escalationCategoryIssue: [
          `-${EscalationCategoryTypes.None}`,
          `-${EscalationCategoryTypes.Void}`,
          `-${EscalationCategoryTypes.RecycleBin}`,
          ...categoryList,
        ],
        isSubmitted: [0],
      };
    }
  }

  getRecycleBinPageFilters(state: any, orgIds: string[], dateRange: string[]): AdvancedFilter {
    if (state.recycleBinPage) {
      const filters = {
        ...state.recycleBinPage.filters,
        ...state.recycleBinPage.aggregateFilters,
      };

      return {
        ...filters,
        buyerId:
          filters.buyerId.length === 0
            ? orgIds.slice(0, 10)
            : filters.buyerId.map(buyer => buyer.id),
        dateRecycled: dateRange,
      };
    } else {
      return {
        buyerId: orgIds.slice(0, 10) as any,
        escalationCategoryIssue: [`${EscalationCategoryTypes.RecycleBin}`],
        dateRecycled: dateRange,
        isSubmitted: [0],
      };
    }
  }

  getUploadsPageFilters(state: any, orgIds: string[], sourceEmail: string): AdvancedFilter {
    if (state.uploadsQueuePage) {
      const filters = state.uploadsQueuePage.filters;

      return {
        ...filters,
        buyerId:
          filters.buyerId.length === 0
            ? orgIds.slice(0, 10)
            : filters.buyerId.map(buyer => buyer.id),
      };
    } else {
      return {
        buyerId: orgIds.slice(0, 10) as any,
        escalationCategoryIssue: [EscalationCategoryTypes.None],
        ingestionType: [IngestionTypes.Api],
        isSubmitted: [0],
        sourceEmail: [sourceEmail],
      };
    }
  }
}
