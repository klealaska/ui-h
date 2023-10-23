enum reason {
  ShipToField = 'Ship To Field',
  SupplierField = 'Supplier Field',
  InvoiceAmountField = 'Invoice Amount Field',
  InvoiceNonInvoice = 'Invoice vs Non-Invoice',
  Other = 'Other',
}

enum duplicateDetection {
  AvidCapture = 'Duplicate Detected In AvidCapture',
  AvidInvoice = 'Duplicate Detected In AvidInvoice',
  AvidCaptureAndAvidInvoice = 'Duplicate Detected In AvidCapture & AvidInvoice',
}

export const escalationCategoryReasonTypes = { reason, duplicateDetection };

export type escalationCategoryReasonTypes = typeof escalationCategoryReasonTypes;
