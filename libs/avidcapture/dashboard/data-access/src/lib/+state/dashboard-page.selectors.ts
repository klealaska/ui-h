import { Selector } from '@ngxs/store';
import { DocumentReduce, IngestionTypes, TimeIntervals } from '@ui-coe/avidcapture/shared/types';
import { DateTime } from 'luxon';

import { DashboardPageStateModel } from './dashboard-page.model';
import { DashboardPageState } from './dashboard-page.state';

export class DashboardPageSelectors {
  @Selector([DashboardPageState.data])
  static dataTransactionCountVolume(state: DashboardPageStateModel): DocumentReduce[] {
    state.dataTransactionCountVolume.sort(
      (a, b) => Number(a.dateReceived) - Number(b.dateReceived)
    );

    return state.dataTransactionCountVolume;
  }

  @Selector([DashboardPageState.data])
  static dataExceptionVolume(state: DashboardPageStateModel): DocumentReduce[] {
    return state.dataExceptionVolume;
  }

  @Selector([DashboardPageState.data])
  static averageTimeToSubmission(state: DashboardPageStateModel): number {
    if (state.averageTimeToSubmission != null) {
      const factor = Math.pow(10, 2);
      const businessTime = state.timeInSelectedInterval - (state.weekendTime || 0);
      const avgTimeToProcess =
        Number(state.averageTimeToSubmission.sum) / Number(state.averageTimeToSubmission.count);
      const avg = businessTime / avgTimeToProcess;

      switch (state.submissionTimeInterval) {
        case TimeIntervals.Hours:
          return Math.round((avg / 60 / 60) * factor) / factor;
        case TimeIntervals.Minutes:
          return Math.round((avg / 60) * factor) / factor;
      }
    }
  }

  @Selector([DashboardPageState.data])
  static averageTimeToIndex(state: DashboardPageStateModel): number {
    if (state.averageTimeToIndex != null) {
      const factor = Math.pow(10, 2);

      return Math.round(Number(state.averageTimeToIndex.average) * factor) / factor;
    }
  }

  @Selector([DashboardPageState.data])
  static dataQueueAging(state: DashboardPageStateModel): DocumentReduce[] {
    const queueAging: DocumentReduce[] = [];

    const currentDay = DateTime.local();
    const twoDaysAgo = DateTime.local().minus({ days: 1 });
    const threeDaysAgo = DateTime.local().minus({ days: 2 });
    const moreThreeDaysAgo = DateTime.local().minus({ days: 3 });

    let counter = 0;
    if (state.dataQueueAging && state.dataQueueAging.length > 0) {
      state.dataQueueAging.forEach(data => {
        const groupDate = DateTime.fromMillis(parseInt(data.group) * 1000).toLocal();

        if (groupDate < currentDay && groupDate > twoDaysAgo) {
          queueAging.push({ documentId: '', group: '<1 Day Old', count: data.count });
        } else if (groupDate < twoDaysAgo && groupDate > threeDaysAgo) {
          queueAging.push({ documentId: '', group: '1-2 Days Old', count: data.count });
        } else if (groupDate < threeDaysAgo && groupDate > moreThreeDaysAgo) {
          queueAging.push({ documentId: '', group: '2-3 Days Old', count: data.count });
        } else {
          counter += parseInt(data.count);
        }
      });
      if (counter > 0) {
        queueAging.push({ documentId: '', group: '3+ Days Old', count: counter.toString() });
      }
    }
    return queueAging;
  }

  @Selector([DashboardPageState.data])
  static percentageElectronicDelivery(state: DashboardPageStateModel): number {
    let totalInvoices = 0;
    let totalInvoicesFiltered = 0;
    let percentageElectronicDelivery = 0;

    state.ingestionType
      .filter(x => x.ingestionType !== IngestionTypes.Scan)
      .forEach(data => {
        totalInvoicesFiltered += parseInt(data.count);
      });

    state.ingestionType.forEach(data => {
      totalInvoices += parseInt(data.count);
    });
    percentageElectronicDelivery = Math.round((totalInvoicesFiltered / totalInvoices) * 100);
    return percentageElectronicDelivery;
  }

  @Selector([DashboardPageState.data])
  static dataTopPaperSuppliers(state: DashboardPageStateModel): DocumentReduce[] {
    return state.dataTopPaperSuppliers;
  }
}
