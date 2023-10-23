import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';

import {
  ITenantMapped,
  SHELL_HEADER_HEIGHT,
  SortLabels,
  TenantsStatusType,
} from '@ui-coe/tenant/shared/types';
import { TableDataSource } from '@ui-coe/shared/ui-v2';

@Component({
  selector: 'ui-coe-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantListComponent implements OnChanges, OnInit {
  @Input() public siteNameHeader: string;
  @Input() public dateCreatedHeader: string;
  @Input() public statusHeader: string;
  @Input() public newBadgeText: string;
  @Input() public virtualScroll;
  @Input() public size;
  @Input() public displayedColumns;
  @Input() public fixedColumns;
  @Input() public tenants: ITenantMapped[];

  @Output() public tenantId: EventEmitter<string> = new EventEmitter();
  @Output() public rowClicked;
  @Output() public sortChange: EventEmitter<Sort> = new EventEmitter();

  @ViewChild(MatSort) set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  public gridHeight: number;
  public dataSource: TableDataSource<ITenantMapped>;
  public tenantsStatusTypeMap = {
    [TenantsStatusType.ACTIVE]: 'success',
    [TenantsStatusType.INACTIVE]: 'default',
  };

  sortLabels: typeof SortLabels = SortLabels;

  constructor(private element: ElementRef) {}

  ngOnChanges(changes): void {
    if (changes.displayedColumns?.currentValue) {
      const { siteName, dateCreated, status } = changes.displayedColumns.currentValue;
      this.displayedColumns = [siteName, dateCreated, status];
    }
    if (changes.tenants?.currentValue) {
      this.tenants = changes.tenants.currentValue;
      if (this.dataSource) {
        this.dataSource.data = this.tenants;
      }
    }
  }

  ngOnInit() {
    this.getGridHeight();
    this.dataSource = new TableDataSource([]);
  }

  getStatusType(status: TenantsStatusType): string {
    return this.tenantsStatusTypeMap[status];
  }

  onRowClick(row: ITenantMapped) {
    this.tenantId.emit(row.tenantId);
  }

  onSortChange(sortEvent: Sort) {
    this.sortChange.emit(sortEvent);
  }

  @HostListener('window:resize')
  getGridHeight() {
    //* Need the height for virtual scroll
    this.gridHeight =
      window.innerHeight -
      (this.element.nativeElement.offsetParent.offsetTop +
        this.element.nativeElement.offsetTop +
        SHELL_HEADER_HEIGHT);
  }
}
