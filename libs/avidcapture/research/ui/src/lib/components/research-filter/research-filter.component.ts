import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  AdvancedFilter,
  AdvancedFilters,
  AdvancedFiltersKeys,
  Buyer,
  EscalationCategoryTypes,
  ExposedFilter,
} from '@ui-coe/avidcapture/shared/types';
import { transformDates } from '@ui-coe/shared/util/interfaces';

@Component({
  selector: 'xdc-research-filter',
  templateUrl: './research-filter.component.html',
  styleUrls: ['./research-filter.component.scss'],
})
export class ResearchFilterComponent implements OnChanges {
  @Input() buyers: Buyer[] = [];
  @Input() filteredBuyers: Buyer[] = [];
  @Input() advancedFilters: AdvancedFilter;
  @Input() appliedFilters: AdvancedFilter;
  @Input() filteredBuyersCore: Buyer[] = [];
  @Input() canRefreshPage = true;
  @Input() queuesNotAllowedList: string[] = [];
  @Input() canViewAllBuyers = false;
  @Input() canUseAdvancedFilter = false;
  @Input() exposedFilters: ExposedFilter[] = [];
  @Input() canSeeExposedFilters = false;

  @Output() buyerChangedEvent = new EventEmitter<Buyer[]>();
  @Output() buyerTextChangedEvent = new EventEmitter<string>();
  @Output() advanceSearchApplied = new EventEmitter<AdvancedFilter>();
  @Output() filterChipRemoved = new EventEmitter<string>();
  @Output() escalationChipRemoved = new EventEmitter<string>();
  @Output() refreshPage = new EventEmitter<Buyer[]>();
  @Output() buyerAddedEvent = new EventEmitter<Buyer>();
  @Output() buyerRemovedEvent = new EventEmitter<Buyer>();
  @Output() exposedFilterSelected = new EventEmitter<string>();

  showFilters = false;
  filterCount = 0;
  advancedFiltersEnum = AdvancedFilters; // for template
  advancedFiltersKeysEnum = AdvancedFiltersKeys; // for template
  escalationCategoryTypes = EscalationCategoryTypes; // for template
  transformDates = transformDates;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.appliedFilters?.currentValue) {
      this.filterCount = 0;

      Object.keys(changes.appliedFilters.currentValue).forEach(key => {
        if (key === AdvancedFiltersKeys.EscalationCategoryIssue) {
          const escalations: string[] = changes.appliedFilters.currentValue[key].filter(
            escalation => escalation.search('-')
          );

          this.filterCount = this.filterCount + escalations.length;
        } else if (key === AdvancedFiltersKeys.DateReceived) {
          // accounting for date having start and end date strings
          this.filterCount = this.filterCount + 1;
        } else {
          const filters: string[] = changes.appliedFilters.currentValue[key];

          this.filterCount = this.filterCount + filters.length;
        }
      });
    }
  }

  filtersChanged(formValues: AdvancedFilter): void {
    this.showFilters = false;
    this.advanceSearchApplied.emit(formValues);
  }

  refreshClicked(): void {
    this.refreshPage.emit(this.filteredBuyers);
  }

  getEscalations(filterKey: string): string[] {
    const escalations: string[] = this.appliedFilters[filterKey];
    return escalations.filter(escalation => escalation.search('-'));
  }
}
