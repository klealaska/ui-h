import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  IDetails,
  IGetDetails,
  IEditEntity,
  IRequest,
  IGetEntities,
  IEntity,
  IActivateOrDeactivateItem,
  DetailsType,
  IActivateOrDeactivateAddress,
  IEditAddress,
} from '@ui-coe/bus-hier/shared/types';
import * as DetailsActions from './details.actions';
import * as DetailsSelectors from './details.selectors';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { IToastConfigData } from '@ui-coe/shared/types';

@Injectable({
  providedIn: 'root',
})
export class DetailsFacade {
  constructor(private store: Store) {}

  getDetails(params?: IRequest<IGetDetails>): void {
    this.store.dispatch(DetailsActions.loadDetails(params));
  }

  getEntities(params?: IRequest<IGetEntities>): void {
    this.store.dispatch(DetailsActions.loadEntities(params));
  }

  editDetails(editEntity: IEditEntity): void {
    this.store.dispatch(
      DetailsActions.editDetails({
        id: editEntity.id,
        body: editEntity.body,
        hierarchyType: editEntity.type,
        orgId: editEntity.orgId,
        erpId: editEntity.erpId,
        level: editEntity.level,
      })
    );
  }

  displayToast(config: MatSnackBarConfig<IToastConfigData>) {
    this.store.dispatch(DetailsActions.displayToast({ config }));
  }

  dismissToast() {
    this.store.dispatch(DetailsActions.dismissToast());
  }
  activateItem(params?: IActivateOrDeactivateItem): void {
    this.store.dispatch(DetailsActions.activateItem(params));
  }

  deactivateItem(params?: IActivateOrDeactivateItem): void {
    this.store.dispatch(DetailsActions.deactivateItem(params));
  }

  activateAddress(params?: IActivateOrDeactivateAddress): void {
    this.store.dispatch(DetailsActions.activateAddress(params));
  }

  deactivateAddress(params?: IActivateOrDeactivateAddress): void {
    this.store.dispatch(DetailsActions.deactivateAddress(params));
  }

  resetDetails(): void {
    this.store.dispatch(DetailsActions.resetDetails());
  }
  toggleEditDetailsMode(): void {
    this.store.dispatch(DetailsActions.toggleEditDetailsMode());
  }

  editAddress(params: IEditAddress): void {
    this.store.dispatch(DetailsActions.editAddress(params));
  }

  details$: Observable<IDetails> = this.store.pipe(select(DetailsSelectors.selectDetails));
  entities$: Observable<IEntity[]> = this.store.pipe(select(DetailsSelectors.selectEntities));
  loading$: Observable<boolean> = this.store.pipe(select(DetailsSelectors.isDetailsLoading));
  toast$ = this.store.pipe(select(DetailsSelectors.selectToast));
  type$: Observable<DetailsType> = this.store.pipe(select(DetailsSelectors.selectType));
  editDetailsMode$: Observable<boolean> = this.store.pipe(
    select(DetailsSelectors.selectEditDetailsMode)
  );
}
