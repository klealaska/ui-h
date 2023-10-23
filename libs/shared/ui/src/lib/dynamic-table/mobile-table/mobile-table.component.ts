import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Paginator, TableColumnDef } from '../../shared/models/ax-table-column-def';
import { Observable } from 'rxjs';

@Component({
  selector: 'ax-mobile-table',
  templateUrl: './mobile-table.component.html',
  styleUrls: ['./mobile-table.component.scss'],
})
export class MobileTableComponent<T> {
  @Input() dataSource: Observable<T>;
  @Input() columnDefs: TableColumnDef[];
  @Input() selectionType: SelectionModel<T>;
  @Input() paginator: Paginator;
  @Output() checkboxEvent = new EventEmitter();
  @Output() buttonEvent = new EventEmitter();
  @Output() checkboxToggle = new EventEmitter();
  @Output() changeRadioButton = new EventEmitter();

  checkCardValue(column: TableColumnDef, card: Object): boolean {
    if (typeof column.cellDef.value === 'function' && !column.cellDef.mobileView) {
      return column.cellDef.value(card);
    } else if (typeof column.cellDef.value.inputs === 'function' && !column.cellDef.mobileView) {
      return true;
    }
    return false;
  }
}
