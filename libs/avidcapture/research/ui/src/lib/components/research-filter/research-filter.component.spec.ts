import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { getAdvancedFilterStub } from '@ui-coe/avidcapture/shared/test';
import { AdvancedFiltersKeys, EscalationCategoryTypes } from '@ui-coe/avidcapture/shared/types';
import { AdvancedFilterComponent } from '@ui-coe/avidcapture/shared/ui';
import { ChipsAutocompleteComponent } from '@ui-coe/shared/ui';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';
import { MockComponent, MockPipe } from 'ng-mocks';

import { ResearchFilterComponent } from './research-filter.component';

describe('ResearchFilterComponent', () => {
  let component: ResearchFilterComponent;
  let fixture: ComponentFixture<ResearchFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ResearchFilterComponent,
        MockComponent(ChipsAutocompleteComponent),
        MockComponent(AdvancedFilterComponent),
        MockPipe(TranslatePipe),
      ],
      imports: [ButtonComponent, MatChipsModule, MatIconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges()', () => {
    describe('when appliedFilters is NULL', () => {
      beforeEach(() => {
        component.ngOnChanges({
          appliedFilters: new SimpleChange(null, null, true),
        });
      });

      it('should not add any counts to filterCount', () => expect(component.filterCount).toBe(0));
    });

    describe('when appliedFilters has escalation filters but have a - in them', () => {
      const escalationFilters = [
        `-${EscalationCategoryTypes.RecycleBin}`,
        `-${EscalationCategoryTypes.None}`,
        `-${EscalationCategoryTypes.IndexingOpsQc}`,
        `-${EscalationCategoryTypes.ImageIssue}`,
      ];

      beforeEach(() => {
        component.ngOnChanges({
          appliedFilters: new SimpleChange(
            null,
            { [AdvancedFiltersKeys.EscalationCategoryIssue]: escalationFilters },
            true
          ),
        });
      });

      it('should not add any counts to filterCount', () => expect(component.filterCount).toBe(0));
    });

    describe('when appliedFilters has escalation filters has some with - and some with no -', () => {
      const escalationFilters = [
        `-${EscalationCategoryTypes.RecycleBin}`,
        `-${EscalationCategoryTypes.None}`,
        `-${EscalationCategoryTypes.IndexingOpsQc}`,
        `${EscalationCategoryTypes.ImageIssue}`,
      ];

      beforeEach(() => {
        component.ngOnChanges({
          appliedFilters: new SimpleChange(
            null,
            { [AdvancedFiltersKeys.EscalationCategoryIssue]: escalationFilters },
            true
          ),
        });
      });

      it('should add to the filterCount', () => expect(component.filterCount).toBe(1));
    });

    describe('when appliedFilters has date received', () => {
      const dateFilters = ['02/02/2021', '03/02/2021'];

      beforeEach(() => {
        component.ngOnChanges({
          appliedFilters: new SimpleChange(
            null,
            { [AdvancedFiltersKeys.DateReceived]: dateFilters },
            true
          ),
        });
      });

      it('should only add 1 to the filterCount', () => expect(component.filterCount).toBe(1));
    });

    describe('when appliedFilters has other filters besides Escalations and Dates', () => {
      beforeEach(() => {
        component.ngOnChanges({
          appliedFilters: new SimpleChange(
            null,
            { [AdvancedFiltersKeys.Supplier]: ['mock'], [AdvancedFiltersKeys.FileName]: ['yeah'] },
            true
          ),
        });
      });

      it('should add 1 per filter for the filterCount', () =>
        expect(component.filterCount).toBe(2));
    });
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

  describe('getEscalations()', () => {
    let escalations: string[];
    beforeEach(() => {
      component.appliedFilters = {
        buyerId: [],
        escalationCategoryIssue: ['-none', EscalationCategoryTypes.IndexingOpsQc],
      };
      escalations = component.getEscalations(AdvancedFiltersKeys.EscalationCategoryIssue);
    });

    it('should return an array of escalations without hyphens', () =>
      expect(escalations).toEqual([EscalationCategoryTypes.IndexingOpsQc]));
  });
});
