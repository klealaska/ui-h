import { UntypedFormGroup } from '@angular/forms';
import { Selector } from '@ngxs/store';
import { ClaimsQueries } from '@ui-coe/avidcapture/core/data-access';
import {
  CompositeDocument,
  ConfidenceThreshold,
  ControlTypes,
  DocumentLabelKeys,
  FieldBase,
  LookupCustomerAccount,
  LookupLoadingState,
  LookupOrderedBy,
  LookupProperty,
  LookupSupplier,
  LookupWorkflow,
  NonLookupErrorMessage,
} from '@ui-coe/avidcapture/shared/types';
import { DropdownOption } from '@ui-coe/shared/ui';

import { IndexingDocumentFieldsStateModel } from './indexing-document-fields.model';
import { IndexingDocumentFieldsState } from './indexing-document-fields.state';
import { IndexingPageSelectors } from '../indexing-page/indexing-page.selectors';

export class IndexingDocumentFieldsSelectors {
  @Selector([IndexingPageSelectors.compositeData])
  static invoiceType(compositeData: CompositeDocument): string {
    const invoiceTypeLabel = compositeData?.indexed.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceType
    );

    return invoiceTypeLabel?.value.text ?? '';
  }

  @Selector([IndexingDocumentFieldsState.data])
  static invoiceTypeConfidenceThreshold(
    state: IndexingDocumentFieldsStateModel
  ): ConfidenceThreshold {
    const invoiceTypeMetaData = state.formFields.filter(
      item => item.key === DocumentLabelKeys.nonLookupLabels.InvoiceType
    );
    return invoiceTypeMetaData[0]?.confidenceThreshold || null;
  }

  @Selector([IndexingDocumentFieldsState.data])
  static fields(state: IndexingDocumentFieldsStateModel): FieldBase<string>[] {
    return state.fields;
  }

  @Selector([IndexingDocumentFieldsState.data])
  static formFields(state: IndexingDocumentFieldsStateModel): FieldBase<string>[] {
    return state.formFields;
  }

  @Selector([IndexingDocumentFieldsState.data])
  static utilityFields(state: IndexingDocumentFieldsStateModel): string[] {
    return state.utilityFields;
  }

  @Selector([IndexingDocumentFieldsState.data])
  static formGroupInstance(state: IndexingDocumentFieldsStateModel): UntypedFormGroup {
    return state.formGroupInstance;
  }

  @Selector([IndexingDocumentFieldsState.data])
  static internalEscalationChoices(state: IndexingDocumentFieldsStateModel): DropdownOption[] {
    return state.formFields.reduce((acc, field) => {
      acc.push({
        name: field.labelDisplayName,
        value: field.key,
      });
      return acc;
    }, []);
  }

  @Selector([IndexingDocumentFieldsState.data])
  static lookupFormFields(state: IndexingDocumentFieldsStateModel): FieldBase<string>[] {
    return state.formattedFields.filter(
      field =>
        field.key === DocumentLabelKeys.lookupLabels.CustomerAccountNumber ||
        field.key === DocumentLabelKeys.lookupLabels.Supplier ||
        field.key === DocumentLabelKeys.lookupLabels.ShipToName
    );
  }

  @Selector([IndexingDocumentFieldsState.data, ClaimsQueries.editWorkflow])
  static lookupFormFieldsBottom(
    state: IndexingDocumentFieldsStateModel,
    editWorkflow: boolean
  ): FieldBase<string>[] {
    return state.formattedFields.reduce((acc, field) => {
      if (field.key === DocumentLabelKeys.lookupLabels.Workflow && !editWorkflow) {
        return acc;
      }

      if (field.controlType === ControlTypes.AutoComplete && field.order >= 15) {
        acc.push(field);
      }
      return acc;
    }, []);
  }

  @Selector([IndexingDocumentFieldsState.data])
  static nonLookupFormFields(state: IndexingDocumentFieldsStateModel): FieldBase<string>[] {
    return state.formattedFields.reduce((acc, field) => {
      if (
        field.controlType !== ControlTypes.AutoComplete &&
        field.controlType !== ControlTypes.Dropdown &&
        field.order < 15
      ) {
        acc.push(field);
      }
      return acc;
    }, []);
  }

  @Selector([IndexingDocumentFieldsState.data])
  static nonLookupFormFieldsBottom(state: IndexingDocumentFieldsStateModel): FieldBase<string>[] {
    return state.formattedFields.filter(
      field =>
        field.controlType !== ControlTypes.AutoComplete &&
        field.controlType !== ControlTypes.Dropdown &&
        field.order >= 15
    );
  }

  @Selector([IndexingDocumentFieldsState.data])
  static dropdownFields(state: IndexingDocumentFieldsStateModel): FieldBase<string>[] {
    return state.formattedFields.filter(field => field.controlType === ControlTypes.Dropdown);
  }

  @Selector([IndexingDocumentFieldsState.data])
  static customerAccounts(state: IndexingDocumentFieldsStateModel): LookupCustomerAccount[] {
    return state.customerAccounts;
  }

  @Selector([IndexingDocumentFieldsState.data])
  static properties(state: IndexingDocumentFieldsStateModel): LookupProperty[] {
    return state.properties;
  }

  @Selector([IndexingDocumentFieldsState.data])
  static suppliers(state: IndexingDocumentFieldsStateModel): LookupSupplier[] {
    return state.suppliers;
  }

  @Selector([IndexingDocumentFieldsState.data])
  static orderedBy(state: IndexingDocumentFieldsStateModel): LookupOrderedBy[] {
    return state.orderedBy;
  }

  @Selector([IndexingDocumentFieldsState.data])
  static workflow(state: IndexingDocumentFieldsStateModel): LookupWorkflow[] {
    return state.workflow;
  }

  @Selector([IndexingDocumentFieldsState.data])
  static isLookupLoading(state: IndexingDocumentFieldsStateModel): boolean {
    return state.isLookupLoading;
  }

  @Selector([IndexingDocumentFieldsState.data])
  static isDefaultShipToLoading(state: IndexingDocumentFieldsStateModel): boolean {
    return state.isDefaultShipToLoading;
  }

  @Selector([IndexingDocumentFieldsState.data])
  static lastLabelUpdated(state: IndexingDocumentFieldsStateModel): string {
    return state.lastLabelUpdated;
  }

  @Selector([IndexingDocumentFieldsState.data])
  static customerAccountFieldValue(state: IndexingDocumentFieldsStateModel): string {
    return state.customerAccountFieldValue;
  }

  @Selector([IndexingDocumentFieldsState.data])
  static selectedSupplier(state: IndexingDocumentFieldsStateModel): LookupSupplier {
    return state.selectedSupplier;
  }

  @Selector([IndexingDocumentFieldsState.data])
  static selectedProperty(state: IndexingDocumentFieldsStateModel): LookupProperty {
    return state.selectedProperty;
  }
  @Selector([IndexingDocumentFieldsState.data])
  static selectedOrderedBy(state: IndexingDocumentFieldsStateModel): LookupOrderedBy {
    return state.selectedOrderedBy;
  }

  @Selector([IndexingDocumentFieldsState.data])
  static selectedWorkflow(state: IndexingDocumentFieldsStateModel): LookupWorkflow {
    return state.selectedWorkflow;
  }

  @Selector([IndexingDocumentFieldsState.data])
  static nonLookupErrorMessage(state: IndexingDocumentFieldsStateModel): NonLookupErrorMessage {
    return state.nonLookupErrorMessage;
  }

  @Selector([IndexingDocumentFieldsState.data])
  static lookupLoadingState(state: IndexingDocumentFieldsStateModel): LookupLoadingState {
    return state.lookupLoadingState;
  }
}
