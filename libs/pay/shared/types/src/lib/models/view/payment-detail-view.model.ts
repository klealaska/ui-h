export const PAYMENT_DETAIL_VIEW_KEY = 'paymentDetailFeature';

export interface IPaymentDetailFeatureView {
  searchLabel: string;
  paymentDetailsCard: IPaymentDetailsCard;
  vendorDetailsCard: IVendorDetailsCard;
  paymentDistribution: IPaymentDistributionView;
  cancelPayment: ICancelPayment;
  cancelPaymentConfirmation: ICancelPaymentConfirmation;
  cancelPaymentAlert: ICancelPaymentAlert;
}

export interface IPaymentDetailsCard {
  title: string;
  paymentId: string;
  batchId: string;
  fundingAccount: string;
  entityId: string;
}

export interface IVendorDetailsCard {
  title: string;
  vendorId: string;
  remitAddress: string;
}

export interface IPaymentDistributionView {
  distributionsHeader: string;
  paymentMethod: string;
  paymentDate: string;
  remitAdviceButton: string;
  stopPaymentButton: string;
  stopPayment: IStopPaymentView;
  paymentStatusEnum: { [key: string]: string };
}

export interface IStopPaymentView {
  title: string;
  description: string;
  refund: string;
  reissue: string;
  submitButton: string;
  backButton: string;
}

export interface ICancelPayment {
  title: string;
  cancelPaymentMessage: string;
  cancelPaymentButton: string;
}

export interface ICancelPaymentConfirmation {
  title: string;
  cancelConfirmationMessage: string;
  cancelConfirmationButton: string;
  closeCancelPaymentButton: string;
}

export interface ICancelPaymentAlert {
  cancelPaymentAlertMessage: string;
}
