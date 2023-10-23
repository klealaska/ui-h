import { GridColumn } from '@ui-coe/shared/ui';
import { DateTime } from 'luxon';

export interface Report {
  headers: string[];
  data:
    | AbsPendingProcessingTrackerData[]
    | ActivityData[]
    | QueueAgingPendingData[]
    | DataException[]
    | InvoiceImage[]
    | ProcessingDataRange[]
    | TransacctionCountByEntity[]
    | ActivityByProperty[];
}

export interface AbsPendingProcessingTrackerData {
  organizationName: string;
  organizationId: string;
  invoicesToBeWorked: number;
  docsInPending: number;
  docsInException: number;
  subSixHour: number;
  sevenToTwelve: number;
  thirteenToEighteen: number;
  nineteenToTwentyfour: number;
  twentyfour: number;
}

export interface ActivityData {
  customer: string;
  usMail: number;
  uploads: number;
  email: number;
  electronicTotal: number;
  total: number;
}

export interface QueueAgingPendingData {
  customerName: string;
  invoiceNumber: string;
  invoiceAmount: number | string;
  vendorName: string;
  propertyName: string;
  propertyCode: string;
  lastEditDate: DateTime;
  daysSinceLastEdit: number;
  source: string;
  sourceEmail: string;
  movedtoQueueBy: string;
  fromQueue: string;
  queue: string;
}

export interface DataException {
  companyName: string;
  exceptionType: string;
  indexer: string;
  twentyfourHours: string;
  moreTwentyfourHours: string;
}

export interface InvoiceImage {
  documentId: string;
  fileName: string;
  status: string;
  invoiceSource: string;
  imageDate: DateTime;
  invoiceNumber: string;
  customerName: string;
  billAccount: string;
}

export interface ProcessingDataRange {
  documentId: string;
  invoiceImage: string;
  invoiceNumber: string;
  invoiceReceivedDate: string;
  invoiceSource: string;
  status: string;
  submittedBy: string;
  supplierName: string;
  supplierAddress: string;
  entityName: string;
  entityCode: string;
  customerAccountNumber: string;
  customerName: string;
}

export interface TransacctionCountByEntity {
  customerName: string;
  yearMonth: string;
  entityName: string;
  entityCode: string;
  electronicInvoiceCount: string;
  paperInvoiceCount: string;
  total: string;
}

export interface ActivityByProperty {
  property: string;
  usMailCount: string;
  usMailPercent: string;
  uploadsCount: string;
  uploadsPercent: string;
  emailCount: string;
  emailPercent: string;
  electronicTotalCount: string;
  electronicTotalPercent: string;
  totalABNCount: string;
  totalABNPercent: string;
  customerManagedCount: string;
  customerManagedPercent: string;
  totalVolume: string;
}
