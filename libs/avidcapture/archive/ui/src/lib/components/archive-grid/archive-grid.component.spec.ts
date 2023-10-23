import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from '@ui-coe/shared/ui-v2';
import { MockComponent } from 'ng-mocks';

import { ArchiveGridComponent } from './archive-grid.component';

describe('ArchiveGridComponent', () => {
  let component: ArchiveGridComponent;
  let fixture: ComponentFixture<ArchiveGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArchiveGridComponent, MockComponent(TableComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveGridComponent);
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
  });
});
