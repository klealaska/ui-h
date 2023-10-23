import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { NgxsModule, Store } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import {
  complexStub,
  dialogRefStub,
  propertyStub,
  schemaHelperStub,
  storeStub,
} from '../../../../../../test/test-stubs';
import { SchemaHelperService } from '../../../../services/schema-helper.service';
import { PropertyTypeComponent } from '../../property-type/property-type.component';

import { ComplexPropertyModalComponent } from './complex-property-modal.component';

describe('ComplexPropertyModalComponent', () => {
  let component: ComplexPropertyModalComponent;
  let fixture: ComponentFixture<ComplexPropertyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ComplexPropertyModalComponent,
        MockComponents(MatLabel, PropertyTypeComponent),
      ],
      imports: [NgxsModule.forRoot([]), MatDialogModule, MatIconModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { groupName: 'group', property: propertyStub, value: {}, complexValues: [] },
        },
        {
          provide: Store,
          useValue: storeStub,
        },
        {
          provide: SchemaHelperService,
          useValue: schemaHelperStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplexPropertyModalComponent);
    component = fixture.componentInstance;
    jest.spyOn(storeStub, 'selectSnapshot').mockReturnValue(() => ({
      ...complexStub,
      Properties: [propertyStub],
    }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should validate property values', () => {
      fixture.detectChanges();
      expect(schemaHelperStub.validatePropertyValue).toHaveBeenCalled();
    });
  });

  describe('saveComplexForm', () => {
    beforeEach(() => component.saveComplexForm());

    it('should close dialogRef', () => expect(dialogRefStub.close).toHaveBeenCalled());
  });

  describe('complexValueChanged()', () => {
    describe('when index is 0', () => {
      beforeEach(() => {
        component.complexValueChanged('', propertyStub, 0);
      });

      it('should set duplicatedError message', () => {
        expect(component.duplicatedError).toBe('');
      });
    });

    describe('when index is greater than 0', () => {
      beforeEach(() => {
        jest.spyOn(component.valueChanged, 'emit');
        component.complexValueChanged('', propertyStub, 2);
      });

      it('should emit valueChanged', () => {
        expect(component.valueChanged.emit).toHaveBeenCalled();
      });
    });
  });
});
