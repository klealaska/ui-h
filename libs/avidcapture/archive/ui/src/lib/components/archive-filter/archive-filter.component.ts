import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AdvancedFilter,
  AdvancedFilters,
  AdvancedFiltersKeys,
  Buyer,
} from '@ui-coe/avidcapture/shared/types';
import { transformDates } from '@ui-coe/shared/util/interfaces';

@Component({
  selector: 'xdc-archive-filter',
  templateUrl: './archive-filter.component.html',
  styleUrls: ['./archive-filter.component.scss'],
})
export class ArchiveFilterComponent {
  @Input() buyers: Buyer[] = [];
  @Input() filteredBuyers: Buyer[] = [];
  @Input() advancedFilters: AdvancedFilter;
  @Input() appliedFilters: AdvancedFilter;
  @Input() filteredBuyersCore: Buyer[] = [];
  @Input() canRefreshPage = true;
  @Input() canViewAllBuyers = false;
  @Input() canUseAdvancedFilter = false;

  @Output() buyerChangedEvent = new EventEmitter<Buyer[]>();
  @Output() buyerTextChangedEvent = new EventEmitter<string>();
  @Output() advanceSearchApplied = new EventEmitter<AdvancedFilter>();
  @Output() filterChipRemoved = new EventEmitter<string>();
  @Output() refreshPage = new EventEmitter<void>();
  @Output() buyerAddedEvent = new EventEmitter<Buyer>();
  @Output() buyerRemovedEvent = new EventEmitter<Buyer>();

  showFilters = false;
  advancedFiltersEnum = AdvancedFilters; // for template
  advancedFiltersKeysEnum = AdvancedFiltersKeys; // for template

  transformDates = transformDates;

  filtersChanged(formValues: AdvancedFilter): void {
    this.showFilters = false;
    this.advanceSearchApplied.emit(formValues);
  }
}
