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

export interface diceColor {
  color: 'yellow' | 'green' | 'red';
}

export interface diceValue {
  value: 'brain' | 'footsteps' | 'shotgun';
}

export type TableDataType = GameTableData & TableDataDef;
