import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Customer, Platform } from '../../../../models';

@Component({
  selector: 'avc-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss'],
})
export class CustomersListComponent implements AfterViewInit, OnInit, OnChanges {
  @Input() customers: Observable<Customer[]>;
  @Input() searchText: string;
  @Input() showInactive: boolean;
  @Input() platforms: Platform[];
  @Output() customerSelected = new EventEmitter<Customer>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<Customer>([]);
  displayedColumns: string[] = [
    'name',
    'externalKey',
    'platformName',
    'createdDate',
    'createdBy',
    'isActive',
  ];
  platformsSelected: string[] = [];

  ngOnInit(): void {
    this.customers.subscribe((customers: Customer[]) => {
      this.dataSource = new MatTableDataSource(customers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = data => data.isActive === true;
      this.customersFilterChanged();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.searchText || changes.showInactive) {
      this.customersFilterChanged();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  customersFilterChanged() {
    this.dataSource.filter = JSON.stringify({
      name: this.searchText?.toLowerCase().trim(),
      isActive: !this.showInactive,
      platforms: this.platformsSelected,
    });

    this.dataSource.filterPredicate = (data, filter) => {
      const searchTerms = JSON.parse(filter);
      const filteredPlatform =
        searchTerms.platforms.length > 0 ? searchTerms.platforms.includes(data.platformName) : true;

      return (
        data.name.toLowerCase().indexOf(searchTerms.name) !== -1 &&
        data.isActive === searchTerms.isActive &&
        filteredPlatform
      );
    };
  }
}
