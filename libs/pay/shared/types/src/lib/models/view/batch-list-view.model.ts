export const BATCH_LIST_CONTENT_KEY = 'batchListFeature';

export interface IBatchListFeatureView {
  title: string;
  table: IBatchListTableView;
}

export interface IBatchListTableView {
  batchId: string;
  amount: string;
  totalPayments: string;
  dateSubmitted: string;
  submittedBy: string;
  status: string;
}
