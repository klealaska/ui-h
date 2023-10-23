import { Injectable } from '@angular/core';
import { AxToastService } from '@ui-coe/shared/ui';
import { ToastStatus } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toast: AxToastService) {}

  open(message: string, status: ToastStatus): void {
    this.toast.open(message, status, {
      timeOut: 5000,
      tapToDismiss: false,
    });
  }
}
