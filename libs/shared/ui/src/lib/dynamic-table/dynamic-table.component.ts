import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { Paginator, TableColumnDef, DefaultSort } from '../shared/models/ax-table-column-def';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { UntypedFormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'ax-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DynamicTableComponent<T> implements OnInit, OnChanges, OnDestroy {
  @Input()
  set dataSource(dataSource: MatTableDataSource<T>) {
    if (dataSource) {
      this._dataSource = new MatTableDataSource<T>(dataSource.data);
      this._dataSource.paginator = this.matPaginator;

      if (!this.serverSortingFiltering && this.sort) {
        this._dataSource.sort = this.sort;
      }

      this.mobileData = this._dataSource.connect();
    }
  }
  get dataSource(): MatTableDataSource<T> {
    return this._dataSource;
  }
  @Input() columnDefs: TableColumnDef[];
  @Input() paginator: Paginator;
  @Input() serverSortingFiltering: boolean;
  @Input() filtering = false;
  @Input() defaultSort?: DefaultSort;
  @Output() buttonEvent = new EventEmitter();
  @Output() filterEvent = new EventEmitter<string>();
  @Output() sortEvent = new EventEmitter();
  @Output() paginatorEvent = new EventEmitter();

  @ViewChild(MatPaginator)
  set matPaginator(matPaginator: MatPaginator) {
    if (matPaginator) {
      this._matPaginator = matPaginator;

      for (const property in this.paginator?.pageLabels) {
        matPaginator._intl[property] = this.paginator.pageLabels[property];
      }

      this._dataSource.paginator = matPaginator;
    }
  }
  get matPaginator(): MatPaginator {
    return this._matPaginator;
  }

  @ViewChild(MatSort)
  set sort(sort: MatSort) {
    if (sort) {
      this._sort = sort;
      this.sortSubscription = sort.sortChange.subscribe(() => {
        const sortEvent = {
          direction: sort.direction,
          column: sort.active,
        };

        if (this.paginator) {
          this.matPaginator.pageIndex = 0;
        }

        this.sortEvent.emit(sortEvent);
      });

      if (!this.serverSortingFiltering) {
        this._dataSource.sort = sort;
      }
    }
  }
  get sort(): MatSort {
    return this._sort;
  }

  sortSubscription: Subscription;
  filter = new UntypedFormControl();
  filterSubscription: Subscription;
  selectionType: SelectionModel<T>;
  mobileData: Observable<any>;

  private _dataSource: MatTableDataSource<T> = new MatTableDataSource([]);
  private _sort: MatSort;
  private _matPaginator: MatPaginator;

  get displayedColumns(): string[] {
    return this.columnDefs?.map(data => data?.columnDef);
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.sortSubscription = new Subscription();
    this.filterSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.selectionToggle();
    this.filterSubscription = this.filter.valueChanges.subscribe(() =>
      this.filterEvent.emit(this.filter.value)
    );

    this.changeDetectorRef.detectChanges();
  }

  ngOnChanges(changes: any): void {
    if (changes.dataSource?.currentValue) {
      this.dataSource = changes.dataSource.currentValue;
    }
  }

  ngOnDestroy(): void {
    this.filterSubscription.unsubscribe();
    this.sortSubscription.unsubscribe();

    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  selectionToggle(): SelectionModel<T> {
    return this.columnDefs?.map(data => data?.columnDef).includes('multiSelect')
      ? (this.selectionType = new SelectionModel<T>(true, []))
      : (this.selectionType = new SelectionModel<T>(false, []));
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selectionType.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected()
      ? this.selectionType.clear()
      : this.dataSource?.data.forEach(row => this.selectionType.select(row));
    this.buttonEvent.emit(this.selectionType.selected);
  }

  clickCheckbox($event: any): void {
    $event.stopPropagation();
  }

  changeRadioButton(data: T): any {
    if (this.selectionType.selected[0] !== data) {
      this.selectionType.toggle(data);
    }
    return null;
  }

  checkboxToggle(row: T): void {
    this.selectionType.toggle(row);
    this.buttonEvent.emit(this.selectionType.selected);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
