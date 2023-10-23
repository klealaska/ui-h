import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getDocuments } from '@ui-coe/avidcapture/shared/test';
import { ContextMenuComponent } from '@ui-coe/avidcapture/shared/ui';
import { MockComponent } from 'ng-mocks';

import { PendingGridComponent } from './pending-grid.component';

describe('PendingGridComponent', () => {
  let component: PendingGridComponent;
  let fixture: ComponentFixture<PendingGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PendingGridComponent, MockComponent(ContextMenuComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingGridComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
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

    describe('when batchSelectIsActive is TRUE', () => {
      beforeEach(() => {
        component.batchSelectIsActive = true;
        component.canViewAllBuyers = false;
        fixture.detectChanges();
      });

      it('should have moved lockedBy column to the end for the displayedColumns', () =>
        expect(component.displayedColumns).toEqual([
          'checkbox',
          'fileName',
          'sourceEmail',
          'dateReceived',
          'ingestionType',
          'lockedBy',
        ]));
    });

    describe('when batchSelectIsActive is FALSE', () => {
      beforeEach(() => {
        component.batchSelectIsActive = false;
        component.canViewAllBuyers = false;
        fixture.detectChanges();
      });

      it('should NOT move lockedBy column for the displayedColumns', () =>
        expect(component.displayedColumns).toEqual([
          'lockedBy',
          'fileName',
          'sourceEmail',
          'dateReceived',
          'ingestionType',
        ]));
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

    describe('when numSelected equals excluded rows', () => {
      beforeEach(() => {
        component.selection.select({ documentId: '1', lockedBy: 'none' });
        component.documentDataSource.data = [{ documentId: '1', lockedBy: 'none' }];
      });

      it('should return TRUE', () => expect(component.isAllSelected()).toBeTruthy());
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

    describe('when all rows are not selected but the only rows remaining are locked', () => {
      beforeEach(() => {
        jest.spyOn(component.rowsSelected, 'emit').mockImplementation();
        jest.spyOn(component.selection, 'select');
        jest.spyOn(component, 'isAllSelected').mockImplementation(() => false);

        component.documentDataSource.data = [{ documentId: '1', lockedBy: 'mock' }];

        component.selectAllRows();
      });

      it('should clear the selection model', () =>
        expect(component.selection.select).not.toHaveBeenCalled());

      it('should emit the selected rows for rowsSelected', () =>
        expect(component.rowsSelected.emit).toHaveBeenNthCalledWith(1, []));
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

  describe('onRightClick', () => {
    it('should set properties correctly on right click', () => {
      const mockEvent = new MouseEvent('contextmenu', { clientX: 100, clientY: 200 });
      const mockDocument = document;

      component.onRightClick(mockEvent, mockDocument);

      expect(component.unlockDocument).toEqual(mockDocument);
      expect(component.contextMenuPosition).toEqual({ left: 100, top: 200 });
      expect(component.contextMenuVisible).toBe(true);
    });
  });
});
