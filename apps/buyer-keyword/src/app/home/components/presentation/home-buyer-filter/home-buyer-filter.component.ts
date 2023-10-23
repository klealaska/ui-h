import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';

import { Buyer } from '../../../../shared/interfaces';

@Component({
  selector: 'bkws-home-buyer-filter',
  templateUrl: './home-buyer-filter.component.html',
  styleUrls: ['./home-buyer-filter.component.scss'],
})
export class HomeBuyerFilterComponent implements OnInit, OnDestroy {
  @Input() filteredBuyers: Buyer[] = [];
  @Output() searchTextChanged = new EventEmitter<string>();
  @Output() buyerSelected = new EventEmitter<string>();
  @Output() clearFilterBuyers = new EventEmitter<void>();

  filtersForm: UntypedFormGroup;
  private subscriptions: Subscription[] = [];

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.filtersForm = this.fb.group({ searchBuyer: [''] });

    this.listenToFormChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  clearFilter(): void {
    this.filtersForm.get('searchBuyer').setValue('', { emitEvent: false });
    this.clearFilterBuyers.emit();
  }

  private listenToFormChanges(): void {
    this.subscriptions.push(
      this.filtersForm
        .get('searchBuyer')
        .valueChanges.pipe(
          filter((val: string) => val.length >= 1),
          debounceTime(500),
          tap((value: string) => this.searchTextChanged.emit(value))
        )
        .subscribe()
    );
  }
}
