import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextMenuComponent } from '@ui-coe/avidcapture/shared/ui';
import { TableComponent } from '@ui-coe/shared/ui-v2';
import { MockComponent } from 'ng-mocks';

import { RecycleBinGridComponent } from './recycle-bin-grid.component';

describe('RecycleBinGridComponent', () => {
  let component: RecycleBinGridComponent;
  let fixture: ComponentFixture<RecycleBinGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RecycleBinGridComponent,
        MockComponent(TableComponent),
        MockComponent(ContextMenuComponent),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecycleBinGridComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
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

    describe('when batchSelectIsActive is TRUE', () => {
      beforeEach(() => {
        component.batchSelectIsActive = true;
        component.canViewAllBuyers = true;
        fixture.detectChanges();
      });

      it('should have moved lockedBy column to the end for the displayedColumns', () =>
        expect(component.displayedColumns).toEqual([
          'fileName',
          'sourceEmail',
          'buyerName',
          'lastModified',
          'dateReceived',
          'ingestionType',
          'lockedBy',
        ]));
    });

    describe('when batchSelectIsActive is FALSE', () => {
      beforeEach(() => {
        component.batchSelectIsActive = false;
        component.canViewAllBuyers = true;
        fixture.detectChanges();
      });

      it('should NOT move lockedBy column for the displayedColumns', () =>
        expect(component.displayedColumns).toEqual([
          'lockedBy',
          'fileName',
          'sourceEmail',
          'buyerName',
          'lastModified',
          'dateReceived',
          'ingestionType',
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
