// This file is strictly used for Storybook and not meant for use anywhere else.
import { TableColumnDef, TableDataDef, Paginator } from '@ui-coe/shared/ui';

export interface PeriodicElement {
  position?: number;
  href: string;
  name: string;
  weight: number;
  symbol: string;
  paginator?: Paginator;
  nestedTableColumnDefs: TableColumnDef[];
  nestedTableDatasource: NestedTableDatasource[];
}
export interface NestedTableDatasource {
  position: number;
  name: string;
  weight: number;
  symbol: string;
  checked: boolean;
}

export type TableDataType = PeriodicElement & TableDataDef;
