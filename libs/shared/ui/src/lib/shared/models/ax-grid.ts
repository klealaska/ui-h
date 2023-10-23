import { ColDef } from 'ag-grid-community';

export interface GridColumn extends ColDef {
  imageCell?: {
    valueGetter: any;
  };

  textCell?: TextCell;
  multiLineTextCell?: TextCell[];

  linkCell?: {
    valueGetter: any;
    bold?: boolean;
    size?: string;
    isLocked?: (value: any) => boolean;
  };

  tooltipCell?: {
    valueGetter: any;
  };
}

export interface TextCell {
  valueGetter: any;
  bold?: boolean;
  size?: string;
  color?: string;
}
