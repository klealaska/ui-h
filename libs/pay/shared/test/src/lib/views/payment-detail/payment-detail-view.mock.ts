import { IPaymentDetailFeatureView } from '@ui-coe/pay/shared/types';

export const paymentDetailViewMock: IPaymentDetailFeatureView = {
  searchLabel: 'Filter by vendor',
  paymentDetailsCard: {
    title: 'Payment Details',
    paymentId: 'Payment ID',
    batchId: 'Batch ID',
    fundingAccount: 'Funding Account',
    entityId: 'Entity ID',
  },
  vendorDetailsCard: {
    title: 'Vendor Details',
    vendorId: 'Vendor ID',
    remitAddress: 'Remittance Address',
  },
  paymentDistribution: {
    distributionsHeader: 'Payment Distributions',
    paymentMethod: 'Payment Method',
    paymentDate: 'Payment Date',
    remitAdviceButton: 'Remittance Advice',
    stopPaymentButton: 'Stop Payment',
    stopPayment: {
      title: 'Stop Payment Request',
      description:
        'AvidXchange and the financial institution will attempt to stop the payment. Such attempt may not be successful. When you submit a stop payment request, you agree to be responsible for any charges, costs, fees or liability that may apply.',
      refund: 'Refund',
      reissue: 'Reissue',
      submitButton: 'Submit',
      backButton: 'Back',
    },
    paymentStatusEnum: {
      exampleStatus: 'Status Example',
      stopRequested: 'Stop Requested',
    },
  },
  cancelPayment: {
    title: 'Need to cancel this payment?',
    cancelPaymentMessage:
      'You have until 3PM EST to cancel. You may also need to reconcile this payment in your accounting system.',
    cancelPaymentButton: 'Cancel Payment',
  },
  cancelPaymentConfirmation: {
    title: 'Confirm cancellation',
    cancelConfirmationMessage:
      'We will not process payment TRE7183659. You cannot undo this action.',
    cancelConfirmationButton: 'Cancel Payment',
    closeCancelPaymentButton: 'Close',
  },
  cancelPaymentAlert: {
    cancelPaymentAlertMessage:
      'Payment cancelled. You may also need to reconcile this payment in your accounting system.',
  },
};
