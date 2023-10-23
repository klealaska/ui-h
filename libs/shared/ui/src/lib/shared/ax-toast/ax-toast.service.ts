import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { AxToastConfig } from '../models/ax-toast';

@Injectable({
  providedIn: 'root',
})
export class AxToastService {
  defaultConfig: AxToastConfig = {
    closeButton: true,
    timeOut: 5000,
    positionClass: 'toast-top-right',
    tapToDismiss: false,
  };

  constructor(private toastr: ToastrService) {}

  open(toastBody: string, toastType: string, config?: AxToastConfig): void {
    const configObj = this.replaceDefaults(config);

    switch (toastType) {
      case 'success':
        this.toastr.success(toastBody, null, configObj);
        break;
      case 'error':
        this.toastr.error(toastBody, null, configObj);
        break;
      case 'warning':
        this.toastr.warning(toastBody, null, configObj);
        break;
      case 'info':
        this.toastr.info(toastBody, null, configObj);
        break;
      default:
        this.toastr.success(toastBody, null, configObj);
        break;
    }
  }

  replaceDefaults(propertiesToOverride: AxToastConfig): AxToastConfig {
    const newConfig = { ...this.defaultConfig };
    for (const property in propertiesToOverride) {
      if (property in newConfig) {
        newConfig[property] = propertiesToOverride[property];
      }
    }
    return newConfig;
  }
}
