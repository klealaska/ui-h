import { Injectable } from '@angular/core';
import { FormatterService } from '@ui-coe/avidcapture/core/util';
import { FieldBase, LookupPaymentTerms } from '@ui-coe/avidcapture/shared/types';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class PaymentTermService {
  constructor(private formatterService: FormatterService) {}

  getDueDate(
    field: FieldBase<string>,
    invoiceDate: string,
    paymentTerm: LookupPaymentTerms
  ): string {
    const sanitizedValue = this.formatterService.getSanitizedFieldValue(field, invoiceDate);
    const date = DateTime.fromFormat(sanitizedValue, 'MM/dd/yyyy');

    const paymentTerms = this.getPaymentTerm(paymentTerm);

    if (!paymentTerms) {
      return null;
    }

    let utcInvoiceDate = null;
    let newUTCDueDate = null;

    const beginTimezoneOffset = date.offset * 60 * 1000;
    const endDateTimezoneOffset =
      date.plus({ days: paymentTerms.numberDaysUntilDue }).offset * 60 * 1000;

    if (paymentTerms.isEndOfMonth) {
      let newDate = date.plus({ months: 1 }).set({ day: 0, hour: 12, minute: 0, second: 0 });
      newDate = newDate.plus({ days: paymentTerms.numberDaysUntilDue });

      newUTCDueDate = newDate.plus({ milliseconds: beginTimezoneOffset });
    } else {
      utcInvoiceDate = date.plus({ milliseconds: beginTimezoneOffset });
      newUTCDueDate = utcInvoiceDate.plus({ days: paymentTerms.numberDaysUntilDue });
    }
    const newDueDate = newUTCDueDate.minus({ milliseconds: endDateTimezoneOffset });
    return newDueDate.toFormat('MM/dd/yy');
  }

  getPaymentTerm(paymentTerm: LookupPaymentTerms): LookupPaymentTerms {
    const paymentTerms = window.localStorage.getItem('paymentTerms');

    if (paymentTerms) {
      const terms = JSON.parse(paymentTerms);
      if (paymentTerm.termTypeId === 0 && paymentTerm.termTypeName) {
        return terms.find(ter => ter.termTypeName === paymentTerm.termTypeName) ?? null;
      } else {
        return terms.find(ter => ter.termTypeId === paymentTerm.termTypeId) ?? null;
      }
    }

    return null;
  }
}
