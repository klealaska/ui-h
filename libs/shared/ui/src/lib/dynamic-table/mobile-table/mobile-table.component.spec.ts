import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MockComponents } from 'ng-mocks';
import { SelectionModel } from '@angular/cdk/collections';

import { MobileTableComponent } from './mobile-table.component';
import { DynamicTableComponent } from '../dynamic-table.component';
import { DynamicTableCellComponent } from '../dynamic-table-cell/dynamic-table-cell.component';
import { DynamicExpandableCellComponent } from '../dynamic-expandable-cell/dynamic-expandable-cell.component';
import { Observable, of } from 'rxjs';

describe('MobileTableComponent', () => {
  let component: MobileTableComponent<any>;
  let fixture: ComponentFixture<MobileTableComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MobileTableComponent,
        MockComponents(
          DynamicTableComponent,
          DynamicTableCellComponent,
          DynamicExpandableCellComponent
        ),
      ],
      imports: [
        MatCardModule,
        MatIconModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSortModule,
        MatTableModule,
        MatDividerModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileTableComponent);
    component = fixture.componentInstance;
    component.dataSource = of([
      {
        position: 1,
        name: 'Hydrogen',
        weight: 1.0079,
        symbol: 'H',
        href: 'www.google.com',
        isExpandable: true,
        isExpanded: true,
        nestedTableColumnDefs: ['test', 'test2', 'test3'],
        nestedTableDatasource: [
          {
            position: 1,
            name: 'Hydrogen',
            weight: 1.0079,
            symbol: 'H',
          },
        ],
        mobileView: {
          doubleColumnTop: true,
        },
        component: null,
      },
    ]);
    component.columnDefs = [
      {
        columnDef: 'multiSelect',
        headerCellDef: 'test3',
        cellDef: { type: 'text', value: (element: any): any => element.position },
      },
      {
        columnDef: 'name',
        headerCellDef: 'test2',
        cellDef: { type: 'text', value: (element: any): any => element.name, mobileView: 1 },
      },
      {
        columnDef: 'position',
        headerCellDef: 'test1',
        cellDef: {
          type: 'component', // Set type to 'component' when injecting a dynamic component.
          value: {
            type: 'component',
            inputs: (element: any): any => {
              // 'inputs' is used to define your dynamic components @Input property.
              return { element };
            },
          },
        },
      },
    ];
    component.selectionType = new SelectionModel(true, []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('checkCardValue', () => {
    it('should check if cell def is a function and has mobile view property and return true', () => {
      component.dataSource.subscribe(() => {
        const card = component.dataSource[0];
        const column = component.columnDefs[0];
        expect(component.checkCardValue(column, card)).toBeTruthy();
      });
    });

    it('should check if cell def is a function and has mobile view property', () => {
      component.dataSource.subscribe(() => {
        const card = component.dataSource[0];
        const column = component.columnDefs[2];
        expect(component.checkCardValue(column, card)).toBeTruthy();
      });
    });

    it('should check mobileView and return false', () => {
      component.dataSource.subscribe(() => {
        const card = component.dataSource[0];
        const column = component.columnDefs[1];
        expect(component.checkCardValue(column, card)).toBeFalsy();
      });
    });
  });
});
