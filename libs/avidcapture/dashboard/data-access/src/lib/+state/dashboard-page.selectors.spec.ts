import {
  getHistoricalVolumeReport,
  getIngestionTypeData,
  getQueueAgingGroupedReport,
  getQueueAgingReport,
  getTopPaperSuppliers,
} from '@ui-coe/avidcapture/shared/test';
import { TimeIntervals } from '@ui-coe/avidcapture/shared/types';
import { DateTime } from 'luxon';

import { DashboardPageSelectors } from './dashboard-page.selectors';

describe('DashboardPageSelectors', () => {
  it('should select dataTransactionCountVolume from state', () => {
    expect(
      DashboardPageSelectors.dataTransactionCountVolume({
        dataTransactionCountVolume: getHistoricalVolumeReport(),
      } as any)
    ).toEqual(getHistoricalVolumeReport());
  });

  it('should select dataExceptionVolume from state', () => {
    expect(
      DashboardPageSelectors.dataExceptionVolume({
        dataExceptionVolume: getHistoricalVolumeReport(),
      } as any)
    ).toEqual(getHistoricalVolumeReport());
  });

  it('should select dataQueueAging from state', () => {
    expect(
      DashboardPageSelectors.dataQueueAging({
        dataQueueAging: getQueueAgingGroupedReport(),
      } as any)
    ).toEqual(getQueueAgingReport());
  });

  it('should select dataQueueAging from state when data is less than twoDaysAgo', () => {
    expect(
      DashboardPageSelectors.dataQueueAging({
        dataQueueAging: [
          { group: DateTime.local().minus({ hours: 12 }).toMillis() / 1000, count: '7' },
        ],
      } as any)
    ).toEqual([{ documentId: '', group: '<1 Day Old', count: '7' }]);
  });

  it('should select dataQueueAging from state when data is greater than twoDaysAgo but less than threeDaysAgo', () => {
    expect(
      DashboardPageSelectors.dataQueueAging({
        dataQueueAging: [
          { group: DateTime.local().minus({ days: 1 }).toMillis() / 1000, count: '7' },
        ],
      } as any)
    ).toEqual([{ documentId: '', group: '1-2 Days Old', count: '7' }]);
  });

  it('should select dataQueueAging from state when data is greater than ThreeDaysAgo but less than moreThreeDaysAgo', () => {
    expect(
      DashboardPageSelectors.dataQueueAging({
        dataQueueAging: [
          { group: DateTime.local().minus({ days: 2 }).toMillis() / 1000, count: '7' },
        ],
      } as any)
    ).toEqual([{ documentId: '', group: '2-3 Days Old', count: '7' }]);
  });

  it('should select averageTimeToSubmission from state & return an average (MINS) when state value is NOT null', () =>
    expect(
      DashboardPageSelectors.averageTimeToSubmission({
        averageTimeToSubmission: {
          sum: 5000,
          count: 10,
        },
        weekendTime: 600,
        timeInSelectedInterval: 42600,
        submissionTimeInterval: TimeIntervals.Minutes,
      } as any)
    ).toBe(1.4));

  it('should select averageTimeToSubmission from state & return an average (HOURS) when state value is NOT null', () =>
    expect(
      DashboardPageSelectors.averageTimeToSubmission({
        averageTimeToSubmission: {
          sum: 5000,
          count: 10,
        },
        weekendTime: 600,
        timeInSelectedInterval: 42600,
        submissionTimeInterval: TimeIntervals.Hours,
      } as any)
    ).toBe(0.02));

  it('should select averageTimeToSubmission from state & return an average (HOURS) when state value is NOT null but weekendTime is NULL', () =>
    expect(
      DashboardPageSelectors.averageTimeToSubmission({
        averageTimeToSubmission: {
          sum: 5000,
          count: 10,
        },
        weekendTime: null,
        timeInSelectedInterval: 42600,
        submissionTimeInterval: TimeIntervals.Hours,
      } as any)
    ).toBe(0.02));

  it('should select averageTimeToSubmission from state & return undefined when state value is null', () =>
    expect(
      DashboardPageSelectors.averageTimeToSubmission({
        averageTimeToSubmission: null,
      } as any)
    ).toBeUndefined());

  it('should select averageTimeToIndex from state when averageTimeToIndex is NOT NULL', () =>
    expect(
      DashboardPageSelectors.averageTimeToIndex({
        averageTimeToIndex: {
          average: '45.78',
          buyerId: '25',
        },
      } as any)
    ).toBe(45.78));

  it('should select averageTimeToSubmission from state & return undefined when state value is NULL', () =>
    expect(
      DashboardPageSelectors.averageTimeToIndex({
        averageTimeToIndex: null,
      } as any)
    ).toBeUndefined());

  it('should select percentageElectronicDelivery from state', () => {
    expect(
      DashboardPageSelectors.percentageElectronicDelivery({
        ingestionType: getIngestionTypeData(),
      } as any)
    ).toBe(67);
  });

  it('should select dataTopPaperSuppliers from state', () => {
    expect(
      DashboardPageSelectors.dataTopPaperSuppliers({
        dataTopPaperSuppliers: getTopPaperSuppliers(),
      } as any)
    ).toEqual(getTopPaperSuppliers());
  });
});
