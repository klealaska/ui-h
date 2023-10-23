import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Customer } from '../../../../models';

@Component({
  selector: 'avc-connector-customers',
  templateUrl: './connector-customers.component.html',
  styleUrls: ['./connector-customers.component.scss'],
})
export class ConnectorCustomersComponent implements OnChanges {
  @Input() customers: Customer[];
  @Output() customerSelected = new EventEmitter<number>();

  subscription: Subscription;
  private paginator: MatPaginator;
  private sort: MatSort;

  dataSource = new MatTableDataSource<Customer>([]);
  displayedColumns: string[] = ['name', 'platformName', 'createdBy', 'createdDate'];

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
    this.dataSource = new MatTableDataSource(this.customers);
    this.setDataSourceAttributes();
  }
}
