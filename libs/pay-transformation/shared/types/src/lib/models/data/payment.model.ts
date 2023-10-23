import { PaymentStatus, StopPaymentOptions } from '../../enums';

export interface IPayment {
  id: string;
  amount: number;
  date: Date;
  vendorName: string;
  status: string;
}

export interface IPaymentDetail {
  id: string;
  batchId: string;
  amount: number;
  entityId: string;
  fundingAccount: string;
  vendorId: string;
  vendorName: string;
  remitAddress: string;
  date: Date;
  status: string;
  lastUpdatedBy: string;
  lastUpdatedOn: Date;
  distributions: IPaymentDistribution[];
}

export interface IPaymentDistribution {
  id: string;
  amount: number;
  paymentMethod: string;
  paymentType: string;
  date: Date;
  status: PaymentStatus;
}

export interface IStopPayment {
  paymentId?: string;
  distributionId: string;
  option: StopPaymentOptions;
}
