import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumnDef, TableColumnDefs } from '../../shared/models/ax-table-column-def';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NestedBottomSheetComponent } from './bottom-sheet/nested-bottom-sheet.components';

@Component({
  selector: 'ax-nested-table',
  templateUrl: './nested-table.component.html',
  styleUrls: ['./nested-table.component.scss'],
})
export class NestedTableComponent<T extends { checked: boolean }> implements AfterViewInit {
  @Input() dataSource = new MatTableDataSource<T>();
  @Input() columnDefs: TableColumnDef[];
  @Output() buttonEvent = new EventEmitter();

  selectionType = new SelectionModel<T>(false);

  constructor(public _bottomSheet: MatBottomSheet) {}

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  get displayedColumns(): string[] {
    return this.columnDefs?.map(data => data?.columnDef);
  }

  openBottomSheet(data: T, columnDefs: TableColumnDefs): void {
    this._bottomSheet.open(NestedBottomSheetComponent, {
      data: { columnDefs, data },
    });
  }

  changeRadioButton(data: T): void {
    if (this.selectionType.selected[0] !== data) {
      this.selectionType.toggle(data);
    }
    return null;
  }

  emitRadioButton(data: T): void {
    for (let i = 0; i < this.dataSource.data.length; i++) {
      if (this.dataSource.data[i].checked === true) {
        this.dataSource.data[i].checked = false;
      }
    }
    data.checked = true;
    this.buttonEvent.emit(data);
  }

  checkRadioButton(data: T): boolean {
    if (data.checked) {
      return true;
    }
    return false;
  }
}
