import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { PropertyType } from '../../../../core/enums';
import { of } from 'rxjs';
import { propertyStub, storeStub } from '../../../../../test/test-stubs';

import { ChoicePropertyComponent } from './choice-property.component';

describe('ChoicePropertyComponent', () => {
  let component: ChoicePropertyComponent;
  let fixture: ComponentFixture<ChoicePropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChoicePropertyComponent],
      imports: [NgxsModule.forRoot([])],
      // providers: [
      //   {
      //     provide: Store,
      //     useValue: storeStub,
      //   },
      // ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoicePropertyComponent);
    component = fixture.componentInstance;
    component.property = { ...propertyStub, Type: PropertyType.Choice };
    // jest.spyOn(storeStub, 'select').mockReturnValue(of({}));
    jest.spyOn(storeStub, 'select').mockImplementation();

    component.value = '1, 2, 3';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    describe('when property value is multiple', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });
      it('should set multipleSelectedValues value', () =>
        expect(component.multiSelectedValues).toEqual(['1', '2', '3']));
    });

    describe('when component.value is null', () => {
      it('should not set multipleSelectedValues value', () => {
        component.value = null;
        component.ngOnInit();
        expect(component.multiSelectedValues).toEqual([]);
      });
    });
  });

  describe('ngOnChanges()', () => {
    it('should null propertyFormControl', () => {
      component.propertyFormControl = null;
      component.ngOnChanges({});
      expect(component.propertyFormControl).toBe(null);
    });
    describe('when error exist', () => {
      beforeEach(() => {
        component.ngOnChanges({ error: { currentValue: 'error' } as any });
      });

      it('should map error message to propertyFormControl', () => {
        expect(component.propertyFormControl.hasError('error')).toBe(true);
      });
    });

    describe('when error doesnt exist', () => {
      beforeEach(() => {
        component.ngOnChanges({});
      });

      it('should not map error message to propertyFormControl', () => {
        expect(component.propertyFormControl.hasError('error')).toBe(false);
      });
    });
  });

  describe('add()', () => {
    describe('when event contains value', () => {
      const event = { value: 'text', chipInput: { clear: jest.fn() } } as any;
      beforeEach(() => {
        component.multiSelectedValues = [];
        component.add(event);
      });

      it('should push select value to multipleSelectedValues', () =>
        expect(component.multiSelectedValues.length).toBe(1));

      it('should clear chipInput', () => expect(event.chipInput.clear).toHaveBeenCalled());
    });

    describe('when event does not contain value', () => {
      const event = { value: '' } as any;
      beforeEach(() => {
        component.multiSelectedValues = [];
        component.add(event);
      });

      it('should not push select value to multipleSelectedValues', () =>
        expect(component.multiSelectedValues.length).toBe(0));
    });
  });

  describe('remove()', () => {
    describe('if value exists on multiSelectedValues', () => {
      beforeEach(() => {
        const value = 'test value';
        component.multiSelectedValues = [value];
        component.remove(value);
      });

      it('should remove value from multiSelectedValues array', () =>
        expect(component.multiSelectedValues.length).toBe(0));
    });

    describe('if value doesn not exist on multiSelectedValues', () => {
      beforeEach(() => {
        const value = 'test value';
        component.multiSelectedValues = [value];
        component.remove('value');
      });

      it('should not remove objects from multiSelectedValues array', () =>
        expect(component.multiSelectedValues.length).toBe(1));
    });
  });

  describe('selected()', () => {
    const event = { option: { viewValue: 'test' } } as any;
    beforeEach(() => {
      component.multiSelectedValues = [];
      component.selected(event);
    });

    it('should map selected value to multiSelectedValues array', () =>
      expect(component.multiSelectedValues[0]).toBe(event.option.value));
  });

  describe('checkBoxChanged()', () => {
    describe('when checked and multiSelectedValues does not include value', () => {
      beforeEach(() => {
        component.multiSelectedValues = [];
        jest.spyOn(component.choiceChanged, 'emit');
        component.checkBoxChanged(true, 'value');
      });

      it('should add new value to multiSelectedValues array', () =>
        expect(component.multiSelectedValues).toEqual(['value']));

      it('should emit multiSelected values', () => {
        expect(component.choiceChanged.emit).toHaveBeenCalledWith(
          component.multiSelectedValues.join(',')
        );
      });
    });

    describe('when unchecked and multiSelectedValues includes value', () => {
      beforeEach(() => {
        component.multiSelectedValues = ['value'];
        component.checkBoxChanged(false, 'value');
      });

      it('should remove value from multiSelectedValues array', () =>
        expect(component.multiSelectedValues).toEqual([]));
    });
  });
});
