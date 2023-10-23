import { AdvancedFilter } from './advanced-filter';
import { SearchBodyControls } from './aggregate-body-request';

export interface SearchBodyRequest {
  Controls: SearchBodyControls;
  Filters?: AdvancedFilter;
  SortField?: string;
  SortDirection?: string;
}
