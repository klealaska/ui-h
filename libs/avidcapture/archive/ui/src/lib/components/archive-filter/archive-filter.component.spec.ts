import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { getAdvancedFilterStub } from '@ui-coe/avidcapture/shared/test';
import { AdvancedFilterComponent } from '@ui-coe/avidcapture/shared/ui';
import { ChipsAutocompleteComponent } from '@ui-coe/shared/ui';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';
import { MockComponent, MockPipe } from 'ng-mocks';

import { ArchiveFilterComponent } from './archive-filter.component';

describe('ArchiveFilterComponent', () => {
  let component: ArchiveFilterComponent;
  let fixture: ComponentFixture<ArchiveFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ArchiveFilterComponent,
        MockComponent(ChipsAutocompleteComponent),
        MockComponent(AdvancedFilterComponent),
        MockPipe(TranslatePipe),
      ],
      imports: [ButtonComponent, MatChipsModule, MatIconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveFilterComponent);
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
});
