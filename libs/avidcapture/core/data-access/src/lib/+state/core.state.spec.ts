import { fakeAsync, tick } from '@angular/core/testing';
import {
  getAggregateBodyRequest,
  getBuyersStub,
  getCompositeDataStub,
  getDocuments,
  getPendingPageFiltersStub,
  getRecycleBinPageFiltersStub,
  getResearchPageFiltersStub,
  getUploadsPageFiltersStub,
  hasAllTheClaimsTokenStub,
  hasAllTheRolesTokenStub,
  hasNoClaimsTokenStub,
  noPendingQueueClaim,
  singleOrgTokenStub,
  userAccountStub,
} from '@ui-coe/avidcapture/shared/test';
import {
  AggregateBodyRequest,
  AppPages,
  EscalationCategoryTypes,
  FeatureFlags,
  LookupPaymentTerms,
  SearchContext,
  SecurityAttributes,
  UserMenuOptions,
} from '@ui-coe/avidcapture/shared/types';
import { of, throwError } from 'rxjs';

import * as coreActions from './core.actions';
import { CoreState } from './core.state';

describe('CoreState', () => {
  const stateContextStub = {
    getState: jest.fn(),
    setState: jest.fn(),
    patchState: jest.fn(),
    dispatch: jest.fn(),
  };
  const xdcServiceStub = {
    postAggregateSearch: jest.fn(),
    postAggregateBulkSearch: jest.fn(),
    unlockDocument: jest.fn(),
  };
  const authServiceStub = {
    getAccessToken: jest.fn(),
    getUserInfo: jest.fn(),
    getIdToken: jest.fn(),
    logout: jest.fn(),
    getAvidAuthLoginUrl: jest.fn(),
    refreshToken: jest.fn(),
  };
  const socketServiceStub = {
    createConnection: jest.fn(),
    startLockHeartbeat: jest.fn(),
    removeExpiredLocks: jest.fn(),
    refreshConnection: jest.fn(),
    addToGroup: jest.fn(),
    removeFromGroup: jest.fn(),
    sendLockMessage: jest.fn(),
    sendUnlockMessage: jest.fn(),
    getQueueCount: jest.fn(),
  };
  const featureFlagServiceStub = {
    getAllFeatureFlags: jest.fn(),
  };

  const documentSearchHelperServiceStub = {
    getAggregateRequestBody: jest.fn(),
    getColumnSortedData: jest.fn(),
    getContainsAggregateRequest: jest.fn(),
    getCountAggregateRequest: jest.fn(),
    getCountAggregateWithAliasRequest: jest.fn(),
  };
  const retryServiceStub = {
    retryApiCall: jest.fn(),
  };
  const pageHelperServiceStub = {
    openFilteredBuyersModal: jest.fn(),
    getDateRange: jest.fn(),
    getPendingPageFilters: jest.fn(() => getPendingPageFiltersStub()),
    getResearchPageFilters: jest.fn(() => getResearchPageFiltersStub()),
    getRecycleBinPageFilters: jest.fn(() => getRecycleBinPageFiltersStub()),
    getUploadsPageFilters: jest.fn(() => getUploadsPageFiltersStub()),
  };

  const bkwServiceStub = {
    postAggregateSearch: jest.fn(),
  };

  const storeStub = {
    selectSnapshot: jest.fn(),
    select: jest.fn(),
  };

  const toastStub = {
    warning: jest.fn(),
    error: jest.fn(),
  };

  const indexingHelperServiceStub = {
    getPaymentTerms: jest.fn(),
    setPaymentTerms: jest.fn(),
  };

  const lookupApiServiceStub = {
    getPaymentTerms: jest.fn(),
  };

  const environmentStub = {
    avidAuthBaseUri: 'https://mock/',
    avidAuthLoginUrl: 'https://login.qa.avidsuite.com/',
    appConfigConnectionString: 'mock',
  };

  const coreState = new CoreState(
    authServiceStub as any,
    xdcServiceStub as any,
    socketServiceStub as any,
    featureFlagServiceStub as any,
    documentSearchHelperServiceStub as any,
    retryServiceStub as any,
    pageHelperServiceStub as any,
    bkwServiceStub as any,
    storeStub as any,
    toastStub as any,
    lookupApiServiceStub as any,
    indexingHelperServiceStub as any,
    environmentStub as any
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    it('should return state back for data', () => {
      expect(CoreState.data({ userAccount: { name: 'mock' } } as any)).toStrictEqual({
        userAccount: { name: 'mock' },
      });
    });
  });

  describe('Action: ngxsOnInit', () => {
    beforeEach(() => {
      coreState.ngxsOnInit(stateContextStub);
    });

    it('should dispatch StartWebSockets, QueryAllFeatureFlags, StartChameleon, & SetToken actions', () =>
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
        1,
        new coreActions.QueryAllFeatureFlags()
      ));
  });

  describe('Action: SetToken', () => {
    describe('when token is null', () => {
      it('should not patchState for token or dispatch any actions after 5 tries', fakeAsync(() => {
        authServiceStub.getAccessToken.mockReturnValue(null);
        coreState.setToken(stateContextStub).subscribe();
        tick(5000);
        expect(authServiceStub.getAccessToken).toHaveBeenCalledTimes(5);
        expect(stateContextStub.patchState).not.toHaveBeenCalled();
        expect(stateContextStub.dispatch).not.toHaveBeenCalled();
      }));
    });

    describe('when token is empty string', () => {
      it('should not patchState for token or dispatch any actions after 5 tries', fakeAsync(() => {
        authServiceStub.getAccessToken.mockReturnValue('');
        coreState.setToken(stateContextStub).subscribe();
        tick(5000);
        expect(authServiceStub.getAccessToken).toHaveBeenCalledTimes(5);
        expect(stateContextStub.patchState).not.toHaveBeenCalled();
        expect(stateContextStub.dispatch).not.toHaveBeenCalled();
      }));
    });

    describe('when token is null on 1st try and found 2nd try', () => {
      it('should patchState for token and dispatch actions after the 2nd try', fakeAsync(() => {
        authServiceStub.getAccessToken.mockReturnValue(null);
        coreState.setToken(stateContextStub).subscribe();
        tick(1000);
        expect(authServiceStub.getAccessToken).toHaveBeenCalledTimes(1);
        expect(stateContextStub.patchState).not.toHaveBeenCalled();
        expect(stateContextStub.dispatch).not.toHaveBeenCalled();

        authServiceStub.getAccessToken.mockReturnValue(hasNoClaimsTokenStub);
        tick(1000);
        expect(authServiceStub.getAccessToken).toHaveBeenCalledTimes(2);
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          token: hasNoClaimsTokenStub,
        });
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new coreActions.StartWebSockets(),
          new coreActions.QueryUserRoles(),
          new coreActions.QueryUserAccount(),
        ]);
      }));
    });

    describe('when token has CanViewAllBuyers claim', () => {
      it('should patchState for token and dispatch HandleSponsorUser', fakeAsync(() => {
        authServiceStub.getAccessToken.mockReturnValue(hasAllTheClaimsTokenStub);
        coreState.setToken(stateContextStub).subscribe();
        tick(1000);
        expect(authServiceStub.getAccessToken).toHaveBeenCalledTimes(1);
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          token: hasAllTheClaimsTokenStub,
        });
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new coreActions.StartWebSockets(),
          new coreActions.QueryUserRoles(),
          new coreActions.QueryUserAccount(),
        ]);
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new coreActions.HandleSponsorUser()
        );
      }));
    });
  });

  describe('Action: RefreshToken', () => {
    describe('when refreshToken api returns successfully', () => {
      const token = {
        return_code: '',
        return_data: {
          access_token: hasAllTheClaimsTokenStub,
          expires_in: 0,
          id_token: '',
          scope: '',
          token_type: '',
          refresh_token: '',
        },
      };
      beforeEach(() => {
        authServiceStub.refreshToken.mockReturnValue(of(token));
        coreState.refreshToken(stateContextStub).subscribe();
      });

      it('should patch new refreshed token', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          token: hasAllTheClaimsTokenStub,
          hubConnection: null,
        });
      });

      it('should refresh the hub connection', () => {
        expect(socketServiceStub.refreshConnection).toHaveBeenCalledTimes(1);
      });
    });

    describe('when refreshToken api returns an error', () => {
      const mockedUrl = 'http://mocking.url.mock';

      Object.defineProperty(window, 'location', {
        writable: true,
        value: { replace: jest.fn() },
      });

      beforeEach(() => {
        authServiceStub.refreshToken.mockReturnValue(throwError(() => ({ status: 400 })));
        authServiceStub.getAvidAuthLoginUrl.mockReturnValue(mockedUrl);
      });

      it('should dispatch Logout action', done => {
        coreState.refreshToken(stateContextStub).subscribe({
          next: () => {
            return;
          },
          error: () => {
            expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new coreActions.Logout());
            expect(window.location.replace).toHaveBeenNthCalledWith(1, mockedUrl);
            done();
          },
        });
      });
    });

    describe('When refreshToken api return a token with no roles', () => {
      const mockedUrl = 'http://mocking.url.mock';
      const token = {
        return_code: '',
        return_data: {
          access_token: hasNoClaimsTokenStub,
          expires_in: 0,
          id_token: '',
          scope: '',
          token_type: '',
          refresh_token: '',
        },
      };
      beforeEach(() => {
        authServiceStub.refreshToken.mockReturnValue(of(token));
        coreState.refreshToken(stateContextStub).subscribe();
      });

      it('should dispatch Logout action', () => {
        expect(toastStub.warning).toHaveBeenNthCalledWith(1, 'Session expired');
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new coreActions.Logout());
        expect(window.location.replace).toHaveBeenNthCalledWith(1, mockedUrl);
      });
    });
  });

  describe('Action: QueryUserAccount', () => {
    beforeEach(() => {
      authServiceStub.getUserInfo.mockReturnValue(userAccountStub);
      coreState.queryUserAccount(stateContextStub);
    });

    it('should patchState userAccount with userAccountStub and startChameleon and getPaymentTerms', () => {
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        userAccount: userAccountStub,
      });
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
        new coreActions.StartChameleon(),
        new coreActions.GetPaymentTerms(),
      ]);
    });
  });

  describe('Action: QueryUserRoles', () => {
    describe('when orgIds is NULL', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          token: hasAllTheRolesTokenStub,
        });

        coreState.queryUserRoles(stateContextStub);
      });

      it('should patchState userRoles with some roles & orgIds with empty array', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          userRoles: [
            SecurityAttributes.Accountant,
            SecurityAttributes.Admin,
            SecurityAttributes.Clerk,
            SecurityAttributes.Manager,
            SecurityAttributes.User,
          ],
          orgIds: [],
        });
      });

      it('should dispatch QueryOrgNames action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new coreActions.QueryOrgNames()
        ));
    });

    describe('when orgIds is NOT NULL', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          token: singleOrgTokenStub,
        });

        coreState.queryUserRoles(stateContextStub);
      });

      it('should patchState userRoles with some roles & orgIds with empty array', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          userRoles: [
            'AvidSync',
            'Approver',
            'AI All Queues',
            'Asst. PM',
            'New Role',
            'OrgAdmin',
            'Batching',
            'Global User',
            'Assistant Prop Mgr',
            'PortalAdmin',
            'Research',
            'AC.CustomerAdmin',
            'AC.PortalAdmin',
            'Customer',
          ],
          orgIds: ['1'],
        });
      });

      it('should dispatch QueryOrgNames action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new coreActions.QueryOrgNames()
        ));
    });
  });

  describe('Action: QueryOrgNames', () => {
    const documentsStub = getDocuments();
    const bodyRequestStub: AggregateBodyRequest = {
      Controls: {
        SearchAllPages: true,
        SourceId: SearchContext.AvidSuite,
      },
      Filters: {
        buyerId: ['25'],
      } as any,
      GroupBy: ['buyerName', 'buyerId'],
    };

    const buyersStub = [{ id: '25', name: 'AVIDXCHANGE, INC' }];

    describe('when receiving data back from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          orgIds: ['25'],
          token: hasNoClaimsTokenStub,
        });

        documentSearchHelperServiceStub.getAggregateRequestBody.mockReturnValue(bodyRequestStub);
        bkwServiceStub.postAggregateSearch.mockReturnValue(of(documentsStub));
        coreState.queryOrgNames(stateContextStub).subscribe();
      });

      it('should of called documentSearchHelperService getAggregateRequestBody function', () =>
        expect(documentSearchHelperServiceStub.getAggregateRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          filters: {
            sourceSystemBuyerId: ['25'] as any,
            indexingSolutionId: ['2'],
            portalStatus: ['active'],
          },
          groupBy: ['buyerName', 'sourceSystemBuyerId'],
        }));

      it('should of called xdcService postAggregateSearch api', () =>
        expect(bkwServiceStub.postAggregateSearch).toHaveBeenNthCalledWith(1, bodyRequestStub));

      it('should patchState buyers with buyersStub', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          orgNames: buyersStub,
          filteredBuyers: buyersStub,
        }));
    });

    describe('when receiving an error back from the API', () => {
      beforeEach(() => {
        bkwServiceStub.postAggregateSearch.mockReturnValue(throwError(() => ({ status: 500 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 500 })));
      });

      it('should patchState with an empty buyerName', done => {
        coreState.queryOrgNames(stateContextStub).subscribe({
          next: () => {
            return;
          },
          error: () => {
            expect(bkwServiceStub.postAggregateSearch).toHaveBeenNthCalledWith(1, bodyRequestStub);
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
              orgNames: [{ id: '25', name: '' }],
              filteredBuyers: [{ id: '25', name: '' }],
            });
            done();
          },
        });
      });
    });
  });

  describe('Action:QueryAllOrgNames', () => {
    const documentsStub = getDocuments();
    const bodyRequestCanViewAllBuyers: AggregateBodyRequest = {
      Controls: {
        SearchAllPages: true,
        SourceId: SearchContext.AvidSuite,
      },
      Filters: {
        buyerId: [],
        documentId: ['-nothing'],
      } as any,
      GroupBy: ['buyerName', 'buyerId'],
    };
    describe('When user has CanViewAlBuyers claim', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          orgIds: ['25'],
          token: hasAllTheClaimsTokenStub,
        });

        documentSearchHelperServiceStub.getAggregateRequestBody.mockReturnValue(
          bodyRequestCanViewAllBuyers
        );
        bkwServiceStub.postAggregateSearch.mockReturnValue(of(documentsStub));
        coreState.queryAllOrgNames(stateContextStub).subscribe();
      });

      it('should of called documentSearchHelperService getAggregateRequestBody function', () =>
        expect(documentSearchHelperServiceStub.getAggregateRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          filters: {
            indexingSolutionId: ['2'],
            portalStatus: ['active'],
          },
          groupBy: ['buyerName', 'sourceSystemBuyerId'],
        }));

      it('should of called xdcService postAggregateSearch api', () =>
        expect(bkwServiceStub.postAggregateSearch).toHaveBeenNthCalledWith(
          1,
          bodyRequestCanViewAllBuyers
        ));
    });

    describe('when receiving an error back from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          orgIds: ['25'],
          token: hasAllTheClaimsTokenStub,
        });
        documentSearchHelperServiceStub.getAggregateRequestBody.mockReturnValue(
          bodyRequestCanViewAllBuyers
        );
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 500 })));
        bkwServiceStub.postAggregateSearch.mockReturnValue(throwError(() => ({ status: 500 })));
      });

      it('should NOT patchState', done => {
        coreState.queryAllOrgNames(stateContextStub).subscribe({
          next: () => {
            return;
          },
          error: () => {
            expect(bkwServiceStub.postAggregateSearch).toHaveBeenNthCalledWith(
              1,
              bodyRequestCanViewAllBuyers
            );
            expect(stateContextStub.patchState).not.toHaveBeenCalled();

            done();
          },
        });
      });
    });
  });

  describe('Action: HandleSponsorUser', () => {
    describe('when filteredBuyers is an empty array', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ filteredBuyers: [] });
        coreState.handleSponsorUser(stateContextStub);
      });

      it('should dispatch QueryAllOrgNames & OpenFilteredBuyersModal actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new coreActions.QueryAllOrgNames(),
          new coreActions.OpenFilteredBuyersModal(),
        ]));
    });

    describe('when filteredBuyers has buyers in the array', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          filteredBuyers: [{ id: '25', name: 'AvidXchange Inc' }],
        });
        coreState.handleSponsorUser(stateContextStub);
      });

      it('should only dispatch QueryAllOrgNames action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new coreActions.QueryAllOrgNames()
        ));
    });
  });

  describe('Action: Logout', () => {
    beforeEach(() => {
      jest.spyOn(window.localStorage.__proto__, 'clear').mockImplementation();
      jest.spyOn(window.sessionStorage.__proto__, 'clear').mockImplementation();
      Object.defineProperty(window, 'location', {
        value: new URL('http://localhost/'),
      });
      coreState.logout();
    });

    it('should clear localStorage', () => expect(localStorage.clear).toHaveBeenCalled());

    it('should clear sessionStorage', () => expect(sessionStorage.clear).toHaveBeenCalled());

    it('should navigate to login page', () =>
      expect(window.location.href).toEqual('https://login.qa.avidsuite.com/'));
  });

  describe('Action: HttpRequestActive', () => {
    beforeEach(() => {
      coreState.httpRequestActive(stateContextStub);
    });

    it('should patchState isLoading to true', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        isLoading: true,
      }));
  });

  describe('Action: HttpRequestComplete', () => {
    beforeEach(() => {
      coreState.httpRequestComplete(stateContextStub);
    });

    it('should patchState isLoading to false', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        isLoading: false,
      }));
  });

  describe('Action: QueryDocumentCardSetCounts', () => {
    describe('when user has all queue claims', () => {
      const documentTypes = [
        AppPages.Queue,
        AppPages.Research,
        AppPages.RecycleBin,
        AppPages.UploadsQueue,
      ];

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            pendingPage: {},
            researchPage: {},
            recycleBinPage: {},
            uploadsQueuePage: {},
          })
        );
        stateContextStub.getState.mockReturnValue({
          filteredBuyers: getBuyersStub(),
          token: hasAllTheClaimsTokenStub,
          researchPageEscalationCategoryList: [],
          userAccount: {
            preferred_username: 'mock',
          },
        });
        xdcServiceStub.postAggregateBulkSearch.mockReturnValueOnce(
          of([
            { isSubmitted: [0], [AppPages.Queue]: 1 },
            { isSubmitted: [0], [AppPages.Research]: 1 },
            { isSubmitted: [0], [AppPages.RecycleBin]: 1 },
            { isSubmitted: [0], [AppPages.UploadsQueue]: 1 },
          ])
        );

        coreState.queryDocumentCardSetCounts(stateContextStub).subscribe();
      });

      documentTypes.forEach((type, index) => {
        let filtersStub = {};

        switch (type) {
          case AppPages.Queue:
            filtersStub = getPendingPageFiltersStub();
            break;
          case AppPages.Research:
            filtersStub = getResearchPageFiltersStub();
            break;
          case AppPages.RecycleBin:
            filtersStub = getRecycleBinPageFiltersStub();
            break;
          case AppPages.UploadsQueue:
            filtersStub = getUploadsPageFiltersStub();
            break;
        }
        it(`should call documentSearchHelperService getCountAggregateWithAliasRequest with ${type} filters`, () =>
          expect(
            documentSearchHelperServiceStub.getCountAggregateWithAliasRequest
          ).toHaveBeenNthCalledWith(index + 1, SearchContext.AvidSuite, filtersStub, type));
      });

      it(`should patchState the count for each document type `, () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          documentCount: 1,
          escalationCount: 1,
          recycleBinCount: 1,
          myUploadsCount: 1,
        }));

      it('should patchState for buyerCount when action finalizes', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(2, { buyerCount: 3 }));
    });

    describe('when user does not have the Pending Queue Claim AND Recycle Bin Page Claim', () => {
      const documentTypes = [AppPages.Research, AppPages.UploadsQueue];

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            pendingPage: {},
            researchPage: {},
            recycleBinPage: {},
            uploadsQueuePage: {},
          })
        );
        stateContextStub.getState.mockReturnValue({
          filteredBuyers: getBuyersStub(),
          token: noPendingQueueClaim,
          researchPageEscalationCategoryList: [],
          userAccount: {
            preferred_username: 'mock',
          },
        });
        xdcServiceStub.postAggregateBulkSearch.mockReturnValueOnce(
          of([
            { isSubmitted: [0], [AppPages.Research]: 1 },
            { isSubmitted: [0], [AppPages.UploadsQueue]: 1 },
          ])
        );

        coreState.queryDocumentCardSetCounts(stateContextStub).subscribe();
      });

      documentTypes.forEach((type, index) => {
        let filtersStub = {};

        switch (type) {
          case AppPages.Queue:
            filtersStub = getPendingPageFiltersStub();
            break;
          case AppPages.Research:
            filtersStub = getResearchPageFiltersStub();
            break;
          case AppPages.RecycleBin:
            filtersStub = getRecycleBinPageFiltersStub();
            break;
          case AppPages.UploadsQueue:
            filtersStub = getUploadsPageFiltersStub();
            break;
        }
        it(`should call documentSearchHelperService getCountAggregateWithAliasRequest with ${type} filters`, () =>
          expect(
            documentSearchHelperServiceStub.getCountAggregateWithAliasRequest
          ).toHaveBeenNthCalledWith(index + 1, SearchContext.AvidSuite, filtersStub, type));
      });

      it(`should patchState the count for each document type `, () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          documentCount: 0,
          escalationCount: 1,
          recycleBinCount: 0,
          myUploadsCount: 1,
        }));

      it('should patchState for buyerCount when action finalizes', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(2, { buyerCount: 3 }));
    });

    describe('when uploads queue does not have any documents', () => {
      const documentTypes = [AppPages.UploadsQueue];

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            pendingPage: {},
            researchPage: {},
            recycleBinPage: {},
            uploadsQueuePage: {},
          })
        );
        stateContextStub.getState.mockReturnValue({
          filteredBuyers: getBuyersStub(),
          token: hasNoClaimsTokenStub,
          researchPageEscalationCategoryList: [],
          userAccount: {
            preferred_username: 'mock',
          },
        });
        xdcServiceStub.postAggregateBulkSearch.mockReturnValueOnce(
          of([
            { isSubmitted: [0], [AppPages.Queue]: 1 },
            { isSubmitted: [0], [AppPages.Research]: 1 },
            { isSubmitted: [0], [AppPages.RecycleBin]: 1 },
          ])
        );

        coreState.queryDocumentCardSetCounts(stateContextStub).subscribe();
      });

      documentTypes.forEach((type, index) => {
        let filtersStub = {};

        switch (type) {
          case AppPages.Queue:
            filtersStub = getPendingPageFiltersStub();
            break;
          case AppPages.Research:
            filtersStub = getResearchPageFiltersStub();
            break;
          case AppPages.RecycleBin:
            filtersStub = getRecycleBinPageFiltersStub();
            break;
          case AppPages.UploadsQueue:
            filtersStub = getUploadsPageFiltersStub();
            break;
        }
        it(`should call documentSearchHelperService getCountAggregateWithAliasRequest with ${type} filters`, () =>
          expect(
            documentSearchHelperServiceStub.getCountAggregateWithAliasRequest
          ).toHaveBeenNthCalledWith(index + 1, SearchContext.AvidSuite, filtersStub, type));
      });

      it(`should patchState the count for each document type `, () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          documentCount: 1,
          escalationCount: 1,
          recycleBinCount: 1,
          myUploadsCount: 0,
        }));

      it('should patchState for buyerCount when action finalizes', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(2, { buyerCount: 3 }));
    });

    describe('when user has no claims', () => {
      const documentTypes = [AppPages.UploadsQueue];

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            pendingPage: {},
            researchPage: {},
            recycleBinPage: {},
            uploadsQueuePage: {},
          })
        );
        stateContextStub.getState.mockReturnValue({
          filteredBuyers: getBuyersStub(),
          token: hasNoClaimsTokenStub,
          researchPageEscalationCategoryList: [],
          userAccount: {
            preferred_username: 'mock',
          },
        });
        xdcServiceStub.postAggregateBulkSearch.mockReturnValueOnce(
          of([{ isSubmitted: [0], [AppPages.UploadsQueue]: 1 }])
        );

        coreState.queryDocumentCardSetCounts(stateContextStub).subscribe();
      });

      documentTypes.forEach((type, index) => {
        let filtersStub = {};

        switch (type) {
          case AppPages.Queue:
            filtersStub = getPendingPageFiltersStub();
            break;
          case AppPages.Research:
            filtersStub = getResearchPageFiltersStub();
            break;
          case AppPages.RecycleBin:
            filtersStub = getRecycleBinPageFiltersStub();
            break;
          case AppPages.UploadsQueue:
            filtersStub = getUploadsPageFiltersStub();
            break;
        }
        it(`should call documentSearchHelperService getCountAggregateWithAliasRequest with ${type} filters`, () =>
          expect(
            documentSearchHelperServiceStub.getCountAggregateWithAliasRequest
          ).toHaveBeenNthCalledWith(index + 1, SearchContext.AvidSuite, filtersStub, type));
      });

      it(`should patchState the count for each document type `, () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          documentCount: 0,
          escalationCount: 0,
          recycleBinCount: 0,
          myUploadsCount: 1,
        }));

      it('should patchState for buyerCount when action finalizes', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(2, { buyerCount: 3 }));
    });

    describe('when bulk aggregate request fails', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            pendingPage: {},
            researchPage: {},
            recycleBinPage: {},
            uploadsQueuePage: {},
          })
        );
        stateContextStub.getState.mockReturnValue({
          filteredBuyers: getBuyersStub(),
          token: hasAllTheClaimsTokenStub,
          researchPageEscalationCategoryList: [],
          userAccount: {
            preferred_username: 'mock',
          },
        });
        xdcServiceStub.postAggregateBulkSearch.mockReturnValue(throwError(() => ({ status: 500 })));
      });

      it('should patchState 0 for all counts', done => {
        coreState.queryDocumentCardSetCounts(stateContextStub).subscribe({
          next: () => {
            return;
          },
          error: () => {
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
              documentCount: 0,
              escalationCount: 0,
              recycleBinCount: 0,
              myUploadsCount: 0,
            });
            done();
          },
        });
      });
    });
  });

  describe('Action: StartWebSockets', () => {
    const hubConnectionStub = {} as any;

    beforeEach(() => {
      socketServiceStub.createConnection.mockReturnValue(hubConnectionStub);
      coreState.startWebSockets(stateContextStub);
    });

    it('should call socketService createConnection function', () =>
      expect(socketServiceStub.createConnection).toHaveBeenCalledTimes(1));

    it('should patchState with the hubConnection', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        hubConnection: hubConnectionStub,
      }));
  });

  describe('Action: UpdateWebSocketConnection', () => {
    const hubConnectionStub = {} as any;

    beforeEach(() => {
      coreState.updateWebSocketConnection(stateContextStub, { hubConnection: hubConnectionStub });
    });

    it('should patchState with the hubConnection', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        hubConnection: hubConnectionStub,
      }));
  });

  describe('Action: ConfigureWebSocketGroups', () => {
    describe('when is a sponsor user and there are already filtered buyers selected', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          token: hasAllTheClaimsTokenStub,
          filteredBuyers: getBuyersStub(),
        });
        coreState.configureWebSocketGroups(stateContextStub);
      });

      it('should dispatch the AddBuyerToWebSocketsGroup & AddUsernameToWebSocketsGroup actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new coreActions.AddBuyerToWebSocketsGroup(getBuyersStub().map(b => b.id)),
          new coreActions.AddUsernameToWebSocketsGroup(),
        ]));
    });

    describe('when is a sponsor user and there are NO filtered buyers selected', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          token: hasAllTheClaimsTokenStub,
          filteredBuyers: [],
        });
        coreState.configureWebSocketGroups(stateContextStub);
      });

      it('should not dispatch any actions', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenCalled());
    });

    describe('when user is NOT a sponsor user', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          token: hasNoClaimsTokenStub,
          filteredBuyers: getBuyersStub(),
          orgIds: ['1'],
        });
        coreState.configureWebSocketGroups(stateContextStub);
      });

      it('should dispatch the AddBuyerToWebSocketsGroup & AddUsernameToWebSocketsGroup actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new coreActions.AddBuyerToWebSocketsGroup(['1']),
          new coreActions.AddUsernameToWebSocketsGroup(),
        ]));
    });
  });

  describe('Action: AddUsernameToWebSocketsGroup', () => {
    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({
        userAccount: userAccountStub,
      });
      coreState.addUsernameToWebSocketsGroup(stateContextStub);
    });

    it('should call socketService addToGroup function', () =>
      expect(socketServiceStub.addToGroup).toHaveBeenNthCalledWith(1, ['Avid Xer']));
  });

  describe('Action: AddBuyerToWebSocketsGroup', () => {
    beforeEach(() => {
      coreState.addBuyerToWebSocketsGroup(stateContextStub, { buyerIds: ['1'] });
    });

    it('should call socketService addToGroup function', () =>
      expect(socketServiceStub.addToGroup).toHaveBeenNthCalledWith(1, ['1']));
  });

  describe('Action: RemoveBuyerFromWebSocketsGroup', () => {
    beforeEach(() => {
      coreState.removeBuyerFromWebSocketsGroup(stateContextStub, { buyerId: '1' });
    });

    it('should call socketService removeFromGroup function', () =>
      expect(socketServiceStub.removeFromGroup).toHaveBeenNthCalledWith(1, '1'));
  });

  describe('Action: StartLockHeartbeat', () => {
    const documentId = '0000001';
    beforeEach(() => {
      coreState.startLockHeartbeat(stateContextStub, { documentId, buyerId: '25' });
    });

    it('should call socketService startLockHeartbeat function', () =>
      expect(socketServiceStub.startLockHeartbeat).toHaveBeenNthCalledWith(1, documentId, '25'));
  });

  describe('Action: RemoveExpiredLocks', () => {
    beforeEach(() => {
      coreState.removeExpiredLocks();
    });

    it('should call socketService removeExpiredLocks function', () =>
      expect(socketServiceStub.removeExpiredLocks).toHaveBeenCalledTimes(1));
  });

  describe('Action: UpdatePendingDocumentCount', () => {
    beforeEach(() => {
      coreState.updatePendingDocumentCount(stateContextStub, { documentCount: 4 });
    });

    it('should patchState for documentCount', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        documentCount: 4,
      }));
  });

  describe('Action: UpdateEscalationDocumentCount', () => {
    beforeEach(() => {
      coreState.updateEscalationDocumentCount(stateContextStub, { escalationCount: 4 });
    });

    it('should patchState for escalationCount', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        escalationCount: 4,
      }));
  });

  describe('Action: UpdateUploadsDocumentCount', () => {
    beforeEach(() => {
      coreState.updateUploadsDocumentCount(stateContextStub, { myUploadsCount: 4 });
    });

    it('should patchState for myUploadsCount', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        myUploadsCount: 4,
      }));
  });

  describe('Action: UpdateRecycleBinDocumentCount', () => {
    beforeEach(() => {
      coreState.updateRecycleBinDocumentCount(stateContextStub, { recycleBinCount: 4 });
    });

    it('should patchState for recycleBinCount', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        recycleBinCount: 4,
      }));
  });

  describe('Action: SendLockMessage', () => {
    beforeEach(() => {
      coreState.sendLockMessage(stateContextStub, {
        username: 'username',
        documentId: 'docId',
        buyerId: '1',
      });
    });

    it('should call socketService sendLockMessage function', () =>
      expect(socketServiceStub.sendLockMessage).toHaveBeenNthCalledWith(
        1,
        'username',
        'docId',
        '1'
      ));
  });

  describe('Action: SendUnlockMessage', () => {
    beforeEach(() => {
      coreState.sendUnlockMessage(stateContextStub, {
        documentId: 'docId',
        buyerId: '1',
      });
    });

    it('should call socketService sendUnlockMessage function', () =>
      expect(socketServiceStub.sendUnlockMessage).toHaveBeenNthCalledWith(1, 'docId', '1'));
  });

  describe('Action: StartChameleon', () => {
    describe('when userAccount is NOT NULL', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          userAccount: userAccountStub,
        });
      });

      it('should not start chameleon if chmln is null', () => {
        coreState.startChameleon(stateContextStub);
        expect((window as any).chmln).toBe(undefined);
      });

      it('should start chameleon if chmln is not null', () => {
        let wasCalled = false;
        (window as any).chmln = {
          identify(): any {
            wasCalled = true;
          },
        };
        coreState.startChameleon(stateContextStub);
        expect(wasCalled).toBe(true);
      });
    });

    describe('when userAccount is NULL', () => {
      it('should start chameleon if chmln is not null', () => {
        stateContextStub.getState.mockReturnValue({
          userAccount: null,
        });
        let wasCalled = false;
        (window as any).chmln = {
          identify(): any {
            wasCalled = true;
          },
        };
        coreState.startChameleon(stateContextStub);
        expect(wasCalled).toBeFalsy();
      });
    });
  });

  describe('Action: AddMenuOptions', () => {
    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({
        userMenuOptions: [{ text: UserMenuOptions.ClientGuidelines }],
      });
      coreState.addMenuOptions(stateContextStub, {
        menuOption: { text: UserMenuOptions.HotkeyGuide },
      });
    });

    it('should add hotkeyguide to menu options', () => {
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        userMenuOptions: [
          { text: UserMenuOptions.ClientGuidelines },
          { text: UserMenuOptions.HotkeyGuide },
        ],
      });
    });
  });

  describe('Action: RemoveMenuOptions', () => {
    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({
        userMenuOptions: [
          { text: UserMenuOptions.ClientGuidelines },
          { text: UserMenuOptions.HotkeyGuide },
        ],
      });
      coreState.removeMenuOptions(stateContextStub, {
        menuOption: { text: UserMenuOptions.HotkeyGuide },
      });
    });

    it('should remove hotkeyguide to menu options', () => {
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        userMenuOptions: [{ text: UserMenuOptions.ClientGuidelines }],
      });
    });
  });

  describe('Action: QueryAllFeatureFlags', () => {
    describe('when contentType is a feature flag', () => {
      const configurationSettingsStub = [
        {
          contentType: 'application/vnd.microsoft.appconfig.ff+json;charset=utf-8',
          value: JSON.stringify({
            id: 'Indexing.Xdc.InvoiceUploadIsActive',
            description: '',
            enabled: false,
            conditions: { client_filters: [] },
          }),
        },
      ];
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          featureFlags: null,
        });

        featureFlagServiceStub.getAllFeatureFlags.mockReturnValue(of(configurationSettingsStub));
        coreState.queryAllFeatureFlags(stateContextStub).subscribe();
      });

      it('should patchState a parsed configuration setting value for featureFlags', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          featureFlags: [JSON.parse(configurationSettingsStub[0].value)],
        });
      });

      it('should dispatch setToken when no feature flags', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new coreActions.SetToken());
      });
    });

    describe('maintenance mode', () => {
      const configurationSettingsStub = [
        {
          contentType: 'application/vnd.microsoft.appconfig.ff+json;charset=utf-8',
          value: JSON.stringify({
            id: 'Indexing.Xdc.InvoiceUploadIsActive',
            description: '',
            enabled: false,
            conditions: { client_filters: [] },
          }),
        },
      ];

      describe('when maintenance mode is enabled', () => {
        beforeEach(() => {
          stateContextStub.getState.mockReturnValue({
            featureFlags: [
              {
                id: FeatureFlags.maintenanceModeIsActive,
                enabled: true,
              },
            ],
          });

          featureFlagServiceStub.getAllFeatureFlags.mockReturnValue(of(configurationSettingsStub));
          coreState.queryAllFeatureFlags(stateContextStub).subscribe();
        });

        it('should patchState a parsed configuration setting value for featureFlags', () => {
          expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
            featureFlags: [JSON.parse(configurationSettingsStub[0].value)],
          });
        });

        it('should NOT dispatch setToken', () => {
          expect(stateContextStub.dispatch).not.toHaveBeenCalled();
        });
      });

      describe('when maintenance mode is disabled', () => {
        beforeEach(() => {
          featureFlagServiceStub.getAllFeatureFlags.mockReturnValue(of(configurationSettingsStub));
        });

        it('should dispatch setToken when no maintenance mode flag', () => {
          stateContextStub.getState.mockReturnValue({
            featureFlags: [],
          });

          coreState.queryAllFeatureFlags(stateContextStub).subscribe();

          expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new coreActions.SetToken());
        });

        it('should dispatch setToken when maintenance mode flag is disabled', () => {
          stateContextStub.getState.mockReturnValue({
            featureFlags: [
              {
                id: FeatureFlags.maintenanceModeIsActive,
                enabled: false,
              },
            ],
          });

          coreState.queryAllFeatureFlags(stateContextStub).subscribe();

          expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new coreActions.SetToken());
        });
      });
    });

    describe('when contentType is NOT a feature flag', () => {
      const configurationSettingsStub = [
        {
          contentType: 'application/vnd.microsoft.appconfig.kv+json;charset=utf-8',
          value: JSON.stringify({
            id: 'Indexing.Xdc.Sentinel',
            description: '',
            enabled: false,
            conditions: { client_filters: [] },
          }),
        },
      ];
      beforeEach(() => {
        featureFlagServiceStub.getAllFeatureFlags.mockReturnValue(of(configurationSettingsStub));
        coreState.queryAllFeatureFlags(stateContextStub).subscribe();
      });

      it('should patchState with an empty array for featureFlags', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          featureFlags: [],
        });
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        featureFlagServiceStub.getAllFeatureFlags.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
      });

      it('should throw an error toast', done => {
        coreState.queryAllFeatureFlags(stateContextStub).subscribe({
          next: () => {
            return;
          },
          error: err => {
            expect(err).toEqual({ status: 404 });
            done();
          },
        });
      });
    });
  });

  describe('Action: SetCurrentPage', () => {
    beforeEach(() => {
      coreState.setCurrentPage(stateContextStub, { currentPage: AppPages.Queue });
    });

    it('should patchState with currentPage of Queue', () => {
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        currentPage: AppPages.Queue,
      });
    });
  });

  describe('Action: AddFilteredBuyer', () => {
    const buyerStub = getBuyersStub()[0];

    beforeEach(() => {
      jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation();
      stateContextStub.getState.mockReturnValue({
        filteredBuyers: [],
      });
      coreState.addFilteredBuyer(stateContextStub, { buyer: buyerStub });
    });

    it('should patchState with filteredBuyers', () => {
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        filteredBuyers: [buyerStub],
      });
    });

    it('should dispatch QueryDocumentCardSetCounts & AddBuyerToWebSocketsGroup actions', () => {
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
        new coreActions.QueryDocumentCardSetCounts(),
        new coreActions.AddBuyerToWebSocketsGroup([buyerStub.id]),
      ]);
    });
  });

  describe('Action: RemoveFilteredBuyer', () => {
    describe('when filteredBuyers still has other buyers in filter', () => {
      const buyerStub = getBuyersStub()[0];
      const remainingFilteredBuyers = getBuyersStub();
      remainingFilteredBuyers.shift();

      beforeEach(() => {
        jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation();
        stateContextStub.getState.mockReturnValue({
          filteredBuyers: getBuyersStub(),
          buyerModalOpenedCount: 0,
        });
        coreState.removeFilteredBuyer(stateContextStub, { buyer: buyerStub });
      });

      it('should set filteredBuyers into localStorage', () =>
        expect(localStorage.setItem).toHaveBeenNthCalledWith(
          1,
          'filteredBuyers',
          JSON.stringify(remainingFilteredBuyers)
        ));

      it('should patchState with filteredBuyers', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          filteredBuyers: remainingFilteredBuyers,
          buyerModalOpenedCount: 0,
        });
      });

      it('should dispatch QueryDocumentCardSetCounts & RemoveBuyerFromWebSocketsGroup actions', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new coreActions.QueryDocumentCardSetCounts(),
          new coreActions.RemoveBuyerFromWebSocketsGroup(buyerStub.id),
        ]);
      });
    });

    describe('when filteredBuyers is emptied out', () => {
      const buyerStub = getBuyersStub()[0];

      beforeEach(() => {
        jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation();
        stateContextStub.getState.mockReturnValue({
          filteredBuyers: [buyerStub],
          buyerModalOpenedCount: 0,
        });
        coreState.removeFilteredBuyer(stateContextStub, { buyer: buyerStub });
      });

      it('should set filteredBuyers into localStorage', () =>
        expect(localStorage.setItem).toHaveBeenNthCalledWith(
          1,
          'filteredBuyers',
          JSON.stringify([])
        ));

      it('should patchState with filteredBuyers', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          filteredBuyers: [],
          buyerModalOpenedCount: 1,
        });
      });

      it('should dispatch RemoveBuyerFromWebSocketsGroup & OpenFilteredBuyersModal actions', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new coreActions.RemoveBuyerFromWebSocketsGroup(buyerStub.id),
          new coreActions.OpenFilteredBuyersModal(),
        ]);
      });
    });
  });

  describe('Action OpenFilteredBuyersModal', () => {
    describe('when buyerModalOpenedCount is 0', () => {
      const buyersStub = [{ id: '25', name: 'test' }];

      beforeEach(() => {
        jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation();
        stateContextStub.getState.mockReturnValue({ buyerModalOpenedCount: 0 });
        storeStub.select.mockImplementation(cb =>
          of(
            cb({
              core: {
                orgNames: buyersStub,
              },
            })
          )
        );
        pageHelperServiceStub.openFilteredBuyersModal.mockReturnValue(of(buyersStub));
        coreState.openFilteredBuyersModal(stateContextStub).subscribe();
      });

      it('should call pageHelperService openFilteredBuyersModal fn', () =>
        expect(pageHelperServiceStub.openFilteredBuyersModal).toHaveBeenNthCalledWith(
          1,
          buyersStub
        ));

      it('should set filteredBuyers into localStorage', () =>
        expect(localStorage.setItem).toHaveBeenNthCalledWith(
          1,
          'filteredBuyers',
          JSON.stringify(buyersStub)
        ));

      it('should patchState for filteredBuyers after selection has been made from modal and set buyerModalOpenedCount to 0', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          filteredBuyers: buyersStub,
          buyerModalOpenedCount: 1,
        }));

      it('should dispatch AddBuyerToWebSocketsGroup action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new coreActions.AddBuyerToWebSocketsGroup(['25'])
        ));
    });

    describe('when orgNames is NOT NULL', () => {
      const buyersStub = [{ id: '25', name: 'test' }];

      beforeEach(() => {
        jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation();
        stateContextStub.getState.mockReturnValue({ buyerModalOpenedCount: 1 });
        storeStub.select.mockImplementation(cb =>
          of(
            cb({
              core: {
                orgNames: buyersStub,
              },
            })
          )
        );
        pageHelperServiceStub.openFilteredBuyersModal.mockReturnValue(of(buyersStub));
        coreState.openFilteredBuyersModal(stateContextStub).subscribe();
      });

      it('should call pageHelperService openFilteredBuyersModal fn', () =>
        expect(pageHelperServiceStub.openFilteredBuyersModal).toHaveBeenNthCalledWith(
          1,
          buyersStub
        ));

      it('should set filteredBuyers into localStorage', () =>
        expect(localStorage.setItem).toHaveBeenNthCalledWith(
          1,
          'filteredBuyers',
          JSON.stringify(buyersStub)
        ));

      it('should patchState for filteredBuyers after selection has been made from modal and set buyerModalOpenedCount to 0', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          filteredBuyers: buyersStub,
          buyerModalOpenedCount: 2,
        }));
    });

    describe('when orgNames is NULL', () => {
      beforeEach(() => {
        jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation();
        stateContextStub.getState.mockReturnValue({ buyerModalOpenedCount: 0 });
        storeStub.select.mockImplementation(cb =>
          of(
            cb({
              core: {
                orgNames: [],
              },
            })
          )
        );
        pageHelperServiceStub.openFilteredBuyersModal.mockReturnValue(of([]));
        coreState.openFilteredBuyersModal(stateContextStub).subscribe();
      });

      it('should NOT set filteredBuyers into localStorage', () =>
        expect(localStorage.setItem).not.toHaveBeenCalled());

      it('should NOT call pageHelperService openFilteredBuyersModal fn', () =>
        expect(pageHelperServiceStub.openFilteredBuyersModal).not.toHaveBeenCalled());

      it('should NOT dispatch HandleSponsorUserWithBuyers action', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenCalled());
    });
  });

  describe('Action: SetResearchPageEscalationCategoryList', () => {
    beforeEach(() => {
      coreState.setResearchPageEscalationCategoryList(stateContextStub, {
        researchPageEscalationCategoryList: [`-${EscalationCategoryTypes.IndexingOpsQc}`],
      });
    });

    it('should patchState for researchPageEscalationCategoryList', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        researchPageEscalationCategoryList: [`-${EscalationCategoryTypes.IndexingOpsQc}`],
      }));
  });

  describe('Action: getPaymentTerms', () => {
    it('should NOT call lookupApi if localStorage returns data', () => {
      indexingHelperServiceStub.getPaymentTerms.mockReturnValue([
        {
          termTypeId: 1,
          termTypeName: 'test',
          numberDaysUntilDue: 1,
          isEndOfMonth: false,
        } as LookupPaymentTerms,
      ]);
      coreState.getPaymentTerms(stateContextStub);
      expect(lookupApiServiceStub.getPaymentTerms).not.toHaveBeenCalled();
    });

    it('should call lookupApi if localStorage returns NULL', () => {
      indexingHelperServiceStub.getPaymentTerms.mockReturnValue(null);
      lookupApiServiceStub.getPaymentTerms.mockReturnValue(
        of([
          {
            termTypeId: 1,
            termTypeName: 'test',
            numberDaysUntilDue: 1,
            isEndOfMonth: false,
          } as LookupPaymentTerms,
        ])
      );
      coreState.getPaymentTerms(stateContextStub).subscribe();
      expect(indexingHelperServiceStub.setPaymentTerms).toHaveBeenCalled();
    });

    it('should call lookupApi if localStorage returns empty array', () => {
      indexingHelperServiceStub.getPaymentTerms.mockReturnValue([]);
      lookupApiServiceStub.getPaymentTerms.mockReturnValue(
        of([
          {
            termTypeId: 1,
            termTypeName: 'test',
            numberDaysUntilDue: 1,
            isEndOfMonth: false,
          } as LookupPaymentTerms,
        ])
      );
      coreState.getPaymentTerms(stateContextStub).subscribe();
      expect(indexingHelperServiceStub.setPaymentTerms).toHaveBeenCalled();
    });
  });

  describe('Action: UpdatePendingQueueCount', () => {
    beforeEach(() => {
      stateContextStub.getState.mockReturnValueOnce({
        filteredBuyers: [{ id: '25', name: 'AvidXchange' }],
      });
      pageHelperServiceStub.getPendingPageFilters.mockReturnValueOnce(getPendingPageFiltersStub());
      documentSearchHelperServiceStub.getCountAggregateRequest.mockReturnValueOnce(
        getAggregateBodyRequest({ buyerId: ['25'] as any })
      );

      coreState.updatePendingQueueCount(stateContextStub);
    });

    it('should call documentSearchHelperService getCountAggregateRequest function', () =>
      expect(documentSearchHelperServiceStub.getCountAggregateRequest).toHaveBeenNthCalledWith(
        1,
        SearchContext.AvidSuite,
        getPendingPageFiltersStub()
      ));

    it('should call socketService getQueueCount function', () =>
      expect(socketServiceStub.getQueueCount).toHaveBeenNthCalledWith(
        1,
        getAggregateBodyRequest({ buyerId: ['25'] as any }),
        'onPendingQueueCount'
      ));
  });

  describe('Action: UpdateResearchQueueCount', () => {
    beforeEach(() => {
      stateContextStub.getState.mockReturnValueOnce({
        filteredBuyers: [{ id: '25', name: 'AvidXchange' }],
      });
      pageHelperServiceStub.getPendingPageFilters.mockReturnValueOnce(getResearchPageFiltersStub());
      documentSearchHelperServiceStub.getCountAggregateRequest.mockReturnValueOnce(
        getAggregateBodyRequest({ buyerId: ['25'] as any })
      );

      coreState.updateResearchQueueCount(stateContextStub);
    });

    it('should call documentSearchHelperService getCountAggregateRequest function', () =>
      expect(documentSearchHelperServiceStub.getCountAggregateRequest).toHaveBeenNthCalledWith(
        1,
        SearchContext.AvidSuite,
        getResearchPageFiltersStub()
      ));

    it('should call socketService getQueueCount function', () =>
      expect(socketServiceStub.getQueueCount).toHaveBeenNthCalledWith(
        1,
        getAggregateBodyRequest({ buyerId: ['25'] as any }),
        'onResearchQueueCount'
      ));
  });

  describe('Action: UpdateUploadsQueueCount', () => {
    beforeEach(() => {
      stateContextStub.getState.mockReturnValueOnce({
        filteredBuyers: [{ id: '25', name: 'AvidXchange' }],
      });
      pageHelperServiceStub.getPendingPageFilters.mockReturnValueOnce(getUploadsPageFiltersStub());
      documentSearchHelperServiceStub.getCountAggregateRequest.mockReturnValueOnce(
        getAggregateBodyRequest({ buyerId: ['25'] as any })
      );

      coreState.updateUploadsQueueCount(stateContextStub);
    });

    it('should call documentSearchHelperService getCountAggregateRequest function', () =>
      expect(documentSearchHelperServiceStub.getCountAggregateRequest).toHaveBeenNthCalledWith(
        1,
        SearchContext.AvidSuite,
        getUploadsPageFiltersStub()
      ));

    it('should call socketService getQueueCount function', () =>
      expect(socketServiceStub.getQueueCount).toHaveBeenNthCalledWith(
        1,
        getAggregateBodyRequest({ buyerId: ['25'] as any }),
        'onUploadsQueueCount'
      ));
  });

  describe('Action: UpdateRecycleBinQueueCount', () => {
    beforeEach(() => {
      stateContextStub.getState.mockReturnValueOnce({
        filteredBuyers: [{ id: '25', name: 'AvidXchange' }],
      });
      pageHelperServiceStub.getPendingPageFilters.mockReturnValueOnce(
        getRecycleBinPageFiltersStub()
      );
      pageHelperServiceStub.getDateRange.mockReturnValueOnce(['', '']);
      documentSearchHelperServiceStub.getCountAggregateRequest.mockReturnValueOnce(
        getAggregateBodyRequest({ buyerId: ['25'] as any })
      );
      coreState.updateRecycleBinQueueCount(stateContextStub);
    });

    it('should call documentSearchHelperService getCountAggregateRequest function', () =>
      expect(documentSearchHelperServiceStub.getCountAggregateRequest).toHaveBeenNthCalledWith(
        1,
        SearchContext.AvidSuite,
        getRecycleBinPageFiltersStub()
      ));

    it('should call socketService getQueueCount function', () =>
      expect(socketServiceStub.getQueueCount).toHaveBeenNthCalledWith(
        1,
        getAggregateBodyRequest({ buyerId: ['25'] as any }),
        'onRecycleBinQueueCount'
      ));
  });

  describe('Action: UnlockDocument', () => {
    describe('when updateLockStatus is false', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            core: {
              userAccount: {
                preferred_username: 'mockIndexer',
              },
              featureFlags: [{ id: 'Indexing.Xdc.AllEscalationsInternalIsActive', enabled: true }],
            },
            indexingPage: {
              compositeData: getCompositeDataStub(),
              startDate: '',
              allowedToUnlockDocument: false,
              buyerId: 1,
            },
          })
        );
        coreState.unlockDocument(stateContextStub, {
          documentId: '1',
          buyerId: null,
        });
      });

      it('should NOT call xdcService unlockDocument api', () =>
        expect(xdcServiceStub.unlockDocument).not.toHaveBeenCalled());

      it('should NOT dispatch the SendUnlock action', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenCalled());
    });

    describe('when receiving a successful unlock', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            core: {
              userAccount: {
                preferred_username: 'mockIndexer',
              },
              featureFlags: [{ id: 'Indexing.Xdc.AllEscalationsInternalIsActive', enabled: true }],
            },
            indexingPage: {
              compositeData: getCompositeDataStub(),
              startDate: '',
              allowedToUnlockDocument: true,
              buyerId: 1,
            },
          })
        );
        xdcServiceStub.unlockDocument.mockReturnValue(of(null));
        coreState
          .unlockDocument(stateContextStub, {
            documentId: '1',
            buyerId: null,
          })
          .subscribe();
      });

      it('should of called xdcService unlockDocument api', () =>
        expect(xdcServiceStub.unlockDocument).toHaveBeenNthCalledWith(1, '1'));

      it('should dispatch the SendUnlock action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new coreActions.SendUnlockMessage('1', '1')
        ));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        xdcServiceStub.unlockDocument.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should throw an error toast', done => {
        coreState
          .unlockDocument(stateContextStub, {
            documentId: '1',
            buyerId: null,
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(xdcServiceStub.unlockDocument).toHaveBeenNthCalledWith(1, '1');
              expect(toastStub.error).toHaveBeenNthCalledWith(1, 'Invoice 1 failed to unlock.');

              done();
            },
          });
      });
    });

    describe('when buyerId is empty', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            core: {
              userAccount: {
                preferred_username: 'mockIndexer',
              },
              featureFlags: [{ id: 'Indexing.Xdc.AllEscalationsInternalIsActive', enabled: true }],
            },
            indexingPage: {
              compositeData: getCompositeDataStub(),
              startDate: '',
              allowedToUnlockDocument: false,
              buyerId: null,
            },
          })
        );
        coreState.unlockDocument(stateContextStub, {
          documentId: '1',
          buyerId: null,
        });
      });

      it('should NOT call xdcService unlockDocument api', () =>
        expect(xdcServiceStub.unlockDocument).not.toHaveBeenCalled());

      it('should NOT dispatch the SendUnlock action', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenCalled());
    });

    describe('when receiving a successful unlock', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            core: {
              userAccount: {
                preferred_username: 'mockIndexer',
              },
              featureFlags: [{ id: 'Indexing.Xdc.AllEscalationsInternalIsActive', enabled: true }],
            },
            indexingPage: {
              compositeData: getCompositeDataStub(),
              startDate: '',
              allowedToUnlockDocument: true,
              buyerId: null,
            },
          })
        );
        xdcServiceStub.unlockDocument.mockReturnValue(of(null));
        coreState
          .unlockDocument(stateContextStub, {
            documentId: '1',
            buyerId: '25',
          })
          .subscribe();
      });

      it('should of called xdcService unlockDocument api', () =>
        expect(xdcServiceStub.unlockDocument).toHaveBeenNthCalledWith(1, '1'));

      it('should dispatch the SendUnlock action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new coreActions.SendUnlockMessage('1', '25')
        ));
    });

    xdescribe('when buyerId on the state is empty but has an specific buyerId', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            core: {
              userAccount: {
                preferred_username: 'mockIndexer',
              },
              featureFlags: [{ id: 'Indexing.Xdc.AllEscalationsInternalIsActive', enabled: true }],
            },
            indexingPage: {
              compositeData: getCompositeDataStub(),
              startDate: '',
              allowedToUnlockDocument: false,
              buyerId: null,
            },
          })
        );
        xdcServiceStub.unlockDocument.mockReturnValue(of(null));
        coreState
          .unlockDocument(stateContextStub, {
            documentId: '1',
            buyerId: '1',
          })
          .subscribe();
      });
      it('should of called xdcService unlockDocument api', () =>
        expect(xdcServiceStub.unlockDocument).toHaveBeenNthCalledWith(1, '1'));

      it('should dispatch the SendUnlock action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new coreActions.SendUnlockMessage('1', '1')
        ));
    });
  });
});
