import { SimpleChange } from '@angular/core';
import { InputDirective } from './input.directive';
import { FormControl } from '@angular/forms';

describe('InputDirective', () => {
  const directive = new InputDirective();

  beforeEach(async () => {
    directive.control = new FormControl({ value: '', disabled: false });
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('If readonly is changed control should be disabled', () => {
      directive.readonly = true;
      directive.ngOnChanges({
        readonly: new SimpleChange(false, directive.readonly, directive.readonly),
      });
      expect(directive.control.disabled).toBeTruthy();
    });

    it('If readonly is not changed disabled should be false', () => {
      directive.ngOnChanges({});
      expect(directive.control.disabled).toBeFalsy();
    });
  });
});
