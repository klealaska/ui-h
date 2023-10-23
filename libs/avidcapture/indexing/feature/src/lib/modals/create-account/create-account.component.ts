import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { ValidatorService } from '@ui-coe/avidcapture/core/util';
import { ConfirmNewAccount } from '@ui-coe/avidcapture/indexing/data-access';
import { Autocomplete } from '@ui-coe/shared/ui';
import { Observable } from 'rxjs';
import { map, startWith, take, tap } from 'rxjs/operators';

@Component({
  selector: 'xdc-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent implements OnInit {
  accountNumberLimit = 50;
  paymentTermsOptions: Autocomplete[];
  allowSpecialCharacters: boolean;
  errorMessageCustomerNumber: string;
  createAccountForm: UntypedFormGroup;
  errorMessage: string;
  filteredOptions$: Observable<Autocomplete[]>;
  currentCharCount$: Observable<number>;

  constructor(
    private dialogRef: MatDialogRef<CreateAccountComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      paymentTermsChoices: Autocomplete[];
      customerAccountNumber: string;
      allowSpecialCharacters: boolean;
    },
    private fb: UntypedFormBuilder,
    private store: Store,
    private validatorsService: ValidatorService
  ) {}

  ngOnInit(): void {
    this.paymentTermsOptions = this.data.paymentTermsChoices;
    this.allowSpecialCharacters = this.data.allowSpecialCharacters;
    this.errorMessageCustomerNumber = this.allowSpecialCharacters
      ? 'Special characters allowed -/_()-:,'
      : 'Alpha numeric values only';

    this.createAccountForm = this.fb.group({
      customerAccountNumber: [
        this.data.customerAccountNumber,
        [
          Validators.required,
          this.allowSpecialCharacters
            ? this.validatorsService.specialCharactersValidator
            : this.validatorsService.alphaNumericValidator,
        ],
      ],
      paymentTerms: ['', Validators.required],
    });

    this.createAccountForm
      .get('paymentTerms')
      .addValidators(this.validatorsService.autocompleteObjectValidator(this.paymentTermsOptions));

    this.filteredOptions$ = this.createAccountForm.get('paymentTerms').valueChanges.pipe(
      startWith(''),
      map((value: string) => this.getFilteredOptions(value))
    );

    this.currentCharCount$ = this.createAccountForm.get('customerAccountNumber').valueChanges.pipe(
      startWith(this.data.customerAccountNumber),
      map((value: string) => this.accountNumberLimit - value.length)
    );
  }

  close(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.store
      .dispatch(new ConfirmNewAccount(this.createAccountForm.get('customerAccountNumber').value))
      .pipe(
        take(1),
        tap(state => {
          if (state.indexingUtility.customerAccountExists) {
            this.errorMessage = 'This account already exists.';
          } else {
            this.dialogRef.close(this.createAccountForm.value);
          }
        })
      )
      .subscribe();
  }

  private getFilteredOptions(value: string): Autocomplete[] {
    if (value) {
      return this.paymentTermsOptions.filter((option: Autocomplete) =>
        option.name.toLowerCase().includes(value.toLowerCase())
      );
    }

    return this.paymentTermsOptions;
  }
}
