import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { ListRange } from '@angular/cdk/collections';
import { map, switchMap } from 'rxjs/operators';
import { Type } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableDataSource } from './table-datasource';
import { TestData, getTestData } from './table-mock';

describe('TableVirtualScrollDataSource', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  runDataSourceTests(TableDataSource);

  it('should extend MatTableDataSource', () => {
    const dataSource: TableDataSource<TestData> = new TableDataSource(getTestData());
    expect(dataSource instanceof MatTableDataSource).toBeTruthy();
  });
});

function runDataSourceTests(
  // tslint:disable-next-line:variable-name
  DataSourceClass: Type<TableDataSource<TestData>>
) {
  it('should be created', () => {
    const dataSource: TableDataSource<TestData> = new DataSourceClass();
    expect(dataSource).toBeTruthy();

    const dataSource2: TableDataSource<TestData> = new DataSourceClass([{ index: 0 }]);
    expect(dataSource2).toBeTruthy();
  });

  it('should provide correct data', () => {
    const testData: TestData[] = getTestData(10);
    const dataSource: TableDataSource<TestData> = new DataSourceClass(testData);
    const stream = new Subject<ListRange>();

    dataSource.dataToRender$
      .pipe(switchMap(data => stream.pipe(map(({ start, end }) => data.slice(start, end)))))
      .subscribe(dataSource.dataOfRange$);

    const renderData: Subject<TestData[]> = dataSource['_renderData'];

    const results: TestData[][] = [];

    renderData.subscribe(data => {
      results.push(data);
    });

    stream.next({ start: 0, end: 2 });
    stream.next({ start: 8, end: testData.length });

    expect(results).toEqual([[], [{ index: 0 }, { index: 1 }], [{ index: 8 }, { index: 9 }]]);
  });

  it('should have reaction on dataOfRange$ changes', () => {
    const testData: TestData[] = getTestData();
    const dataSource: TableDataSource<TestData> = new DataSourceClass(testData);
    const stream = new Subject<TestData[]>();

    stream.subscribe(dataSource.dataOfRange$);

    const renderData: Subject<TestData[]> = dataSource['_renderData'];

    let count = -1; // renderData is BehaviorSubject with base value '[]'
    renderData.subscribe(() => {
      count++;
    });

    stream.next(testData.slice(0, 1));
    stream.next(testData);

    expect(count).toBe(2);
  });

  it('should select records', () => {
    const testData: TestData[] = getTestData();
    const dataSource: TableDataSource<TestData> = new DataSourceClass(testData);
    dataSource.toggle(dataSource.data[0]);
    expect(dataSource.selected.length).toBeGreaterThan(0);
  });

  it('should unselect records', () => {
    const testData: TestData[] = getTestData();
    const dataSource: TableDataSource<TestData> = new DataSourceClass(testData);
    dataSource.toggle(dataSource.data[0]);
    dataSource.toggle(dataSource.data[0]);
    expect(dataSource.selected.length).toBe(0);
  });

  it('should return true if all records selected records', () => {
    const testData: TestData[] = getTestData();
    const dataSource: TableDataSource<TestData> = new DataSourceClass(testData);
    dataSource.toggleAll();
    expect(dataSource.selectedAll).toBe(true);
  });
  it('should return all records', () => {
    const testData: TestData[] = getTestData();
    const dataSource: TableDataSource<TestData> = new DataSourceClass(testData);
    expect(dataSource.allData.length).toBe(testData.length);
  });

  it('should clear selection', () => {
    const testData: TestData[] = getTestData();
    const dataSource: TableDataSource<TestData> = new DataSourceClass(testData);
    dataSource.clearSelection();
    expect(dataSource.selected.length).toBe(0);
  });

  it('should return boolean for record', () => {
    const testData: TestData[] = getTestData();
    const dataSource: TableDataSource<TestData> = new DataSourceClass(testData);
    dataSource.toggle(dataSource.data[0]);
    expect(dataSource.isSelected(dataSource.data[0])).toBe(true);
  });
}
