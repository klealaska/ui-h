import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { InputComponent, SharedUiV2Module, TableComponent } from '@ui-coe/shared/ui-v2';

import { CustomerDetailsComponent } from './customer-details.component';
import { MatInputBackgroundDirective } from './mat-input-background.directive';

describe('CustomerDetailsComponent', () => {
  let component: CustomerDetailsComponent;
  let fixture: ComponentFixture<CustomerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerDetailsComponent, MatInputBackgroundDirective],
      imports: [
        InputComponent,
        ReactiveFormsModule,
        MatCardModule,
        SharedUiV2Module,
        BrowserAnimationsModule,
        TableComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerDetailsComponent);
    component = fixture.componentInstance;
    component.siteNameValidator = jest.fn(() => of(null));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the required validator for siteName', () => {
    component.ngOnInit();
    expect(component.formGroup.get('siteName').hasValidator(Validators.required)).toBe(true);
  });

  it('should set the required validator for cmpId', () => {
    component.ngOnInit();
    expect(component.formGroup.get('cmpId').hasValidator(Validators.required)).toBe(true);
  });

  it('should emit siteNameUpdated with siteName', done => {
    const spySiteNameUpdated = jest.spyOn(component.siteNameUpdated, 'emit');
    component.ngOnInit();
    component.formGroup.get('siteName').setValue('foo');
    setTimeout(() => {
      expect(spySiteNameUpdated).toBeCalledWith('foo');
      done();
    }, 300);
  });
});
