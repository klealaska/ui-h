import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import {
  ToastHorizontalPositions,
  ToastIconTypes,
  ToastTypes,
  ToastVerticalPositions,
} from '@ui-coe/shared/types';
import { ToastComponent } from '@ui-coe/shared/ui-v2';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(
    private snackBar: MatSnackBar,
    private readonly zone: NgZone,
    private translate: TranslateService
  ) {}

  success(message: string): void {
    this.zone.run(() =>
      this.snackBar.openFromComponent(ToastComponent, {
        duration: 5000,
        horizontalPosition: ToastHorizontalPositions.End,
        verticalPosition: ToastVerticalPositions.Top,
        data: {
          title: this.translate.instant('bkws.toast.success'),
          message,
          icon: ToastIconTypes.Success,
          type: ToastTypes.Success,
          close: true,
        },
      })
    );
  }

  error(message: string): void {
    this.zone.run(() =>
      this.snackBar.openFromComponent(ToastComponent, {
        duration: 5000,
        horizontalPosition: ToastHorizontalPositions.End,
        verticalPosition: ToastVerticalPositions.Top,
        data: {
          title: this.translate.instant('bkws.toast.error'),
          message,
          icon: ToastIconTypes.Critical,
          type: ToastTypes.Critical,
          close: true,
        },
      })
    );
  }

  warning(message: string): void {
    this.zone.run(() =>
      this.snackBar.openFromComponent(ToastComponent, {
        duration: 5000,
        horizontalPosition: ToastHorizontalPositions.End,
        verticalPosition: ToastVerticalPositions.Top,
        data: {
          title: this.translate.instant('bkws.toast.warning'),
          message,
          icon: ToastIconTypes.Warning,
          type: ToastTypes.Warning,
          close: true,
        },
      })
    );
  }

  info(message: string): void {
    this.zone.run(() =>
      this.snackBar.openFromComponent(ToastComponent, {
        duration: 5000,
        horizontalPosition: ToastHorizontalPositions.End,
        verticalPosition: ToastVerticalPositions.Top,
        data: {
          title: this.translate.instant('bkws.toast.informational'),
          message,
          icon: ToastIconTypes.Informational,
          type: ToastTypes.Informational,
          close: true,
        },
      })
    );
  }
}
