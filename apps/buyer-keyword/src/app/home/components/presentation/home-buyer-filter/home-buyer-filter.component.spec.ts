import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { formGroupInstanceStub } from '../../../../../testing/test-stubs';
import { HomeBuyerFilterComponent } from './home-buyer-filter.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

describe('HomeBuyerFilterComponent', () => {
  let component: HomeBuyerFilterComponent;
  let fixture: ComponentFixture<HomeBuyerFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeBuyerFilterComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeBuyerFilterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clearFilter()', () => {
    describe('when clearing out filter', () => {
      beforeEach(() => {
        jest.spyOn(component.clearFilterBuyers, 'emit').mockImplementation();

        component.filtersForm = formGroupInstanceStub;
        fixture.detectChanges();

        component.clearFilter();
      });

      it('should set searchBuyer value to empty string', () =>
        expect(component.filtersForm.get('searchBuyer').value).toBe(''));

      it('should emit for clearFilterBuyers event', () =>
        expect(component.clearFilterBuyers.emit).toHaveBeenCalledTimes(1));
    });
  });

  describe('private listenToFormChanges()', () => {
    describe('when searchText change value', () => {
      beforeEach(() => {
        jest.spyOn(component.searchTextChanged, 'emit').mockImplementation();

        component.filtersForm = formGroupInstanceStub;
        fixture.detectChanges();
      });

      it('should emit for searchTextChanged event', fakeAsync(() => {
        component.filtersForm.get('searchBuyer').setValue('mockTest');
        tick(500);
        expect(component.searchTextChanged.emit).toHaveBeenNthCalledWith(1, 'mockTest');
      }));
    });
  });
});
