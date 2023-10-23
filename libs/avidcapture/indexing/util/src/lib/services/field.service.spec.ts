import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { fieldControlStub } from '@ui-coe/avidcapture/shared/test';
import { FieldBase } from '@ui-coe/avidcapture/shared/types';
import { of } from 'rxjs';

import { FieldService } from './field.service';

const httpStub = {
  get: (): any => of([fieldControlStub]),
};

describe('FieldService', () => {
  let service: FieldService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: httpStub,
        },
      ],
    });
    service = TestBed.inject(FieldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFormFieldMetaData()', () => {
    describe('when successfully getting data', () => {
      it('should define some form field meta data', () => {
        service.getFormFieldMetaData().subscribe(data => expect(data).toBeDefined());
      });
    });
  });

  describe('parseFieldMetaData()', () => {
    describe('when controlType is a textbox', () => {
      it('should return fieldControlStub', done => {
        service.parseFieldMetaData('', fieldControlStub).subscribe(data => {
          expect(data).toBeDefined();
          done();
        });
      });
    });

    describe('when controlType is a textarea', () => {
      beforeEach(() => {
        fieldControlStub[0].controlType = 'textarea';
      });

      it('should return fieldControlStub', done => {
        service.parseFieldMetaData('', fieldControlStub).subscribe(data => {
          expect(data).toBeDefined();
          done();
        });
      });
    });

    describe('when controlType is a autocomplete', () => {
      beforeEach(() => {
        fieldControlStub[0].controlType = 'autocomplete';
      });

      it('should return fieldControlStub', done => {
        service.parseFieldMetaData('', fieldControlStub).subscribe(data => {
          expect(data).toBeDefined();
          done();
        });
      });
    });

    describe('when controlType is a dropdown', () => {
      beforeEach(() => {
        fieldControlStub[0].controlType = 'dropdown';
      });

      it('should return fieldControlStub', done => {
        service.parseFieldMetaData('', fieldControlStub).subscribe(data => {
          expect(data).toBeDefined();
          done();
        });
      });
    });

    describe('when filterData is true ', () => {
      beforeEach(() => {
        fieldControlStub[0].controlType = 'autocomplete';
      });

      it('should return fieldControlStub', done => {
        service.parseFieldMetaData('', fieldControlStub, true).subscribe(data => {
          expect(data).toBeDefined();
          done();
        });
      });
    });

    describe('when filterData is true & invoiceType is passed in', () => {
      beforeEach(() => {
        fieldControlStub[0].controlType = 'textbox';
        fieldControlStub[0].fieldType = '';
      });

      it('should return fieldControlStub', done => {
        service.parseFieldMetaData('advanced', fieldControlStub, true).subscribe(data => {
          expect(data).toBeDefined();
          done();
        });
      });
    });

    describe('set FieldBase default values', () => {
      it('should set deafult values for textbox field when no config values are set', () => {
        const configStub = {
          fieldType: 'default',
          key: undefined,
          value: undefined,
          controlType: undefined,
          confidence: undefined,
          displayThreshold: undefined,
          confidenceThreshold: undefined,
          type: undefined,
          required: undefined,
          regEx: undefined,
          labelDisplayName: undefined,
          headerBackgroundColor: undefined,
          headerTextColor: undefined,
          order: undefined,
          maxLength: undefined,
        };

        const fieldBase = new FieldBase(configStub);

        expect(fieldBase.key).toBe('');
        expect(fieldBase.displayThreshold.view).toBe(0);
        expect(fieldBase.displayThreshold.readonly).toBe(0);
        expect(fieldBase.controlType).toBe('');
        expect(fieldBase.type).toBe('');
        expect(fieldBase.labelDisplayName).toBe('');
        expect(fieldBase.headerBackgroundColor).toBe('none');
        expect(fieldBase.headerTextColor).toBe('default');
        expect(fieldBase.order).toBe(1);
      });

      it('should set a default htmlId when key is not a valid value', () => {
        const fieldControlMock = fieldControlStub[0];
        fieldControlMock.key = '--()&^';

        const fieldBase = new FieldBase(fieldControlMock);
        const dateTime = new Date().getTime().toString();
        expect(fieldBase.htmlId.substr(0, 6)).toBe(dateTime.substr(0, 6));
      });
    });

    describe('Filter data fields', () => {
      it('Should filter data fields when flag is falte', () => {
        service
          .parseFieldMetaData('', fieldControlStub)
          .subscribe(data => expect(data.length).toBe(14));
      });

      it('Should not filter data fields when flag is true', () => {
        service
          .parseFieldMetaData('', fieldControlStub)
          .subscribe(data => expect(data.length).toBe(11));
      });
    });
  });
});
