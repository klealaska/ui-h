import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MockComponents } from 'ng-mocks';
import { MatSortModule } from '@angular/material/sort';

import { NestedTableComponent } from './nested-table.component';
import { NestedBottomSheetComponent } from './bottom-sheet/nested-bottom-sheet.components';
import { DynamicTableCellComponent } from '../dynamic-table-cell/dynamic-table-cell.component';
import { DynamicExpandableCellComponent } from '../dynamic-expandable-cell/dynamic-expandable-cell.component';

describe('NestedTableComponent', () => {
  let component: NestedTableComponent<any>;
  let fixture: ComponentFixture<NestedTableComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        NestedTableComponent,
        NestedBottomSheetComponent,
        MockComponents(
          DynamicTableCellComponent,
          DynamicExpandableCellComponent,
          NestedBottomSheetComponent
        ),
      ],
      imports: [
        MatTableModule,
        MatBottomSheetModule,
        BrowserAnimationsModule,
        MatSortModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedTableComponent);
    component = fixture.componentInstance;
    component.dataSource.data = [
      {
        position: 6,
        name: 'Carbon',
        weight: 12.0107,
        symbol: 'C',
        checked: false,
      },
      {
        position: 7,
        name: 'Nitrogen',
        weight: 14.0067,
        symbol: 'N',
        checked: true,
      },
    ];
    component.columnDefs = [
      {
        columnDef: 'multiSelect',
        headerCellDef: 'test3',
        cellDef: { type: 'text', value: (element: any): any => element.position },
      },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngAfterViewInit', () => {
    it('should have populated datasource.sort', () => {
      expect(component.dataSource.sort).toBeDefined();
    });
  });

  describe('displayedColumns', () => {
    it('should have returned the columnDef', () => {
      expect(component.displayedColumns).toBeDefined();
    });

    it('should have returned undefined', () => {
      component.columnDefs = undefined;
      expect(component.displayedColumns).toBeUndefined();
    });
  });

  describe('openBottomSheet', () => {
    it('Should expect the bottomSheet to be called', () => {
      const data = component.dataSource.data[0];
      const columnDef = component.columnDefs;

      component.openBottomSheet(data, columnDef);
      expect(component._bottomSheet.open).toBeCalled;
    });
  });

  describe('changeRadioButton', () => {
    it('should have returned the columnDef', () => {
      const data = component.dataSource.data[0];
      component.changeRadioButton(data);
      expect(component.selectionType.selected[0]).toEqual(data);
    });
  });

  describe('changeRadioButton', () => {
    it('should have returned the columnDef', () => {
      const data = component.dataSource.data[0];
      component.selectionType.toggle(data);
      expect(component.changeRadioButton(data)).toEqual(null);
    });
  });

  describe('emitRadioButton', () => {
    it('should loop through all objects in DataSource and change their "checked" property to false. Then should change "checked" property passed in to be true', () => {
      const data = component.dataSource.data[0];
      component.emitRadioButton(data);

      expect(component.dataSource.data[1].checked).toBeFalsy();
      expect(data.checked).toBeTruthy();
    });
  });

  describe('checkRadioButton', () => {
    it('should check if property "checked" in data is false', () => {
      const data = component.dataSource.data[0];
      expect(component.checkRadioButton(data)).toBeFalsy();
    });
  });

  describe('checkRadioButton', () => {
    it('should check if property "checked" in data is true', () => {
      const data = component.dataSource.data[1];
      expect(component.checkRadioButton(data)).toBeTruthy();
    });
  });
});
