import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ColDef, ColumnApi, ColumnState, DetailGridInfo, GridApi } from 'ag-grid-community';
import { DateTime } from 'luxon';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { axIconAscending, axIconDescending, axIconUnsorted } from '../../assets/ax-icons.model';

@Component({
  selector: 'ax-ag-grid-wrapper',
  templateUrl: './ax-ag-grid-wrapper.component.html',
  styleUrls: ['./ax-ag-grid-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AxAgGridWrapperComponent implements OnInit, OnDestroy {
  @Input() rowData: any[];
  @Input() columnDefs: ColDef[];
  @Input() loadMoreSubject: Subject<void>;
  @Input() pageSize = 30;
  @Input() loadMoreSize = 30;
  @Input() clientSidePaging = false;
  @Input() customPagination = false;
  @Input() isExternalFilterPresent = false;
  @Input() doesExternalFilterPass: any;
  @Input() applyFilterSubject: Subject<any>;
  @Input() setNewDataSubject: Subject<any[]>;
  @Input() resizeColumnsSubject: Subject<boolean>;
  @Output() hideLoadMore = new EventEmitter<boolean>();
  @Output() loadNextPageEvent = new EventEmitter<void>();
  @Output() columnSorted = new EventEmitter<ColumnState[]>();

  gridApi: GridApi;
  gridColumnApi: ColumnApi;
  columnTypes: { [key: string]: unknown };
  icons = {
    sortUnSort: (): string => axIconUnsorted.data,
    sortAscending: (): string => axIconAscending.data,
    sortDescending: (): string => axIconDescending.data,
  };

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.columnDefs?.forEach(x => {
      if (x.type === 'dateColumn') {
        x.valueFormatter = this.dateFormatter;
      }
    });

    this.columnTypes = {
      dateColumn: {},
    };

    this.loadMoreSubject?.subscribe(() => {
      this.loadMoreData();
    });

    this.applyFilterSubject?.subscribe(() => {
      this.applyFilter();
    });

    this.setNewDataSubject?.subscribe(newData => {
      this.refreshData(newData);
    });

    this.resizeColumnsSubject?.subscribe(() => {
      this.gridApi?.sizeColumnsToFit();
    });

    this.subscriptions.push(
      fromEvent(window, 'resize').subscribe(() => {
        this.gridApi?.sizeColumnsToFit();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onFirstDataRendered(): void {
    this.gridApi?.sizeColumnsToFit();

    if (this.clientSidePaging) {
      this.hideLoadMore.emit(this.pageSize >= this.rowData?.length);
    }
  }

  onGridReady(params: DetailGridInfo): void {
    this.gridApi = params?.api;
    this.gridColumnApi = params.columnApi;
  }

  loadMoreData(): void {
    if (!this.clientSidePaging) {
      this.loadNextPageEvent.emit();
      return;
    }
    const newPageSize = this.gridApi?.paginationGetPageSize() + this.loadMoreSize;
    const newData = this.rowData?.slice(0, newPageSize) || [];

    this.refreshData(newData);
  }

  refreshData(newData: any[]): void {
    const newPageSize = newData.length || 0;

    // TODO : figure out what to do for server side paging
    //      how will we know it's the last page?
    if (this.clientSidePaging) {
      this.hideLoadMore.emit(newData?.length >= this.rowData?.length);
    }

    if (!newData || newData.length < 1) {
      return;
    }

    this.gridApi?.paginationSetPageSize(newPageSize);
    this.gridApi?.setRowData(newData);
    this.gridApi?.sizeColumnsToFit();
  }

  applyFilter(): void {
    this.gridApi?.onFilterChanged();
  }

  dateFormatter(params: any): string {
    if (!params || !params?.value) {
      return null;
    }
    return DateTime.fromMillis(params.value * 1000).toFormat('dd MMM y hh:mma');
  }

  sortChanged(): void {
    this.columnSorted.emit(this.gridColumnApi.getColumnState());
  }
}
