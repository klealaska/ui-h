import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Autocomplete } from '../../shared/models/ax-autocomplete';
import { AutocompleteComponent } from './autocomplete.component';

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

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutocompleteComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    component.data = dataToPass;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getFilteredOptions()', () => {
    beforeEach(() => {
      component.formCtrl.setValue('t');
    });

    it('should set filteredOptions to dataToPass', () => {
      component.filteredOptions.subscribe(value => expect(value).toEqual(dataToPass));
    });
  });
});
