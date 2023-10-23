import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { IBankAccountMapped, IPopBamListContent } from '@ui-coe/bank-account-mgmt/shared/types';
import { getStatusTagType } from '@ui-coe/bank-account-mgmt/shared/util';
import { TableDataSource } from '@ui-coe/shared/ui-v2';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ui-coe-pop-list',
  templateUrl: './pop-list.component.html',
  styleUrls: ['./pop-list.component.scss'],
})
export class PopListComponent implements OnChanges, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @Input() accounts: IBankAccountMapped[];
  @Input() content: IPopBamListContent;
  @Output() bankAccountSelected: EventEmitter<string> = new EventEmitter();

  public dataSource$: BehaviorSubject<TableDataSource<IBankAccountMapped>> = new BehaviorSubject(
    new TableDataSource([])
  );

  public displayedColumns: string[] = [
    'accountNumber',
    'routingNumber',
    'bankName',
    'bankAccountStatus',
  ];

  constructor(private readonly _cd: ChangeDetectorRef) {}

  ngOnChanges({ accounts }: SimpleChanges): void {
    if (accounts && accounts.currentValue) {
      this.defineDatasource(accounts.currentValue);
    }
  }

  ngAfterViewInit(): void {
    const tableData = this.dataSource$.value;
    tableData.sort = this.sort;
    this.dataSource$.next(tableData);
    this._cd.detectChanges();
  }

  public defineDatasource(accounts: IBankAccountMapped[]): void {
    const dataMapped = accounts.map(account => ({
      ...account,
      statusTagType: getStatusTagType(account.bankAccountStatus),
    }));
    const tableData = new TableDataSource(dataMapped);
    tableData.sort = this.sort;
    this.dataSource$.next(tableData);
  }

  public accountClicked(account) {
    this.bankAccountSelected.emit(account.accountId);
  }
}
