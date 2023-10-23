import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { OperationType, Schedule } from '../../../../models';
import cronstrue from 'cronstrue';

@Component({
  selector: 'avc-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss'],
})
export class ScheduleListComponent implements OnChanges {
  @Input() schedules: Schedule[];
  @Output() statusChanged = new EventEmitter<Schedule>();
  @Output() editScheduleClicked = new EventEmitter<Schedule>();

  subscription: Subscription;
  private paginator: MatPaginator;

  dataSource = new MatTableDataSource<Schedule>([]);
  displayedColumns: string[] = ['isActive', 'schedule', 'datasets', 'edit'];

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource(this.schedules);
  }

  getScheduleStatus(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getCronFormat(cronText: string): string {
    return cronstrue.toString(cronText, { verbose: true, dayOfWeekStartIndexZero: false });
  }

  getOperationTypes(operationTypes: OperationType[]): string {
    return operationTypes.map(operationType => operationType.name).join(' | ');
  }
}
