import { TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';

import { AxToastService } from './ax-toast.service';
import { AxToastConfig } from '../models/ax-toast';

export const toastrStub = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
};

const overrideConfigStub: AxToastConfig = {
  closeButton: true,
  timeOut: 10000,
  positionClass: 'toast-top-left',
  tapToDismiss: true,
};

describe('AxToastService', () => {
  let service: AxToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ToastrService,
          useValue: toastrStub,
        },
      ],
    });
    service = TestBed.inject(AxToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('open()', () => {
    describe('when toastr is a success', () => {
      beforeEach(() => {
        service.open('Success Message', 'success');
      });

      it('should call the success function', () => expect(toastrStub.success).toHaveBeenCalled());
    });

    describe('when toastr is an error', () => {
      beforeEach(() => {
        service.open('Error Message', 'error');
      });

      it('should call the error function', () => expect(toastrStub.error).toHaveBeenCalled());
    });

    describe('when toastr is a warning', () => {
      beforeEach(() => {
        service.open('Warning Message', 'warning');
      });

      it('should call the warning function', () => expect(toastrStub.warning).toHaveBeenCalled());
    });

    describe('when toastr is an info', () => {
      beforeEach(() => {
        service.open('Info Message', 'info');
      });

      it('should call the info function', () => expect(toastrStub.info).toHaveBeenCalled());
    });

    describe('when toastr has to hit default switch case', () => {
      beforeEach(() => {
        service.open('Default Message', 'mock');
      });

      it('should call the success function', () => expect(toastrStub.success).toHaveBeenCalled());
    });

    describe('when toastr has to hit default switch case', () => {
      beforeEach(() => {
        service.open('Default Message', 'mock');
      });

      it('should call the success function', () => expect(toastrStub.success).toHaveBeenCalled());
    });
  });

  describe('replaceDefaults()', () => {
    describe('when no properties to be overriden are given', () => {
      it('should return defaultConfig', () =>
        expect(service.replaceDefaults(service.defaultConfig)).toEqual(service.defaultConfig));
    });

    describe('when properties to override are given', () => {
      it('should return the overrideConfigStub', () =>
        expect(service.replaceDefaults(overrideConfigStub)).toEqual(overrideConfigStub));
    });
  });
});
