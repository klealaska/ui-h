import { DocumentReduce, TimeIntervals, Report } from '@ui-coe/avidcapture/shared/types';

export interface DashboardPageStateModel {
  dataTransactionCountVolume: DocumentReduce[];
  dataExceptionVolume: DocumentReduce[];
  averageTimeToSubmission: DocumentReduce;
  averageTimeToIndex: DocumentReduce;
  dataQueueAging: DocumentReduce[];
  ingestionType: DocumentReduce[];
  dataTopPaperSuppliers: DocumentReduce[];
  weekendTime: number;
  timeInSelectedInterval: number;
  submissionTimeInterval: TimeIntervals;
  transactionCountByEntity: Report;
}
