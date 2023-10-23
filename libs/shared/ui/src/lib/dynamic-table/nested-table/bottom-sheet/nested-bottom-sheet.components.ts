import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { TableColumnDef } from '../../../shared/models/ax-table-column-def';

@Component({
  selector: 'ax-nested-bottom-sheet',
  templateUrl: './nested-bottom-sheet.component.html',
  styleUrls: ['./nested-bottom-sheet.component.scss'],
})
export class NestedBottomSheetComponent<T extends { data: T; columnDefs: TableColumnDef }> {
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: T) {}
}
