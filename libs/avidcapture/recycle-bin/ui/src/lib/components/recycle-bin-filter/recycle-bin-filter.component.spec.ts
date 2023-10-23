import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { getAdvancedFilterStub } from '@ui-coe/avidcapture/shared/test';
import { AdvancedFilterComponent, ChipsAutocompleteComponent } from '@ui-coe/avidcapture/shared/ui';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';
import { MockComponent, MockPipe } from 'ng-mocks';

import { RecycleBinFilterComponent } from './recycle-bin-filter.component';

describe('RecycleBinFilterComponent', () => {
  let component: RecycleBinFilterComponent;
  let fixture: ComponentFixture<RecycleBinFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RecycleBinFilterComponent,
        MockComponent(ChipsAutocompleteComponent),
        MockComponent(AdvancedFilterComponent),
        MockPipe(TranslatePipe),
      ],
      imports: [MatChipsModule, MatIconModule, ButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecycleBinFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filtersChanged', () => {
    const formValuesStub = getAdvancedFilterStub();
    beforeEach(() => {
      jest.spyOn(component.advanceSearchApplied, 'emit');
      component.showFilters = true;
      component.filtersChanged(formValuesStub);
    });

    it('should emit formValues for advanceSearchApplied', () =>
      expect(component.advanceSearchApplied.emit).toHaveBeenNthCalledWith(1, formValuesStub));

    it('should showFilters be false', () => {
      expect(component.showFilters).toBeFalsy();
    });
  });
});
