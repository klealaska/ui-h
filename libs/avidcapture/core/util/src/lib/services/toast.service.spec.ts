import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ToastHorizontalPositions,
  ToastIconTypes,
  ToastTypes,
  ToastVerticalPositions,
} from '@ui-coe/shared/types';

import { ToastService } from './toast.service';

const matSnackBarStub = {
  openFromComponent: jest.fn(),
};

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MatSnackBar,
          useValue: matSnackBarStub,
        },
      ],
    });
    service = TestBed.inject(ToastService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success()', () => {
    beforeEach(() => {
      service.success('mock');
    });

    it('should open a snackbar with success traits', () =>
      expect(matSnackBarStub.openFromComponent).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({
          duration: 5000,
          horizontalPosition: ToastHorizontalPositions.End,
          verticalPosition: ToastVerticalPositions.Top,
          data: {
            title: 'Success',
            message: 'mock',
            icon: ToastIconTypes.Success,
            type: ToastTypes.Success,
            close: true,
          },
        })
      ));
  });

  describe('error()', () => {
    beforeEach(() => {
      service.error('mock');
    });

    it('should open a snackbar with success traits', () =>
      expect(matSnackBarStub.openFromComponent).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({
          duration: 5000,
          horizontalPosition: ToastHorizontalPositions.End,
          verticalPosition: ToastVerticalPositions.Top,
          data: {
            title: 'Error',
            message: 'mock',
            icon: ToastIconTypes.Critical,
            type: ToastTypes.Critical,
            close: true,
          },
        })
      ));
  });

  describe('warning()', () => {
    beforeEach(() => {
      service.warning('mock');
    });

    it('should open a snackbar with success traits', () =>
      expect(matSnackBarStub.openFromComponent).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({
          duration: 5000,
          horizontalPosition: ToastHorizontalPositions.End,
          verticalPosition: ToastVerticalPositions.Top,
          data: {
            title: 'Warning',
            message: 'mock',
            icon: ToastIconTypes.Warning,
            type: ToastTypes.Warning,
            close: true,
          },
        })
      ));
  });

  describe('info()', () => {
    beforeEach(() => {
      service.info('mock');
    });

    it('should open a snackbar with success traits', () =>
      expect(matSnackBarStub.openFromComponent).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({
          duration: 5000,
          horizontalPosition: ToastHorizontalPositions.End,
          verticalPosition: ToastVerticalPositions.Top,
          data: {
            title: 'Informational',
            message: 'mock',
            icon: ToastIconTypes.Informational,
            type: ToastTypes.Informational,
            close: true,
          },
        })
      ));
  });
});
