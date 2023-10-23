import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialUiModule } from '../../lib/material-ui.module';
import { MatTableDataSource } from '@angular/material/table';
import { MockComponents } from 'ng-mocks';
import { DynamicTableComponent } from './dynamic-table.component';
import { MobileTableComponent } from './mobile-table/mobile-table.component';
import { DynamicTableCellComponent } from './dynamic-table-cell/dynamic-table-cell.component';
import { DynamicExpandableCellComponent } from './dynamic-expandable-cell/dynamic-expandable-cell.component';
import { EventEmitter, SimpleChange } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSortHeaderHarness } from '@angular/material/sort/testing';
import { SortDirection } from '@angular/material/sort';

describe('DynamicTableComponent', () => {
  let component: DynamicTableComponent<any>;
  let fixture: ComponentFixture<DynamicTableComponent<any>>;
  let loader: HarnessLoader;
  const mockData = [
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
    {
      position: 2,
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
  ];
  const paginatorData = {
    pageSize: 1,
    pageSizeOptions: [1, 3, 5, 7],
    hidePageSize: false,
    pageIndex: 0,
    showFirstLastButtons: true,
    disabled: false,
    page: (event): void => {
      console.log(event);
    },
    pageLabels: {
      firstPageLabel: 'First',
      lastPageLabel: 'Last',
      nextPageLabel: 'Next',
      previousPageLabel: 'Previous',
      itemsPerPageLabel: 'Testing Items',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DynamicTableComponent,
        MockComponents(
          MobileTableComponent,
          DynamicTableCellComponent,
          DynamicExpandableCellComponent
        ),
      ],
      imports: [NoopAnimationsModule, MaterialUiModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicTableComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    component.sortEvent = new EventEmitter<{
      direction: SortDirection;
      column: string;
    }>();
    component.dataSource = new MatTableDataSource(mockData);
    component.columnDefs = [
      {
        columnDef: 'multiSelect',
        headerCellDef: 'test3',
        cellDef: {
          type: 'text',
          value: '',
        },
      },
      {
        columnDef: 'position',
        headerCellDef: 'No.',
        cellDef: { type: 'text', value: (element: any): any => element.position },
      },
      {
        columnDef: 'name',
        headerCellDef: 'Name',
        cellDef: { type: 'text', value: (element: any): any => element.name },
      },
      {
        columnDef: 'weight',
        headerCellDef: 'Weight.',
        cellDef: { type: 'text', value: (element: any): any => element.weight },
      },
      {
        columnDef: 'symbol',
        headerCellDef: 'Symbol',
        cellDef: { type: 'text', value: (element: any): any => element.symbol },
      },
      {
        columnDef: 'details',
        headerCellDef: 'Details',
        cellDef: {
          type: 'text',
          value: '',
        },
      },
      {
        columnDef: 'action',
        headerCellDef: '',
        cellDef: {
          type: 'text',
          value: '',
        },
      },
    ];
    component.filtering = true;
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

  describe('ngOnInit', () => {
    it('should have called selectionToggle()', () => {
      const spy = jest.spyOn(component, 'selectionToggle');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should have called selectionToggle()', () => {
      const spy = jest.spyOn(component, 'selectionToggle');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('if multiSelect, selectionToggle should return true', () => {
    it('should return true', () => {
      const spy = jest.spyOn(component, 'selectionToggle');
      component.selectionToggle();
      expect(spy).toBeTruthy();
    });
  });

  describe('isAllSelected', () => {
    it('should return false if the data length and selected length are not equal', () => {
      component.isAllSelected();
      expect(component.dataSource.data.length).toEqual(2);
      expect(component.selectionType.selected.length).toEqual(0);

      expect(component.isAllSelected()).toBeFalsy();
    });

    it('should return true if the data length and selected length are equal', () => {
      const data1 = component.dataSource.data[0];
      const data2 = component.dataSource.data[1];

      component.selectionType.toggle(data1);
      component.selectionType.toggle(data2);

      expect(component.dataSource.data.length).toEqual(2);
      expect(component.selectionType.selected.length).toEqual(2);
      expect(component.isAllSelected()).toBeTruthy();
    });
  });

  describe('masterToggle', () => {
    it('should select all rows if they are not all selected', () => {
      component.masterToggle();
      expect(component.selectionType.selected).toHaveLength(2);
    });

    it('should unselect all rows if they are all selected', () => {
      const data1 = component.dataSource.data[0];
      const data2 = component.dataSource.data[1];

      component.selectionType.toggle(data1);
      component.selectionType.toggle(data2);

      component.masterToggle();
      expect(component.selectionType.selected).toHaveLength(0);
    });
  });

  describe('clickCheckbox', () => {
    it('should stop action if element is clicked', () => {
      const ev = new Event('click');
      jest.spyOn(ev, 'stopPropagation');

      component.clickCheckbox(ev);
      expect(ev.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('changeRadioButton', () => {
    it('should add data to selectionType if data does not equal selectionType', () => {
      const data = component.dataSource.data;
      component.changeRadioButton(data);
      expect(component.selectionType.selected[0]).toEqual(data);
    });
  });

  describe('changeRadioButton', () => {
    it('should add data to selectionType if data does not equal selectionType', () => {
      const data = component.dataSource.data;
      component.selectionType.selected[0] = data;
      expect(component.changeRadioButton(data)).toEqual(null);
    });
  });

  describe('checkboxToggle', () => {
    it('should add data to selectionType', () => {
      const data = component.dataSource.data;
      component.checkboxToggle(data);
      expect(component.selectionType.selected[0]).toEqual(data);
    });
  });

  describe('set dataSource', () => {
    it('if dataSouce is undefinded, dataSource should not be set', () => {
      component.dataSource = undefined;
      expect(component.dataSource).toBeUndefined;
    });
  });

  describe('ngOnChanges', () => {
    it('if a change is made to dataSource set its sort to materials sort', () => {
      const newDataSource = new MatTableDataSource(mockData);

      // Set the new data source reference
      component.dataSource = newDataSource;

      // Manually call ngOnChanges
      component.ngOnChanges({ dataSource: new SimpleChange(undefined, newDataSource, true) });

      expect(component.dataSource.sort).toEqual(component.sort);
    });
  });

  describe('ngOnDestroy', () => {
    it('if ngOnDestroy is called and dataSource is undefined, exect ngOnDestroy to not disconnect from dataSource', () => {
      component.dataSource = undefined;
      component.ngOnDestroy();

      expect(component.dataSource).toBeUndefined;
      expect(component.ngOnDestroy).toHaveBeenCalled;
    });
  });

  describe('set Sort', () => {
    it('if sort is undefined, sort should not be set', () => {
      component.sort = undefined;
      expect(component.sort).toBeUndefined;
    });

    it('should check if paginator is undefined', async () => {
      component.paginator = undefined;
      component.ngOnInit();

      // Get our "No." column sort header harness
      const sortHeader = await loader.getHarness(MatSortHeaderHarness);

      // Click and sort
      await sortHeader.click();

      expect(component.paginator).toBeUndefined;
    });
  });

  describe('paginator', () => {
    it('should set the datasource paginator to the MatPaginator when paginator is set', () => {
      // Set our input paginator
      component.paginator = paginatorData;

      // Detect the new input paginator
      fixture.detectChanges();

      // Validate our datasource is set to the paginator
      expect(component.dataSource.paginator).toBeTruthy();
    });

    it('should check if paginator is defined then set index to 0', async () => {
      component.paginator = paginatorData;
      component.ngOnInit();

      // Get next button
      const nextButton = await loader.getHarness(
        MatButtonHarness.with({ selector: '.mat-mdc-paginator-navigation-next' })
      );

      // Click next button to go to page 2
      await nextButton.click();

      // Get our "No." column sort header harness
      const sortHeader = await loader.getHarness(MatSortHeaderHarness);

      // Click and sort
      await sortHeader.click();

      expect(component.matPaginator.pageIndex).toEqual(0);
    });

    it('should emit the sortEvent when the table is sorted', async () => {
      // Spy on sortEvent
      jest.spyOn(component.sortEvent, 'emit');
      component.paginator = paginatorData;
      component.ngOnInit();

      // Get our "No." column sort header harness
      const sortHeader = await loader.getHarness(MatSortHeaderHarness);

      // Click and sort
      await sortHeader.click();

      expect(component.sortEvent.emit).toHaveBeenCalled();
    });
  });

  describe('applyFilter', () => {
    it('if datasource has a paginator run materials firstPage function', async () => {
      component.paginator = paginatorData;

      const input = await loader.getHarness(
        MatInputHarness.with({ selector: '[data-test="table-filtering"]' })
      );
      input.setValue('a');

      fixture.detectChanges();

      expect(component.dataSource.paginator).toBeTruthy();
    });

    it('if datasource does not have a paginator make sure it is undefined', async () => {
      const input = await loader.getHarness(
        MatInputHarness.with({ selector: '[data-test="table-filtering"]' })
      );
      input.setValue('a');

      expect(component.dataSource.paginator).toBeUndefined();
    });
  });
});
