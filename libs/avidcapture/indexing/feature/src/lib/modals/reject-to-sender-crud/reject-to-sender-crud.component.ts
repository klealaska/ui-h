import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Store } from '@ngxs/store';
import {
  CreateRejectToSenderTemplate,
  DeleteRejectToSenderTemplate,
  EditRejectToSenderTemplate,
  IndexingUtilitySelectors,
} from '@ui-coe/avidcapture/indexing/data-access';
import { RejectToSenderTemplate, SearchContext } from '@ui-coe/avidcapture/shared/types';
import { Observable, Subscription, take, tap } from 'rxjs';

interface TemplateForm {
  templateId: FormControl<string | null>;
  templateName: FormControl<string | null>;
  templateSubject: FormControl<string | null>;
  templateBody: FormControl<string | null>;
}

@Component({
  selector: 'xdc-reject-to-sender-crud',
  templateUrl: './reject-to-sender-crud.component.html',
  styleUrls: ['./reject-to-sender-crud.component.scss'],
})
export class RejectToSenderCrudComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('addTemplateNameInput') addTemplateNameInput: ElementRef<HTMLInputElement>;

  templateForm: FormGroup<TemplateForm>;
  errorMessage = '';
  templateSelected = false;
  htmlTemplate = '';
  templates$: Observable<RejectToSenderTemplate[]>;

  private subscriptions: Subscription[] = [];

  constructor(
    private dialogRef: MatDialogRef<RejectToSenderCrudComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      buyerId: number;
    },
    private store: Store,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.templateForm = this.fb.group({
      templateId: [null],
      templateName: ['', [Validators.required]],
      templateSubject: ['', Validators.required],
      templateBody: ['', Validators.required],
    });
    this.templates$ = this.store.select(IndexingUtilitySelectors.customRejectToSenderTemplates);
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.addTemplateNameInput.nativeElement.focus(), 150);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  close(): void {
    this.dialogRef.close(null);
  }

  addTemplate(): void {
    const templatePayload: RejectToSenderTemplate = {
      sourceSystemBuyerId: this.data.buyerId.toString(),
      sourceSystemId: SearchContext.AvidSuite,
      templateName: this.templateForm.get('templateName').value,
      templateSubjectLine: this.templateForm.get('templateSubject').value,
      notificationTemplate: this.templateForm.get('templateBody').value,
      isActive: true,
    };
    this.htmlTemplate = this.templateForm.get('templateBody').value;

    this.subscriptions.push(
      this.store
        .dispatch(new CreateRejectToSenderTemplate(templatePayload))
        .pipe(
          take(1),
          tap(() => this.resetForm())
        )
        .subscribe()
    );
  }

  editTemplate(): void {
    const templatePayload: RejectToSenderTemplate = {
      sourceSystemBuyerId: this.data.buyerId.toString(),
      sourceSystemId: SearchContext.AvidSuite,
      templateName: this.templateForm.get('templateName').value,
      templateSubjectLine: this.templateForm.get('templateSubject').value,
      notificationTemplate: this.templateForm.get('templateBody').value,
      templateId: this.templateForm.get('templateId').value,
      isActive: true,
    };

    this.store.dispatch(new EditRejectToSenderTemplate(templatePayload));
  }

  deleteTemplate(templateId = ''): void {
    templateId = !templateId ? this.templateForm.get('templateId').value : templateId;

    this.templateSelected = false;
    this.store.dispatch(new DeleteRejectToSenderTemplate(templateId));
  }

  updateTemplate(template: RejectToSenderTemplate): void {
    this.templateForm.patchValue({
      templateId: template.templateId,
      templateName: template.templateName,
      templateSubject: template.templateSubjectLine,
      templateBody: template.notificationTemplate,
    });
    this.templateSelected = true;
    this.htmlTemplate = template.notificationTemplate;
  }

  tabChanged(event: MatTabChangeEvent): void {
    if (event.index === 0) {
      this.resetForm();
      this.templateSelected = false;
    }
  }

  private resetForm(): void {
    this.templateForm.reset({
      templateId: null,
      templateName: '',
      templateSubject: '',
      templateBody: '',
    });
    this.htmlTemplate = '';
  }
}
