import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, ColumnState } from 'ag-grid-community';
import { DateTime } from 'luxon';

import { AxAgGridWrapperComponent } from './ax-ag-grid-wrapper.component';

const predefinedColumns: ColDef[] = [
  { headerName: 'Customer', field: 'buyer.name', sortable: true },
  { headerName: 'File Name', field: 'documentName', sortable: true },
  {
    headerName: 'Upload Date',
    field: 'uploadDate',
    sortable: true,
    type: 'dateColumn',
  },
];

const gridApiSpy = {
  sizeColumnsToFit: jest.fn(),
  paginationGetPageSize: jest.fn(),
  paginationSetPageSize: jest.fn(),
  onFilterChanged: jest.fn(),
  setRowData: jest.fn(),
};

describe('AxAgGridWrapperComponent', () => {
  let component: AxAgGridWrapperComponent;
  let fixture: ComponentFixture<AxAgGridWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AxAgGridWrapperComponent],
      imports: [AgGridModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AxAgGridWrapperComponent);
    component = fixture.componentInstance;

    component.columnDefs = predefinedColumns;
    component.gridApi = gridApiSpy as any;
    component.rowData = [];
    component.clientSidePaging = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call gridApis sizeColumnsToFit function when window resizes', () => {
    window.dispatchEvent(new Event('resize'));
    expect(gridApiSpy.sizeColumnsToFit).toHaveBeenCalled();
  });

  describe('onFirstDataRendered()', () => {
    afterAll(() => {
      component.gridApi = gridApiSpy as any;
      component.rowData = [];
      component.clientSidePaging = false;
    });

    describe('when gridApi & rowData are instantiated', () => {
      beforeEach(() => {
        jest.spyOn(component.hideLoadMore, 'emit').mockImplementation();
        component.clientSidePaging = true;
        component.onFirstDataRendered();
      });

      it('should call gridApi sizeColumnsToFit function', () =>
        expect(component.gridApi.sizeColumnsToFit).toHaveBeenCalled());

      it('should emit hideLoadMore with true', () =>
        expect(component.hideLoadMore.emit).toHaveBeenCalledWith(true));
    });

    describe('when gridApi & rowData are not instantiated', () => {
      beforeEach(() => {
        jest.spyOn(component.hideLoadMore, 'emit').mockImplementation();
        component.gridApi = null;
        component.rowData = null;
        component.clientSidePaging = true;
        component.onFirstDataRendered();
      });

      it('should call gridApi sizeColumnsToFit function', () =>
        expect(component.gridApi).toBeNull());

      it('should emit hideLoadMore with false', () =>
        expect(component.hideLoadMore.emit).toHaveBeenCalledWith(false));
    });
  });

  describe('loadMoreData()', () => {
    describe('when clientSidePaging is true', () => {
      beforeEach(() => {
        jest.spyOn(component, 'refreshData').mockImplementation();
        component.loadMoreSize = 30;
        gridApiSpy.paginationGetPageSize.mockReturnValue(component.loadMoreSize);
        component.clientSidePaging = true;
        component.loadMoreData();
      });

      it('should call refreshData with newData as 30', () =>
        expect(component.refreshData).toHaveBeenCalledWith([]));
    });

    describe('when clientSidePaging is false', () => {
      beforeEach(() => {
        jest.spyOn(component.loadNextPageEvent, 'emit').mockImplementation();
        component.clientSidePaging = false;
        component.loadMoreData();
      });

      it('should emit loadNextPageEvent', () =>
        expect(component.loadNextPageEvent.emit).toHaveBeenCalled());
    });
  });

  describe('refreshData', () => {
    describe('when newData is empty', () => {
      beforeEach(() => {
        component.refreshData([]);
      });

      it('should not call any gridApi paginationSetPageSize', () =>
        expect(component.gridApi.paginationSetPageSize).not.toHaveBeenCalled());

      it('should not call any gridApi setRowData', () =>
        expect(component.gridApi.setRowData).not.toHaveBeenCalled());
    });

    describe('when newData has data', () => {
      beforeEach(() => {
        jest.spyOn(component.hideLoadMore, 'emit').mockImplementation();
        component.clientSidePaging = true;
        component.refreshData([{ cellData: '' }]);
      });

      it('should emit hideLoadMore with false', () =>
        expect(component.hideLoadMore.emit).toHaveBeenCalledWith(true));

      it('should call any gridApi paginationSetPageSize', () =>
        expect(component.gridApi.paginationSetPageSize).toHaveBeenCalledWith(1));

      it('should call any gridApi setRowData', () =>
        expect(component.gridApi.setRowData).toHaveBeenCalledWith([{ cellData: '' }]));

      it('should call any gridApi sizeColumnsToFit', () =>
        expect(component.gridApi.sizeColumnsToFit).toHaveBeenCalled());
    });
  });

  describe('applyFilter()', () => {
    beforeEach(() => {
      component.applyFilter();
    });

    it('should call gridApis onFilterChanged function', () =>
      expect(component.gridApi.onFilterChanged).toHaveBeenCalled());
  });

  describe('dateFormatter()', () => {
    let dateValue: string;

    describe('when params is null', () => {
      beforeEach(() => {
        dateValue = component.dateFormatter(null);
      });

      it('should return undefined', () => expect(dateValue).toBeNull());
    });

    describe('when params does not have a value', () => {
      beforeEach(() => {
        dateValue = component.dateFormatter({ id: 1 });
      });

      it('should return undefined', () => expect(dateValue).toBeNull());
    });

    describe('when params has a value', () => {
      const date = Date.now();
      const unixDate = Math.floor(date / 1000);

      beforeEach(() => {
        dateValue = component.dateFormatter({
          value: unixDate,
        });
      });

      it('should return a formatted date', () => {
        expect(dateValue).toEqual(DateTime.fromMillis(date).toFormat('dd MMM y hh:mma'));
      });
    });
  });

  describe('sortChanged()', () => {
    const columnStateStub: ColumnState = {
      colId: 'buyerName',
      width: 392,
      hide: false,
      pinned: null,
      sort: 'asc',
      sortIndex: 0,
      aggFunc: null,
      rowGroup: false,
      rowGroupIndex: null,
      pivot: false,
      pivotIndex: null,
      flex: null,
    };

    beforeEach(() => {
      jest.spyOn(component.columnSorted, 'emit');
      component.gridColumnApi = {
        getColumnState: jest.fn(() => [columnStateStub]),
      } as any;

      component.sortChanged();
    });

    it('should emit columnState when a column is sorted', () =>
      expect(component.columnSorted.emit).toHaveBeenNthCalledWith(1, [columnStateStub]));
  });
});
