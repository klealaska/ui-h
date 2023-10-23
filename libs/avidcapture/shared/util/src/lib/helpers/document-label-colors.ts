import { DocumentLabelKeys, LabelColor } from '@ui-coe/avidcapture/shared/types';

import { AssociationColors } from './association-colors';

export const documentLabelColors: LabelColor[] = [
  {
    labelName: DocumentLabelKeys.lookupLabels.OrderedBy,
    color: AssociationColors.colors[0],
  },
  {
    labelName: DocumentLabelKeys.nonLookupLabels.InvoiceNumber,
    color: AssociationColors.colors[1],
  },
  {
    labelName: DocumentLabelKeys.lookupLabels.ShipToName,
    color: AssociationColors.colors[2],
  },
  {
    labelName: DocumentLabelKeys.lookupLabels.ShipToAddress,
    color: AssociationColors.colors[2],
  },
  {
    labelName: DocumentLabelKeys.nonLookupLabels.InvoiceDate,
    color: AssociationColors.colors[3],
  },
  {
    labelName: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
    color: AssociationColors.colors[4],
  },
  {
    labelName: DocumentLabelKeys.lookupLabels.Supplier,
    color: AssociationColors.colors[4],
  },
  {
    labelName: DocumentLabelKeys.lookupLabels.SupplierAddress,
    color: AssociationColors.colors[4],
  },
  {
    labelName: DocumentLabelKeys.lookupLabels.Workflow,
    color: AssociationColors.colors[5],
  },
  {
    labelName: DocumentLabelKeys.nonLookupLabels.Memo,
    color: AssociationColors.colors[6],
  },
  {
    labelName: DocumentLabelKeys.nonLookupLabels.InvoiceAmount,
    color: AssociationColors.colors[7],
  },
  {
    labelName: DocumentLabelKeys.nonLookupLabels.PreviousBalance,
    color: AssociationColors.colors[8],
  },
  {
    labelName: DocumentLabelKeys.nonLookupLabels.ServiceStartDate,
    color: AssociationColors.colors[9],
  },
  {
    labelName: DocumentLabelKeys.nonLookupLabels.ServiceEndDate,
    color: AssociationColors.colors[9],
  },
  {
    labelName: DocumentLabelKeys.nonLookupLabels.PurchaseOrderIdentifier,
    color: AssociationColors.colors[10],
  },
  {
    labelName: DocumentLabelKeys.nonLookupLabels.WorkOrderNo,
    color: AssociationColors.colors[11],
  },
  {
    labelName: DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride,
    color: AssociationColors.colors[12],
  },
];
