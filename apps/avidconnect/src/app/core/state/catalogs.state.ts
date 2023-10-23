import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import {
  AvidConnectDataSource,
  Connector,
  Organization,
  OrganizationAccountingSystem,
  OrganizationOption,
  Platform,
} from '../../models';
import * as actions from '../actions/catalogs.actions';
import { ConnectorService } from '../services/connector.service';
import { PlatformDataService } from '../services/platform-data.service';
import { PlatformService } from '../services/platform.service';

export interface CatalogsStateModel {
  platforms: Platform[];
  organizations: Organization[];
  connectorLookup: Connector[];
  organizationAccountingSystems: OrganizationAccountingSystem[];
  organizationOptions: OrganizationOption[];
  isLoadingCatalogs: boolean;
}

const defaults: CatalogsStateModel = {
  platforms: [],
  organizations: [],
  connectorLookup: [],
  organizationAccountingSystems: [],
  organizationOptions: [],
  isLoadingCatalogs: false,
};

@State<CatalogsStateModel>({
  name: 'catalogs',
  defaults,
})
@Injectable()
export class CatalogsState {
  constructor(
    private platformService: PlatformService,
    private connectorService: ConnectorService,
    private platformDataService: PlatformDataService
  ) {}

  @Selector()
  static platforms(state: CatalogsStateModel): Platform[] {
    return state.platforms;
  }

  @Selector()
  static connectorLookup(state: CatalogsStateModel): Connector[] {
    return state.connectorLookup;
  }

  @Selector()
  static organizations(state: CatalogsStateModel): Organization[] {
    return state.organizations;
  }

  @Selector()
  static organizationOptions(state: CatalogsStateModel): OrganizationOption[] {
    return state.organizationOptions;
  }

  @Selector()
  static organizationAccountingSystems(state: CatalogsStateModel): OrganizationAccountingSystem[] {
    return state.organizationAccountingSystems;
  }

  @Selector()
  static isLoadingCatalogs(state: CatalogsStateModel): boolean {
    return state.isLoadingCatalogs;
  }

  @Action(actions.QueryPlatforms)
  queryPlatforms({
    patchState,
    dispatch,
  }: StateContext<CatalogsStateModel>): Observable<AvidConnectDataSource<Platform>> {
    dispatch(new actions.LoadingCatalogsState(true));

    return this.platformService.getAll().pipe(
      tap(data => patchState({ platforms: data.items })),
      catchError((err: HttpErrorResponse) => {
        patchState({ platforms: [] });

        throw err;
      }),
      finalize(() => dispatch(new actions.LoadingCatalogsState(false)))
    );
  }

  @Action(actions.QueryConnectorsLookup)
  queryConnectorsLookup(
    { patchState, dispatch }: StateContext<CatalogsStateModel>,
    { name, platformId, includeInactive }: actions.QueryConnectorsLookup
  ): Observable<AvidConnectDataSource<Connector>> {
    dispatch(new actions.LoadingCatalogsState(true));
    return this.connectorService
      .search([{ field: 'displayName', value: name, searchType: 'contains' }], {
        pageSize: 20,
        includeInactive,
        sortField: 'displayName',
        platformId,
      })
      .pipe(
        tap(data => patchState({ connectorLookup: data.items })),
        catchError((err: HttpErrorResponse) => {
          patchState({ connectorLookup: [] });

          throw err;
        }),
        finalize(() => dispatch(new actions.LoadingCatalogsState(false)))
      );
  }

  @Action(actions.QueryPlatformOrganizations)
  queryPlatformOrganizations(
    { patchState, dispatch, getState }: StateContext<CatalogsStateModel>,
    { name }: actions.QueryPlatformOrganizations
  ): void {
    dispatch(new actions.LoadingCatalogsState(true));

    const organizationOptions = getState()
      .organizations.filter(
        org =>
          org.name?.toLocaleLowerCase().includes(name?.toLowerCase()) ||
          org.id.toString().includes(name)
      )
      .map(org => ({ name: org.name, displayName: `${org.name} (${org.id})`, id: org.id }))
      .slice(0, 20);

    patchState({ organizationOptions });

    dispatch(new actions.LoadingCatalogsState(false));
  }

  @Action(actions.GetPlatformOrganizations)
  getPlatformOrganizations(
    { patchState, dispatch, getState }: StateContext<CatalogsStateModel>,
    { platformId }: actions.GetPlatformOrganizations
  ): Observable<AvidConnectDataSource<Organization>> {
    dispatch(new actions.LoadingCatalogsState(true));

    return getState().organizations.length === 0
      ? this.platformDataService.searchOrganizations({ platformId, includeInactive: false }).pipe(
          tap(data => patchState({ organizations: data.items })),
          catchError((err: HttpErrorResponse) => {
            patchState({ organizations: [] });

            throw err;
          }),
          finalize(() => dispatch(new actions.LoadingCatalogsState(false)))
        )
      : null;
  }

  @Action(actions.QueryOrganizationAccountingSystems)
  queryOrganizationAccountingSystems(
    { patchState, dispatch }: StateContext<CatalogsStateModel>,
    { organizationId, platformId, includeInactive }: actions.QueryOrganizationAccountingSystems
  ): Observable<AvidConnectDataSource<Organization>> {
    dispatch(new actions.LoadingCatalogsState(true));
    return this.platformDataService
      .getOrganizationAccountingSystems({ organizationId, platformId, includeInactive })
      .pipe(
        tap(data => patchState({ organizationAccountingSystems: data.items })),
        catchError((err: HttpErrorResponse) => {
          patchState({ organizationAccountingSystems: [] });

          throw err;
        }),
        finalize(() => dispatch(new actions.LoadingCatalogsState(false)))
      );
  }

  @Action(actions.ClearOrganizationAccountingSystems)
  clearOrganizationAccountingSystems({ patchState }: StateContext<CatalogsStateModel>): void {
    patchState({ organizationAccountingSystems: [] });
  }

  @Action(actions.LoadingCatalogsState)
  loadingCatalogsState(
    { patchState }: StateContext<CatalogsStateModel>,
    { isLoadingCatalogs }: actions.LoadingCatalogsState
  ): void {
    patchState({ isLoadingCatalogs });
  }
}
