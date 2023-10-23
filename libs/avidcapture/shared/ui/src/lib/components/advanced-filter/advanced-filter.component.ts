import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AdvancedFilter, Buyer, EscalationCategoryTypes } from '@ui-coe/avidcapture/shared/types';
import { DropdownOptions } from '@ui-coe/shared/types';
import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'xdc-advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.scss'],
})
export class AdvancedFilterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() buyers: Buyer[] = [];
  @Input() advancedFilters: AdvancedFilter;
  @Input() showFilters: boolean;
  @Input() showExceptionTypeFilter = false;
  @Input() showSubmittedDateFilter = false;
  @Input() minDateForFilter: Date = null;
  @Input() researchQueuesNotAllowedList: string[] = [];
  @Input() dateFieldText = 'Delivery date';
  @Input() canViewAllBuyers = false;
  @Input() isArchivePage = false;
  @Output() closeFilters = new EventEmitter<void>();
  @Output() filtersChanged = new EventEmitter<AdvancedFilter>();
  @Output() buyerFilterTextChange = new EventEmitter<string>();

  advancedFilterForm: UntypedFormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  buyerFilterList: Buyer[] = [];
  escalationCategories: DropdownOptions[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.setFormValues();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.researchQueuesNotAllowedList?.currentValue) {
      this.setEscalationCategoryFilters();
    }

    if (changes.showFilters?.currentValue) {
      this.panelOpened();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  panelOpened(): void {
    this.setFormValues();
    this.buyerFilterList = [...this.advancedFilterForm.get('buyerId').value];

    this.subscriptions.push(
      this.advancedFilterForm
        .get('buyerId')
        .valueChanges.pipe(
          debounceTime(300),
          tap((value: string) => {
            if (value?.length > 1) {
              this.buyerFilterTextChange.emit(value);
            }
          })
        )
        .subscribe()
    );
  }

  panelClosed(): void {
    this.showFilters = false;
    this.buyerFilterList.splice(0, this.buyerFilterList.length);
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.closeFilters.emit();
  }

  resetDateRange(): void {
    this.advancedFilterForm.get('startDate').reset();
    this.advancedFilterForm.get('endDate').reset();
  }

  resetSubmittedDateRange(): void {
    this.advancedFilterForm.get('submittedStartDate').reset();
    this.advancedFilterForm.get('submittedEndDate').reset();
  }

  reset(): void {
    this.advancedFilterForm.reset();
    this.buyerFilterList.splice(0, this.buyerFilterList.length);
  }

  remove(item: Buyer): void {
    const index = this.buyerFilterList.findIndex(x => x.id === item.id);

    if (index > -1) {
      this.buyerFilterList.splice(index, 1);
    }
  }

  closedUploadPicker(): void {
    const formValues = this.advancedFilterForm.value;

    if (formValues.startDate !== '' && (!formValues.endDate || formValues.endDate === '')) {
      this.advancedFilterForm.controls['endDate'].setValue(DateTime.now().toJSDate());
    }
  }

  closedSubmittedPicker(): void {
    const formValues = this.advancedFilterForm.value;

    if (
      formValues.submittedStartDate !== '' &&
      (!formValues.submittedEndDate || formValues.submittedEndDate === '')
    ) {
      this.advancedFilterForm.controls['submittedEndDate'].setValue(DateTime.now().toJSDate());
    }
  }

  submit(): void {
    const formValues = this.advancedFilterForm.value;
    const filters: AdvancedFilter = {
      buyerId: this.buyerFilterList ?? [],
    };

    if (formValues.startDate && formValues.endDate) {
      formValues.endDate = DateTime.fromJSDate(new Date(formValues.endDate))
        .set({
          hour: 23,
          minute: 59,
          second: 59,
        })
        .toJSDate();
      filters.dateReceived = [formValues.startDate, formValues.endDate];
    }

    if (formValues.submittedStartDate && formValues.submittedEndDate) {
      formValues.submittedEndDate = DateTime.fromJSDate(new Date(formValues.submittedEndDate))
        .set({
          hour: 23,
          minute: 59,
          second: 59,
        })
        .toJSDate();
      filters.dateSubmitted = [formValues.submittedStartDate, formValues.submittedEndDate];
    }

    const excludedKeys = [
      'startDate',
      'endDate',
      'submittedStartDate',
      'submittedEndDate',
      'buyerId',
      'dateReceived',
    ];

    Object.keys(formValues)
      .filter(key => !excludedKeys.some(excludedKey => key === excludedKey))
      .forEach(key => {
        if (!formValues[key]) {
          return;
        }
        filters[key] = Array.isArray(formValues[key]) ? formValues[key] : [formValues[key]];
      });

    this.filtersChanged.emit(filters);
  }

  private setFormValues(): void {
    this.advancedFilterForm = this.fb.group({
      buyerId: [this.advancedFilters?.buyerId ?? [], Validators.required],
      supplier: [this.advancedFilters?.supplier ?? ''],
      shipToName: [this.advancedFilters?.shipToName ?? ''],
      invoiceNumber: [this.advancedFilters?.invoiceNumber ?? ''],
      sourceEmail: [this.advancedFilters?.sourceEmail ?? ''],
      fileName: [this.advancedFilters?.fileName ?? ''],
      startDate: [
        this.advancedFilters?.dateReceived && this.advancedFilters.dateReceived.length > 0
          ? this.advancedFilters.dateReceived[0]
          : '',
      ],
      endDate: [
        this.advancedFilters?.dateReceived && this.advancedFilters.dateReceived.length > 0
          ? this.advancedFilters.dateReceived[1]
          : '',
      ],
      submittedStartDate: [
        this.advancedFilters?.dateSubmitted && this.advancedFilters.dateSubmitted.length > 0
          ? this.advancedFilters.dateSubmitted[0]
          : '',
      ],
      submittedEndDate: [
        this.advancedFilters?.dateSubmitted && this.advancedFilters.dateSubmitted.length > 0
          ? this.advancedFilters.dateSubmitted[1]
          : '',
      ],
      escalationCategoryIssue: [this.advancedFilters?.escalationCategoryIssue ?? []],
    });
  }

  private setEscalationCategoryFilters(): void {
    // removing the '-' to make matching easier
    const bannedFilters: string[] = this.researchQueuesNotAllowedList.map(filter =>
      filter.slice(1)
    );

    this.escalationCategories = Object.values(EscalationCategoryTypes).reduce((acc, category) => {
      const hasIndex = bannedFilters.findIndex(
        filter => filter.toLowerCase() === category.toLowerCase()
      );

      if (hasIndex === -1) {
        acc.push({ text: category, value: category });
      }
      return acc;
    }, []);
  }
}
