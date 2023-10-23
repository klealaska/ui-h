import { AdvancedFilter } from './advanced-filter';

export interface AggregateBodyRequest {
  Controls: SearchBodyControls;
  Fields?: string[];
  Filters?: AdvancedFilter;
  SortBy?: { [colId: string]: string };
  GroupBy?: string[];
  ReduceFields?: SearchBodyReduce[];
  ApplyFields?: SearchBodyApplyField[];
  ResultFilters?: SearchBodyResultFilter[];
}

export interface SearchBodyControls {
  Page?: number;
  PageSize?: number;
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
