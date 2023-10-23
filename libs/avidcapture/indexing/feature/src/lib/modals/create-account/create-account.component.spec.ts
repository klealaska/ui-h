import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { ValidatorService } from '@ui-coe/avidcapture/core/util';
import { paymentTermsChoicesStub } from '@ui-coe/avidcapture/shared/test';
import { ButtonComponent, InputComponent } from '@ui-coe/shared/ui-v2';
import { MockPipe } from 'ng-mocks';
import { of } from 'rxjs';

import { CreateAccountComponent } from './create-account.component';

const dialogRefStub = {
  close: jest.fn(),
};

const dialogDataStub = {
  paymentTermsChoices: paymentTermsChoicesStub,
  allowSpecialCharacters: false,
};

const validatorServiceStub = {
  autocompleteObjectValidator: jest.fn(),
};

describe('CreateAccountComponent', () => {
  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAccountComponent, MockPipe(TranslatePipe)],
      imports: [
        ButtonComponent,
        InputComponent,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([], { developmentMode: true }),
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogDataStub,
        },
        {
          provide: ValidatorService,
          userValue: validatorServiceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    describe('When do not allow special characters', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should set Alpha numeric values only to errorMessageCustomerNumber', () => {
        expect(component.errorMessageCustomerNumber).toBe('Alpha numeric values only');
      });

      it('should set required validator', () => {
        expect(
          component.createAccountForm.get('customerAccountNumber').hasValidator(Validators.required)
        ).toBe(true);
      });
    });

    describe('when allow special characters is TRUE', () => {
      beforeEach(() => {
        dialogDataStub.allowSpecialCharacters = true;
        fixture.detectChanges();
      });

      it('should set Alpha numeric values only to errorMessageCustomerNumber', () => {
        expect(component.errorMessageCustomerNumber).toBe('Special characters allowed -/_()-:,');
      });

      it('should set required validator', () => {
        expect(
          component.createAccountForm.get('customerAccountNumber').hasValidator(Validators.required)
        ).toBe(true);
      });
    });
  });

  describe('close()', () => {
    beforeEach(() => {
      component.close();
    });

    it('should close dialog', () => expect(dialogRefStub.close).toHaveBeenCalled());
  });

  describe('confirm()', () => {
    beforeEach(() => fixture.detectChanges());

    describe('when account number does NOT exist', () => {
      const stateStub = {
        indexingUtility: {
          customerAccountExists: false,
        },
      } as any;

      beforeEach(() => {
        jest.spyOn(store, 'dispatch').mockImplementationOnce(() => of(stateStub));
        component.createAccountForm.get('customerAccountNumber').setValue('1234');
        component.createAccountForm.get('paymentTerms').setValue(paymentTermsChoicesStub[0].id);
        component.confirm();
      });

      it('should close dialog with returnValue object of selectedValue', () =>
        expect(dialogRefStub.close).toHaveBeenNthCalledWith(1, {
          paymentTerms: paymentTermsChoicesStub[0].id,
          customerAccountNumber: '1234',
        }));
    });

    describe('when account number already exist', () => {
      const stateStub = {
        indexingUtility: {
          customerAccountExists: true,
        },
      } as any;

      beforeEach(() => {
        jest.spyOn(store, 'dispatch').mockImplementationOnce(() => of(stateStub));
        component.createAccountForm.get('customerAccountNumber').setValue('1234');
        component.createAccountForm.get('paymentTerms').setValue(paymentTermsChoicesStub[0].id);
        component.confirm();
      });

      it('should set errorMessage to account already exists message', () =>
        expect(component.errorMessage).toBe('This account already exists.'));

      it('should close dialog with returnValue object of selectedValue', () =>
        expect(dialogRefStub.close).not.toHaveBeenNthCalledWith(1, {
          paymentTerms: paymentTermsChoicesStub[0].id,
          customerAccountNumber: '1234',
        }));
    });
  });

  describe('private getFilteredOptions()', () => {
    describe('when value is Customer Account Number', () => {
      beforeEach(() => {
        fixture.detectChanges();
        component.paymentTermsOptions = paymentTermsChoicesStub;
        component.createAccountForm.get('paymentTerms').setValue(paymentTermsChoicesStub[0].name);
      });

      it('should get filter data for Net 30 ', done => {
        component.filteredOptions$.subscribe(result => {
          expect(result.length).toEqual(5);
          done();
        });
      });
    });
  });
});
