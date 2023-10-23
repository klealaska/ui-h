import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import {
  CompositeDocument,
  DocumentTypes,
  EscalationCategoryTypes,
  FieldBase,
  MoreActions,
} from '@ui-coe/avidcapture/shared/types';
import { MenuOption } from '@ui-coe/shared/ui';

@Component({
  selector: 'xdc-indexing-header',
  templateUrl: './indexing-header.component.html',
  styleUrls: ['./indexing-header.component.scss'],
})
export class IndexingHeaderComponent implements OnChanges {
  @Input() customerName: string;
  @Input() markAsChoices: MenuOption[];
  @Input() formValid: boolean;
  @Input() lookupFieldsValid: boolean;
  @Input() hasNewEscalations: boolean;
  @Input() invoiceAge: string;
  @Input() tooltipText: string;
  @Input() hasActivities = false;
  @Input() isLoading = false;
  @Input() isLookupLoading = false;
  @Input() compositeData: CompositeDocument;
  @Input() canSwapImage = false;
  @Input() isSponsorUser = false;
  @Input() fields: FieldBase<string>[];
  @Input() formFields: FieldBase<string>[];
  @Input() utilityFields: string[];
  @Input() hasChangedLabels: boolean;
  @Input() saveInvoiceIsActive: boolean;
  @Input() moreActionsIsActive: boolean;
  @Input() canRecycleDocument: boolean;
  @Input() canRejectToSender = false;
  @Input() canSubmit = true;
  @Input() multipleDisplayThresholdsIsActive: boolean;
  @Input() supplierPredictionIsActive: boolean;
  @Output() markAsSelected = new EventEmitter<string>();
  @Output() submitClick = new EventEmitter<void>();
  @Output() swapDocument = new EventEmitter<void>();
  @Output() saveDocument = new EventEmitter<void>();

  @ViewChild(MatExpansionPanel) expansionPanel: MatExpansionPanel;

  text = 'Mark As';
  showing = false;
  deleteDocument = EscalationCategoryTypes.RecycleBin;
  rejectToSender = EscalationCategoryTypes.RejectToSender;
  rejectToSenderCrud = MoreActions.RejectToSenderCrud;
  documentType = DocumentTypes.Indexing;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.hasNewEscalations?.currentValue) {
      this.text = 'Mark As';
    }
  }

  itemSelected(selectedValue: string): void {
    this.markAsSelected.emit(selectedValue);
  }

  activityLogClick(): void {
    this.showing = !this.showing;
    this.expansionPanel.toggle();
  }
}
