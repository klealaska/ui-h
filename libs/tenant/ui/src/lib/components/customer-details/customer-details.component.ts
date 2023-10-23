import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { SubscriptionManagerService } from '@ui-coe/shared/util/services';
import { FormFieldError } from '@ui-coe/shared/types';

@Component({
  selector: 'ui-coe-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDetailsComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() siteNameLabel: string;
  @Input() cmpLabel: string;
  @Input() cmpIdHelperText: string;
  @Input() submitButtonText: string;
  @Input() submitButtonId: string;
  @Input() customerNameLabel: string;
  @Input() accountIdLabel: string;
  @Input() siteIdLabel: string;
  @Input() enableSubmitButton: boolean = true;

  // form field values
  @Input() siteNameValue: string = '';
  @Input() cmpIdValue: string = 'avidxchange123456789'; // TODO remove hard code value once we have CMPID lookup functionality
  @Input() customerNameValue: string = '';
  @Input() accountIdValue: string = '';
  @Input() siteIdValue: string = '';

  // form config values
  @Input() siteNameValidator: AsyncValidatorFn;
  @Input() disableCmpIdField: boolean = false;

  @Output() submitButtonClick = new EventEmitter<FormGroup>();
  @Output() siteNameUpdated = new EventEmitter<string>();

  formGroup: FormGroup;
  siteNameError: FormFieldError = {
    message: 'Enter a unique site name',
    icon: 'warning',
  };
  cmpError: FormFieldError = {
    message: 'Enter 20 case-sensitive characters',
    icon: 'warning',
  };

  constructor(private subManager: SubscriptionManagerService) {}

  private readonly _subKey = this.subManager.init();

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      siteName: new FormControl(this.siteNameValue, {
        validators: Validators.required,
        asyncValidators: [this.siteNameValidator],
      }),
      cmpId: new FormControl({ value: this.cmpIdValue, disabled: this.disableCmpIdField }, [
        Validators.required,
        Validators.maxLength(20),
        Validators.minLength(20),
      ]),
      customerName: new FormControl(this.customerNameValue),
      accountId: new FormControl(this.accountIdValue),
    });
    // TODO disabling these fields for now since out of scope of ticket
    this.formGroup.get('customerName')?.disable();
    this.formGroup.get('accountId')?.disable();

    this.subManager.add(
      this._subKey,
      this.formGroup.valueChanges.pipe(debounceTime(200)),
      ({ siteName }: { siteName: string; cmpId: string }) => {
        this.siteNameUpdated.emit(siteName);
      }
    );
  }

  ngOnDestroy(): void {
    this.subManager.tearDown(this._subKey);
  }
}
