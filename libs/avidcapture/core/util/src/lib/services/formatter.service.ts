import { Injectable } from '@angular/core';
import {
  DocumentLabelKeys,
  FieldBase,
  InputDataTypes,
  Integer,
} from '@ui-coe/avidcapture/shared/types';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class FormatterService {
  getSanitizedFieldValue(field: FieldBase<string>, value: string, isSponsorUser = false): string {
    if (!value) return value;
    switch (field.type) {
      case InputDataTypes.Date:
        return this.getFormattedDate(value);
      case InputDataTypes.Currency:
        return this.getCurrencyDouble(value);
      default:
        return this.sanitizeSpecialChars(value, field.key, isSponsorUser);
    }
  }

  getFormattedFieldValue(field: FieldBase<string>, value: string, isSponsorUser = false): string {
    if (!value) return value;

    switch (field.type) {
      case InputDataTypes.Date:
        return this.getFormattedDate(value);
      case InputDataTypes.Currency:
        return this.getFormattedCurrency(value);
      default:
        return this.sanitizeSpecialChars(value, field.key, isSponsorUser);
    }
  }

  handleGlobalDateFormatToUS(date: string): string {
    if (!date) {
      return null;
    }
    const isValidDate = DateTime.fromFormat(date, 'MM/dd/yyyy');
    if (isValidDate.invalidReason && isValidDate.invalidReason != 'unparsable') {
      const isGlobalFormat = DateTime.fromFormat(date, 'dd/MM/yyyy');
      if (!isGlobalFormat.invalidReason) {
        return isGlobalFormat.toFormat('MM/dd/yyyy');
      } else {
        return null;
      }
    } else if (isValidDate.invalidReason === 'unparsable') {
      return null;
    } else {
      return date;
    }
  }

  handleMaxFieldLength(value: string, length: number): string {
    return value.substring(0, length);
  }

  sanitizeSpecialChars(value: string, key: string, isIndexer = false): string {
    if (key !== DocumentLabelKeys.nonLookupLabels.InvoiceNumber) {
      return value;
    } else {
      const regexInvoiceNumber = isIndexer ? /[^a-zA-Z-/_().:,0-9]/g : /[^a-zA-Z-/_().:,*0-9]/g;
      value = value.replace(/[\u2010\u2212\u2013]/g, '-');
      value = value.replace(regexInvoiceNumber, ' ');
      value = value.replace(/\s+/g, ' ');
      return value;
    }
  }

  private getFormattedCurrency(value: string): string {
    if (!value) {
      return '';
    }
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return formatter.format(Number(this.getCurrencyDouble(value)));
  }

  private getFormattedDate(value: string): string {
    const val = value.replace(/-/g, ' ');
    let date: DateTime;

    if (this.handleOrdinalDateFormatToUS(val)) {
      date = DateTime.fromJSDate(new Date(this.handleOrdinalDateFormatToUS(val)));
    } else if (value.length === 6) {
      date = DateTime.fromFormat(value, 'MMddyy');
    } else if (this.handleGlobalDateFormatToUS(value)) {
      date = DateTime.fromJSDate(new Date(this.handleGlobalDateFormatToUS(value)));
    } else {
      date = DateTime.fromJSDate(new Date(val));
    }

    if (
      !date.isValid ||
      (date.year === 2001 && !value.split('/').includes('2001')) ||
      !this.minYearValidator(date.toFormat('MM/dd/yyyy')) ||
      !this.maxYearValidator(date.toFormat('MM/dd/yyyy'))
    ) {
      return null;
    }

    return date.toFormat('MM/dd/yyyy');
  }

  getCurrencyDouble(value: string): string {
    // checking value for parenthesis wrapped numbers
    const isNegative = new RegExp(/\(([^)]+)\)/g).test(value) ? '-' : '';
    value = this.handleEuropeanCurrencyFormat(value);
    value = value.replace(/[^-0-9.]/g, '');

    if (value?.endsWith('-')) {
      value = `-${value.replace('-', '')}`;
    }

    value = value.startsWith('-') ? value : `${isNegative}${value}`;

    return !value || value === '.' || isNaN(Number(value)) || Number(value) > Integer.MAX_LIMIT
      ? ''
      : parseFloat(value).toFixed(2);
  }

  private minYearValidator(date: string): boolean {
    const minYear = 1970;
    if (new Date(date).getFullYear() < minYear) {
      return false;
    }
    return true;
  }

  maxYearValidator(date: string): boolean {
    const maximumDate = DateTime.now().plus({ year: 25 });

    if (new Date(date).getFullYear() > maximumDate.year) {
      return false;
    }
    return true;
  }

  handleEuropeanCurrencyFormat(value: string): string {
    if (!value) {
      return '';
    }
    value = value.replace('$', '');
    const regexEuropean = /^\d{1,3}(?:\.\d{3})*(?:,\d{2})$/;
    const regexComa = /^(\d+(,{1}\d{1,2})?)$/;
    const regexIsNegative = /^-|-$|[cC][rR]$/;
    const isNegative = regexIsNegative.test(value) ? '-' : '';
    value = value.replace(/^-|-$|[a-zA-Z]+$/, '');

    if (regexEuropean.test(value)) {
      const numericPart = value.replace(/\./g, '').replace(',', '.');
      value = parseFloat(numericPart).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    } else {
      if (regexComa.test(value)) {
        value = value.replace(',', '.');
      }
    }

    return `${isNegative}${value}`;
  }

  handleOrdinalDateFormatToUS(date: string): string {
    const suffixRegex = /(th|st|nd|rd)(,)?(?=\s|$)/i;
    if (suffixRegex.test(date)) {
      const cleanDateStr = date.replace(suffixRegex, '');
      const formatDate = DateTime.fromFormat(cleanDateStr, 'LLL d yyyy');

      if (formatDate.isValid) {
        return formatDate.toFormat('MM/dd/yyyy');
      }
    }
    return null;
  }

  toPascalCase(text: string): string {
    const words = text.split(/\s+/);
    const pascalCaseWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    const pascalCaseText = pascalCaseWords.join(' ');
    return pascalCaseText;
  }
}
