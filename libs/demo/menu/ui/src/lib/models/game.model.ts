import { TableColumnDef, TableDataDef } from '@ui-coe/shared/ui';

export interface GameTableData {
  gameName: string;
  players: string;
  nestedTableColumnDefs: TableColumnDef[];
  nestedTableDatasource: NestedTableDataSource[];
}

export interface NestedTableDataSource {
  userName: string;
}
export type TableDataType = GameTableData & TableDataDef;
