import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  constructor(private _snackBar: MatSnackBar) {}

  open(message: string, duration: number): void {
    const horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    const verticalPosition: MatSnackBarVerticalPosition = 'top';
    this._snackBar.open(message, 'dismiss', {
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      duration: duration * 1000,
    });
  }
}
