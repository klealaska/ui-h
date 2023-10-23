import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AdvancedFilter,
  AdvancedFilters,
  AdvancedFiltersKeys,
  Buyer,
} from '@ui-coe/avidcapture/shared/types';
import { transformDates } from '@ui-coe/shared/util/interfaces';

@Component({
  selector: 'xdc-pending-filter',
  templateUrl: './pending-filter.component.html',
  styleUrls: ['./pending-filter.component.scss'],
})
export class PendingFilterComponent {
  @Input() customerData: Buyer[] = [];
  @Input() filteredBuyers: Buyer[] = [];
  @Input() advancedFilters: AdvancedFilter;
  @Input() appliedFilters: AdvancedFilter;
  @Input() filteredBuyersCore: Buyer[] = [];
  @Input() canUpload = false;
  @Input() canRefreshPage = true;
  @Input() canViewAllBuyers = false;
  @Input() canUseAdvancedFilter = false;

  @Output() customerChangedEvent = new EventEmitter<Buyer[]>();
  @Output() customerTextChangedEvent = new EventEmitter<string>();
  @Output() advanceSearchApplied = new EventEmitter<AdvancedFilter>();
  @Output() filterChipRemoved = new EventEmitter<string>();
  @Output() refreshPage = new EventEmitter<Buyer[]>();
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

  refreshClicked(): void {
    this.refreshPage.emit(this.filteredBuyers);
  }
}
