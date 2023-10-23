import { SearchFilters } from './search-filters';

export interface AggregateBodyRequest {
  Controls: SearchBodyControls;
  Fields?: string[];
  Filters?: SearchFilters;
  GroupBy?: string[];
  ReduceFields?: SearchBodyReduce[];
  ApplyFields?: SearchBodyApplyField[];
  ResultFilters?: SearchBodyResultFilter[];
  SortDirection?: string;
  SortField?: string;
}

export interface SearchBodyControls {
  Page?: string;
  PageSize?: string;
  SourceId: string;
  SearchAllPages?: boolean;
}

export interface SearchBodyReduce {
  LabelName?: string;
  Function: string;
  Alias?: string;
}

export interface SearchBodyApplyField {
  ParameterName?: string;
  ParameterValue?: any; // object on backend
  Function: string;
  Alias: string;
}

export class SearchBodyResultFilter {
  ParameterName: string;
  ParameterValue: any; // object on backend
  Operation: string;
  Chain: string;
}
