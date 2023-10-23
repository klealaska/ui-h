import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, combineLatestWith, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as DetailsActions from './details.actions';
import * as TreeActions from '../tree/tree.actions';
import {
  ContentKeys,
  HierarchyType,
  IGetDetails,
  IERP,
  IOrganization,
  IDetails,
  IRequest,
  IGetEntities,
  IMappedEntitiesResponse,
  IMappedEntity,
  IEditEntityBody,
  IActivateOrDeactivateItem,
  AddressType,
  IActivateOrDeactivateAddress,
  IEditAddress,
  IMappedOrganizationAddress,
  IAddress,
  IMappedEntityAddress,
} from '@ui-coe/bus-hier/shared/types';
import { TranslateService } from '@ngx-translate/core';
import { IGetToastOptions, ToastIcon, ToastTypeEnum } from '@ui-coe/shared/types';
import { OrganizationService, ErpService, EntityService } from '../../services';
import { getToasterConfig } from '@ui-coe/shared/util/interfaces';

@Injectable()
export class DetailsEffects {
  loadDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DetailsActions.loadDetails),
      switchMap((params: IRequest<IGetDetails>) => {
        switch (params.payload.hierarchyType) {
          case HierarchyType.ERP:
            return this.erpService.getErpById(params.payload.id).pipe(
              map((erp: IERP) =>
                DetailsActions.loadDetailsSuccess({ response: this.erpToDetails(erp) })
              ),
              catchError(error => of(DetailsActions.loadDetailsFailure({ error })))
            );

          case HierarchyType.ORGANIZATION:
            return this.organizationService.getOrganization(params.payload.id).pipe(
              map((organization: IOrganization) =>
                DetailsActions.loadDetailsSuccess({
                  response: this.organizationToDetails(organization),
                })
              ),
              catchError(error => of(DetailsActions.loadDetailsFailure({ error })))
            );

          case HierarchyType.ENTITIES:
            return this.entityService.getEntityById(params.payload.id).pipe(
              switchMap((entity: IMappedEntity) => {
                const { orgId, erpId, id, level } = params.payload;

                if (erpId && orgId) {
                  return [
                    DetailsActions.loadDetailsSuccess({
                      response: this.entityToDetails(entity, params.payload?.entityTypeName),
                    }),
                    TreeActions.loadTree({
                      payload: { orgId, erpId, entityId: id, selectedNode: level },
                      correlationId: params.correlationId,
                    }),
                  ];
                } else {
                  return [
                    DetailsActions.loadDetailsSuccess({
                      response: this.entityToDetails(entity, params.payload?.entityTypeName),
                    }),
                  ];
                }
              }),
              catchError(error => of(DetailsActions.loadDetailsFailure({ error })))
            );
        }
      })
    )
  );

  loadEntities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DetailsActions.loadEntities),
      switchMap((params: IRequest<IGetEntities>) =>
        this.entityService
          .getEntities(
            params?.payload?.erpId,
            params?.payload?.level,
            params?.payload?.parentEntityId
          )
          .pipe(
            map((entities: IMappedEntitiesResponse) =>
              DetailsActions.loadEntitiesSuccess({
                response: entities.items.map((entity: IMappedEntity) => ({
                  name: entity.entityName,
                  id: entity.entityId,
                  isActive: entity.isActive,
                  level: entity.businessLevel,
                  parentEntityId: entity.parentEntityId,
                  entityTypeName: params.payload.entityName,
                })),
              })
            ),
            catchError(error => of(DetailsActions.loadEntitiesFailure({ error })))
          )
      )
    )
  );

  editDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DetailsActions.editDetails),
      switchMap(
        ({
          id,
          body,
          hierarchyType,
          orgId,
          erpId,
          level,
        }: {
          id: string;
          body: IEditEntityBody;
          hierarchyType: HierarchyType;
          orgId?: string;
          erpId?: string;
          level?: number;
        }) => {
          switch (hierarchyType) {
            case HierarchyType.ENTITIES:
              return this.entityService.editEntity(id, body).pipe(
                switchMap((entity: IMappedEntity) => [
                  TreeActions.loadTree({
                    payload: { orgId, erpId, entityId: id, selectedNode: level },
                  }),
                  DetailsActions.editDetailsSuccess({
                    response: this.entityToDetails(entity),
                  }),
                  DetailsActions.toggleEditDetailsMode(),
                ]),
                catchError(error => of(DetailsActions.editDetailsFailure({ error })))
              );
            case HierarchyType.ORGANIZATION:
              return this.organizationService.editOrganization(id, body).pipe(
                switchMap((organization: IOrganization) => [
                  DetailsActions.editDetailsSuccess({
                    response: this.organizationToDetails(organization),
                  }),
                  DetailsActions.toggleEditDetailsMode(),
                  TreeActions.loadTree({
                    payload: { orgId: id, erpId, selectedNode: orgId },
                  }),
                ]),
                catchError(error => of(DetailsActions.editDetailsFailure({ error })))
              );
            case HierarchyType.ERP:
              return this.erpService.editERP(id, body).pipe(
                switchMap((erp: IERP) => [
                  DetailsActions.editDetailsSuccess({
                    response: this.erpToDetails(erp),
                  }),
                  DetailsActions.toggleEditDetailsMode(),
                  TreeActions.loadTree({
                    payload: { orgId, erpId: id, selectedNode: erpId },
                  }),
                ]),
                catchError(error => of(DetailsActions.editDetailsFailure({ error })))
              );
          }
        }
      )
    )
  );

  activateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DetailsActions.activateItem),
      switchMap((params: IActivateOrDeactivateItem) => {
        switch (params.hierarchyType) {
          case HierarchyType.ORGANIZATION:
            return this.organizationService.activateOrganization(params.id).pipe(
              map(() =>
                DetailsActions.activateItemSuccess({
                  status: 'Active',
                  itemName: params.name,
                })
              ),
              catchError(error =>
                of(
                  DetailsActions.activateItemFailure({
                    error,
                    itemName: params.name,
                  })
                )
              )
            );
          case HierarchyType.ERP:
            return this.erpService.activateErp(params.id).pipe(
              map(() =>
                DetailsActions.activateItemSuccess({
                  status: 'Active',
                  itemName: params.name,
                })
              ),
              catchError(error =>
                of(
                  DetailsActions.activateItemFailure({
                    error,
                    itemName: params.name,
                  })
                )
              )
            );
          case HierarchyType.ENTITIES:
            return this.entityService.activeEntity(params.id).pipe(
              map(() =>
                DetailsActions.activateItemSuccess({
                  status: 'Active',
                  itemName: params.name,
                })
              ),
              catchError(error =>
                of(
                  DetailsActions.activateItemFailure({
                    error,
                    itemName: params.name,
                  })
                )
              )
            );
        }
      })
    )
  );

  deactivateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DetailsActions.deactivateItem),
      switchMap((params: IActivateOrDeactivateItem) => {
        switch (params.hierarchyType) {
          case HierarchyType.ORGANIZATION:
            return this.organizationService.deactivateOrganization(params.id).pipe(
              map(() =>
                DetailsActions.deactivateItemSuccess({
                  status: 'Inactive',
                  itemName: params.name,
                })
              ),
              catchError(error =>
                of(
                  DetailsActions.deactivateItemFailure({
                    error,
                    itemName: params.name,
                  })
                )
              )
            );
          case HierarchyType.ERP:
            return this.erpService.deactivateErp(params.id).pipe(
              map(() =>
                DetailsActions.deactivateItemSuccess({
                  status: 'Inactive',
                  itemName: params.name,
                })
              ),
              catchError(error =>
                of(
                  DetailsActions.deactivateItemFailure({
                    error,
                    itemName: params.name,
                  })
                )
              )
            );
          case HierarchyType.ENTITIES:
            return this.entityService.deactiveEntity(params.id).pipe(
              map(() =>
                DetailsActions.deactivateItemSuccess({
                  status: 'Inactive',
                  itemName: params.name,
                })
              ),
              catchError(error =>
                of(
                  DetailsActions.deactivateItemFailure({
                    error,
                    itemName: params.name,
                  })
                )
              )
            );
        }
      })
    )
  );

  displayToast$ = createEffect(() => {
    let toastConfigOptions: IGetToastOptions;

    return this.actions$.pipe(
      ofType(
        DetailsActions.editDetailsSuccess,
        DetailsActions.editDetailsFailure,
        DetailsActions.activateItemSuccess,
        DetailsActions.activateItemFailure,
        DetailsActions.deactivateItemFailure,
        DetailsActions.deactivateItemSuccess,
        DetailsActions.activateAddressSuccess,
        DetailsActions.activateAddressFailure,
        DetailsActions.deactivateAddressSuccess,
        DetailsActions.deactivateAddressFailure,
        DetailsActions.editAddressSuccess,
        DetailsActions.editAddressFailure
      ),
      combineLatestWith(
        this.translateService.get([
          ContentKeys.ENTITY_DETAILS_TOASTER,
          ContentKeys.ITEM_ACTIVATE_DEACTIVATE_TOASTER,
          ContentKeys.ADDRESS_ACTIVATE_SUCCESS_TOASTER,
          ContentKeys.ADDRESS_ACTIVATE_FAILURE_TOASTER,
          ContentKeys.ADDRESS_DEACTIVATE_SUCCESS_TOASTER,
          ContentKeys.ADDRESS_DEACTIVATE_FAILURE_TOASTER,
          ContentKeys.ADDRESS_EDIT_SUCCESS_TOASTER,
          ContentKeys.ADDRESS_EDIT_FAILURE_TOASTER,
        ])
      ),
      switchMap(([action, translation]) => {
        switch (action.type) {
          case DetailsActions.editDetailsSuccess.type:
            toastConfigOptions = {
              title: translation[ContentKeys.ENTITY_DETAILS_TOASTER].edit.title.success,
            };
            break;

          case DetailsActions.editDetailsFailure.type:
            toastConfigOptions = {
              title: translation[ContentKeys.ENTITY_DETAILS_TOASTER].edit.title.error,
              type: ToastTypeEnum.CRITICAL,
              icon: ToastIcon.ERROR,
            };
            break;

          case DetailsActions.activateItemSuccess.type:
            toastConfigOptions = {
              title: translation[
                ContentKeys.ITEM_ACTIVATE_DEACTIVATE_TOASTER
              ].activate.success.replace('{{ name }}', action.itemName),
            };
            break;

          case DetailsActions.deactivateItemSuccess.type:
            toastConfigOptions = {
              title: translation[
                ContentKeys.ITEM_ACTIVATE_DEACTIVATE_TOASTER
              ].deactivate.success.replace('{{ name }}', action.itemName),
            };
            break;

          case DetailsActions.activateItemFailure.type:
            toastConfigOptions = {
              title: translation[
                ContentKeys.ITEM_ACTIVATE_DEACTIVATE_TOASTER
              ].activate.error.replace('{{ name }}', action.itemName),
              type: ToastTypeEnum.CRITICAL,
              icon: ToastIcon.ERROR,
            };
            break;

          case DetailsActions.deactivateItemFailure.type:
            toastConfigOptions = {
              title: translation[
                ContentKeys.ITEM_ACTIVATE_DEACTIVATE_TOASTER
              ].deactivate.error.replace('{{ name }}', action.itemName),
              type: ToastTypeEnum.CRITICAL,
              icon: ToastIcon.ERROR,
            };
            break;
          case DetailsActions.activateAddressSuccess.type:
            toastConfigOptions = {
              title: translation[ContentKeys.ADDRESS_ACTIVATE_SUCCESS_TOASTER],
            };
            break;

          case DetailsActions.activateAddressFailure.type:
            toastConfigOptions = {
              title: translation[ContentKeys.ADDRESS_ACTIVATE_FAILURE_TOASTER],
              type: ToastTypeEnum.CRITICAL,
              icon: ToastIcon.ERROR,
            };
            break;
          case DetailsActions.deactivateAddressSuccess.type:
            toastConfigOptions = {
              title: translation[ContentKeys.ADDRESS_DEACTIVATE_SUCCESS_TOASTER],
            };
            break;

          case DetailsActions.deactivateAddressFailure.type:
            toastConfigOptions = {
              title: translation[ContentKeys.ADDRESS_DEACTIVATE_FAILURE_TOASTER],
              type: ToastTypeEnum.CRITICAL,
              icon: ToastIcon.ERROR,
            };
            break;

          case DetailsActions.editAddressSuccess.type:
            toastConfigOptions = {
              title: translation[ContentKeys.ADDRESS_EDIT_SUCCESS_TOASTER],
            };
            break;

          case DetailsActions.editAddressFailure.type:
            toastConfigOptions = {
              title: translation[ContentKeys.ADDRESS_EDIT_FAILURE_TOASTER],
              type: ToastTypeEnum.CRITICAL,
              icon: ToastIcon.ERROR,
            };
            break;
        }

        return of(DetailsActions.displayToast({ config: getToasterConfig(toastConfigOptions) }));
      })
    );
  });

  activateAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DetailsActions.activateAddress),
      switchMap((params: IActivateOrDeactivateAddress) => {
        switch (params.hierarchyType) {
          case HierarchyType.ENTITIES:
            return this.entityService.activeEntityAddress(params.id, params.addressId).pipe(
              map(() =>
                DetailsActions.activateAddressSuccess({
                  isActive: true,
                  addressId: params.addressId,
                  addressType: params.addressType,
                })
              ),
              catchError(error =>
                of(
                  DetailsActions.activateAddressFailure({
                    error,
                  })
                )
              )
            );
          case HierarchyType.ORGANIZATION:
            return this.organizationService
              .activateOrganizationAddress(params.id, params.addressId)
              .pipe(
                map(() =>
                  DetailsActions.activateAddressSuccess({
                    isActive: true,
                    addressId: params.addressId,
                    addressType: params.addressType,
                  })
                ),
                catchError(error =>
                  of(
                    DetailsActions.activateAddressFailure({
                      error,
                    })
                  )
                )
              );
        }
      })
    )
  );

  deactivateAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DetailsActions.deactivateAddress),
      switchMap((params: IActivateOrDeactivateAddress) => {
        switch (params.hierarchyType) {
          case HierarchyType.ENTITIES:
            return this.entityService.deactiveEntityAddress(params.id, params.addressId).pipe(
              map(() =>
                DetailsActions.deactivateAddressSuccess({
                  isActive: false,
                  addressId: params.addressId,
                  addressType: params.addressType,
                })
              ),
              catchError(error =>
                of(
                  DetailsActions.deactivateAddressFailure({
                    error,
                  })
                )
              )
            );
          case HierarchyType.ORGANIZATION:
            return this.organizationService
              .deactivateOrganizationAddress(params.id, params.addressId)
              .pipe(
                map(() =>
                  DetailsActions.deactivateAddressSuccess({
                    isActive: false,
                    addressId: params.addressId,
                    addressType: params.addressType,
                  })
                ),
                catchError(error =>
                  of(
                    DetailsActions.deactivateAddressFailure({
                      error,
                    })
                  )
                )
              );
        }
      })
    )
  );

  editAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DetailsActions.editAddress),
      switchMap((params: IEditAddress) => {
        switch (params.hierarchyType) {
          case HierarchyType.ORGANIZATION:
            return this.organizationService.editOrganizationAddress(params.id, params.address).pipe(
              map((response: IMappedOrganizationAddress) => {
                return DetailsActions.editAddressSuccess({
                  payload: response as IAddress,
                  addressType: params.addressType,
                });
              }),
              catchError(error =>
                of(
                  DetailsActions.editAddressFailure({
                    error,
                  })
                )
              )
            );
          case HierarchyType.ENTITIES:
            return this.entityService.editEntityAddress(params.id, params.address).pipe(
              map((response: IMappedEntityAddress) =>
                DetailsActions.editAddressSuccess({
                  payload: response as IAddress,
                  addressType: params.addressType,
                })
              ),
              catchError(error =>
                of(
                  DetailsActions.editAddressFailure({
                    error,
                  })
                )
              )
            );
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private entityService: EntityService,
    private erpService: ErpService,
    private organizationService: OrganizationService,
    private translateService: TranslateService
  ) {}

  private erpToDetails(erp: IERP): IDetails {
    return {
      id: erp.erpId,
      name: erp.erpName,
      code: erp.erpCode,
      status: erp.isActive ? 'Active' : 'Inactive',
      type: HierarchyType.ERP,
    };
  }

  private organizationToDetails(organization: IOrganization): IDetails {
    return {
      id: organization.organizationId,
      name: organization.organizationName,
      code: organization.organizationCode,
      status: organization.isActive ? 'Active' : 'Inactive',
      type: HierarchyType.ORGANIZATION,
      billToAddresses: organization?.organizationAddresses.filter(
        x => x.addressType === AddressType.BILL_TO
      ),
      shipToAddresses: organization?.organizationAddresses.filter(
        x => x.addressType === AddressType.SHIP_TO
      ),
    };
  }

  private entityToDetails(entity: IMappedEntity, entityTypeName?: string): IDetails {
    return {
      id: entity.entityId,
      name: entity.entityName,
      code: entity.entityCode,
      status: entity.isActive ? 'Active' : 'Inactive',
      level: entity.businessLevel,
      type: HierarchyType.ENTITIES,
      billToAddresses: entity?.entityAddresses.filter(x => x.addressType === AddressType.BILL_TO),
      shipToAddresses: entity?.entityAddresses.filter(x => x.addressType === AddressType.SHIP_TO),
      entityTypeName,
    };
  }
}
