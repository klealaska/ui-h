import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ColumnState } from 'ag-grid-community';
import { Subject } from 'rxjs';

import { GridColumn } from '../../shared/models/ax-grid';

@Component({
  selector: 'ax-grid',
  templateUrl: './ax-grid.component.html',
  styleUrls: ['./ax-grid.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AxGridComponent {
  @Input() rowData: any[] = [];
  @Input() columnData: GridColumn[] = [];
  @Input() pageable = false;
  @Input() pageSize = 30;
  @Input() clientSidePaging = false;
  @Input() loadMoreSize = 30;
  @Input() loadMoreHidden = false;
  @Input() noMoreDataMessage = 'No more data';
  @Input() emptyStateImgSrc: string;
  @Input() applyFilterSubject: Subject<any>;
  @Input() customButton = false;
  @Input() customButtonId: string;
  @Input() customButtonText: string;
  @Input() isExternalFilterPresent = false;
  @Input() doesExternalFilterPass: any;
  @Input() setNewDataSubject: Subject<any[]>;
  @Input() resizeColumnsSubject: Subject<boolean>;
  @Input() isLoading = false;
  @Output() customButtonEvent = new EventEmitter<any>();
  @Output() loadNextPageEvent = new EventEmitter<void>();
  @Output() columnSorted = new EventEmitter<ColumnState[]>();

  loadMoreData: Subject<void> = new Subject<void>();

  loadMoreClick(): void {
    this.loadMoreData.next();
  }

  hideLoadMore(value: boolean = false): void {
    this.loadMoreHidden = value;
  }

  customButtonClick($event: any): void {
    this.customButtonEvent.emit($event);
  }
}
