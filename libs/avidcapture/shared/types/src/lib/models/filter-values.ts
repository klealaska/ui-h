import { Buyer } from './buyer';

export interface FilterValues {
  buyer?: Buyer;
  queue?: string;
  startDate?: string;
  endDate?: string;
  source?: string;
  status?: string;
  invoiceNumber?: string;
  customerAccountNumber?: string;
}
