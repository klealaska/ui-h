import { SearchFilters } from './search-filters';
import {
  SearchBodyApplyField,
  SearchBodyControls,
  SearchBodyReduce,
  SearchBodyResultFilter,
} from './aggregate-body-request';

export interface SearchBodyRequest {
  Controls: SearchBodyControls;
  Filters?: SearchFilters;
  GroupBy?: string[];
  ApplyFields?: SearchBodyApplyField[];
  ResultFilters?: SearchBodyResultFilter[];
  ReduceFields?: SearchBodyReduce[];
  SortField?: string;
  SortDirection?: string;
}
