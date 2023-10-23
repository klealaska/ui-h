import { Component, Input, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { CompositeDocument, DocumentTypes, FieldBase } from '@ui-coe/avidcapture/shared/types';

@Component({
  selector: 'xdc-archive-invoice-header',
  templateUrl: './archive-invoice-header.component.html',
  styleUrls: ['./archive-invoice-header.component.scss'],
})
export class ArchiveInvoiceHeaderComponent {
  @Input() archivedDocument: CompositeDocument;
  @Input() customerName: string;
  @Input() fields: FieldBase<string>[];
  @Input() submittedDate: string;
  @Input() isSponsorUser: boolean;
  @Input() multipleDisplayThresholdsIsActive: boolean;
  @Input() supplierPredictionIsActive: boolean;
  @Input() utilityFields: string[];
  @Input() formFields: FieldBase<string>[];
  @ViewChild(MatExpansionPanel) expansionPanel: MatExpansionPanel;

  showing = false;
  documentType = DocumentTypes.Archived;

  activityLogClick(): void {
    this.showing = !this.showing;
    this.expansionPanel.toggle();
  }
}
