import { Injectable } from '@angular/core';
import { ActionType, getActionTypeFromInstance, NgxsNextPluginFn, NgxsPlugin } from '@ngxs/store';

import { LogoutService } from './logout.service';

@Injectable()
export class NgxsLogoutPlugin implements NgxsPlugin {
  constructor(private readonly logoutService: LogoutService) {}

  handle(state: any, action: ActionType, next: NgxsNextPluginFn): NgxsNextPluginFn {
    const type = getActionTypeFromInstance(action);

    switch (type) {
      case 'Logout':
        state = this.logoutService.initialState;
        break;
    }

    return next(state, action);
  }
}
