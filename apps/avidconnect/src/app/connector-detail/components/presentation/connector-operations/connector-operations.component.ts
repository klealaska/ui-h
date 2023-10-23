import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Operation } from '../../../../models';

@Component({
  selector: 'avc-connector-operations',
  templateUrl: './connector-operations.component.html',
  styleUrls: ['./connector-operations.component.scss'],
})
export class ConnectorOperationsComponent implements OnChanges {
  @Input() operations: Operation[];
  @Output() operationSelected = new EventEmitter<number>();

  subscription: Subscription;
  private paginator: MatPaginator;
  private sort: MatSort;

  dataSource = new MatTableDataSource<Operation>([]);
  displayedColumns: string[] = [
    'customerName',
    'registrationDescription',
    'operationTypeName',
    'operationStatusTypeName',
    'startDate',
    'endDate',
    'inserts',
    'updates',
    'deletes',
    'errors',
    'noUpdates',
  ];

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource(this.operations);
    this.setDataSourceAttributes();
  }

  getOperationDuration(startDate: string, endDate: string): string {
    if (!endDate || startDate === endDate) return '';

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const duration = Math.abs(start - end);

    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor(duration / (1000 * 60 * 60));

    const thours = hours < 10 ? '0' + hours : hours;
    const tminutes = minutes < 10 ? '0' + minutes : minutes;
    const tseconds = seconds < 10 ? '0' + seconds : seconds;

    return +thours + ':' + tminutes + ':' + tseconds;
  }
}
