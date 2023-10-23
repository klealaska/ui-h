import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { ConfidenceColorAssociationService } from '@ui-coe/avidcapture/core/util';
import {
  CreateCustomerAccountActivity,
  GetMaxInvoiceNumberLength,
  IndexingDocumentFieldsSelectors,
  IndexingPageSelectors,
  IndexingUtilitySelectors,
  QueryDocumentFormFields,
  QueryLookupCustomerAccounts,
  QueryLookupProperties,
  QueryLookupSuppliers,
  QueryOrderedBy,
  QueryWorkflow,
  RemoveLatestFieldAssociation,
  ResetLookupDropdownData,
  ResetLookupState,
  SanitizeFieldValue,
  SetCustomerAccount,
  SetDueDate,
  SetExistingOrderedBy,
  SetExistingProperty,
  SetExistingSupplier,
  SetExistingWorkflow,
  SetLookupOrderedBy,
  SetLookupProperty,
  SetLookupSupplier,
  SetLookupWorkflow,
  UpdateFormattedFields,
  UpdateInvoiceType,
  UpdateLookupFieldAssociationValue,
  UpdateLookupFieldOnNoSelection,
  UpdateNonLookupField,
  UpdateOnManualIntervention,
  UpdateUtilityFields,
} from '@ui-coe/avidcapture/indexing/data-access';
import { HotkeysService } from '@ui-coe/avidcapture/indexing/util';
import type { LookupLoadingState, LookupValue } from '@ui-coe/avidcapture/shared/types';
import {
  Activity,
  AssociatedErrorMessage,
  CompositeDocument,
  ConfidenceThreshold,
  CustomerAccount,
  DocumentLabelKeys,
  FieldAssociated,
  FieldBase,
  FieldTypes,
  IndexedLabel,
  InvoiceTypes,
  LookupCustomerAccount,
  LookupOrderedBy,
  LookupProperty,
  LookupSupplier,
  LookupWorkflow,
  NonLookupErrorMessage,
} from '@ui-coe/avidcapture/shared/types';
import { invoiceTypeChoices, paymentTermsChoices } from '@ui-coe/avidcapture/shared/util';
import { Observable, Subscription } from 'rxjs';
import { filter, take, tap, withLatestFrom } from 'rxjs/operators';

import { CreateAccountComponent } from '../../modals/create-account/create-account.component';
import { ClaimsQueries, FeatureFlagTargetQueries } from '@ui-coe/avidcapture/core/data-access';

@Component({
  selector: 'xdc-document-fields',
  templateUrl: './document-fields.component.html',
  styleUrls: ['./document-fields.component.scss'],
})
export class DocumentFieldsComponent implements OnInit, OnChanges, OnDestroy {
  @Select(IndexingDocumentFieldsSelectors.invoiceTypeConfidenceThreshold)
  invoiceTypeConfidenceThreshold$: Observable<ConfidenceThreshold>;
  @Select(IndexingDocumentFieldsSelectors.formGroupInstance)
  formGroupInstance$: Observable<UntypedFormGroup>;
  @Select(IndexingDocumentFieldsSelectors.lookupFormFields) lookupFormFields$: Observable<
    FieldBase<string>[]
  >;
  @Select(IndexingDocumentFieldsSelectors.lookupFormFieldsBottom)
  lookupFormFieldsBottom$: Observable<FieldBase<string>[]>;
  @Select(IndexingDocumentFieldsSelectors.nonLookupFormFields) nonLookupFormFields$: Observable<
    FieldBase<string>[]
  >;
  @Select(IndexingDocumentFieldsSelectors.dropdownFields)
  dropdownFields$: Observable<FieldBase<string>[]>;
  @Select(IndexingDocumentFieldsSelectors.nonLookupFormFieldsBottom)
  nonLookupFormFieldsBottom$: Observable<FieldBase<string>[]>;
  @Select(IndexingDocumentFieldsSelectors.customerAccounts) customerAccounts$: Observable<
    LookupCustomerAccount[]
  >;
  @Select(IndexingDocumentFieldsSelectors.properties) properties$: Observable<LookupProperty[]>;
  @Select(IndexingDocumentFieldsSelectors.suppliers) suppliers$: Observable<LookupSupplier[]>;
  @Select(IndexingDocumentFieldsSelectors.orderedBy) orderedBy$: Observable<LookupOrderedBy[]>;
  @Select(IndexingDocumentFieldsSelectors.workflow) workflow$: Observable<LookupWorkflow[]>;
  @Select(IndexingDocumentFieldsSelectors.isLookupLoading) isLookupLoading$: Observable<boolean>;
  @Select(IndexingDocumentFieldsSelectors.isDefaultShipToLoading)
  isDefaultShipToLoading$: Observable<boolean>;
  @Select(IndexingDocumentFieldsSelectors.lastLabelUpdated) lastLabelUpdated$: Observable<string>;
  @Select(IndexingDocumentFieldsSelectors.customerAccountFieldValue)
  customerAccountFieldValue$: Observable<string>;
  @Select(IndexingDocumentFieldsSelectors.selectedSupplier)
  selectedSupplier$: Observable<LookupSupplier>;
  @Select(IndexingDocumentFieldsSelectors.selectedProperty)
  selectedProperty$: Observable<LookupProperty>;
  @Select(IndexingDocumentFieldsSelectors.selectedOrderedBy) selectedOrderedBy$: Observable<string>;
  @Select(IndexingDocumentFieldsSelectors.selectedWorkflow) selectedWorkflow$: Observable<string>;
  @Select(IndexingDocumentFieldsSelectors.nonLookupErrorMessage)
  nonLookupErrorMessage$: Observable<NonLookupErrorMessage>;
  @Select(IndexingDocumentFieldsSelectors.invoiceType) invoiceType$: Observable<string>;
  @Select(IndexingDocumentFieldsSelectors.lookupLoadingState)
  lookupLoadingState$: Observable<LookupLoadingState>;

  @Select(IndexingPageSelectors.latestFieldAssociation)
  latestFieldAssociation$: Observable<FieldAssociated>;
  @Select(IndexingPageSelectors.associatedErrorMessage)
  associatedErrorMessage$: Observable<AssociatedErrorMessage>;
  @Select(IndexingPageSelectors.activityToDisplay) activityToDisplay$: Observable<Activity>;

  @Select(IndexingUtilitySelectors.selectedDocumentText)
  selectedDocumentText$: Observable<IndexedLabel>;
  @Select(FeatureFlagTargetQueries.multipleDisplayThresholdsIsActive)
  multipleDisplayThresholdsIsActive$: Observable<boolean>;
  @Select(FeatureFlagTargetQueries.supplierPredictionIsActive)
  supplierPredictionIsActive$: Observable<boolean>;
  @Select(ClaimsQueries.canViewAllBuyers) canViewAllBuyers$: Observable<boolean>;
  @Select(ClaimsQueries.canEditPredictedValues) canEditPredictedValues$: Observable<boolean>;

  @Input() compositeData: CompositeDocument;
  @Input() fieldToHighlight: string;
  @Input() associatedErrorMessage: { message: string; label: string };
  @Input() canCreateAccount: boolean;
  @Input() allowSpecialCharacters: boolean;
  @Input() isSponsorUser: boolean;
  @Input() canDisplayPredictedValues: boolean;
  @Output() boundingBoxToHighlight = new EventEmitter<string>();

  selectedInvoiceType: InvoiceTypes;
  invoiceTypeConfidence: number;
  invoiceTypeOptions = invoiceTypeChoices;
  highlightLabels: IndexedLabel[] = [];
  editModeField: string;
  tabbedToField: FieldBase<string>;

  private subscriptions: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private hotkeysService: HotkeysService,
    private confidenceColorService: ConfidenceColorAssociationService,
    private store: Store
  ) {}

  ngOnInit(): void {
    const invoiceTypeLabel: IndexedLabel = this.compositeData?.indexed?.labels?.find(
      item => item.label === DocumentLabelKeys.nonLookupLabels.InvoiceType
    );

    this.selectedInvoiceType =
      invoiceTypeLabel != null
        ? (`${invoiceTypeLabel.value.text
            .charAt(0)
            .toUpperCase()}${invoiceTypeLabel.value.text.slice(1)}` as InvoiceTypes)
        : InvoiceTypes.Standard;

    const buyerId$ = this.store.select(state => state.indexingPage.buyerId);
    this.subscriptions.push(
      buyerId$
        .pipe(
          filter(buyerId => buyerId != null),
          tap(() => {
            this.store.dispatch([
              new UpdateInvoiceType(this.selectedInvoiceType),
              new QueryDocumentFormFields(),
              new SetExistingProperty(),
              new SetExistingSupplier(),
              new SetExistingOrderedBy(),
              new SetExistingWorkflow(),
            ]);
          })
        )
        .subscribe()
    );

    this.subscriptions.push(
      this.dropdownFields$
        .pipe(
          filter(dropdownFields => dropdownFields.length > 0),
          tap(dropdownFields => {
            let invoiceTypeField = dropdownFields.find(
              fld => fld.key === DocumentLabelKeys.nonLookupLabels.InvoiceType
            );
            if (invoiceTypeField.value === '') {
              invoiceTypeField = { ...invoiceTypeField, value: this.selectedInvoiceType };
              this.store.dispatch([
                new UpdateFormattedFields(invoiceTypeField),
                new UpdateOnManualIntervention({
                  value: this.selectedInvoiceType,
                  key: DocumentLabelKeys.nonLookupLabels.InvoiceType,
                  type: FieldTypes.String,
                } as FieldBase<string>),
              ]);
            }
          })
        )
        .subscribe()
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fieldToHighlight) {
      this.findFieldToHighlight();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.store.dispatch(new ResetLookupState());
  }

  setConfidenceColor(field: FieldBase<string>): string {
    return this.confidenceColorService.getConfidenceColor(
      this.getConfidencePercentage(field),
      field.confidenceThreshold
    );
  }

  getConfidencePercentage(field: FieldBase<string>): number {
    return Number((field.confidence * 100).toFixed(2));
  }

  handleInvoiceTypeSelect(event: InvoiceTypes): void {
    const fields = this.store.selectSnapshot(
      state => state.indexingDocumentFields?.formattedFields
    );
    let invoiceTypeField = fields.find(
      fld => fld.key === DocumentLabelKeys.nonLookupLabels.InvoiceType
    );

    invoiceTypeField = { ...invoiceTypeField, value: event };
    this.selectedInvoiceType = event;
    this.store.dispatch([
      new UpdateInvoiceType(this.selectedInvoiceType),
      new UpdateFormattedFields(invoiceTypeField),
      new UpdateUtilityFields(),
      new UpdateOnManualIntervention({
        value: this.selectedInvoiceType,
        key: DocumentLabelKeys.nonLookupLabels.InvoiceType,
        type: FieldTypes.String,
      } as FieldBase<string>),
    ]);
  }

  updateOnManualIntervention(formValue: FieldBase<string>): void {
    this.store.dispatch(new UpdateOnManualIntervention(formValue));
  }

  updateNonLookupField(field: FieldBase<string>): void {
    this.tabbedToField = null;
    this.store.dispatch(new UpdateNonLookupField(field));
  }

  updateLookupValue(event: { lookupValue: LookupValue; field: string }): void {
    switch (event.field) {
      case DocumentLabelKeys.lookupLabels.CustomerAccountNumber:
        this.store.dispatch(new SetCustomerAccount(event.lookupValue));
        break;
      case DocumentLabelKeys.lookupLabels.Supplier:
      case DocumentLabelKeys.lookupLabels.SupplierAddress:
        this.store.dispatch(new SetLookupSupplier(event.lookupValue, event.field));

        if (!this.isSponsorUser) {
          this.store.dispatch(
            new GetMaxInvoiceNumberLength(event?.lookupValue?.vendorID?.toString() ?? '')
          );
        }
        break;
      case DocumentLabelKeys.lookupLabels.ShipToName:
      case DocumentLabelKeys.lookupLabels.ShipToAddress:
        this.store.dispatch(new SetLookupProperty(event.lookupValue, event.field));
        break;
      case DocumentLabelKeys.lookupLabels.OrderedBy:
        this.store.dispatch(new SetLookupOrderedBy(event.lookupValue, event.field));
        break;
      case DocumentLabelKeys.lookupLabels.Workflow:
        this.store.dispatch(new SetLookupWorkflow(event.lookupValue, event.field));
        break;
    }
  }

  queryLookupField(event: { value: string; field: string }): void {
    switch (event.field) {
      case DocumentLabelKeys.lookupLabels.CustomerAccountNumber:
        this.store.dispatch(new QueryLookupCustomerAccounts(event.value));
        break;
      case DocumentLabelKeys.lookupLabels.Supplier:
      case DocumentLabelKeys.lookupLabels.SupplierAddress:
        this.store.dispatch(new QueryLookupSuppliers(event.value));
        break;
      case DocumentLabelKeys.lookupLabels.ShipToName:
      case DocumentLabelKeys.lookupLabels.ShipToAddress:
        this.store.dispatch(new QueryLookupProperties(event.value));
        break;
      case DocumentLabelKeys.lookupLabels.OrderedBy:
        this.store.dispatch(new QueryOrderedBy(event.value));
        break;
      case DocumentLabelKeys.lookupLabels.Workflow:
        this.store.dispatch(new QueryWorkflow(event.value));
        break;
    }
  }

  removeLatestFieldAssociation(): void {
    this.store.dispatch(new RemoveLatestFieldAssociation());
  }

  resetLookupDropdownData(): void {
    this.store.dispatch(new ResetLookupDropdownData());
  }

  getBoundingBoxId(field: string): void {
    if (field) {
      const label = this.compositeData?.indexed?.labels?.filter(
        (label: IndexedLabel) => label.label === field
      );

      if (!label || label.length === 0) {
        this.boundingBoxToHighlight.emit('');
        return;
      }

      this.boundingBoxToHighlight.emit(`label-feature-${label[0].label.toString().trim()}`);
    } else {
      this.boundingBoxToHighlight.emit('');
    }
  }

  resetLookUpFieldsEditMode(field: string): void {
    this.editModeField = field;
    this.tabbedToField = null;
  }

  lookupFieldSelectedForAssociation(field: FieldBase<string>): void {
    const selectedDocumentText = this.store.selectSnapshot(
      state => state.indexingUtility.selectedDocumentText
    );

    if (field === null || selectedDocumentText === null) {
      return;
    }

    this.store.dispatch([
      new SanitizeFieldValue(field, true),
      new UpdateLookupFieldAssociationValue(field),
    ]);
  }

  fieldSelectedForAssociation(field: FieldBase<string>): void {
    const selectedDocumentText = this.store.selectSnapshot(
      state => state.indexingUtility.selectedDocumentText
    );

    if (field === null || selectedDocumentText === null) {
      return;
    }

    this.store.dispatch(new SanitizeFieldValue(field, false));
  }

  handleNoSelection(field: FieldBase<string>): void {
    this.store.dispatch(new UpdateLookupFieldOnNoSelection(field));
  }

  tabKeyPress(field: FieldBase<string>): void {
    this.tabbedToField = field;
  }

  tabKeyPressLookup(field: FieldBase<string>): void {
    const fields = this.store.selectSnapshot(state => state.indexingDocumentFields.fields);
    const currentField = fields.find(fld => fld.key === field.key);

    if (
      (currentField.key === DocumentLabelKeys.lookupLabels.Supplier && !currentField.value) ||
      currentField.key === DocumentLabelKeys.lookupLabels.CustomerAccountNumber
    ) {
      this.tabbedToField = fields.find(
        fld => fld.key === DocumentLabelKeys.lookupLabels.ShipToName
      );
    } else if (currentField.key === DocumentLabelKeys.lookupLabels.Supplier && currentField.value) {
      this.tabbedToField = fields.find(
        fld => fld.key === DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
    } else if (currentField.key === DocumentLabelKeys.lookupLabels.ShipToName) {
      this.tabbedToField = fields.find(
        fld => fld.key === DocumentLabelKeys.nonLookupLabels.InvoiceNumber
      );
    }
  }

  openCreateAccountModal(fieldText: string): void {
    this.subscriptions.push(
      this.dialog
        .open(CreateAccountComponent, {
          width: '28.125em',
          data: {
            paymentTermsChoices,
            customerAccountNumber: fieldText,
            allowSpecialCharacters: this.allowSpecialCharacters,
          },
        })
        .afterClosed()
        .pipe(
          take(1),
          withLatestFrom(this.formGroupInstance$),
          tap(([result, formGroupInstance]: [CustomerAccount, UntypedFormGroup]) => {
            if (result) {
              const lookupValue: LookupCustomerAccount = {
                vendorAccountId: 0,
                accountNo: result.customerAccountNumber,
                propertyId: 0,
                propertyName: '',
                termTypeId: 0,
                allowRetainage: false,
                isActive: true,
              };

              formGroupInstance
                .get(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)
                .clearValidators();

              formGroupInstance
                .get(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)
                .updateValueAndValidity();

              this.updateLookupValue({
                lookupValue: lookupValue as LookupValue,
                field: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
              });

              this.newAccountNumberCreated(result);
            } else {
              this.hotkeysService.canOpenHotKeysModal = true;
            }
          })
        )
        .subscribe()
    );
    // disable hotkeys modal when selection modal is open
    this.hotkeysService.canOpenHotKeysModal = false;
  }

  private newAccountNumberCreated(customerAccount: CustomerAccount): void {
    this.store.dispatch([new CreateCustomerAccountActivity(customerAccount), new SetDueDate()]);
  }

  private findFieldToHighlight(): void {
    if (this.fieldToHighlight) {
      this.highlightLabels = this.compositeData.indexed.labels.filter(
        label =>
          `label-feature-${label.label.toString().trim()}` ===
          this.fieldToHighlight.toString().trim()
      );
    } else {
      this.highlightLabels = [];
    }
  }
}
