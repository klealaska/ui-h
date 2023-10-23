import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { MatColumnDef, MatTable, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { TableDataSource } from './table-datasource';
import { CoreTableFixedVirtualScrollDirective } from './virtual-scroll/virtual-scroll.directive';
import { DEFAULT_GRID_HEIGHT, HEADER_HEIGHT, ROW_HEIGHT } from './table-constants';
import { TableType, TableTypeConstant } from '@ui-coe/shared/types';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { CdkTableModule } from '@angular/cdk/table';

@Component({
  selector: 'ax-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    ScrollingModule,
    CdkVirtualScrollViewport,
    CdkTableModule,
    MatSortModule,
    CoreTableFixedVirtualScrollDirective,
    CheckboxComponent,
  ],
  standalone: true,
})
export class TableComponent<T> implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  private _selection = false;
  private _columnnsInitialized = false;
  private _isTableInitialized = false;
  private _descendedColumns: string[] = [];
  private _headerColumns: string[] = [];
  private _onDestroy$: Subject<void> = new Subject();
  private _data: T[];

  itemSize = ROW_HEIGHT;
  headerHeight = HEADER_HEIGHT;

  @Input() tableType: TableType = TableTypeConstant.DEFAULT;
  @Input() gridHeight = DEFAULT_GRID_HEIGHT;

  @Input() size: string;
  @Input() fixedColumns = false;
  @Input() customSort = false;
  @Input() noborder = false;
  @Input() customTemplate = false;
  @Input() virtualScroll = false;
  @Input() stickyHeader = false;
  @Input() allowSort = true;
  offset!: Observable<number>;

  @Input() set data(records: T[]) {
    this._data = records;
    if (this.dataSource) {
      this.dataSource.data = records;
    }
  }
  @Input() dataSource: TableDataSource<T>;

  @Output() checkSelection = new Subject<T[]>();
  @Output() sortFunction: EventEmitter<Sort> = new EventEmitter();
  @Output() selectChange: EventEmitter<T> = new EventEmitter();
  @Output() allSelected: EventEmitter<T[]> = new EventEmitter();
  @Output() rowClicked: EventEmitter<T> = new EventEmitter<T>();

  @Input() set displayedColumns(columns: string[]) {
    this._descendedColumns = columns;
    if (!!this.customTemplate && !!this._columnnsInitialized) {
      this._headerColumns = columns;
      this._columnnsInitialized = true;
    }
  }

  get displayedColumns(): string[] {
    return this._headerColumns;
  }

  @Input() set selection(val: boolean) {
    this._selection = val ? true : false;
    this.toggleSelectionColumn();
  }

  @ViewChild(CdkVirtualScrollViewport, { static: false }) viewPort!: CdkVirtualScrollViewport;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  /**
   * Needed for Customized Table
   */
  @ViewChild(MatTable, { static: false }) table!: MatTable<T>;
  @ContentChildren(MatColumnDef) columnDefs!: QueryList<MatColumnDef>;

  @ContentChild(TemplateRef) templateRef!: TemplateRef<any>;

  constructor(private cdRef: ChangeDetectorRef) {}

  toggleSelectionColumn() {
    if (this._selection && this._headerColumns.indexOf('select') === -1) {
      this._headerColumns.unshift('select');
    } else {
      if (this._headerColumns.indexOf('select') > -1) {
        this._headerColumns.shift();
      }
    }
  }

  ngOnInit(): void {
    if (!this.dataSource) {
      this.dataSource = new TableDataSource(this._data);
    }
  }

  ngAfterViewInit(): void {
    this.addCustomTemplateColumn();
    this.toggleSelectionColumn();
    this.attachViewport();
    this.attachSort();
    this.observerSelectionChanges();
    this.observeScrollChange();
  }

  addCustomTemplateColumn() {
    if (!this._isTableInitialized && this.customTemplate) {
      this.columnDefs.forEach(columnDef => {
        this.table.addColumnDef(columnDef);
      });
      this._isTableInitialized = true;
      this._columnnsInitialized = true;
      this._headerColumns = [...this._descendedColumns];
      this.cdRef.detectChanges();
    } else {
      this._isTableInitialized = true;
    }
  }

  attachViewport() {
    if (this.virtualScroll && this.viewPort) {
      this.dataSource.attachViewPort(this.viewPort);
    } else {
      this.dataSource.initializeFirstLoad();
    }
  }

  attachSort() {
    this.dataSource.sort = this.sort;
  }

  observerSelectionChanges() {
    if (this._selection) {
      this.dataSource.selectionChanged.pipe(takeUntil(this._onDestroy$)).subscribe(() => {
        this.checkSelection.next(this.dataSource.selected);
      });
    }
  }

  /**
   * To be used for Viewport
   */
  observeScrollChange() {
    if (this.viewPort) {
      this.offset = this.viewPort.renderedRangeStream.pipe(
        takeUntil(this._onDestroy$),
        map(() => {
          const n = this.viewPort.getOffsetToRenderedContentStart() || 0;
          return -n;
        })
      );
    }
  }

  /**
   * To be called After content is initialized
   * added logic is for default approach when no custom template given
   */
  ngAfterContentInit() {
    if (!this._columnnsInitialized && !this.customTemplate) {
      this._headerColumns = [...this._descendedColumns];
      this._columnnsInitialized = true;
    }
  }

  /**
   * Check selection methods and emitters
   */
  get indeterminate(): boolean {
    return this.dataSource.selected.length > 0 && !this.selectedAll;
  }

  get selectedAll(): boolean {
    return this.dataSource.selectedAll;
  }

  clearSelection(): void {
    this.dataSource.clearSelection();
    this.allSelected.emit([]);
  }

  isSelected(item: T): boolean {
    return this.dataSource.isSelected(item);
  }

  toggle(item: T): void {
    this.dataSource.toggle(item);
    this.selectChange.emit(item);
    this.allSelected.emit(this.dataSource.selected);
  }

  toggleAll(): void {
    this.dataSource.toggleAll();
    this.allSelected.emit(this.dataSource.selected);
  }

  customSortFn($event) {
    if (this.customSort) {
      this.sortFunction.emit($event);
    }
  }

  /**
   * Row click method
   */
  onRowClick(row: T): void {
    // Emit an event to inform the parent component about the row click
    this.rowClicked.emit(row);
  }

  /**
   * On Component destroy, Unsubscribe all subscriptions
   */
  ngOnDestroy(): void {
    if (this.checkSelection) {
      this.checkSelection.unsubscribe();
    }
    this._onDestroy$.next();
    this._onDestroy$.complete();
  }
}
