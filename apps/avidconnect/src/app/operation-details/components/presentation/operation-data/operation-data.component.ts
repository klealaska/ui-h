import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'avc-operation-data',
  templateUrl: './operation-data.component.html',
  styleUrls: ['./operation-data.component.scss'],
})
export class OperationDataComponent implements OnChanges {
  @Input() data: any[];
  @Input() displayedColumns: string[];

  subscription: Subscription;
  private paginator: MatPaginator;
  private sort: MatSort;

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource(this.data);
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
