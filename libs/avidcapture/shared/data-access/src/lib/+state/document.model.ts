import {
  AdvancedFilter,
  Buyer,
  Document,
  ExposedFilter,
  SearchFilters,
  SortedColumnData,
  UploadedDocumentMessage,
} from '@ui-coe/avidcapture/shared/types';

export interface DocumentStateModel {
  invoices: Document[];
  buyers: Buyer[];
  filteredBuyers: Buyer[];
  filters: AdvancedFilter;
  defaultPageFilters: AdvancedFilter;
  aggregateFilters: SearchFilters;
  sortedColumnData: SortedColumnData;
  loadMoreHidden: boolean;
  pageNumber: number;
  scrollPosition: [number, number];
  searchFields: string[];
  canRefreshPage: boolean;
  needsDefaultDateRange: boolean;
  queuesNotAllowedList?: string[];
  exposedFilters?: ExposedFilter[];
  isUploadSuccessful?: boolean;
  uploadedDocumentMessages?: UploadedDocumentMessage[];
  searchByFileNameValue?: string;
}
