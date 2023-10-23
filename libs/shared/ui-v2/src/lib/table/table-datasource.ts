import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject,
  Subscription,
  combineLatest,
  map,
  merge,
  of,
  startWith,
} from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ListRange, SelectionChange, SelectionModel } from '@angular/cdk/collections';

export interface AxTableDataSourceI<T> {
  dataToRender$: Subject<T[]>;
  dataOfRange$: Subject<T[]>;
}

export class TableDataSource<T> extends MatTableDataSource<T> implements AxTableDataSourceI<T> {
  private _viewPort!: CdkVirtualScrollViewport;
  private selection = new SelectionModel<T>(true, []);

  public dataToRender$!: Subject<T[]>;
  public dataOfRange$!: Subject<T[]>;
  private streamsReady!: boolean;

  /**
   * The full array of data
   */
  get allData(): T[] {
    return this.data.slice();
  }
  set allData(data: T[]) {
    this.data = data;
  }

  constructor(initialData: T[]) {
    super();
    this.selection.clear();
    this.allData = initialData;
  }

  override _updateChangeSubscription() {
    this.initStreams();
    const _sort: MatSort | null = this['_sort'];
    const _paginator: MatPaginator | null = this['_paginator'];
    const _internalPageChanges: Subject<void> = this['_internalPageChanges'];
    const _filter: BehaviorSubject<string> = this['_filter'];
    const _renderData: BehaviorSubject<T[]> = this['_renderData'];

    const sortChange: Observable<Sort | null | void> = _sort
      ? (merge(_sort.sortChange, _sort.initialized) as Observable<Sort | void>)
      : of(null);
    const pageChange: Observable<PageEvent | null | void> = _paginator
      ? (merge(
          _paginator.page,
          _internalPageChanges,
          _paginator.initialized
        ) as Observable<PageEvent | void>)
      : of(null);
    const dataStream: Observable<T[]> = this['_data'];
    const filteredData = combineLatest([dataStream, _filter]).pipe(
      map(([data]) => this._filterData(data))
    );
    const orderedData = combineLatest([filteredData, sortChange]).pipe(
      map(([data]) => this._orderData(data))
    );
    const paginatedData = combineLatest([orderedData, pageChange]).pipe(
      map(([data]) => this._pageData(data))
    );

    this._renderChangesSubscription?.unsubscribe();
    this._renderChangesSubscription = new Subscription();
    this._renderChangesSubscription.add(
      paginatedData.subscribe(data => this.dataToRender$.next(data))
    );
    this._renderChangesSubscription.add(
      this.dataOfRange$.subscribe(data => _renderData.next(data))
    );
  }

  /**
   *
   * @param viewPort
   * Attatch ViewPort and subscribe to rendered stream of data
   */
  attachViewPort(viewPort: CdkVirtualScrollViewport) {
    if (!viewPort) {
      throw new Error('ViewPort is undefined');
    }
    this._viewPort = viewPort;
    this._viewPort.setRenderedRange({ start: 0, end: 10 });
    this.subscribeToViewportChange();
  }

  /**
   * Subscribe to scrolling inside view port
   */
  private subscribeToViewportChange() {
    const rangeStream = this._viewPort.renderedRangeStream.pipe(startWith({} as ListRange));
    combineLatest([this.dataToRender$, rangeStream])
      .pipe(
        map(([data, { start, end }]) =>
          start === null || end === null ? data : data.slice(start, end)
        )
      )
      .subscribe(slicedData => {
        this.dataOfRange$.next(slicedData);
      });
  }

  /**
   * If Viewport is not selected then push data into streams.
   */
  initializeFirstLoad() {
    combineLatest([this.dataToRender$])
      .pipe(map(([data]) => data))
      .subscribe(data => {
        this.dataOfRange$.next(data);
      });
  }

  /**
   * Initialize Stream
   */
  private initStreams() {
    if (!this.streamsReady) {
      this.dataToRender$ = new ReplaySubject<T[]>(1);
      this.dataOfRange$ = new ReplaySubject<T[]>(1);
      this.streamsReady = true;
    }
  }

  /**
   * The array of currently selected items.
   */
  get selected(): T[] {
    return this.selection.selected;
  }

  /**
   * Whether all visible items are selected.
   */
  get selectedAll(): boolean {
    return this.selection.hasValue() && this.selected.length === this.data.length;
  }

  /**
   * A stream of changes made on selections.
   */
  get selectionChanged(): Observable<SelectionChange<T>> {
    return this.selection.changed;
  }

  /**
   * Clears all of the selected items.
   */
  clearSelection(): void {
    this.selection.clear();
  }

  /**
   * Whether an item is selected.
   */
  isSelected(item: T): boolean {
    return this.selection.isSelected(item);
  }

  /**
   * Selects one or more items.
   */
  select(...items: T[]): void {
    this.selection.select(...items);
  }

  /**
   * Toggles an item between selected and deselected.
   */
  toggle(item: T): void {
    this.selection.toggle(item);
  }

  /**
   * Toggles the selection of all visible items.
   *
   * If all are selected, deselects all.
   *
   * If some or none are selected, selects all.
   */
  toggleAll(): void {
    this.selectedAll ? this.selection.clear() : this.selection.select(...this.data);
  }
}
