import { Selector } from '@ngxs/store';
import { CoreStateModel } from './core.model';
import { CoreState } from './core.state';

export class CoreSelectors {
  @Selector([CoreState.data])
  static token(state: CoreStateModel): string {
    return state.token;
  }

  @Selector([CoreState.data])
  static userRoles(state: CoreStateModel): string[] {
    return state.userRoles;
  }

  @Selector([CoreState.data])
  static orgIds(state: CoreStateModel): string[] {
    return state.orgIds;
  }
}
