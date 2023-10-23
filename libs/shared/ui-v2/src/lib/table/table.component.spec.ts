import { Component, EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { TableTypeConstant } from '@ui-coe/shared/types';
import { DEFAULT_GRID_HEIGHT } from '../table/table-constants';
import { TestData, getTestData } from './table-mock';
import { Subject } from 'rxjs';
import { TableComponent } from './table.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TableComponent', () => {
  let tableComp: TableComponent<any>;
  let fixture: ComponentFixture<TableComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [TableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    tableComp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(tableComp).toBeTruthy();
  });
  it('should have `default` tableType', () => {
    expect(tableComp.tableType).toBe(TableTypeConstant.DEFAULT);
  });
  it('should have default height of 400', () => {
    expect(tableComp.gridHeight).toBe(DEFAULT_GRID_HEIGHT);
  });
  it('should have `dataSource` property', () => {
    expect(tableComp).toHaveProperty('dataSource');
  });
  it('should have `checkSelection` property', () => {
    expect(tableComp).toHaveProperty('checkSelection');
    expect(tableComp.checkSelection instanceof Subject).toBe(true);
  });
  it('should have called `selectChange` event callback', () => {
    expect(tableComp).toHaveProperty('selectChange');
    expect(tableComp.selectChange instanceof EventEmitter).toBe(true);
  });
  it('should emit `selectChange` and `allSelected` when called', () => {
    jest.spyOn(tableComp.allSelected, 'emit');
    jest.spyOn(tableComp.selectChange, 'emit');
    const record = getTestData()[0];
    tableComp.toggle(record);
    expect(tableComp.allSelected.emit).toHaveBeenCalledWith([record]);
    expect(tableComp.selectChange.emit).toHaveBeenCalledWith(record);
  });
  it('should emit all selected items of records when all is selected', () => {
    jest.spyOn(tableComp.allSelected, 'emit');
    const record = getTestData();
    tableComp.dataSource.select(record);
    tableComp.toggleAll();
    expect(tableComp.allSelected.emit).toHaveBeenCalledWith(tableComp.dataSource.selected);
  });

  it('should deselect all and emit no records on toggleAll', () => {
    jest.spyOn(tableComp.allSelected, 'emit');
    const record = getTestData();
    tableComp.dataSource.data = record;
    tableComp.toggleAll();
    tableComp.toggleAll();
    expect(tableComp.allSelected.emit).toHaveBeenLastCalledWith([]);
  });

  it('should have called `allSelected` event callback', () => {
    expect(tableComp).toHaveProperty('allSelected');
    expect(tableComp.allSelected instanceof EventEmitter).toBe(true);
  });

  it('should initialize columns inside `ngAfterContentInit` lifecycle hook ', () => {
    tableComp['_columnnsInitialized'] = false;
    tableComp.customTemplate = false;
    tableComp['_descendedColumns'] = ['id', 'position'];
    tableComp.ngAfterContentInit();
    expect(tableComp['_headerColumns']).toEqual(['id', 'position']);
    expect(tableComp['_columnnsInitialized']).toBeTruthy();
  });

  it('should initlize selection of checkboxes if flag is true', () => {
    tableComp.selection = true;
    jest.spyOn(tableComp.checkSelection, 'next');
    tableComp.dataSource.selectionChanged.subscribe(() => {
      expect(tableComp.checkSelection.next).toHaveBeenCalled();
    });
  });

  it('should attach sort', () => {
    tableComp.attachSort();
    expect(tableComp.dataSource.sort).toBeDefined();
  });

  it('should not attach view port if flag is false', () => {
    jest.spyOn(tableComp.dataSource, 'attachViewPort');
    jest.spyOn(tableComp.dataSource, 'initializeFirstLoad');
    // jest.spyOn(tableComp, 'viewPort')// .mockReturnValue({} satisfies CdkVirtualScrollViewport);
    tableComp.virtualScroll = true;
    tableComp.attachViewport();
    expect(tableComp.dataSource.initializeFirstLoad).toHaveBeenCalled();
    expect(tableComp.dataSource.attachViewPort).not.toHaveBeenCalled();
  });

  it('should set columns if not using custom template', () => {
    tableComp.customTemplate = true;
    tableComp.displayedColumns = ['id', 'position'];
    expect(tableComp.displayedColumns).toEqual(['id', 'position']);
  });

  it('should NOT set columns if not custom template', () => {
    tableComp.customTemplate = false;
    tableComp.displayedColumns = ['id', 'position'];
    expect(tableComp.displayedColumns).toEqual([]);
  });

  it('should have indeterminate state', () => {
    const record = getTestData();
    tableComp.dataSource.select(record[0]);
    expect(tableComp.indeterminate).toBe(true);
  });
  it('should return true if all are selected', () => {
    const record = getTestData();
    tableComp.dataSource.data = record;
    tableComp.toggleAll();
    expect(tableComp.indeterminate).toBe(false);
    expect(tableComp.selectedAll).toBe(true);
  });
  it('should return true if selected', () => {
    const record = getTestData();
    tableComp.dataSource.select(record[0]);
    expect(tableComp.isSelected(record[0])).toBe(true);
  });
  it('should emit no record when all records are deselected', () => {
    jest.spyOn(tableComp.allSelected, 'emit');
    const record = getTestData();
    tableComp.dataSource.data = record;
    tableComp.toggleAll();
    tableComp.clearSelection();
    expect(tableComp.allSelected.emit).toHaveBeenCalledWith([]);
  });
});

@Component({
  template: `
    <ax-table
      [displayedColumns]="displayedColumns"
      [data]="data"
      [stickyHeader]="stickyHeader"
      [customSort]="customSort"
      [selection]="selection"
      [virtualScroll]="virtualScroll"
    >
    </ax-table>
  `,
})
export class TestTableComponent {
  virtualScroll = true;
  selection = false;
  customSort = false;
  stickyHeader = false;
  data: TestData[] = getTestData();
  displayedColumns: string[] = ['index'];
}

describe('TestTableComponent', () => {
  let testTableComp: TestTableComponent;
  let fixture: ComponentFixture<TestTableComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestTableComponent],
      imports: [NoopAnimationsModule, TableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestTableComponent);
    testTableComp = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(testTableComp).toBeTruthy();
  });
});
