export interface TableColumnDef {
  columnDef: string;
  headerCellDef: string;
  cellDef: CellDef;
}

export interface CellDef {
  type: string;
  value: any;
  mobileView?: number;
}

export interface Paginator {
  disabled?: boolean;
  hidePageSize?: boolean;
  length?: number;
  pageIndex?: number;
  pageSize?: number;
  pageSizeOptions?: Array<number>;
  showFirstLastButtons: boolean;
  page?: ($event) => any;
  pageLabels?: PaginatorPageLabels;
}

export interface PaginatorPageLabels {
  firstPageLabel?: string;
  lastPageLabel?: string;
  nextPageLabel?: string;
  previousPageLabel?: string;
  itemsPerPageLabel?: string;
}

export interface DefaultSort {
  column: string;
  direction: string;
}

export type TableColumnDefs = Array<TableColumnDef>;
