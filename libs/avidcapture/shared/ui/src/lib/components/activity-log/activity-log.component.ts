import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  CompositeDocument,
  DocumentLabelDisplayNames,
  DocumentLabelKeys,
  DocumentTypes,
  Environment,
  EscalationCategoryTypes,
  FieldBase,
} from '@ui-coe/avidcapture/shared/types';

@Component({
  selector: 'xdc-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss'],
})
export class ActivityLogComponent implements OnInit {
  @Input() compositeData: CompositeDocument;
  @Input() isSponsorUser = false;
  @Input() fields: FieldBase<string>[];
  @Input() multipleDisplayThresholdsIsActive = false;
  @Input() supplierPredictionIsActive = false;
  @Input() formFields: FieldBase<string>[];
  @Input() utilityFields: string[];
  @Input() documentType: DocumentTypes;

  compositeDocument: CompositeDocument;
  avidSuiteBaseUrl: string;
  initialLookupFieldCheck = false;
  initialNonLookupFieldCheck = false;
  documentLabelDisplayNames = DocumentLabelDisplayNames; // for template
  escalationCategoryTypes = EscalationCategoryTypes; // for template

  constructor(@Inject('environment') private environment: Environment) {}

  ngOnInit(): void {
    this.compositeDocument = this.compositeData;
    this.avidSuiteBaseUrl = this.environment.avidSuiteInvoiceUrl;
    this.initialLookupFieldCheck = this.supplierPredictionIsActive && this.isSponsorUser;
    this.initialNonLookupFieldCheck = this.multipleDisplayThresholdsIsActive && this.isSponsorUser;
  }
}
