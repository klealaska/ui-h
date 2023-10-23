import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getDocuments } from '@ui-coe/avidcapture/shared/test';
import { TableComponent } from '@ui-coe/shared/ui-v2';

import { UploadsQueueGridComponent } from './uploads-queue-grid.component';
import { PendingUploadStatus } from '../../../../../../shared/types/src';

describe('UploadsQueueGridComponent', () => {
  let component: UploadsQueueGridComponent;
  let fixture: ComponentFixture<UploadsQueueGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadsQueueGridComponent],
      imports: [TableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadsQueueGridComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    describe('when batchSelectIsActive is TRUE && user is a customer', () => {
      beforeEach(() => {
        component.batchSelectIsActive = true;
        component.canViewAllBuyers = false;
        fixture.detectChanges();
      });

      it('should have buyerName column for the displayedColumns', () =>
        expect(component.displayedColumns.includes('checkbox')).toBeTruthy());
    });

    describe('when batchSelectIsActive is FALSE && user is a customer', () => {
      beforeEach(() => {
        component.batchSelectIsActive = false;
        component.canViewAllBuyers = false;
        fixture.detectChanges();
      });

      it('should NOT have buyerName column for the displayedColumns', () =>
        expect(component.displayedColumns.includes('checkbox')).toBeFalsy());
    });

    describe('when batchSelectIsActive is FALSE && user is an indexer', () => {
      beforeEach(() => {
        component.batchSelectIsActive = false;
        component.canViewAllBuyers = true;
        fixture.detectChanges();
      });

      it('should NOT have buyerName column for the displayedColumns', () =>
        expect(component.displayedColumns.includes('checkbox')).toBeFalsy());
    });

    describe('when batchSelectIsActive is TRUE && user is an indexer', () => {
      beforeEach(() => {
        component.batchSelectIsActive = true;
        component.canViewAllBuyers = true;
        fixture.detectChanges();
      });

      it('should NOT have buyerName column for the displayedColumns', () =>
        expect(component.displayedColumns.includes('checkbox')).toBeFalsy());
    });

    describe('when canViewAllBuyers is TRUE', () => {
      beforeEach(() => {
        component.canViewAllBuyers = true;
        fixture.detectChanges();
      });

      it('should have buyerName column for the displayedColumns', () =>
        expect(component.displayedColumns.includes('buyerName')).toBeTruthy());
    });

    describe('when canViewAllBuyers is FALSE', () => {
      beforeEach(() => {
        component.canViewAllBuyers = false;
        fixture.detectChanges();
      });

      it('should NOT have buyerName column for the displayedColumns', () =>
        expect(component.displayedColumns.includes('buyerName')).toBeFalsy());
    });
  });

  describe('ngOnChanges()', () => {
    describe('when documents are NULL', () => {
      beforeEach(() => {
        component.ngOnChanges({
          documents: new SimpleChange(null, null, true),
        });
      });

      it('should not add any counts to filterCount', () =>
        expect(component.documentDataSource.data).toEqual([]));
    });

    describe('when documents are have some changes', () => {
      beforeEach(() => {
        component.ngOnChanges({
          documents: new SimpleChange(null, getDocuments(), true),
        });
      });

      it('should not add any counts to filterCount', () =>
        expect(component.documentDataSource.data).toEqual(getDocuments()));
    });

    describe('when resetBatchSelection is NULL', () => {
      beforeEach(() => {
        jest.spyOn(component.selection, 'clear').mockImplementation();
        component.ngOnChanges({
          resetBatchSelection: new SimpleChange(null, null, true),
        });
      });

      it('should not clear selection', () =>
        expect(component.selection.clear).not.toHaveBeenCalled());
    });

    describe('when resetBatchSelection is false', () => {
      beforeEach(() => {
        jest.spyOn(component.selection, 'clear').mockImplementation();
        component.ngOnChanges({
          resetBatchSelection: new SimpleChange(null, false, true),
        });
      });

      it('should not clear selection', () =>
        expect(component.selection.clear).not.toHaveBeenCalled());
    });

    describe('when resetBatchSelection is true', () => {
      beforeEach(() => {
        jest.spyOn(component.selection, 'clear').mockImplementation();
        component.ngOnChanges({
          resetBatchSelection: new SimpleChange(null, true, true),
        });
      });

      it('should clear selection', () =>
        expect(component.selection.clear).toHaveBeenCalledTimes(1));
    });
  });

  describe('isAllSelected()', () => {
    describe('when numSelected does not equal excluded rows', () => {
      beforeEach(() => {
        component.selection.select({ documentId: '1' });
        component.documentDataSource.data = [{ documentId: '1' }, { documentId: '2' }];
      });

      it('should return FALSE', () => expect(component.isAllSelected()).toBeFalsy());
    });

    describe('when numSelected equals excluded rows && uploadStatus is not defined on any rows', () => {
      beforeEach(() => {
        component.selection.select({ documentId: '1' });
        component.documentDataSource.data = [{ documentId: '1' }];
      });

      it('should return TRUE', () => expect(component.isAllSelected()).toBeTruthy());
    });

    describe('when uploadStatus is defined but all docs are completed', () => {
      beforeEach(() => {
        component.selection.select({
          documentId: '1',
          uploadStatus: PendingUploadStatus.Completed,
        });
        component.documentDataSource.data = [
          { documentId: '1', uploadStatus: PendingUploadStatus.Completed },
        ];
      });

      it('should return TRUE', () => expect(component.isAllSelected()).toBeTruthy());
    });

    describe('when uploadStatus is defined and some docs are still pending', () => {
      beforeEach(() => {
        component.selection.select({
          documentId: '1',
          uploadStatus: PendingUploadStatus.Completed,
        });
        component.documentDataSource.data = [
          { documentId: '1', uploadStatus: PendingUploadStatus.Pending },
          { documentId: '1', uploadStatus: PendingUploadStatus.Completed },
        ];
      });

      it('should filter the pending docs out & return TRUE', () =>
        expect(component.isAllSelected()).toBeTruthy());
    });
  });

  describe('selectRow()', () => {
    beforeEach(() => {
      jest.spyOn(component.rowsSelected, 'emit').mockImplementation();
      jest.spyOn(component.selection, 'toggle');

      component.selectRow({ documentId: '1' });
    });

    it('should toggle the selection model for passed in row', () =>
      expect(component.selection.toggle).toHaveBeenNthCalledWith(1, { documentId: '1' }));

    it('should emit the selected rows for rowsSelected', () =>
      expect(component.rowsSelected.emit).toHaveBeenNthCalledWith(1, [{ documentId: '1' }]));
  });

  describe('selectAllRows()', () => {
    describe('when all rows are selected and you want to deselect them all', () => {
      beforeEach(() => {
        jest.spyOn(component.rowsSelected, 'emit').mockImplementation();
        jest.spyOn(component.selection, 'clear');
        jest.spyOn(component, 'isAllSelected').mockImplementation(() => true);

        component.selectAllRows();
      });

      it('should clear the selection model', () =>
        expect(component.selection.clear).toHaveBeenCalledTimes(1));

      it('should emit the selected rows for rowsSelected', () =>
        expect(component.rowsSelected.emit).toHaveBeenNthCalledWith(1, []));
    });

    describe('when all rows are not selected but the only rows remaining are processing', () => {
      beforeEach(() => {
        jest.spyOn(component.rowsSelected, 'emit').mockImplementation();
        jest.spyOn(component.selection, 'select');
        jest.spyOn(component, 'isAllSelected').mockImplementation(() => false);

        component.documentDataSource.data = [
          { documentId: '1', uploadStatus: PendingUploadStatus.Pending },
        ];

        component.selectAllRows();
      });

      it('should clear the selection model', () =>
        expect(component.selection.select).not.toHaveBeenCalled());

      it('should emit the selected rows for rowsSelected', () =>
        expect(component.rowsSelected.emit).toHaveBeenNthCalledWith(1, []));
    });

    describe('when uploadStatus is defined and user selects all', () => {
      beforeEach(() => {
        jest.spyOn(component.rowsSelected, 'emit').mockImplementation();
        jest.spyOn(component.selection, 'select');
        jest.spyOn(component, 'isAllSelected').mockImplementation(() => false);

        component.documentDataSource.data = [
          { documentId: '1', uploadStatus: PendingUploadStatus.Completed },
        ];

        component.selectAllRows();
      });

      it('should clear the selection model', () =>
        expect(component.selection.select).toHaveBeenNthCalledWith(1, {
          documentId: '1',
          uploadStatus: PendingUploadStatus.Completed,
        }));

      it('should emit the selected rows for rowsSelected', () =>
        expect(component.rowsSelected.emit).toHaveBeenNthCalledWith(1, [
          { documentId: '1', uploadStatus: PendingUploadStatus.Completed },
        ]));
    });

    describe('when all rows are not selected', () => {
      beforeEach(() => {
        jest.spyOn(component.rowsSelected, 'emit').mockImplementation();
        jest.spyOn(component.selection, 'select');
        jest.spyOn(component, 'isAllSelected').mockImplementation(() => false);

        component.documentDataSource.data = [{ documentId: '1', lockedBy: 'none' }];

        component.selectAllRows();
      });

      it('should clear the selection model', () =>
        expect(component.selection.select).toHaveBeenNthCalledWith(1, {
          documentId: '1',
          lockedBy: 'none',
        }));

      it('should emit the selected rows for rowsSelected', () =>
        expect(component.rowsSelected.emit).toHaveBeenNthCalledWith(1, [
          { documentId: '1', lockedBy: 'none' },
        ]));
    });
  });
});
