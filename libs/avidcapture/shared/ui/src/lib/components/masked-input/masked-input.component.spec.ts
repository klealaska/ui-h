import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { TextBoxComponent } from '../text-box/text-box.component';
import { MaskedInputComponent } from './masked-input.component';

describe('MaskedInputComponent', () => {
  let component: MaskedInputComponent;
  let fixture: ComponentFixture<MaskedInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaskedInputComponent, MockComponent(TextBoxComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaskedInputComponent);
    component = fixture.componentInstance;
    component.isDateFormat = true;
    component.isCurrencyFormat = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updateCurrency()', () => {
    beforeEach(() => {
      jest.spyOn(component.maskInputBlur, 'emit').mockImplementation();
      component.updateCurrency('$13.37');
    });

    it('should set inputValue to 13.37', () => expect(component.inputValue).toBe('13.37'));

    it('should emit 13.37 for onMaskInputBlur', () =>
      expect(component.maskInputBlur.emit).toHaveBeenCalledWith('13.37'));

    describe('When amount has more than 2 decimals', () => {
      beforeEach(() => {
        jest.spyOn(component.maskInputBlur, 'emit').mockImplementation();
        component.updateCurrency('13.379');
      });

      describe('When decimals end between 5 and 9', () => {
        it('should round up to 2 decimals', () => {
          expect(component.inputValue).toBe('13.38');
        });

        it('should emit 13.37 for onMaskInputBlur', () =>
          expect(component.maskInputBlur.emit).toHaveBeenCalledWith('13.38'));
      });

      describe('When decimals end between 1 and 4', () => {
        beforeEach(() => {
          jest.spyOn(component.maskInputBlur, 'emit').mockImplementation();
          component.updateCurrency('13.374');
        });
        it('should round down to 2 decimals', () => {
          expect(component.inputValue).toBe('13.37');
        });

        it('should emit 13.37 for onMaskInputBlur', () =>
          expect(component.maskInputBlur.emit).toHaveBeenCalledWith('13.37'));
      });
    });
  });

  describe('updateDate()', () => {
    describe('parse date', () => {
      beforeEach(() => {
        jest.spyOn(component.maskInputBlur, 'emit').mockImplementation();
        component.updateDate('10/10/2020');
      });

      it('should set inputValue to 10/10/2020', () =>
        expect(component.inputValue).toBe('10/10/2020'));

      it('should emit 10/10/2020 for onMaskInputBlur', () =>
        expect(component.maskInputBlur.emit).toHaveBeenCalledWith('10/10/2020'));
    });

    describe('when value only has day and month', () => {
      beforeEach(() => {
        component.updateDate('10/10');
      });

      it('should set inputValue to 10/10/2022', () =>
        expect(component.inputValue).toEqual(`10/10/${new Date().getFullYear()}`));
    });

    describe('parse numbers', () => {
      beforeEach(() => {
        jest.spyOn(component.maskInputBlur, 'emit').mockImplementation();
        component.updateDate('02232011');
      });

      it('should transform only numbers to a valid date', () =>
        expect(component.inputValue).toBe('02/23/2011'));
    });
  });

  describe('handleMaskInputFocus()', () => {
    describe('when is DateFormat but not a valid date', () => {
      beforeEach(() => {
        jest.spyOn(component.maskInputFocus, 'emit').mockImplementation();
        component.handleMaskInputFocus('' as any);
      });

      it('should emit an event of {} for onMaskInputFocus', () =>
        expect(component.maskInputFocus.emit).toHaveBeenCalledWith(null as any));
    });

    describe('when is DateFormat and is a valid date', () => {
      beforeEach(() => {
        jest.spyOn(component.maskInputFocus, 'emit').mockImplementation();
        component.handleMaskInputFocus('10/02/2020');
      });

      it('should emit date for onMaskInputFocus', () =>
        expect(component.maskInputFocus.emit).toHaveBeenCalledWith('10/02/2020'));
    });
  });

  describe('handleGlobalDateFormatToUS()', () => {
    describe('when receives date on format dd/MM/yyyy', () => {
      it('should change the format to MM/dd/yyyy', () => {
        expect(component.handleGlobalDateFormatToUS('28/11/2022')).toBe('11/28/2022');
      });
    });

    describe('when receives date on format MM/dd/yyyy', () => {
      it('should return the same value', () => {
        expect(component.handleGlobalDateFormatToUS('11/11/2020')).toBe('11/11/2020');
      });
    });

    describe('when receives unparseable date', () => {
      it('should returns null', () => {
        expect(component.handleGlobalDateFormatToUS('34/12/2020')).toBeNull();
      });

      describe('when receives a no date value', () => {
        it('should returns null', () => {
          expect(component.handleGlobalDateFormatToUS('noDate')).toBeNull();
        });
      });
    });
  });

  describe('handleMonthDayFormat()', () => {
    describe('when receives date on format dd/MM', () => {
      it('should change the format to MM/dd/yyyy', () => {
        expect(component.handleMonthDayFormat('28/11')).toBe(`11/28/${new Date().getFullYear()}`);
      });
    });

    describe('when receives date on format MM/dd', () => {
      it('should change the format to MM/dd/yyyy', () => {
        expect(component.handleMonthDayFormat('11/11')).toBe(`11/11/${new Date().getFullYear()}`);
      });
    });

    describe('when receives unparseable date', () => {
      it('should returns null', () => {
        expect(component.handleMonthDayFormat('34/12')).toBeNull();
      });

      describe('when receives a no date value', () => {
        it('should returns null', () => {
          expect(component.handleMonthDayFormat('noDate')).toBeNull();
        });
      });
    });
  });

  describe('handleNumberDate()', () => {
    describe('when receives date on format ddMMyyyy', () => {
      it('should change the format to MM/dd/yyyy', () => {
        expect(component.handleNumberDate('28112022')).toBe('11/28/2022');
      });
    });

    describe('when receives date on format MMddyyyy', () => {
      it('should return the same value', () => {
        expect(component.handleNumberDate('11112020')).toBe('11/11/2020');
      });
    });

    describe('when receives unparseable date', () => {
      it('should returns null', () => {
        expect(component.handleNumberDate('34122020')).toBeNull();
      });

      describe('when receives a no date value', () => {
        it('should returns null', () => {
          expect(component.handleNumberDate('noDate')).toBeNull();
        });
      });
    });
  });

  describe('handleMinYear()', () => {
    describe('when receives a date 50 year old', () => {
      it('should return null', () => {
        expect(component.handleMinYear('01/01/0223')).toBeNull();
      });
    });

    describe('When receives a date less than 50 years old', () => {
      it('should return formatted value', () => {
        expect(component.handleMinYear('01/01/2022')).toBe('01/01/2022');
      });
    });
  });

  describe('handleEuropeanCurrencyFormat()', () => {
    describe('When amount is on European format', () => {
      it('should return US currency format', () => {
        expect(component.handleEuropeanCurrencyFormat('123.123,12')).toBe('$123,123.12');
      });
    });

    describe('When amount is negative', () => {
      it('should return US currency format', () => {
        expect(component.handleEuropeanCurrencyFormat('-123.123,12')).toBe('-$123,123.12');
      });
    });

    describe('when negative symbol is at the end', () => {
      it('should return US currency format', () => {
        expect(component.handleEuropeanCurrencyFormat('123.123,12-')).toBe('-$123,123.12');
      });
    });

    describe('When amount has CR at the end', () => {
      it('should return US currency format', () => {
        expect(component.handleEuropeanCurrencyFormat('123.12CR')).toBe('-123.12');
      });
    });

    describe('When amount has CR with spaces at the end', () => {
      it('should return US currency format', () => {
        expect(component.handleEuropeanCurrencyFormat('123.12  CR')).toBe('-123.12');
      });
    });

    describe('When amount has cR with spaces at the end', () => {
      it('should return US currency format', () => {
        expect(component.handleEuropeanCurrencyFormat('123.12  cR')).toBe('-123.12');
      });
    });

    describe('When amount has cr with spaces at the end', () => {
      it('should return US currency format', () => {
        expect(component.handleEuropeanCurrencyFormat('123.12  cr')).toBe('-123.12');
      });
    });

    describe('When amount has CREDIT at the end', () => {
      it('should return US currency format', () => {
        expect(component.handleEuropeanCurrencyFormat('123.12  CREDIT')).toBe('123.12');
      });
    });

    describe('when has multiple points sepration', () => {
      it('should return US currency format', () => {
        expect(component.handleEuropeanCurrencyFormat('123456789')).toBe('123456789');
      });
    });

    describe('when value is null', () => {
      it('should return null', () => {
        expect(component.handleEuropeanCurrencyFormat(null)).toBe('');
      });
    });

    describe('when value is empty', () => {
      it('should return empty string', () => {
        expect(component.handleEuropeanCurrencyFormat('')).toBe('');
      });
    });

    describe('when value is undefined', () => {
      it('should return empty string', () => {
        expect(component.handleEuropeanCurrencyFormat(undefined)).toBe('');
      });
    });

    describe('when value is 29,03', () => {
      it('should returns US currency format', () => {
        expect(component.handleEuropeanCurrencyFormat('29,03')).toBe('$29.03');
      });
    });

    describe('when value is 29,1', () => {
      it('should returns US currency format', () => {
        expect(component.handleEuropeanCurrencyFormat('29,1')).toBe('29.1');
      });
    });

    describe('when value is 3.516,58', () => {
      it('should returns US currency format', () => {
        expect(component.handleEuropeanCurrencyFormat('3.516,58')).toBe('$3,516.58');
      });
    });

    describe('when value is 29,200.00', () => {
      it('should returns US currency format', () => {
        expect(component.handleEuropeanCurrencyFormat('29,200.00')).toBe('29,200.00');
      });
    });

    describe('when value is 29,200', () => {
      it('should returns US currency format', () => {
        expect(component.handleEuropeanCurrencyFormat('29,200')).toBe('29,200');
      });
    });
  });
});
