import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import {
  DocumentLabelKeys,
  IndexedData,
  IndexedLabel,
  RejectToSenderTemplate,
  emailTemplateReplace,
} from '@ui-coe/avidcapture/shared/types';
import { DateTime } from 'luxon';

interface ReturnToSenderForm {
  toEmailAddress: FormControl<string>;
  templateId: FormControl<string>;
  htmlBody: FormControl<string>;
}

@Component({
  selector: 'xdc-reject-to-sender',
  templateUrl: './reject-to-sender.component.html',
  styleUrls: ['./reject-to-sender.component.scss'],
})
export class RejectToSenderComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSelect) matSelect: MatSelect;

  templates: RejectToSenderTemplate[];
  replaceData = emailTemplateReplace;
  indexedData: IndexedData;
  rejectToSenderForm: FormGroup<ReturnToSenderForm>;
  notificationTemplate = '';
  errorMessage: string;
  duplicateIndexedData: IndexedData;

  constructor(
    private dialogRef: MatDialogRef<RejectToSenderComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      sourceEmail: string;
      templates: RejectToSenderTemplate[];
      indexedData: IndexedData;
      duplicateIndexedData: IndexedData;
    },
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.templates = this.data.templates;
    this.indexedData = this.data.indexedData;
    this.duplicateIndexedData = this.data.duplicateIndexedData;
    this.rejectToSenderForm = this.fb.group({
      toEmailAddress: [this.data.sourceEmail, [Validators.required, Validators.email]],
      templateId: ['', Validators.required],
      htmlBody: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.templates.length >= 2 ? this.matSelect.toggle() : null;
    }, 100);
  }

  close(): void {
    this.dialogRef.close();
  }

  send(): void {
    this.dialogRef.close(this.rejectToSenderForm.value);
  }

  selectTemplate(templateId: string): void {
    const template = this.templates.find(temp => temp.templateId === templateId);
    const indexedData =
      template.templateName.indexOf('Duplicate Research') > -1 && this.duplicateIndexedData
        ? this.duplicateIndexedData
        : this.indexedData; // TODO : confirm template(s) they want to do this replacement

    this.notificationTemplate = template.notificationTemplate;

    this.notificationTemplate = this.replaceText(
      this.notificationTemplate,
      indexedData,
      this.replaceData
    );

    this.rejectToSenderForm.get('htmlBody').setValue(this.notificationTemplate);

    const position: InsertPosition = 'afterbegin';
    const templateDiv = document.getElementById('notificationTemplateId');
    templateDiv.innerHTML = '';
    templateDiv.insertAdjacentHTML(position, this.notificationTemplate);
  }

  updateHtmlTemplate(htmlTemplateUpdated: string): void {
    this.rejectToSenderForm.get('htmlBody').setValue(htmlTemplateUpdated);
  }

  replaceText(emailTemplate: string, indexedData: IndexedData, dataReplace: object): string {
    let replacedText = emailTemplate;

    for (const key in dataReplace) {
      if (Object.prototype.hasOwnProperty.call(dataReplace, key)) {
        let value: string;
        const label = dataReplace[key];
        const regex = new RegExp(`{{${key}}}`, 'g');

        if (
          label.toLowerCase() === DocumentLabelKeys.nonLookupLabels.DateReceived.toLocaleLowerCase()
        ) {
          value = DateTime.fromISO(indexedData.dateReceived).toFormat('MM/dd/yyyy h:mma');
        } else {
          value = indexedData.labels?.find(
            (lbl: IndexedLabel) => lbl.label.toLowerCase() === label.toLowerCase()
          )?.value.text;
        }

        replacedText = replacedText.replace(regex, value);
      }
    }
    return replacedText;
  }
}
