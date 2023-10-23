import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponents } from 'ng-mocks';
import { propertyStub } from '../../../../../test/test-stubs';

import { PropertyTypeComponent } from './property-type.component';

describe('PropertyTypeComponent', () => {
  let component: PropertyTypeComponent;
  let fixture: ComponentFixture<PropertyTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertyTypeComponent, MockComponents(MatError)],
      imports: [MatInputModule, ReactiveFormsModule, BrowserAnimationsModule, MatIconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyTypeComponent);
    component = fixture.componentInstance;
    component.property = propertyStub;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should set propertyFormControl ', () => {
      expect(component.propertyFormControl).toBeDefined();
    });
  });

  describe('ngOnChanges()', () => {
    it('should null propertyFormControl', () => {
      component.propertyFormControl = null;
      component.ngOnChanges();
      expect(component.propertyFormControl).toBe(null);
    });
    describe('when error is defined', () => {
      beforeEach(() => {
        component.error = { property: 'error' };
        component.ngOnChanges();
      });

      it('should set propertyFormControl error', () => {
        expect(component.propertyFormControl.hasError('error')).toBe(true);
      });
    });

    describe('when error is defined', () => {
      beforeEach(() => {
        component.error = null;
        component.ngOnChanges();
      });

      it('should set propertyFormControl error', () => {
        expect(component.propertyFormControl.hasError('error')).toBe(false);
      });
    });
  });

  describe('getPropertyType()', () => {
    let propertyType;

    describe('when propertyType is password', () => {
      beforeEach(() => {
        component.property = { ...propertyStub, Type: 'password' };
        propertyType = component.getPropertyType();
      });

      it('should set property type to password', () => {
        expect(propertyType).toBe('password');
      });
    });

    describe('when propertyType is not password', () => {
      beforeEach(() => {
        component.property = propertyStub;
        propertyType = component.getPropertyType();
      });

      it('should set property type to password', () => {
        expect(propertyType).toBe('text');
      });
    });
  });

  describe('isTypeOfErrorString()', () => {
    let isTypeOfErrorString: boolean;

    describe('when type of error is string', () => {
      beforeEach(() => {
        component.error = 'This field is missing';
        isTypeOfErrorString = component.isTypeOfErrorString();
      });

      it('should set isTypeOfErrorString to true', () => {
        expect(isTypeOfErrorString).toBe(true);
      });
    });

    describe('when type of error is not string', () => {
      beforeEach(() => {
        component.error = { property: 'A field is missing' };
        isTypeOfErrorString = component.isTypeOfErrorString();
      });

      it('shold set isTypeOfErrorString to false', () => {
        expect(isTypeOfErrorString).toBe(false);
      });
    });
  });
});
