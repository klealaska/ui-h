import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { PropertyType } from '../../../../core/enums';
import { MockComponents } from 'ng-mocks';
import { propertyStub } from '../../../../../test/test-stubs';
import { PropertyTypeComponent } from '../property-type/property-type.component';

import { PropertyItemComponent } from './property-item.component';

describe('PropertyItemComponent', () => {
  let component: PropertyItemComponent;
  let fixture: ComponentFixture<PropertyItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PropertyItemComponent,
        MockComponents(MatLabel, PropertyTypeComponent, MatIcon),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyItemComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    component.property = propertyStub;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    describe('when property IsArray = true', () => {
      describe('and value is not defined', () => {
        describe('and property Type is not "complex"', () => {
          beforeEach(() => {
            component.property = { ...propertyStub, IsArray: true };
            component.propertiesArray = [];
            component.ngOnInit();
          });

          it('should add defualt value object to propertyArray', () =>
            expect(component.propertiesArray[0]).toEqual({ value: '', isNew: true }));
        });

        describe('and property Type is "complex"', () => {
          beforeEach(() => {
            component.property = { ...propertyStub, IsArray: true, Type: PropertyType.Complex };
            component.propertiesArray = [];
            fixture.detectChanges();
          });

          it('should not add defualt value object to propertyArray', () =>
            expect(component.propertiesArray.length).toBe(0));
        });
      });

      describe('and value is defined', () => {
        beforeEach(() => {
          component.property = { ...propertyStub, IsArray: true };
          component.value = [1, 2, 3];
          component.propertiesArray = [];
          component.ngOnInit();

          console.log('propertiesArray: ', component.propertiesArray);
        });

        it('should add  values object to propertyArray', () =>
          expect(component.propertiesArray.length).toBe(component.value.length));
      });

      describe('and value is defined and property type is "complex"', () => {
        beforeEach(() => {
          component.property = { ...propertyStub, IsArray: true, Type: 'complex' };
          component.value = [{ key1: 'test1' }, { key2: 'test2' }, { key3: 'test3' }];
          component.propertiesArray = [];
          component.complexValues = undefined;
          component.ngOnInit();
          console.log('propertiesArray: ', component.propertiesArray);
        });

        it('should add  values object to propertyArray', () =>
          expect(component.propertiesArray.length).toBe(component.value.length));

        it('shoud add values to complexValues', () =>
          expect(component.complexValues).toBeDefined());
      });
    });

    describe('when property IsArray = false', () => {
      beforeEach(() => {
        component.propertiesArray = [];
        component.property = propertyStub;
        component.ngOnInit();
      });

      it('should not add value to propertyArray', () =>
        expect(component.propertiesArray.length).toBe(0));
    });
  });

  describe('addProperty()', () => {
    beforeEach(() => {
      component.propertiesArray = [];
      component.addProperty();
    });

    it('should add new prop object to propertiesArray', () =>
      expect(component.propertiesArray.length).toBe(1));
  });

  describe('removeProperty()', () => {
    const prop = { value: '', isNew: true };
    beforeEach(() => {
      component.propertiesArray = [prop];
      component.property = propertyStub;
      component.removeProperty(prop);
    });

    it('should remove prop object from propertiesArray', () =>
      expect(component.propertiesArray.length).toBe(0));
  });

  describe('complexModalClosed()', () => {
    let propertyValue;
    beforeEach(() => {
      component.propertiesArray = [{ value: '' }];
      propertyValue = { isNew: true, value: '' };
    });
    describe('if is saved', () => {
      beforeEach(() => {
        component.complexModalClosed(true, propertyValue);
      });

      it('should set isNew to false', () => expect(propertyValue.isNew).toBe(false));
    });

    describe('if prop is null', () => {
      beforeEach(() => {
        component.complexModalClosed(true, null);
      });

      it('should not save', () => expect(component.propertiesArray).toStrictEqual([{ value: '' }]));
    });

    describe('if is not saved', () => {
      beforeEach(() => {
        component.complexModalClosed(false, { value: '', isNew: true });
      });

      it('should pop property from propertiesArray', () =>
        expect(component.propertiesArray.length).toBe(0));
    });
  });

  describe('propertyArrayChanged()', () => {
    beforeEach(() => {
      jest.spyOn(component.valueChanged, 'emit');
      component.propertiesArray = [{ value: '' }];
      component.property = propertyStub;
      component.propertyArrayChanged({ value: 'value', index: 0 });
    });

    it('should emit valueChanged with array values', () => {
      expect(component.valueChanged.emit).toHaveBeenCalled();
    });
  });
});
