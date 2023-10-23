import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  CompositeDocument,
  DocumentLabelExcludeThreshold,
  DocumentLabelKeys,
  DocumentTypes,
  FieldBase,
  IndexedLabel,
} from '@ui-coe/avidcapture/shared/types';

@Pipe({
  name: 'activityLogDisplayLabel',
})
export class ActivityLogDisplayLabelPipe implements PipeTransform {
  constructor(private store: Store) {}

  transform(
    label: IndexedLabel,
    initialLookupFieldCheck: boolean,
    initialNonLookupFieldCheck: boolean,
    documentType: DocumentTypes
  ): boolean {
    if (DocumentLabelExcludeThreshold[label.label]) {
      return true;
    }
    const compositeData: CompositeDocument =
      documentType === DocumentTypes.Indexing
        ? this.store.selectSnapshot(state => state.indexingPage?.compositeData)
        : this.store.selectSnapshot(state => state.archiveInvoicePage?.document);

    const formFields: FieldBase<string>[] =
      documentType === DocumentTypes.Indexing
        ? this.store.selectSnapshot(state => state.indexingDocumentFields?.formFields)
        : this.store.selectSnapshot(state => state.archiveInvoicePage?.formFields);

    const lookupFields: string[] = [
      DocumentLabelKeys.lookupLabels.Supplier,
      DocumentLabelKeys.lookupLabels.SupplierAddress,
      DocumentLabelKeys.lookupLabels.ShipToName,
      DocumentLabelKeys.lookupLabels.ShipToAddress,
      DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
    ];

    const canDisplayPredictedValues =
      Boolean(
        Number(
          compositeData?.indexed.labels.find(
            lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
          )?.value.text
        )
      ) ?? false;

    const canDisplayIdentifierSearchValues =
      Boolean(
        Number(
          compositeData?.indexed.labels.find(
            lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.DisplayIdentifierSearchValues
          )?.value.text
        )
      ) ?? false;

    const displayThreshold =
      formFields?.find(fld => fld.key === label.label)?.displayThreshold.view * 0.01;

    const nonLookupFieldCheck =
      initialNonLookupFieldCheck &&
      canDisplayPredictedValues &&
      lookupFields.indexOf(label.label as any) === -1 &&
      label.value.confidence >= displayThreshold;

    const lookupFieldCheck =
      initialLookupFieldCheck &&
      canDisplayPredictedValues &&
      canDisplayIdentifierSearchValues &&
      lookupFields.indexOf(label.label as any) > -1 &&
      label.value.confidence >= displayThreshold;

    return nonLookupFieldCheck || lookupFieldCheck || label.value.confidence === 1 ? true : false;
  }
}
