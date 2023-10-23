import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  constructor(private snackBar: MatSnackBar, private readonly zone: NgZone) {}

  success(message: string): void {
    this.zone.run(() =>
      this.snackBar.openFromComponent(ToastComponent, {
        duration: 5000,
        horizontalPosition: ToastHorizontalPositions.End,
        verticalPosition: ToastVerticalPositions.Top,
        data: {
          title: 'Success',
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
          title: 'Error',
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
          title: 'Warning',
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
          title: 'Informational',
          message,
          icon: ToastIconTypes.Informational,
          type: ToastTypes.Informational,
          close: true,
        },
      })
    );
  }
}
