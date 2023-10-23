import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Connector } from '../../../../models';

@Component({
  selector: 'avc-connectors-list',
  templateUrl: './connectors-list.component.html',
  styleUrls: ['./connectors-list.component.scss'],
})
export class ConnectorsListComponent implements OnInit, OnChanges {
  @Input() connectors: Observable<Connector[]>;
  @Input() searchText: string;
  @Output() connectorSelected = new EventEmitter<number>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<Connector>([]);
  displayedColumns: string[] = ['logoUrl', 'name', 'connectorTypeName', 'description', 'isActive'];

  ngOnInit(): void {
    this.connectors.subscribe((connectors: Connector[]) => {
      this.dataSource = new MatTableDataSource(connectors);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.searchText) {
      this.dataSource.filter = JSON.stringify({
        displayName: this.searchText?.toLowerCase().trim(),
      });

      this.dataSource.filterPredicate = (data, filter) => {
        const searchTerms = JSON.parse(filter);

        return data.displayName.toLowerCase().indexOf(searchTerms.displayName) !== -1;
      };
    }
  }
}
