import { of, throwError } from 'rxjs';

import { getBuyerFormStub, getBuyerPayloadStub, getBuyersStub } from '../../../testing/test-stubs';
import { SearchApplyFunction, SearchContext } from '../../shared/enums';
import { QueryBuyers } from './home.actions';
import { HomeState } from './home.state';
import { Dictionary } from '@ngrx/entity';

describe('HomeState', () => {
  const stateContextStub = {
    getState: jest.fn(),
    setState: jest.fn(),
    patchState: jest.fn(),
    dispatch: jest.fn(),
  };

  const homeServiceStub = {
    getBuyers: jest.fn(),
    updateBuyer: jest.fn(),
    getAggregateSearch: jest.fn(),
    massVoid: jest.fn(),
  };

  const searchHelperServiceStub = {
    getSearchRequestBody: jest.fn(),
    getAggregateRequestBody: jest.fn(),
  };

  const toastServiceStub = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const storeStub = {
    selectSnapshot: jest.fn(cb =>
      cb({
        core: {
          orgIds: ['25'],
        },
      })
    ),
    select: jest.fn(),
    snapshot: jest.fn(),
  };

  const translateServiceStub = {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    instant: (key: any) => {
      const stubObject: Dictionary<string> = {
        'bkws.home.home-buyer-filter.buyer-search': 'Buyer Search',
        'bkws.home.home-buyer-filter.search': 'search',
        'bkws.home.home-buyer-filter.close': 'close',

        'bkws.home.home-model.confirm': 'Confirm',
        'bkws.home.home-model.cancel': 'Cancel',
        'bkws.home.home-model.close': 'close',

        'bkws.home.home-panel.execute': 'Execute',
        'bkws.home.home-panel.update': 'Update',

        'bkws.home.home-state.executedToast': 'Your changes have been successfully executed',
        'bkws.home.home-state.nonExecutedToast':
          'Oops! Unable to execute the changes. Please try again later',
        'bkws.home.home-state.massVoidExecuted': 'Mass Void has been successfully executed',
        'bkws.home.home-state.massVoidNonExecuted':
          'Oops! Unable to execute Mass Void. Please try again later',
      };
      return stubObject[key];
    },
  };

  const homeState = new HomeState(
    homeServiceStub as any,
    searchHelperServiceStub as any,
    toastServiceStub as any,
    storeStub as any,
    translateServiceStub as any
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    it('should select buyers from state', () =>
      expect(HomeState.buyers({ buyers: getBuyersStub() } as any)).toEqual(getBuyersStub()));

    it('should select canLoadMore from state', () =>
      expect(HomeState.canLoadMore({ canLoadMore: true } as any)).toBeTruthy());

    it('should select filteredBuyers', () => {
      expect(HomeState.filteredBuyers({ filteredBuyers: getBuyersStub() } as any)).toEqual(
        getBuyersStub()
      );
    });

    it('should select resetForm from state', () => {
      expect(HomeState.resetForm({ resetForm: false } as any)).toBeFalsy();
    });
  });

  describe('Action: QueryQueueInvoices', () => {
    describe('on successful call', () => {
      const buyersStub = getBuyersStub();

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          buyers: [],
          pageNumber: 1,
          filters: {
            sourceSystemBuyerId: ['25'],
          },
        });
        homeServiceStub.getBuyers.mockReturnValue(of(buyersStub));

        homeState.queryBuyers(stateContextStub).subscribe();
      });

      it('should call searchHelperService getSearchRequestBody fn', () =>
        expect(searchHelperServiceStub.getSearchRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          filters: {
            sourceSystemBuyerId: ['25'],
          },
          page: '1',
          pageSize: '30',
        }));

      it('should patchState for buyers, pageNumber, and canLoadMore', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          buyers: buyersStub,
          canLoadMore: true,
          filteredBuyers: [],
          pageNumber: 2,
        }));
    });

    describe('when loading more buyers', () => {
      const buyersStub = getBuyersStub();

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          buyers: buyersStub,
          pageNumber: 2,
          filters: {
            sourceSystemBuyerId: ['25'],
          },
          sortField: 'buyerName',
          sortDirection: 'asc',
        });
        homeServiceStub.getBuyers.mockReturnValue(of(buyersStub));

        homeState.queryBuyers(stateContextStub).subscribe();
      });

      it('should call searchHelperService getSearchRequestBody fn', () =>
        expect(searchHelperServiceStub.getSearchRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          filters: {
            sourceSystemBuyerId: ['25'],
          },
          page: '2',
          pageSize: '30',
          sortField: 'buyerName',
          sortDirection: 'asc',
        }));

      it('should patchState for buyers, pageNumber, and canLoadMore', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          buyers: [...buyersStub, ...buyersStub],
          canLoadMore: true,
          filteredBuyers: [],
          pageNumber: 3,
        }));
    });

    describe('when receiving a 404 & pageNumber is 1', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          buyers: [],
          pageNumber: 1,
          filters: {
            sourceSystemBuyerId: ['25'],
          },
        });
        homeServiceStub.getBuyers.mockReturnValue(throwError({ status: 404 }));
      });

      it('should patchState loadMoreHidden as true & buyers as empty array', done => {
        homeState.queryBuyers(stateContextStub).subscribe(
          () => {
            return;
          },
          () => {
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
              canLoadMore: false,
            });

            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(2, {
              buyers: [],
            });
            done();
          }
        );
      });
    });

    describe('when receiving a 404 & pageNumber is 2', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          buyers: [],
          pageNumber: 2,
          filters: {
            sourceSystemBuyerId: ['25'],
          },
        });
        homeServiceStub.getBuyers.mockReturnValue(throwError({ status: 404 }));
      });

      it('should patchState loadMoreHidden as true but not patchState for buyers', done => {
        homeState.queryBuyers(stateContextStub).subscribe(
          () => {
            return;
          },
          () => {
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
              canLoadMore: false,
            });

            expect(stateContextStub.patchState).toHaveBeenCalledTimes(1);
            done();
          }
        );
      });
    });
  });

  describe('Action: getBuyersLookahead', () => {
    describe('Call getBuyers API', () => {
      const buyersStub = getBuyersStub();
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          buyers: [],
          pageNumber: 1,
          filters: {
            sourceSystemBuyerId: ['25'],
          },
        });
        homeServiceStub.getAggregateSearch.mockReturnValue(of(buyersStub));
        homeState.getBuyersLookahead(stateContextStub, { text: 'mock' }).subscribe();
      });
      it('should call searchHelperService getSearchRequestBody fn', () =>
        expect(searchHelperServiceStub.getSearchRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          filters: {
            sourceSystemBuyerId: ['25'],
          },
          applyFields: [
            {
              ParameterName: 'buyerName',
              ParameterValue: 'mock',
              Alias: 'buyer',
              Function: SearchApplyFunction.Contains,
            },
          ],
          groupBy: ['buyerName', 'sourceSystemBuyerId'],
          resultFilters: [
            { ParameterName: 'buyer', ParameterValue: '1', Chain: null, Operation: '==' },
          ],
        }));

      it('should patch filteredBuyers', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          filteredBuyers: buyersStub,
          pageNumber: 1,
        });
      });
    });

    describe('when receiving a 404 ', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          buyers: [],
          pageNumber: 1,
          filters: {
            sourceSystemBuyerId: ['25'],
          },
        });
        homeServiceStub.getAggregateSearch.mockReturnValue(throwError({ status: 404 }));
      });

      it('should patchState filteredBuyers as empty array', done => {
        homeState.getBuyersLookahead(stateContextStub, { text: 'mock' }).subscribe(
          () => {
            return;
          },
          () => {
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
              filteredBuyers: [],
            });
            done();
          }
        );
      });
    });
  });

  describe('Action: setFilterBuyers', () => {
    describe('Query buyers with buyerName filter', () => {
      beforeEach(() => {
        homeState.setFilterBuyers(stateContextStub, { buyerName: 'mock' });
      });

      it('Should patch buyerName filter and call Querybuyers', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          filters: {
            buyerName: ['mock'],
            sourceSystemBuyerId: ['25'],
          },
          pageNumber: 1,
        });
      });
      it('should dispatch QueryBuyers', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new QueryBuyers());
      });
    });
  });

  describe('Action: clearFilterBuyers', () => {
    describe('Query buyers with buyerName filter', () => {
      beforeEach(() => {
        homeState.clearFilterBuyers(stateContextStub);
      });

      it('Should patch removing buyerName filter and call Querybuyers', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          filters: {
            sourceSystemBuyerId: ['25'],
          },
          pageNumber: 1,
        });
      });
      it('should dispatch QueryBuyers', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new QueryBuyers());
      });
    });
  });

  describe('Action: UpdateBuyer', () => {
    const buyersStub = getBuyerPayloadStub();
    const buyersFromStub = getBuyerFormStub();

    describe('Call updateBuyer API', () => {
      beforeEach(() => {
        homeServiceStub.updateBuyer.mockReturnValue(of(buyersStub));
        homeState.updateBuyer(stateContextStub, { values: buyersFromStub }).subscribe();
      });

      it('should call updateBuyer', () => {
        expect(homeServiceStub.updateBuyer).toHaveBeenNthCalledWith(1, buyersStub);
      });

      it('should show success toast', () => {
        expect(toastServiceStub.success).toHaveBeenNthCalledWith(
          1,
          'Your changes have been successfully executed'
        );
      });
    });

    describe('Update portalStatus boolean value to "Active"', () => {
      beforeEach(() => {
        buyersFromStub.portalStatus = true;
        buyersFromStub.displayPredictedValues = true;
        buyersStub.portalStatus = 'Active';
        buyersStub.displayPredictedValues = '1';
        homeServiceStub.updateBuyer.mockReturnValue(of(buyersStub));
        homeState.updateBuyer(stateContextStub, { values: buyersFromStub }).subscribe();
      });

      it('should change true value to Active', () => {
        expect(homeServiceStub.updateBuyer).toHaveBeenNthCalledWith(1, buyersStub);
      });
    });

    describe('Update portalStatus boolean value to "Inactive"', () => {
      beforeEach(() => {
        buyersFromStub.portalStatus = false;
        buyersFromStub.displayPredictedValues = false;
        buyersStub.portalStatus = 'Inactive';
        buyersStub.displayPredictedValues = '0';
        homeServiceStub.updateBuyer.mockReturnValue(of(buyersStub));
        homeState.updateBuyer(stateContextStub, { values: buyersFromStub }).subscribe();
      });

      it('should change false value to Inactive', () => {
        expect(homeServiceStub.updateBuyer).toHaveBeenNthCalledWith(1, buyersStub);
      });
    });

    describe('when receiving an error back from the API', () => {
      beforeEach(() => {
        // homeServiceStub.massVoid(throwError(() => ({ status: 500 })));
        homeServiceStub.updateBuyer.mockReturnValue(throwError(() => ({ status: 500 })));
      });

      it('should open error toast', done => {
        homeState
          .updateBuyer(stateContextStub, {
            values: {
              sourceSystemBuyerId: '25',
              portalStatus: '',
              bounceBackMessage: '',
              forwardingEmailAddress: '',
              indexingSolutionId: '',
              displayPredictedValues: '',
              sourceSystemId: '',
              ingestionMethodId: '',
              buyerKeyword: '',
              displayIdentifierSearchValues: '',
            },
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(toastServiceStub.error).toHaveBeenNthCalledWith(
                1,
                'Oops! Unable to execute the changes. Please try again later'
              );
              done();
            },
          });
      });
    });
  });

  describe('Action: MassVoid', () => {
    describe('Call massVoid API', () => {
      beforeEach(() => {
        homeServiceStub.massVoid.mockReturnValue(of({}));
        homeState
          .massVoid(stateContextStub, {
            values: {
              sourceSystemBuyerId: '25',
              portalStatus: '',
              bounceBackMessage: '',
              forwardingEmailAddress: '',
              indexingSolutionId: '',
              displayPredictedValues: '',
              sourceSystemId: '',
              ingestionMethodId: '',
              buyerKeyword: '',
              displayIdentifierSearchValues: '',
            },
          })
          .subscribe();
      });

      it('should call updateBuyer', () => {
        expect(homeServiceStub.massVoid).toHaveBeenNthCalledWith(1, {
          buyerId: '25',
          startDate: expect.anything(),
          endDate: expect.anything(),
          sourceId: 'AvidSuite',
        });
      });

      it('should open toast success', () => {
        expect(toastServiceStub.success).toHaveBeenNthCalledWith(
          1,
          'Mass Void has been successfully executed'
        );
      });
    });

    describe('when receiving an error back from the API', () => {
      beforeEach(() => {
        homeServiceStub.massVoid(throwError(() => ({ status: 500 })));
        homeServiceStub.massVoid.mockReturnValue(throwError(() => ({ status: 500 })));
      });

      it('should open error toast', done => {
        homeState
          .massVoid(stateContextStub, {
            values: {
              sourceSystemBuyerId: '25',
              portalStatus: '',
              bounceBackMessage: '',
              forwardingEmailAddress: '',
              indexingSolutionId: '',
              displayPredictedValues: '',
              sourceSystemId: '',
              ingestionMethodId: '',
              buyerKeyword: '',
              displayIdentifierSearchValues: '',
            },
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(toastServiceStub.error).toHaveBeenNthCalledWith(
                1,
                'Oops! Unable to execute Mass Void. Please try again later'
              );
              done();
            },
          });
      });
    });
  });

  describe('Action: UpdateFormStatus', () => {
    beforeEach(() => {
      homeState.updateFormStatus(stateContextStub, { resetForm: false });
    });

    it('should patchState for resetForm', () => {
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { resetForm: false });
    });
  });

  describe('Action QueryBuyers', () => {
    describe('on successful call', () => {
      const buyersStub = getBuyersStub();

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          buyers: [],
          pageNumber: 1,
          filters: {},
        });
        homeServiceStub.getBuyers.mockReturnValue(of(buyersStub));

        homeState.queryBuyers(stateContextStub).subscribe();
      });

      it('should call searchHelperService getSearchRequestBody fn', () =>
        expect(searchHelperServiceStub.getSearchRequestBody).toHaveBeenNthCalledWith(1, {
          sourceId: SearchContext.AvidSuite,
          filters: { sourceSystemBuyerId: ['25'] },
          page: '1',
          pageSize: '30',
        }));

      it('should patchState for buyers, pageNumber, and canLoadMore', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          buyers: buyersStub,
          canLoadMore: true,
          filteredBuyers: [],
          pageNumber: 2,
        }));
    });
  });
});
