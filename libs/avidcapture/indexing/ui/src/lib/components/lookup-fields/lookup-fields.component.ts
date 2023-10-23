import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import type { LookupLoadingState, LookupValue } from '@ui-coe/avidcapture/shared/types';
import {
  DocumentLabelKeys,
  FieldAssociated,
  FieldBase,
  IndexedLabel,
  LookupCustomerAccount,
  LookupOrderedBy,
  LookupProperty,
  LookupSupplier,
  LookupWorkflow,
} from '@ui-coe/avidcapture/shared/types';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'xdc-lookup-fields',
  templateUrl: './lookup-fields.component.html',
  styleUrls: ['./lookup-fields.component.scss'],
})
export class LookupFieldsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() field: FieldBase<string>;
  @Input() formGroupInstance: UntypedFormGroup;
  @Input() customerAccounts: LookupCustomerAccount[];
  @Input() properties: LookupProperty[];
  @Input() suppliers: LookupSupplier[];
  @Input() orderedBy: LookupOrderedBy[];
  @Input() workflow: LookupWorkflow[];
  @Input() isLookupLoading: boolean;
  @Input() isDefaultShipToLoading: boolean;
  @Input() confidence: number;
  @Input() confidenceColor: string;
  @Input() lastLabelUpdated: string;
  @Input() latestFieldAssociation: FieldAssociated;
  @Input() highlightLabels: IndexedLabel[];
  @Input() editModeField: string;
  @Input() customerAccountFieldValue: string;
  @Input() supplierFieldValue: LookupSupplier;
  @Input() shipToFieldValue: LookupProperty;
  @Input() orderedByFieldValue: LookupOrderedBy;
  @Input() workflowFieldValue: LookupWorkflow;
  @Input() canCreateAccount: boolean;
  @Input() tabbedToField: FieldBase<string>;
  @Input() selectedDocumentText: IndexedLabel;
  @Input() isSponsorUser: boolean;
  @Input() canEditPredictedValues: boolean;
  @Input() supplierPredictionIsActive = false;
  @Input() lookupLoadingState: LookupLoadingState;

  @Output() formChanged = new EventEmitter<FieldBase<string>>();
  @Output() searchText = new EventEmitter<{ value: string; field: string }>();
  @Output() updateLookupValue = new EventEmitter<{ lookupValue: LookupValue; field: string }>();
  @Output() removeLatestFieldAssociation = new EventEmitter<void>();
  @Output() resetLookupDropdownData = new EventEmitter<void>();
  @Output() openAccountNumberModal = new EventEmitter<string>();
  @Output() labelHoverEvent = new EventEmitter<string>();
  @Output() resetLookUpFieldsEditMode = new EventEmitter<string>();
  @Output() fieldSelectedForAssociation = new EventEmitter<FieldBase<string>>();
  @Output() handleNoSelection = new EventEmitter<FieldBase<string>>();

  @ViewChild('input') input: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  editMode = false;
  isValid = true;
  meetsDisplayThreshold = false;
  meetsReadonlyThreshold = false;
  value: string | LookupSupplier | LookupProperty | LookupOrderedBy | LookupWorkflow;
  preventSingleClick: boolean;
  modalOpened = false;
  turnOnHighlight = false;
  hasPointer = false;
  documentLabelKeys = DocumentLabelKeys; // for the template
  noResultsText = 'No Results Found';
  noResultsVisible = false;
  fieldEnabled = true;
  fieldCharacterLimit: number;
  labelTextColor = 'default';
  readOnlyColor = '#6C6C6C';

  private clickTimer: ReturnType<typeof setTimeout> = setTimeout(() => '', 1000);
  private subscriptions: Subscription[] = [];
  private latestSearchText = '';

  ngOnInit(): void {
    this.isValid = this.formGroupInstance.get(this.field.key).valid;
    this.hasPointer =
      this.field.key !== DocumentLabelKeys.lookupLabels.ShipToAddress &&
      this.field.key !== DocumentLabelKeys.lookupLabels.SupplierAddress
        ? true
        : false;
    this.setFieldValue();
    this.listenToFormChanges();

    if (this.field.key === DocumentLabelKeys.lookupLabels.CustomerAccountNumber) {
      this.fieldCharacterLimit = 50;
    }

    if (
      this.field.key === DocumentLabelKeys.lookupLabels.CustomerAccountNumber &&
      !this.formGroupInstance.get(DocumentLabelKeys.lookupLabels.Supplier).value
    ) {
      this.fieldEnabled = false;
    }

    this.meetsReadonlyThreshold =
      this.isSponsorUser &&
      this.supplierPredictionIsActive &&
      this.value &&
      this.field.confidence !== 1 &&
      this.field?.confidence >= this.field?.displayThreshold.readonly * 0.01;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.editModeField && changes.editModeField.currentValue !== this.field.key) {
      this.editMode = false;
    }

    if (changes.lastLabelUpdated?.currentValue) {
      this.isValid = this.formGroupInstance.get(this.field.key).valid;

      this.setFieldValue();

      // Uncomment to get back auto-open functionality
      // this.enableNextField(changes.lastLabelUpdated.currentValue);
    }

    if (changes.confidence?.currentValue >= this.field.displayThreshold.view * 0.01) {
      this.meetsDisplayThreshold = true;
    }

    if (changes.latestFieldAssociation?.currentValue?.field === this.field.key) {
      this.searchText.emit({
        value: changes.latestFieldAssociation.currentValue.value,
        field: changes.latestFieldAssociation.currentValue.field,
      });
      this.removeLatestFieldAssociation.emit();
      this.editMode = true;
      setTimeout(() => {
        this.input.nativeElement.focus();
        this.input.nativeElement.select();
      });
      this.resetLookUpFieldsEditMode.emit(this.field.key);
    }

    if (changes.highlightLabels?.currentValue) {
      const label = changes.highlightLabels.currentValue.find(
        (lbl: IndexedLabel) => lbl.label === this.field.key
      );

      this.turnOnHighlight =
        label && label.value.confidence >= this.field.displayThreshold.view * 0.01 ? true : false;
    }

    if (
      (changes.customerAccountFieldValue?.currentValue ||
        changes.supplierFieldValue?.currentValue ||
        changes.shipToFieldValue?.currentValue ||
        changes.orderedByFieldValue?.currentValue ||
        changes.workflowFieldValue?.currentValue) &&
      !this.lastLabelUpdated
    ) {
      this.setFieldValue();
    }

    if (changes.tabbedToField?.currentValue?.key === this.field.key) {
      this.edit();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  edit(): void {
    this.editMode = true;
    setTimeout(() => {
      this.input.nativeElement.focus();
      this.input.nativeElement.select();
      this.autoAdjustFontSize();
    });
    this.resetLookUpFieldsEditMode.emit(this.field.key);

    if (this.field.key === DocumentLabelKeys.lookupLabels.OrderedBy) {
      this.field.value = this.orderedByFieldValue?.firstName ?? '';
    } else if (this.field.key === DocumentLabelKeys.lookupLabels.Workflow) {
      this.field.value = this.workflowFieldValue?.name ?? '';
    }

    this.loadLookup(this.field.key);
  }

  handleInputClick(): void {
    if (!this.fieldEnabled || (this.isLookupLoading && !this.checkLookupState())) {
      return;
    }

    if (this.selectedDocumentText) {
      this.fieldSelectedForAssociation.emit(this.field);
    } else {
      this.edit();
    }
  }

  handleSingleClick(): void {
    if (
      this.fieldEnabled &&
      !this.formGroupInstance.get(this.field.key).disabled &&
      !this.isLookupLoading
    ) {
      this.preventSingleClick = false;

      this.clickTimer = setTimeout(() => {
        if (!this.preventSingleClick) {
          this.fieldSelectedForAssociation.emit(this.field);
        }
      }, 250);
    }
  }

  handleDblClick(): void {
    if (this.fieldEnabled && !this.isLookupLoading) {
      this.preventSingleClick = true;
      clearTimeout(this.clickTimer);
      this.edit();
    }
  }

  loadLookup(field: string): void {
    if (field === DocumentLabelKeys.lookupLabels.CustomerAccountNumber && !this.customerAccounts) {
      this.searchText.emit({ value: this.field.value, field });
    }

    if (field === DocumentLabelKeys.lookupLabels.Supplier && !this.suppliers) {
      this.searchText.emit({ value: this.field.value, field });
    }

    if (field === DocumentLabelKeys.lookupLabels.ShipToName && !this.properties) {
      this.searchText.emit({ value: this.field.value, field });
    }

    if (field === DocumentLabelKeys.lookupLabels.OrderedBy && !this.orderedBy) {
      this.searchText.emit({ value: this.field.value, field });
    }

    if (field === DocumentLabelKeys.lookupLabels.Workflow && !this.workflow) {
      this.searchText.emit({ value: this.field.value, field });
    }
  }

  focusOut(): void {
    if (this.autocompleteTrigger.autocomplete.isOpen) {
      this.editMode = true;
    } else {
      if (!this.field.value || this.field.value.length === 0) {
        this.editMode = false;
        return;
      }
      if (!this.cleanUpData()) {
        this.handleNoSelection.emit(this.field);
        this.resetLookupDropdownData.emit();
      } else {
        this.clearFormValue();
      }
    }
  }

  autocompleteOpened(): void {
    this.autocompleteTrigger.panelClosingActions
      .pipe(
        takeUntil(this.autocompleteTrigger.autocomplete.closed),
        tap(action => {
          if (action == null) {
            this.cleanUpData() ? this.clearFormValue() : this.handleNoSelection.emit(this.field);
          }
        })
      )
      .subscribe();
  }

  cleanUpData(): boolean {
    let formValue = this.formGroupInstance.get(this.field.key).value;
    const typeFormValue = typeof formValue;
    formValue = typeFormValue === 'string' ? formValue : formValue.value;

    switch (this.field.key) {
      case DocumentLabelKeys.lookupLabels.CustomerAccountNumber:
        if (!this.customerAccountFieldValue || this.customerAccountFieldValue !== formValue) {
          return true;
        }
        break;
      case DocumentLabelKeys.lookupLabels.Supplier:
      case DocumentLabelKeys.lookupLabels.SupplierAddress:
        if (!this.supplierFieldValue || this.supplierFieldValue.vendorName !== formValue) {
          return true;
        }
        break;

      case DocumentLabelKeys.lookupLabels.ShipToName:
      case DocumentLabelKeys.lookupLabels.ShipToAddress:
        if (!this.shipToFieldValue || this.shipToFieldValue.propertyName !== formValue) {
          return true;
        }
        break;
      case DocumentLabelKeys.lookupLabels.OrderedBy:
        if (
          !this.orderedByFieldValue ||
          (this.orderedByFieldValue.firstName !== formValue.split(' ')[0] &&
            this.orderedByFieldValue.id !== formValue.split(' ')[0])
        ) {
          return true;
        }
        break;
      case DocumentLabelKeys.lookupLabels.Workflow:
        if (
          !this.workflowFieldValue ||
          (this.workflowFieldValue.name !== formValue && this.workflowFieldValue.id !== formValue)
        ) {
          return true;
        }
        break;
    }

    return false;
  }

  autocompleteClosed(): void {
    if (this.isDefaultShipToLoading) {
      return;
    }
    this.resetLookupDropdownData.emit();
  }

  optionSelected(lookupValue: LookupValue): void {
    if (lookupValue) {
      this.editMode = false;
      this.updateLookupValue.emit({ lookupValue, field: this.field.key });
    }
  }

  openCreateAccountModal(): void {
    if (
      this.field.key === DocumentLabelKeys.lookupLabels.CustomerAccountNumber &&
      this.field.value &&
      !this.latestSearchText
    ) {
      this.latestSearchText = this.field.value;
    }

    this.openAccountNumberModal.emit(this.latestSearchText);
  }

  getResultsCountLabel(count: number): string {
    return `Showing ${count} results`;
  }

  clearFormValue(): void {
    this.updateLookupValue.emit({ lookupValue: null, field: this.field.key });

    if (this.field.key === DocumentLabelKeys.lookupLabels.Supplier) {
      this.updateLookupValue.emit({
        lookupValue: null,
        field: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
      });
    }
  }

  displayValue(formValue: FieldBase<string>): string {
    return formValue.value;
  }

  private listenToFormChanges(): void {
    this.subscriptions.push(
      this.formGroupInstance
        .get(this.field.key)
        .valueChanges.pipe(
          filter((val: string) => {
            if (!val || typeof val !== 'string') {
              return false;
            }

            return this.field.key !== DocumentLabelKeys.lookupLabels.CustomerAccountNumber
              ? val.length !== 1
              : true;
          }),
          debounceTime(500),
          distinctUntilChanged(),
          tap((value: string) => {
            if (typeof value === 'string' && (value !== this.value || !value)) {
              this.latestSearchText = value.trim();
              this.searchText.emit({ value: this.latestSearchText, field: this.field.key });
            }
          })
        )
        .subscribe()
    );
  }

  private enableNextField(lastUpdatedField: string): void {
    if (
      lastUpdatedField === DocumentLabelKeys.lookupLabels.CustomerAccountNumber &&
      this.field.key === DocumentLabelKeys.lookupLabels.ShipToName &&
      this.confidence < 100
    ) {
      this.edit();
    }

    if (
      !this.latestFieldAssociation &&
      (lastUpdatedField === DocumentLabelKeys.lookupLabels.Supplier ||
        lastUpdatedField === DocumentLabelKeys.lookupLabels.SupplierAddress) &&
      this.field.key === DocumentLabelKeys.lookupLabels.CustomerAccountNumber
    ) {
      this.value = null;
      this.formGroupInstance.get(this.field.key).setValue('');
      this.edit();
    }

    if (
      (lastUpdatedField === DocumentLabelKeys.lookupLabels.ShipToName ||
        lastUpdatedField === DocumentLabelKeys.lookupLabels.ShipToAddress) &&
      this.field.key === DocumentLabelKeys.lookupLabels.Supplier &&
      this.confidence < 100
    ) {
      this.edit();
    }
  }

  private setFieldValue(): void {
    switch (this.field.key) {
      case DocumentLabelKeys.lookupLabels.CustomerAccountNumber:
        this.value = this.customerAccountFieldValue ?? this.field.value;
        break;
      case DocumentLabelKeys.lookupLabels.Supplier:
      case DocumentLabelKeys.lookupLabels.SupplierAddress:
        this.value = this.supplierFieldValue ?? this.field.value;
        break;
      case DocumentLabelKeys.lookupLabels.ShipToName:
      case DocumentLabelKeys.lookupLabels.ShipToAddress:
        this.value = this.shipToFieldValue ?? this.field.value;
        break;
      case DocumentLabelKeys.lookupLabels.OrderedBy:
        this.value = this.orderedByFieldValue ?? this.field.value;
        break;
      case DocumentLabelKeys.lookupLabels.Workflow:
        this.value = this.workflowFieldValue ?? this.field.value;
        break;
    }
  }

  private setFormFieldValue(): void {
    switch (this.field.key) {
      case DocumentLabelKeys.lookupLabels.CustomerAccountNumber:
        this.formGroupInstance.get(this.field.key).setValue(this.value);
        break;
      case DocumentLabelKeys.lookupLabels.Supplier:
        this.formGroupInstance
          .get(this.field.key)
          .setValue((this.value as LookupSupplier).vendorName);
        break;
      case DocumentLabelKeys.lookupLabels.ShipToName:
        this.formGroupInstance
          .get(this.field.key)
          .setValue((this.value as LookupProperty).propertyName);
        break;
      case DocumentLabelKeys.lookupLabels.OrderedBy:
        this.formGroupInstance.get(this.field.key).setValue(this.value);
        break;
      case DocumentLabelKeys.lookupLabels.Workflow:
        this.formGroupInstance.get(this.field.key).setValue(this.value);
        break;
    }
  }

  private checkLookupState(): boolean {
    switch (this.field.key) {
      case DocumentLabelKeys.lookupLabels.CustomerAccountNumber:
        return this.lookupLoadingState.customerAccountLoading;
      case DocumentLabelKeys.lookupLabels.Supplier:
        return this.lookupLoadingState.supplierLoading;
      case DocumentLabelKeys.lookupLabels.ShipToName:
        return this.lookupLoadingState.shipToLoading;
      case DocumentLabelKeys.lookupLabels.OrderedBy:
        return this.lookupLoadingState.orderedByLoading;
      case DocumentLabelKeys.lookupLabels.Workflow:
        return this.lookupLoadingState.workflowLoading;
    }
  }

  autoAdjustFontSize(): void {
    if (this.field.key === DocumentLabelKeys.lookupLabels.CustomerAccountNumber) {
      let size = 1;
      const valueLength = this.field.value.length;
      if (valueLength > 15 && valueLength <= 20) {
        size = size - valueLength / 100;
      } else if (valueLength > 20) {
        size = size - (valueLength / 100) * 1.5;
      }

      if (size < 0.6) {
        size = 0.6;
      }
      this.input.nativeElement.style = `font-size:${size}em`;
    }
  }
}
