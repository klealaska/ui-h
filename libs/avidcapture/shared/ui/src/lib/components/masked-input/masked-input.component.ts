import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { DateTime } from 'luxon';

@Component({
  selector: 'xdc-masked-input',
  templateUrl: './masked-input.component.html',
  providers: [CurrencyPipe],
  encapsulation: ViewEncapsulation.None,
})
export class MaskedInputComponent {
  @Input() inputValue: any;
  @Input() isCurrencyFormat: boolean;
  @Input() isDateFormat: boolean;
  @Input() width: number;
  @Input() hasFocus = false;
  @Input() required: boolean;
  @Input() pattern: string;
  @Input() disabled: boolean;
  @Output() maskInputBlur = new EventEmitter<string>();
  @Output() maskInputFocus = new EventEmitter<string>();

  minDifferenceYears = 50;

  updateCurrency(value: string): void {
    value = parseFloat(this.getCurrencytrimValue(value)).toFixed(2);
    this.inputValue = value;
    this.maskInputBlur.emit(value);
  }

  updateDate(value: string): void {
    value = value.replace(/[\s-]/g, '/');
    if (!this.isValidDate(value)) {
      if (this.handleGlobalDateFormatToUS(value)) {
        this.inputValue = this.handleGlobalDateFormatToUS(value);
      } else if (this.handleMonthDayFormat(value)) {
        this.inputValue = this.handleMonthDayFormat(value);
      } else if (this.handleNumberDate(value)) {
        this.inputValue = this.handleNumberDate(value);
      } else {
        this.inputValue = null;
      }
    } else {
      this.inputValue = value;
    }

    this.inputValue = this.handleMinYear(this.inputValue);

    value = this.inputValue;
    this.maskInputBlur.emit(value);
  }

  handleMaskInputFocus(value: string): void {
    if (this.isDateFormat) {
      value = value.replace(/[\s-]/g, '/');
      if (!this.isValidDate(value)) {
        if (this.handleGlobalDateFormatToUS(value)) {
          this.inputValue = this.handleGlobalDateFormatToUS(value);
        } else if (this.handleMonthDayFormat(value)) {
          this.inputValue = this.handleMonthDayFormat(value);
        } else if (this.handleNumberDate(value)) {
          this.inputValue = this.handleNumberDate(value);
        } else {
          this.inputValue = null;
        }
      } else {
        this.inputValue = value;
      }
    }
    this.inputValue = this.handleMinYear(this.inputValue);

    value = this.inputValue;
    this.maskInputFocus.emit(value);
  }

  getCurrencytrimValue(value: string): string {
    value = this.handleEuropeanCurrencyFormat(value);
    return value ? value.replace('$', '').replace(/,/g, '') : value;
  }

  private isValidDate(value: string): boolean {
    const date = DateTime.fromJSDate(new Date(value));
    if (!date.isValid || (date.year === 2001 && !value.split('/').includes('2001'))) {
      return false;
    }

    return true;
  }

  handleNumberDate(date: string): string {
    const isValidDate = DateTime.fromFormat(date, 'MMddyyyy');
    if (isValidDate.invalidReason && isValidDate.invalidReason != 'unparsable') {
      const isGlobalFormat = DateTime.fromFormat(date, 'ddMMyyyy');
      if (!isGlobalFormat.invalidReason) {
        return isGlobalFormat.toFormat('MM/dd/yyyy');
      } else {
        return null;
      }
    } else if (isValidDate.invalidReason === 'unparsable') {
      return null;
    } else {
      return isValidDate.toFormat('MM/dd/yyyy');
    }
  }

  handleMonthDayFormat(date: string): string {
    if (date.split('/')[0].length === 1) {
      date = `0${date}`;
    }
    const isValidDate = DateTime.fromFormat(date, 'MM/dd');

    if (isValidDate.invalidReason === 'unit out of range') {
      const isGlobalFormat = DateTime.fromFormat(date, 'dd/MM');
      if (!isGlobalFormat.invalidReason) {
        return isGlobalFormat.toFormat('MM/dd/yyyy');
      } else {
        return null;
      }
    } else if (isValidDate.invalidReason === 'unparsable') {
      return null;
    } else {
      return isValidDate.toFormat('MM/dd/yyyy');
    }
  }

  handleGlobalDateFormatToUS(date: string): string {
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

  handleMinYear(date: string): string {
    const currentDate = new Date();
    const differenceYears = currentDate.getFullYear() - new Date(date).getFullYear();

    if (differenceYears > this.minDifferenceYears) {
      date = null;
    }

    return date;
  }

  handleEuropeanCurrencyFormat(value: string = ''): string {
    if (!value) {
      return '';
    }
    value = value.replace('$', '');
    const regexComa = /^(\d+(,{1}\d{1,2})?)$/;
    const regexEuropean = /^\d{1,3}(?:\.\d{3})*(?:,\d{2})$/;
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

    return `${isNegative}${value?.trim()}`;
  }
}
