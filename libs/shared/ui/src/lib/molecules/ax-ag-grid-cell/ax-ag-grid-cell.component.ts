import { Component, ViewEncapsulation } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

import { GridColumn, TextCell } from '../../shared/models/ax-grid';

@Component({
  selector: 'ax-ag-grid-cell',
  templateUrl: './ax-ag-grid-cell.component.html',
  styleUrls: ['./ax-ag-grid-cell.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AxAgGridCellComponent implements ICellEditorAngularComp {
  cellData: any;
  params: any;

  image: string;
  showLockImage = false;

  text: string;
  textBold: boolean;
  textSize: string;
  textColor: string;

  multiLineText: TextCell[] = [];

  linkUrl: string;
  linkText: string;
  linkBold: boolean;
  linkSize: string;
  linkTarget: string;
  linkIsLocked: boolean;

  tooltipText: string;

  agInit(params: any): void {
    const colDef: GridColumn = params?.colDef;

    this.cellData = params?.data;
    this.params = params;

    if (!colDef) {
      return;
    }

    if (colDef.imageCell) {
      this.image = colDef.imageCell.valueGetter(this.params);
    }

    if (colDef.colId === 'lockedBy') {
      this.showLockImage = this.params.value !== 'none' ? true : false;
    }

    if (colDef.tooltipCell) {
      this.tooltipText = colDef.tooltipCell.valueGetter(this.params);
    }

    if (colDef.textCell) {
      this.text = colDef.textCell.valueGetter(this.params);
      this.textBold = colDef.textCell.bold;
      this.textSize = colDef.textCell.size;
      this.textColor = colDef.textCell.color;
    }
    if (colDef.multiLineTextCell) {
      this.multiLineText = colDef.multiLineTextCell;
    }

    if (colDef.linkCell) {
      this.linkText = colDef.linkCell.valueGetter(this.params);
      this.linkBold = colDef.linkCell.bold;
      this.linkSize = colDef.linkCell.size;
      this.linkIsLocked = colDef.linkCell?.isLocked(this.params) ?? false;
    }
  }

  onClickLink(): void {
    return this.params.clicked(this.cellData);
  }

  refresh(): boolean {
    return false;
  }

  getValue(): any {
    throw new Error('Method not implemented.');
  }
  isPopup?(): boolean {
    throw new Error('Method not implemented.');
  }
  getPopupPosition?(): 'over' | 'under' {
    throw new Error('Method not implemented.');
  }
  isCancelBeforeStart?(): boolean {
    throw new Error('Method not implemented.');
  }
  isCancelAfterEnd?(): boolean {
    throw new Error('Method not implemented.');
  }
  focusIn?(): void {
    throw new Error('Method not implemented.');
  }
  focusOut?(): void {
    throw new Error('Method not implemented.');
  }
  getFrameworkComponentInstance?(): any {
    throw new Error('Method not implemented.');
  }
  afterGuiAttached?(): void {
    throw new Error('Method not implemented.');
  }
}
