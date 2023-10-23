import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ToastHorizontalPositions,
  ToastIconTypes,
  ToastTypes,
  ToastVerticalPositions,
} from '@ui-coe/shared/types';

import { ToastService } from './toast-service';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { of } from 'rxjs';
import { Dictionary } from '@ngrx/entity';

const matSnackBarStub = {
  openFromComponent: jest.fn(),
};

export class TranslateServiceStub {
  public get(key: any): any {
    const stubObject: Dictionary<string> = {
      'bkws.toast.success': 'Success',
      'bkws.toast.error': 'Error',
    };
    return of(stubObject[key]);
  }

  public instant(key: any): any {
    const stubObject: Dictionary<string> = {
      'bkws.toast.success': 'Success',
      'bkws.toast.error': 'Error',
      'bkws.toast.informational': 'Informational',
      'bkws.toast.warning': 'Warning',
    };
    return stubObject[key];
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../../assets/i18n/', '.json');
}

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient],
          },
          defaultLanguage: 'en',
        }),
      ],
      providers: [
        {
          provide: MatSnackBar,
          useValue: matSnackBarStub,
        },
        { provide: TranslateService, useClass: TranslateServiceStub },
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
