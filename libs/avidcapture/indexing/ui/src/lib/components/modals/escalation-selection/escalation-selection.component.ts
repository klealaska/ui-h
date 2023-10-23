import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { DropdownOptions } from '@ui-coe/shared/types';

@Component({
  selector: 'xdc-escalation-selection',
  templateUrl: './escalation-selection.component.html',
  styleUrls: ['./escalation-selection.component.scss'],
})
export class EscalationSelectionComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSelect) matSelect: MatSelect;

  dropdownOptions: DropdownOptions[];
  selectedValue = '';
  comment = '';
  title = '';

  markAsEscalationForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<EscalationSelectionComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: { dropdownOptions: DropdownOptions[]; escalationCategory: string }
  ) {}

  ngOnInit(): void {
    this.dropdownOptions = this.data.dropdownOptions;
    this.title = this.data.escalationCategory;

    this.markAsEscalationForm = this.formBuilder.group({
      selectedValue: [
        this.dropdownOptions.length === 1 ? this.dropdownOptions[0].value : '',
        Validators.required,
      ],
      comment: [''],
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dropdownOptions.length >= 2 ? this.matSelect.toggle() : null;
    }, 100);
  }

  close(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.dialogRef.close(this.markAsEscalationForm.value);
  }
}
