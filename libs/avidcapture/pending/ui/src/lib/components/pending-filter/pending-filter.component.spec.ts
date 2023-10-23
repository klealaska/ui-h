import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { getAdvancedFilterStub } from '@ui-coe/avidcapture/shared/test';
import { AdvancedFilterComponent } from '@ui-coe/avidcapture/shared/ui';
import { ChipsAutocompleteComponent } from '@ui-coe/shared/ui';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';
import { MockComponent, MockPipe } from 'ng-mocks';

import { PendingFilterComponent } from './pending-filter.component';

describe('PendingFilterComponent', () => {
  let component: PendingFilterComponent;
  let fixture: ComponentFixture<PendingFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PendingFilterComponent,
        MockComponent(ChipsAutocompleteComponent),
        MockComponent(AdvancedFilterComponent),
        MockPipe(TranslatePipe),
      ],
      imports: [MatButtonModule, MatChipsModule, MatIconModule, ButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filtersChanged()', () => {
    const formValuesStub = getAdvancedFilterStub();
    beforeEach(() => {
      jest.spyOn(component.advanceSearchApplied, 'emit');
      component.showFilters = true;
      component.filtersChanged(formValuesStub);
    });

    it('should set showFilters flag to false', () => expect(component.showFilters).toBe(false));

    it('should emit formValues for advanceSearchApplied', () =>
      expect(component.advanceSearchApplied.emit).toHaveBeenNthCalledWith(1, formValuesStub));
  });

  describe('refreshClicked()', () => {
    beforeEach(() => {
      jest.spyOn(component.refreshPage, 'emit');
      component.filteredBuyers = [{ id: '1', name: 'test' }];
      component.refreshClicked();
    });

    it('should emit buyers for refreshPage', () =>
      expect(component.refreshPage.emit).toHaveBeenNthCalledWith(1, component.filteredBuyers));
  });
});
