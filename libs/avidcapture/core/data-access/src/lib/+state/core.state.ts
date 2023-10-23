import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ConfigurationSettingParam } from '@azure/app-configuration';
import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { BuyerKeywordService, ToastService } from '@ui-coe/avidcapture/core/util';
import { IndexingHelperService, LookupApiService } from '@ui-coe/avidcapture/indexing/util';
import {
  AdvancedFiltersKeys,
  AggregateBodyRequest,
  AppPages,
  Buyer,
  Chameleon,
  Document,
  DocumentReduce,
  Environment,
  FeatureFlags,
  LookupPaymentTerms,
  SearchContext,
  UserPermissions,
} from '@ui-coe/avidcapture/shared/types';
import { AppName, AuthService, RefreshTokenResponse } from '@ui-coe/shared/util/auth';
import { FeatureFlagService } from '@ui-coe/shared/util/services';
import jwt_decode from 'jwt-decode';
import { EMPTY, Observable, interval, of } from 'rxjs';
import {
  catchError,
  filter,
  finalize,
  map,
  mergeMap,
  retry,
  take,
  takeWhile,
  tap,
} from 'rxjs/operators';

import {
  DocumentSearchHelperService,
  PageHelperService,
  RetryStrategyService,
  SocketService,
  XdcService,
} from '../services';
import * as actions from './core.actions';
import { CoreStateModel } from './core.model';

const defaults: CoreStateModel = {
  token: null,
  userRoles: [],
  userAccount: null,
  orgIds: [],
  orgNames: [],
  isLoading: false,
  escalationCount: 0,
  buyerCount: 0,
  documentCount: 0,
  myUploadsCount: 0,
  recycleBinCount: 0,
  userMenuOptions: [],
  featureFlags: [],
  currentPage: null,
  filteredBuyers: JSON.parse(localStorage.getItem('filteredBuyers')) ?? [],
  researchPageEscalationCategoryList: [],
  buyerModalOpenedCount: 0,
  hubConnection: null,
};

@State<CoreStateModel>({
  name: 'core',
  defaults,
})
@Injectable()
export class CoreState implements NgxsOnInit {
  constructor(
    private authService: AuthService,
    private xdcService: XdcService,
    private socketService: SocketService,
    private featureFlagService: FeatureFlagService,
    private documentSearchHelperService: DocumentSearchHelperService,
    private retryStrategyService: RetryStrategyService,
    private pageHelperService: PageHelperService,
    private bkwService: BuyerKeywordService,
    private store: Store,
    private toast: ToastService,
    private lookupApiService: LookupApiService,
    private indexingHelperService: IndexingHelperService,
    @Inject('environment') private environment: Environment
  ) {}

  @Selector()
  static data(state: CoreStateModel): CoreStateModel {
    return state;
  }

  ngxsOnInit({ dispatch }: StateContext<CoreStateModel>): void {
    dispatch(new actions.QueryAllFeatureFlags());
  }

  @Action(actions.SetToken)
  setToken({ dispatch, patchState }: StateContext<CoreStateModel>): Observable<string> {
    return interval(1000).pipe(
      map(() => this.authService.getAccessToken()),
      tap(token => {
        if (token) {
          const decodedToken: { [UserPermissions.SponsorUser]: string[] } = jwt_decode(token);

          patchState({ token });

          dispatch([
            new actions.StartWebSockets(),
            new actions.QueryUserRoles(),
            new actions.QueryUserAccount(),
          ]);

          if (decodedToken.hasOwnProperty(UserPermissions.SponsorUser)) {
            dispatch(new actions.HandleSponsorUser());
          }
        }
      }),
      takeWhile(token => token == null || token === ''),
      take(5)
    );
  }

  @Action(actions.RefreshToken)
  refreshToken({
    dispatch,
    patchState,
  }: StateContext<CoreStateModel>): Observable<RefreshTokenResponse> {
    return this.authService.refreshToken(this.environment.avidAuthBaseUri).pipe(
      tap((response: RefreshTokenResponse) => {
        if (!jwt_decode(response.return_data.access_token).hasOwnProperty('roles')) {
          this.toast.warning('Session expired');

          dispatch(new actions.Logout());
          window.location.replace(
            this.authService.getAvidAuthLoginUrl(
              this.environment.avidAuthLoginUrl,
              AppName.DataCapture
            )
          );
        } else {
          patchState({
            token: response.return_data.access_token,
            hubConnection: null,
          });
          this.socketService.refreshConnection();
        }
      }),
      catchError(err => {
        dispatch(new actions.Logout());
        window.location.replace(
          this.authService.getAvidAuthLoginUrl(
            this.environment.avidAuthLoginUrl,
            AppName.DataCapture
          )
        );
        throw err;
      })
    );
  }

  @Action(actions.QueryUserAccount)
  queryUserAccount({ dispatch, patchState }: StateContext<CoreStateModel>): void {
    const userAccount = this.authService.getUserInfo();
    patchState({
      userAccount,
    });
    dispatch([new actions.StartChameleon(), new actions.GetPaymentTerms()]);
  }

  @Action(actions.QueryUserRoles)
  queryUserRoles({ dispatch, getState, patchState }: StateContext<CoreStateModel>): void {
    const decodedToken: { roles: string[]; orgId: string[] } = jwt_decode(getState().token);
    const orgIds = decodedToken?.orgId
      ? decodedToken.orgId.map(orgId => orgId.replace('org.', ''))
      : [];
    patchState({
      userRoles: decodedToken.roles,
      orgIds,
    });

    if (!decodedToken.hasOwnProperty(UserPermissions.SponsorUser)) {
      dispatch(new actions.QueryOrgNames());
    }
  }

  @Action(actions.QueryOrgNames)
  queryOrgNames({ patchState, getState }: StateContext<CoreStateModel>): Observable<Document[]> {
    const requestBody: AggregateBodyRequest =
      this.documentSearchHelperService.getAggregateRequestBody({
        sourceId: SearchContext.AvidSuite,
        groupBy: [AdvancedFiltersKeys.BuyerName, AdvancedFiltersKeys.SourceSystemBuyerId],
        filters: {
          sourceSystemBuyerId: getState().orgIds,
          indexingSolutionId: ['2'],
          portalStatus: ['active'],
        },
      });

    return this.bkwService.postAggregateSearch(requestBody).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((response: Document[]) => {
        const orgNames = response.map(res => ({
          id: res.sourceSystemBuyerId,
          name: res.buyerName.toUpperCase(),
        }));

        patchState({ orgNames, filteredBuyers: orgNames });
      }),
      catchError((err: HttpErrorResponse) => {
        const orgNames = getState().orgIds.map(orgId => ({
          id: orgId,
          name: '',
        }));

        patchState({
          orgNames,
          filteredBuyers: orgNames,
        });
        throw err;
      })
    );
  }

  @Action(actions.QueryAllOrgNames)
  queryAllOrgNames({ patchState }: StateContext<CoreStateModel>): Observable<Document[]> {
    const requestBody: AggregateBodyRequest =
      this.documentSearchHelperService.getAggregateRequestBody({
        sourceId: SearchContext.AvidSuite,
        groupBy: [AdvancedFiltersKeys.BuyerName, AdvancedFiltersKeys.SourceSystemBuyerId],
        filters: {
          indexingSolutionId: ['2'],
          portalStatus: ['active'],
        },
      });

    return this.bkwService.postAggregateSearch(requestBody).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((response: Document[]) => {
        const orgNames = response.map(res => ({
          id: res.sourceSystemBuyerId,
          name: res.buyerName.toUpperCase(),
        }));

        patchState({ orgNames });
      }),
      catchError((err: HttpErrorResponse) => {
        throw err;
      })
    );
  }

  @Action(actions.HandleSponsorUser)
  handleSponsorUser({ dispatch, getState }: StateContext<CoreStateModel>): void {
    dispatch(
      getState().filteredBuyers.length === 0
        ? [new actions.QueryAllOrgNames(), new actions.OpenFilteredBuyersModal()]
        : new actions.QueryAllOrgNames()
    );
  }

  @Action(actions.Logout)
  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = this.environment.avidAuthLoginUrl;
  }

  @Action(actions.HttpRequestActive)
  httpRequestActive({ patchState }: StateContext<CoreStateModel>): void {
    patchState({ isLoading: true });
  }

  @Action(actions.HttpRequestComplete)
  httpRequestComplete({ patchState }: StateContext<CoreStateModel>): void {
    patchState({ isLoading: false });
  }

  @Action(actions.QueryDocumentCardSetCounts, { cancelUncompleted: true })
  queryDocumentCardSetCounts({
    getState,
    patchState,
  }: StateContext<CoreStateModel>): Observable<DocumentReduce[]> {
    const decodedToken = jwt_decode(getState().token);
    const orgIds = getState().filteredBuyers.map(buyer => buyer.id);
    const state = this.store.selectSnapshot(state => state);

    const requests: AggregateBodyRequest[] = [];

    if (decodedToken[UserPermissions.Pending]) {
      requests.push(
        this.documentSearchHelperService.getCountAggregateWithAliasRequest(
          SearchContext.AvidSuite,
          this.pageHelperService.getPendingPageFilters(state, orgIds),
          AppPages.Queue
        )
      );
    }

    if (decodedToken[UserPermissions.Research]) {
      requests.push(
        this.documentSearchHelperService.getCountAggregateWithAliasRequest(
          SearchContext.AvidSuite,
          this.pageHelperService.getResearchPageFilters(
            state,
            orgIds,
            getState().researchPageEscalationCategoryList
          ),
          AppPages.Research
        )
      );
    }

    if (decodedToken[UserPermissions.RecycleBin]) {
      requests.push(
        this.documentSearchHelperService.getCountAggregateWithAliasRequest(
          SearchContext.AvidSuite,
          this.pageHelperService.getRecycleBinPageFilters(
            state,
            orgIds,
            this.pageHelperService.getDateRange(31)
          ),
          AppPages.RecycleBin
        )
      );
    }

    requests.push(
      this.documentSearchHelperService.getCountAggregateWithAliasRequest(
        SearchContext.AvidSuite,
        this.pageHelperService.getUploadsPageFilters(
          state,
          orgIds,
          getState().userAccount?.preferred_username
        ),
        AppPages.UploadsQueue
      )
    );

    return this.xdcService.postAggregateBulkSearch(requests).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      map(request =>
        request.map(req => {
          delete req.isSubmitted;
          return req;
        })
      ),
      tap(request => {
        const documentCount = request.find(req => Object.keys(req)[0] === AppPages.Queue)
          ? request.find(req => Object.keys(req)[0] === AppPages.Queue)[AppPages.Queue]
          : 0;
        const escalationCount = request.find(req => Object.keys(req)[0] === AppPages.Research)
          ? request.find(req => Object.keys(req)[0] === AppPages.Research)[AppPages.Research]
          : 0;
        const recycleBinCount = request.find(req => Object.keys(req)[0] === AppPages.RecycleBin)
          ? request.find(req => Object.keys(req)[0] === AppPages.RecycleBin)[AppPages.RecycleBin]
          : 0;
        const myUploadsCount = request.find(req => Object.keys(req)[0] === AppPages.UploadsQueue)
          ? request.find(req => Object.keys(req)[0] === AppPages.UploadsQueue)[
              AppPages.UploadsQueue
            ]
          : 0;

        patchState({
          documentCount,
          escalationCount,
          recycleBinCount,
          myUploadsCount,
        });
      }),
      catchError(err => {
        patchState({
          documentCount: 0,
          escalationCount: 0,
          recycleBinCount: 0,
          myUploadsCount: 0,
        });
        throw err;
      }),
      finalize(() =>
        patchState({
          buyerCount: getState().filteredBuyers.length,
        })
      )
    );
  }

  @Action(actions.StartWebSockets)
  startWebSockets({ patchState }: StateContext<CoreStateModel>): void {
    patchState({ hubConnection: this.socketService.createConnection() });
  }

  @Action(actions.UpdateWebSocketConnection)
  updateWebSocketConnection(
    { patchState }: StateContext<CoreStateModel>,
    { hubConnection }: actions.UpdateWebSocketConnection
  ): void {
    patchState({ hubConnection });
  }

  @Action(actions.ConfigureWebSocketGroups)
  configureWebSocketGroups({ dispatch, getState }: StateContext<CoreStateModel>): void {
    const decodedToken = jwt_decode(getState().token);
    const filteredBuyers = getState().filteredBuyers;

    if (decodedToken.hasOwnProperty(UserPermissions.SponsorUser) && filteredBuyers.length > 0) {
      dispatch([
        new actions.AddBuyerToWebSocketsGroup(filteredBuyers.map(buyer => buyer.id)),
        new actions.AddUsernameToWebSocketsGroup(),
      ]);
      return;
    }

    if (!decodedToken.hasOwnProperty(UserPermissions.SponsorUser)) {
      dispatch([
        new actions.AddBuyerToWebSocketsGroup(getState().orgIds),
        new actions.AddUsernameToWebSocketsGroup(),
      ]);
      return;
    }
  }

  @Action(actions.AddUsernameToWebSocketsGroup)
  addUsernameToWebSocketsGroup({ getState }: StateContext<CoreStateModel>): void {
    this.socketService.addToGroup([getState().userAccount.preferred_username]);
  }

  @Action(actions.AddBuyerToWebSocketsGroup)
  addBuyerToWebSocketsGroup(
    _: StateContext<CoreStateModel>,
    { buyerIds }: actions.AddBuyerToWebSocketsGroup
  ): void {
    this.socketService.addToGroup(buyerIds);
  }

  @Action(actions.RemoveBuyerFromWebSocketsGroup)
  removeBuyerFromWebSocketsGroup(
    _: StateContext<CoreStateModel>,
    { buyerId }: actions.RemoveBuyerFromWebSocketsGroup
  ): void {
    this.socketService.removeFromGroup(buyerId);
  }

  @Action(actions.StartLockHeartbeat)
  startLockHeartbeat(
    _: StateContext<CoreStateModel>,
    { documentId, buyerId }: actions.StartLockHeartbeat
  ): void {
    this.socketService.startLockHeartbeat(documentId, buyerId);
  }

  @Action(actions.RemoveExpiredLocks)
  removeExpiredLocks(): void {
    this.socketService.removeExpiredLocks();
  }

  @Action(actions.UpdatePendingDocumentCount)
  updatePendingDocumentCount(
    { patchState }: StateContext<CoreStateModel>,
    { documentCount }: actions.UpdatePendingDocumentCount
  ): void {
    patchState({
      documentCount,
    });
  }

  @Action(actions.UpdateEscalationDocumentCount)
  updateEscalationDocumentCount(
    { patchState }: StateContext<CoreStateModel>,
    { escalationCount }: actions.UpdateEscalationDocumentCount
  ): void {
    patchState({
      escalationCount,
    });
  }

  @Action(actions.UpdateUploadsDocumentCount)
  updateUploadsDocumentCount(
    { patchState }: StateContext<CoreStateModel>,
    { myUploadsCount }: actions.UpdateUploadsDocumentCount
  ): void {
    patchState({
      myUploadsCount,
    });
  }

  @Action(actions.UpdateRecycleBinDocumentCount)
  updateRecycleBinDocumentCount(
    { patchState }: StateContext<CoreStateModel>,
    { recycleBinCount }: actions.UpdateRecycleBinDocumentCount
  ): void {
    patchState({
      recycleBinCount,
    });
  }

  @Action(actions.SendLockMessage)
  sendLockMessage(
    _: StateContext<CoreStateModel>,
    { username, documentId, buyerId }: actions.SendLockMessage
  ): void {
    this.socketService.sendLockMessage(username, documentId, buyerId);
  }

  @Action(actions.SendUnlockMessage)
  sendUnlockMessage(
    _: StateContext<CoreStateModel>,
    { documentId, buyerId }: actions.SendUnlockMessage
  ): void {
    this.socketService.sendUnlockMessage(documentId, buyerId);
  }

  @Action(actions.StartChameleon)
  startChameleon({ getState }: StateContext<CoreStateModel>): void {
    if (!(window as any).chmln) {
      return;
    }

    const userAccount = getState().userAccount;
    if (!userAccount) return;

    const chameleonData: Chameleon = {
      id: userAccount.preferred_username,
      email: userAccount.email,
      name: userAccount.name,
      roles: getState().userRoles,
    };

    (window as any).chmln.identify(chameleonData.id, chameleonData);
  }

  @Action(actions.AddMenuOptions)
  addMenuOptions(
    { getState, patchState }: StateContext<CoreStateModel>,
    { menuOption }: actions.AddMenuOptions
  ): void {
    const userMenuOptions = getState().userMenuOptions;
    userMenuOptions.push(menuOption);

    patchState({
      userMenuOptions: [...userMenuOptions],
    });
  }

  @Action(actions.RemoveMenuOptions)
  removeMenuOptions(
    { getState, patchState }: StateContext<CoreStateModel>,
    { menuOption }: actions.RemoveMenuOptions
  ): void {
    const userMenuOptions = getState().userMenuOptions.filter(
      option => option.text !== menuOption.text
    );

    patchState({
      userMenuOptions: [...userMenuOptions],
    });
  }

  @Action(actions.QueryAllFeatureFlags)
  queryAllFeatureFlags({
    patchState,
    dispatch,
    getState,
  }: StateContext<CoreStateModel>): Observable<ConfigurationSettingParam[]> {
    return this.featureFlagService
      .getAllFeatureFlags(this.environment.appConfigConnectionString)
      .pipe(
        tap(settings => {
          const featureFlags = settings.reduce((acc, setting) => {
            if (setting.contentType.includes('ff+json')) {
              acc.push(JSON.parse(setting.value));
            }
            return acc;
          }, []);

          patchState({ featureFlags });
        }),
        catchError(err => {
          throw err;
        }),
        finalize(() => {
          const maintenanceModeFlag = getState().featureFlags?.find(
            flag => flag.id === FeatureFlags.maintenanceModeIsActive
          );

          if (maintenanceModeFlag && maintenanceModeFlag.enabled) {
            return;
          } else {
            dispatch(new actions.SetToken());
          }
        })
      );
  }

  @Action(actions.SetCurrentPage)
  setCurrentPage(
    { patchState }: StateContext<CoreStateModel>,
    { currentPage }: actions.SetCurrentPage
  ): void {
    patchState({ currentPage });
  }

  @Action(actions.AddFilteredBuyer)
  addFilteredBuyer(
    { dispatch, getState, patchState }: StateContext<CoreStateModel>,
    { buyer }: actions.AddFilteredBuyer
  ): void {
    patchState({
      filteredBuyers: [...getState().filteredBuyers, buyer],
    });

    localStorage.setItem('filteredBuyers', JSON.stringify(getState().filteredBuyers));

    dispatch([
      new actions.QueryDocumentCardSetCounts(),
      new actions.AddBuyerToWebSocketsGroup([buyer.id]),
    ]);
  }

  @Action(actions.RemoveFilteredBuyer)
  removeFilteredBuyer(
    { dispatch, getState, patchState }: StateContext<CoreStateModel>,
    { buyer }: actions.RemoveFilteredBuyer
  ): void {
    const filteredBuyers = getState().filteredBuyers.filter(fb => fb.id !== buyer.id);

    patchState({
      filteredBuyers,
      buyerModalOpenedCount:
        filteredBuyers.length === 0
          ? getState().buyerModalOpenedCount + 1
          : getState().buyerModalOpenedCount,
    });

    localStorage.setItem('filteredBuyers', JSON.stringify(filteredBuyers));

    if (filteredBuyers.length === 0) {
      dispatch([
        new actions.RemoveBuyerFromWebSocketsGroup(buyer.id),
        new actions.OpenFilteredBuyersModal(),
      ]);
    } else {
      dispatch([
        new actions.QueryDocumentCardSetCounts(),
        new actions.RemoveBuyerFromWebSocketsGroup(buyer.id),
      ]);
    }
  }

  @Action(actions.OpenFilteredBuyersModal)
  openFilteredBuyersModal({
    dispatch,
    getState,
    patchState,
  }: StateContext<CoreStateModel>): Observable<Buyer[]> {
    const orgNames$ = this.store.select(state => state.core.orgNames);
    const buyerModalOpenedCount = getState().buyerModalOpenedCount;

    return orgNames$.pipe(
      filter(name => name.length > 0),
      mergeMap(orgNames => this.pageHelperService.openFilteredBuyersModal(orgNames)),
      tap(selectedBuyers => {
        localStorage.setItem('filteredBuyers', JSON.stringify(selectedBuyers));
        patchState({
          filteredBuyers: selectedBuyers,
          buyerModalOpenedCount: buyerModalOpenedCount + 1,
        });

        dispatch(new actions.AddBuyerToWebSocketsGroup(selectedBuyers.map(buyer => buyer.id)));
      })
    );
  }

  @Action(actions.SetResearchPageEscalationCategoryList)
  setResearchPageEscalationCategoryList(
    { patchState }: StateContext<CoreStateModel>,
    { researchPageEscalationCategoryList }: actions.SetResearchPageEscalationCategoryList
  ): void {
    patchState({ researchPageEscalationCategoryList });
  }

  @Action(actions.GetPaymentTerms)
  getPaymentTerms(_: StateContext<CoreStateModel>): Observable<LookupPaymentTerms[]> {
    if (this.indexingHelperService.getPaymentTerms()?.length > 0) {
      return null;
    }

    return this.lookupApiService.getPaymentTerms().pipe(
      tap((response: LookupPaymentTerms[]) => {
        this.indexingHelperService.setPaymentTerms(response);
      }),
      catchError((err: HttpErrorResponse) => {
        throw err;
      })
    );
  }

  @Action(actions.UpdatePendingQueueCount)
  updatePendingQueueCount({ getState }: StateContext<CoreStateModel>): void {
    const orgIds = getState().filteredBuyers.map(buyer => buyer.id);
    const state = this.store.selectSnapshot(state => state);

    const pendingRequest = this.documentSearchHelperService.getCountAggregateRequest(
      SearchContext.AvidSuite,
      this.pageHelperService.getPendingPageFilters(state, orgIds)
    );

    this.socketService.getQueueCount(pendingRequest, 'onPendingQueueCount');
  }

  @Action(actions.UpdateResearchQueueCount)
  updateResearchQueueCount({ getState }: StateContext<CoreStateModel>): void {
    const orgIds = getState().filteredBuyers.map(buyer => buyer.id);
    const state = this.store.selectSnapshot(state => state);

    const researchRequest = this.documentSearchHelperService.getCountAggregateRequest(
      SearchContext.AvidSuite,
      this.pageHelperService.getResearchPageFilters(
        state,
        orgIds,
        getState().researchPageEscalationCategoryList
      )
    );

    this.socketService.getQueueCount(researchRequest, 'onResearchQueueCount');
  }

  @Action(actions.UpdateUploadsQueueCount)
  updateUploadsQueueCount({ getState }: StateContext<CoreStateModel>): void {
    const orgIds = getState().filteredBuyers.map(buyer => buyer.id);
    const state = this.store.selectSnapshot(state => state);

    const uploadsQueueCountRequest = this.documentSearchHelperService.getCountAggregateRequest(
      SearchContext.AvidSuite,
      this.pageHelperService.getUploadsPageFilters(
        state,
        orgIds,
        getState().userAccount?.preferred_username
      )
    );

    this.socketService.getQueueCount(uploadsQueueCountRequest, 'onUploadsQueueCount');
  }

  @Action(actions.UpdateRecycleBinQueueCount)
  updateRecycleBinQueueCount({ getState }: StateContext<CoreStateModel>): void {
    const orgIds = getState().filteredBuyers.map(buyer => buyer.id);
    const state = this.store.selectSnapshot(state => state);

    const recycleBinRequest = this.documentSearchHelperService.getCountAggregateRequest(
      SearchContext.AvidSuite,
      this.pageHelperService.getRecycleBinPageFilters(
        state,
        orgIds,
        this.pageHelperService.getDateRange(31)
      )
    );

    this.socketService.getQueueCount(recycleBinRequest, 'onRecycleBinQueueCount');
  }

  @Action(actions.UnlockDocument)
  unlockDocument(
    { dispatch }: StateContext<CoreStateModel>,
    { documentId, buyerId }: actions.UnlockDocument
  ): Observable<void> {
    let buyerIdUnlock: string;
    buyerIdUnlock = this.store.selectSnapshot(state => state.indexingPage.buyerId);
    buyerIdUnlock = !buyerIdUnlock ? buyerId : buyerIdUnlock;

    if (!buyerIdUnlock) {
      return EMPTY;
    } else {
      buyerIdUnlock = buyerIdUnlock.toString();
    }

    if (this.store.selectSnapshot(state => state.indexingPage.allowedToUnlockDocument)) {
      return this.xdcService.unlockDocument(documentId).pipe(
        retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
        tap(() => {
          dispatch(new actions.SendUnlockMessage(documentId, buyerIdUnlock));
          if (buyerId !== '') {
            this.toast.success('Document unlocked.');
          }
        }),
        catchError((err: HttpErrorResponse) => {
          const toastMessage = `Invoice ${documentId} failed to unlock.`;
          this.toast.error(toastMessage);
          throw err;
        })
      );
    }
    return EMPTY;
  }
}
