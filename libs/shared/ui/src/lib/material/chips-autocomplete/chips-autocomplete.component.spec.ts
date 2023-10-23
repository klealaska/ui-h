import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Autocomplete } from '../../shared/models';
import { ChipsAutocompleteComponent } from './chips-autocomplete.component';

const dataToPass: Autocomplete[] = [
  {
    id: '1',
    name: 'ABC Corp',
  },
  {
    id: '2',
    name: 'Telegram',
  },
  {
    id: '3',
    name: 'Bulls Eye',
  },
];

const correctFilteredData: Autocomplete[] = [
  {
    id: '1',
    name: 'ABC Corp',
  },
  {
    id: '2',
    name: 'Telegram',
  },
];

const searchFilterStub: Autocomplete = { id: '3', name: 'Bulls Eye' };

describe('ChipsAutocompleteComponent', () => {
  let component: ChipsAutocompleteComponent;
  let fixture: ComponentFixture<ChipsAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChipsAutocompleteComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsAutocompleteComponent);
    component = fixture.componentInstance;
    component.data = dataToPass;
    component.selectedItems = dataToPass;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add items to selectedItems if data exists OnInit', () => {
    expect(component.selectedItems).toEqual(dataToPass);
  });

  describe('ngOnChanges()', () => {
    describe('when having a currentValue', () => {
      beforeEach(() => {
        component.ngOnChanges({
          data: new SimpleChange('', [searchFilterStub], true),
        });
        fixture.detectChanges();
      });

      it('should set data to an array of a searchFilterStub', () =>
        expect(component.data).toEqual([searchFilterStub]));
    });

    describe('when not having a currentValue', () => {
      beforeEach(() => {
        component.ngOnChanges({
          svgData: new SimpleChange(null, null, false),
        });
        fixture.detectChanges();
      });

      it('should not set data to an array of a searchFilterStub', () =>
        expect(component.data).not.toEqual([searchFilterStub]));
    });
  });

  describe('remove()', () => {
    beforeEach(() => {
      component.chosenItems = [];
    });

    describe('when selectedItems has only 1 object', () => {
      beforeEach(() => {
        component.remove(searchFilterStub);
      });

      it('should remove item from array', () => expect(component.chosenItems).toEqual([]));
    });

    describe('when selectedItems has more than 1 object', () => {
      beforeEach(() => {
        component.chosenItems = dataToPass;
        component.remove(searchFilterStub);
      });

      it('should remove item from array', () => {
        expect(component.chosenItems).toEqual(correctFilteredData);
      });
    });
  });

  describe('selected()', () => {
    beforeEach(() => {
      component.chosenItems = [];
    });

    describe('when multiselect is false', () => {
      beforeEach(() => {
        jest.spyOn(component.optionSelected, 'emit').mockImplementation();
        component.selected(searchFilterStub);
      });

      it('should emit searchFilterStub for filterSelect event', () =>
        expect(component.optionSelected.emit).toHaveBeenCalledWith([searchFilterStub]));

      it('should add items to array', () =>
        expect(component.chosenItems).toEqual([searchFilterStub]));
    });

    describe('when multiselect is true', () => {
      beforeEach(() => {
        jest.spyOn(component.optionSelected, 'emit').mockImplementation();
        component.multiple = true;
        component.selected(searchFilterStub);
      });

      afterEach(() => {
        component.multiple = false;
      });

      it('should emit searchFilterStub for filterSelect event', () =>
        expect(component.optionSelected.emit).toHaveBeenCalledWith([searchFilterStub]));

      it('should add items to array', () => {
        expect(component.chosenItems).toEqual([searchFilterStub]);
      });

      describe('max selections', () => {
        it('should not add to array when max selections reached', () => {
          component.maxSelections = 1;
          component.selected(searchFilterStub);
          expect(component.chosenItems.length).toBe(1);
        });

        it('should allow unlimited selections when max = 0', () => {
          component.maxSelections = 0;
          component.selected(searchFilterStub);
          expect(component.chosenItems.length).toBe(2);
        });
      });
    });
  });
});
