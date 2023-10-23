export const PAYMENT_LIST_CONTENT_KEY = 'paymentListFeature';

export interface IPaymentListFeatureView {
  title: string;
  searchLabel: string;
  table: IPaymentListTableView;
}

export interface IPaymentListTableView {
  vendorName: string;
  date: string;
  amount: string;
  id: string;
  status: string;
  emptyHeaderMain?: string;
  emptyHeaderSub?: string;
}
