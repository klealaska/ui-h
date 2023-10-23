import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, NgForm } from '@angular/forms';
import { User } from '../../shared/models';

@Component({
  selector: 'ax-add-user',
  templateUrl: './add-admin-user.component.html',
  styleUrls: ['./add-admin-user.component.scss'],
})
export class AddAdminUserComponent implements OnChanges {
  @Input() showUserForm: boolean;
  @Input() user = new User();
  @Input() roles: string[] = [];
  @Output() closeUserForm = new EventEmitter<null>();
  @Output() userFormSubmitted = new EventEmitter<User>();
  @ViewChild('form') form: NgForm;

  userForm: UntypedFormGroup;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.user) {
      this.userForm = new UntypedFormGroup({
        firstName: new UntypedFormControl(this.user.firstName),
        lastName: new UntypedFormControl(this.user.lastName),
        email: new UntypedFormControl(this.user.email),
        role: new UntypedFormControl(this.user.role),
      });
    }
  }

  clearField(value: string): void {
    this.userForm.get(value).setValue('');
  }

  onCloseUserForm(): void {
    this.form.resetForm();
    this.closeUserForm.emit();
  }

  submitUserForm(): void {
    if (this.userForm.valid) {
      const user = this.userForm.getRawValue();
      this.userFormSubmitted.emit(user);
      this.form.resetForm();
    }
  }
}
