import { CellDef } from './ax-table-column-def';

export interface TableDataDef {
  isExpandable: boolean;
  isExpanded: boolean;
  component: CellDef;
  mobileView: MobileView;
}

export interface MobileView {
  doubleColumnTop: boolean;
}
