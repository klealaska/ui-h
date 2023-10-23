import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';

import { TenantService } from '../services';
import { SiteNameValidator } from './site-name.validator';
import { ConfigService } from '@ui-coe/shared/util/services';

describe('SiteNameValidator', () => {
  let validator: SiteNameValidator;
  let tenantService: TenantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SiteNameValidator, ConfigService],
    });

    validator = TestBed.inject(SiteNameValidator);
    tenantService = TestBed.inject(TenantService);
  });

  it('should create', () => {
    expect(validator).toBeTruthy();
  });

  it('should set originalValue if control is pristine', () => {
    const control = {
      pristine: true,
      value: 'foo',
    } as AbstractControl;

    validator.validate(control);
    expect(validator['_originalValue']).toBe(control.value);
  });

  it('should return an observable of null if control is pristine', () => {
    const control = {
      pristine: true,
    } as AbstractControl;

    const expected = cold('(a|)', { a: null });

    expect(validator.validate(control)).toBeObservable(expected);
  });

  it('should return an observable of null if control is the same as the original value', () => {
    validator['_originalValue'] = 'foo';

    const control = {
      pristine: false,
      value: 'foo',
    } as AbstractControl;

    const expected = cold('(a|)', { a: null });

    expect(validator.validate(control)).toBeObservable(expected);
  });

  it('should return an observable of null if siteName does not exist', () => {
    validator['_originalValue'] = '';

    const control = {
      pristine: false,
      value: 'foo',
    } as AbstractControl;

    const expected = cold('(a|)', { a: null });

    jest.spyOn(tenantService, 'getTenantData').mockReturnValue(
      of({
        itemsRequested: 1,
        itemsReturned: 0,
        itemsTotal: 0,
        offset: 0,
        items: [],
      })
    );

    expect(validator.validate(control)).toBeObservable(expected);
  });

  it('should return an observable of { siteNameExists: true } if siteName does exist', () => {
    validator['_originalValue'] = '';

    const control = {
      pristine: false,
      value: 'foo',
    } as AbstractControl;

    const expected = cold('(a|)', { a: { siteNameExists: true } });

    jest.spyOn(tenantService, 'getTenantData').mockReturnValue(
      of({
        itemsRequested: 1,
        itemsReturned: 0,
        itemsTotal: 0,
        offset: 0,
        items: [
          {
            tenantId: 'asdf',
            tenantStatus: 'active',
            siteName: 'foo',
            createdDate: '01/01/1970',
          },
        ],
      })
    );

    expect(validator.validate(control)).toBeObservable(expected);
  });
});
