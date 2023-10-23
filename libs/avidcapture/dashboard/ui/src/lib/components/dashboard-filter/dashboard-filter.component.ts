import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Buyer, TimeIntervals } from '@ui-coe/avidcapture/shared/types';
import { DropdownOptions } from '@ui-coe/shared/types';
import { DateTime } from 'luxon';

@Component({
  selector: 'xdc-dashboard-filter',
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.scss'],
})
export class DashboardFilterComponent implements OnInit {
  @Input() orgNames: Buyer[] = [];
  @Input() averageTimeToIndex = 0;
  @Input() averageTimeToSubmission = 0;
  @Input() submissionTimeInterval: TimeIntervals = TimeIntervals.Minutes;
  @Input() indexTimeInterval: TimeIntervals = TimeIntervals.Seconds;
  @Input() canViewAllBuyers = false;
  @Output() orgIdSelectedEvent = new EventEmitter<string>();
  @Output() newDatesSelected = new EventEmitter<string[]>();
  @Output() submissionTimeIntervalChanged = new EventEmitter<string>();

  dateRangeForm: UntypedFormGroup;
  today: Date;
  minDate: Date;
  timeIntervals = TimeIntervals; // for template
  dropdownOptions: DropdownOptions[] = [];

  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.today = DateTime.now().toJSDate();
    this.minDate = DateTime.local().minus({ days: 90 }).toJSDate();
    this.dateRangeForm = this.formBuilder.group({
      startDate: [DateTime.local().minus({ days: 30 }).toJSDate()],
      endDate: [this.today],
    });

    this.dropdownOptions = this.orgNames.map(buyer => ({
      text: buyer.name,
      value: buyer.id,
    }));
  }

  dateChanged(): void {
    if (this.dateRangeForm.get('endDate').value != null) {
      const datesSelected: string[] = [
        this.dateRangeForm.get('startDate').value,
        this.dateRangeForm.get('endDate').value,
      ];

      this.newDatesSelected.emit(datesSelected);
    }
  }

  submissionTimeIntervalChange(value: TimeIntervals): void {
    this.submissionTimeInterval = value;
    this.submissionTimeIntervalChanged.emit(value);
  }

  getAvgTimeToIndexIph(): number {
    const factor = Math.pow(10, 2);
    return Math.round((3600 / this.averageTimeToIndex) * factor) / factor;
  }
}
