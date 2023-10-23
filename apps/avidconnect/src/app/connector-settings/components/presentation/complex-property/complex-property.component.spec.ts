import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { dialogStub, propertyStub, storeStub } from '../../../../../test/test-stubs';
import { ComplexPropertyModalComponent } from './complex-property-modal/complex-property-modal.component';

import { ComplexPropertyComponent } from './complex-property.component';

describe('ComplexPropertyComponent', () => {
  let component: ComplexPropertyComponent;
  let fixture: ComponentFixture<ComplexPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComplexPropertyComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: dialogStub,
        },
        {
          provide: Store,
          useValue: storeStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplexPropertyComponent);
    component = fixture.componentInstance;
    component.property = propertyStub;
    jest.spyOn(dialogStub, 'open').mockReturnValue({
      afterClosed: () => of(null),
      componentInstance: { valueChanged: of({ settings: {} }) },
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      component.isNew = true;
      // jest.spyOn(storeStub, 'select').mockReturnValue(of({}));
      component.ngOnInit();
    });
    it('should open Modal component', () => {
      expect(dialogStub.open).toHaveBeenNthCalledWith(1, ComplexPropertyModalComponent, {
        data: { property: component.property, value: component.value, isNew: true },
        maxHeight: '100vh',
      });
    });
  });

  describe('ngOnChanges()', () => {
    beforeEach(() => {
      component.dialogRef = { componentInstance: { data: { error: null } } } as any;
    });

    describe('when error change has value', () => {
      beforeEach(() => {
        component.error = { error: 'error' };
        component.ngOnChanges({ error: { currentValue: 'error' } } as any);
      });

      it('should map error value on dialogref data object', () => {
        expect(component.dialogRef.componentInstance.data.error).toBe(component.error);
      });
    });

    describe('when error change has no value', () => {
      beforeEach(() => {
        component.ngOnChanges({ error: { currentValue: '' } } as any);
      });

      it('should map error value on dialog ref data error object', () => {
        expect(component.dialogRef.componentInstance.data.error).toBe(null);
      });
    });

    describe('when error is null', () => {
      beforeEach(() => {
        component.ngOnChanges({ error: null } as any);
      });

      it('should map error value on dialog ref data error object', () => {
        expect(component.dialogRef.componentInstance.data.error).toBe(null);
      });
    });
  });

  describe('New openComplexTypeModal', () => {
    beforeEach(() => {
      component.openComplexTypeModal(true);
    });

    it('should open dialog component', () =>
      expect(dialogStub.open).toHaveBeenNthCalledWith(1, ComplexPropertyModalComponent, {
        data: { property: propertyStub, value: component.value, isNew: true },
        maxHeight: '100vh',
      }));
  });

  describe('Old openComplexTypeModal', () => {
    beforeEach(() => {
      component.openComplexTypeModal();
    });

    it('should open dialog component', () =>
      expect(dialogStub.open).toHaveBeenNthCalledWith(1, ComplexPropertyModalComponent, {
        data: { property: propertyStub, value: component.value, isNew: false },
        maxHeight: '100vh',
      }));
  });
});
