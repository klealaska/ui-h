import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ExecutionEvent } from '../../../../models';

@Component({
  selector: 'avc-operation-logs',
  templateUrl: './operation-logs.component.html',
  styleUrls: ['./operation-logs.component.scss'],
})
export class OperationLogsComponent implements OnChanges {
  @Input() events: ExecutionEvent[];

  subscription: Subscription;
  private paginator: MatPaginator;
  private sort: MatSort;

  dataSource = new MatTableDataSource<ExecutionEvent>([]);
  displayedColumns: string[] = ['timeStamp', 'logLevelName', 'message'];

  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource(this.events);
    this.setDataSourceAttributes();
  }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
