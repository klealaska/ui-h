import { Buyer } from './buyer';

export interface AdvancedFilter extends SearchFilters {
  buyerId?: Buyer[];
  isSubmitted?: number[];
  escalationCategoryIssue?: string[];
  escalationLevel?: string[];
  documentId?: string[];
  customerAccountNumber?: string[];
}

export interface SearchFilters {
  buyerName?: string[];
  ingestionType?: string[];
  fileName?: string[];
  supplier?: string[];
  shipToName?: string[];
  invoiceNumber?: string[];
  sourceEmail?: string[];
  dateReceived?: string[];
  dateSubmitted?: string[];
  dateRecycled?: string[];
  indexingSolutionId?: string[];
  portalStatus?: string[];
  sourceSystemBuyerId?: string[];
}
