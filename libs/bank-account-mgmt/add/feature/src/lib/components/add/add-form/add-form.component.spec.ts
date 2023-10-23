import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFormComponent } from './add-form.component';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownComponent, InputComponent, SharedUiV2Module } from '@ui-coe/shared/ui-v2';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { IBankAccountAddContent } from '@ui-coe/bank-account-mgmt/shared/types';
import { bankAccountAddContentMock } from '@ui-coe/bank-account-mgmt/shared/test';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ConfigService } from '@ui-coe/shared/util/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Component({
  selector: 'ax-mock-bam-add-parent',
  template: `<ax-add-form
    #addForm
    [content]="content"
    [addAccountFormGroup]="addAccountFormGroup"
  ></ax-add-form>`,
})
export class BamAddMockParentComponent {
  @ViewChild('addForm') public bamAdd: AddFormComponent;

  public content: IBankAccountAddContent = bankAccountAddContentMock;
  public addAccountFormGroup: FormGroup = new FormGroup({
    nickName: new FormControl(''),
    routingNumber: new FormControl(''),
    accountNumber: new FormControl(''),
    accountType: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    businessName: new FormControl(''),
  });
}

describe('AddFormComponent', () => {
  let component: BamAddMockParentComponent;
  let fixture: ComponentFixture<BamAddMockParentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BamAddMockParentComponent],
      imports: [
        TranslateModule.forRoot(),
        InputComponent,
        DropdownComponent,
        SharedUiV2Module,
        NoopAnimationsModule,
        AddFormComponent,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'mockURL'),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(BamAddMockParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the nickname label and input', () => {
    const nicknameElement: DebugElement = fixture.debugElement.query(By.css('#nickname'));
    const nicknameLabelElement: DebugElement = nicknameElement.query(By.css('mat-label'));
    const nicknameInputElement: DebugElement = nicknameElement.query(By.css('input'));
    expect(nicknameLabelElement.nativeElement.textContent).toBe(
      bankAccountAddContentMock.nicknameLabel
    );
    expect(nicknameInputElement.nativeElement.getAttribute('placeholder')).toBe(
      bankAccountAddContentMock.nicknamePlaceholder
    );
  });

  it('should create the routing number label and input', () => {
    const routingNumberElement: DebugElement = fixture.debugElement.query(By.css('#routingNumber'));
    const routingNumberLabelElement: DebugElement = routingNumberElement.query(By.css('mat-label'));
    const routingNumberInputElement: DebugElement = routingNumberElement.query(By.css('input'));
    expect(routingNumberLabelElement.nativeElement.textContent).toBe(
      bankAccountAddContentMock.routingNumberLabel
    );
    expect(routingNumberInputElement.nativeElement.getAttribute('placeholder')).toBe(
      bankAccountAddContentMock.routingNumberPlaceholder
    );
  });

  it('should create the account number label and input', () => {
    const accountNumberElement: DebugElement = fixture.debugElement.query(By.css('#accountNumber'));
    const accountNumberLabelElement: DebugElement = accountNumberElement.query(By.css('mat-label'));
    const accountNumberInputElement: DebugElement = accountNumberElement.query(By.css('input'));
    expect(accountNumberLabelElement.nativeElement.textContent).toBe(
      bankAccountAddContentMock.accountNumberLabel
    );
    expect(accountNumberInputElement.nativeElement.getAttribute('placeholder')).toBe(
      bankAccountAddContentMock.accountNumberPlaceholder
    );
  });

  it('should create the account type label, placeholder and option', () => {
    const accountTypeElement: DebugElement = fixture.debugElement.query(By.css('#accountType'));
    const accountTypeLabelElement: DebugElement = accountTypeElement.query(By.css('mat-label'));
    const accountTypeSelectElement: DebugElement = accountTypeElement.query(By.css('.ax-select'));
    expect(accountTypeLabelElement.nativeElement.textContent).toBe(
      bankAccountAddContentMock.accountTypeLabel
    );
    expect(accountTypeSelectElement.nativeElement.textContent).toBe(
      bankAccountAddContentMock.accountTypePlaceholder
    );
    accountTypeSelectElement.nativeElement.click();

    fixture.detectChanges();
    const options = fixture.debugElement.queryAll(By.css('.mat-mdc-option'));
    expect(options[0].nativeElement.textContent).toBe('Business Checking');
    expect(options[1].nativeElement.textContent).toBe('Business Savings');
    expect(options[2].nativeElement.textContent).toBe('Consumer Checking');
    expect(options[3].nativeElement.textContent).toBe('Consumer Savings');
  });
});
