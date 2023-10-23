import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAdminUserComponent } from './add-admin-user.component';
import { AxSlidePanelComponent } from '../../slide-panel/slide-panel.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockComponents } from 'ng-mocks';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';

describe('AddAdminUserComponent', () => {
  let component: AddAdminUserComponent;
  let fixture: ComponentFixture<AddAdminUserComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddAdminUserComponent,
        AxSlidePanelComponent,
        MockComponents(MatFormField, MatLabel, MatError, MatIcon, MatSelect, MatButton),
      ],
      imports: [FormsModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdminUserComponent);
    component = fixture.componentInstance;

    component.userForm = formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      role: [''],
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onCloseUserForm', () => {
    beforeEach(() => {
      jest.spyOn(component.form, 'resetForm');
      jest.spyOn(component.closeUserForm, 'emit');

      component.onCloseUserForm();
    });

    it('should reset User form', () => expect(component.form.resetForm).toHaveBeenCalled());
    it('should emit closeUserForm', () => expect(component.closeUserForm.emit).toHaveBeenCalled());
  });

  describe('submitUserForm', () => {
    beforeEach(() => {
      jest.spyOn(component.userForm, 'getRawValue');
      jest.spyOn(component.userFormSubmitted, 'emit');
      jest.spyOn(component.form, 'resetForm');

      component.submitUserForm();
    });
    describe('if userForm is valid', () => {
      let user;

      beforeEach(() => {
        component.userForm.get('firstName').setValue('User First Name');
        component.userForm.get('lastName').setValue('User Last Name');
        component.userForm.get('email').setValue('user@mail.com');

        user = component.userForm.getRawValue();

        component.submitUserForm();
      });

      it('should get raw data from userForm', () =>
        expect(component.userForm.getRawValue).toHaveBeenCalled());

      it('should emit userFormSubmitted', () =>
        expect(component.userFormSubmitted.emit).toHaveBeenNthCalledWith(1, user));

      it('should reset User form', () => expect(component.form.resetForm).toHaveBeenCalled());
    });

    describe('if userForm is NOT valid', () => {
      beforeEach(() => {
        component.submitUserForm();
      });

      it('should NOT emit userFormSubmitted', () =>
        expect(component.userFormSubmitted.emit).not.toHaveBeenCalled());

      it('should NOT reset User form', () =>
        expect(component.form.resetForm).not.toHaveBeenCalled());
    });
  });
});
