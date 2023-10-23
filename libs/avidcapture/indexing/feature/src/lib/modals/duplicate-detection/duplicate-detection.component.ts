import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import {
  OverrideEscalation,
  SetDuplicateDocumentId,
  SetEscalation,
} from '@ui-coe/avidcapture/indexing/data-access';
import {
  DuplicateDetectionError,
  Environment,
  Escalation,
  escalationCategoryReasonTypes,
  EscalationCategoryTypes,
  EscalationLevelTypes,
} from '@ui-coe/avidcapture/shared/types';
import { Observable } from 'rxjs';

@Component({
  selector: 'xdc-duplicate-detection',
  templateUrl: './duplicate-detection.component.html',
  styleUrls: ['./duplicate-detection.component.scss'],
})
export class DuplicateDetectionComponent implements OnInit {
  duplicateDetectionError: DuplicateDetectionError;
  canViewAllBuyers$: Observable<boolean>;
  avidSuiteBaseUrl: string;
  supplierName: string;
  invoiceNumber: number;

  constructor(
    private dialogRef: MatDialogRef<DuplicateDetectionComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      duplicateDetectionError: DuplicateDetectionError;
      canViewAllBuyers$: Observable<boolean>;
      supplierName: string;
      invoiceNumber: number;
    },
    @Inject('environment') private environment: Environment,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.duplicateDetectionError = this.data.duplicateDetectionError;
    this.supplierName = this.data.supplierName;
    this.invoiceNumber = this.data.invoiceNumber;
    this.avidSuiteBaseUrl = this.environment.avidSuiteInvoiceUrl;
    this.canViewAllBuyers$ = this.data.canViewAllBuyers$;
  }

  close(): void {
    this.store.dispatch(new SetDuplicateDocumentId(null));
    this.dialogRef.close();
  }

  markAsDuplicate(): void {
    const escalation: Escalation = {
      category: {
        issue: EscalationCategoryTypes.DuplicateResearch,
        reason: this.getDuplicateDetectedReason(),
      },
      description: JSON.stringify(this.duplicateDetectionError),
      escalationLevel: EscalationLevelTypes.InternalXdc,
      resolution: '',
    };
    this.store.dispatch([new SetEscalation(escalation), new SetDuplicateDocumentId(null)]);
    this.dialogRef.close();
  }

  private getDuplicateDetectedReason(): string {
    if (this.duplicateDetectionError.documentId && !this.duplicateDetectionError.sourceDocumentId) {
      return escalationCategoryReasonTypes.duplicateDetection.AvidCapture;
    } else if (
      !this.duplicateDetectionError.documentId &&
      this.duplicateDetectionError.sourceDocumentId
    ) {
      return escalationCategoryReasonTypes.duplicateDetection.AvidInvoice;
    } else if (
      this.duplicateDetectionError.documentId &&
      this.duplicateDetectionError.sourceDocumentId
    ) {
      return escalationCategoryReasonTypes.duplicateDetection.AvidCaptureAndAvidInvoice;
    }
  }
}
