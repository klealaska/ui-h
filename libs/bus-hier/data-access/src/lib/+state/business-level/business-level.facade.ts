import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IEditBusinessLevelName } from '@ui-coe/bus-hier/shared/types';
import * as BusinessLevelActions from './business-level.actions';
import * as BusinessLevelSelectors from './business-level.selectors';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BusinessLevelFacade {
  constructor(private store: Store) {}

  updateBusinessLevelName(params?: IEditBusinessLevelName): void {
    this.store.dispatch(BusinessLevelActions.updateBusinessLevelName({ params }));
  }

  dismissToast() {
    this.store.dispatch(BusinessLevelActions.dismissToast());
  }

  businessLevelNamePlural$: Observable<string> = this.store.pipe(
    select(BusinessLevelSelectors.selectBusinessLevelNamePlural)
  );

  businessLevelNameSingular$: Observable<string> = this.store.pipe(
    select(BusinessLevelSelectors.selectBusinessLevelNameSingular)
  );

  toast$ = this.store.pipe(select(BusinessLevelSelectors.selectToast));
}
