import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

import { SearchHelperService } from '../../core/services/search-helper.service';
import { ToastService } from '../../core/services/toast-service';
import { SearchApplyFunction, SearchContext } from '../../shared/enums';
import {
  Buyer,
  MassVoidBodyRequest,
  SearchBodyRequest,
  SearchFilters,
} from '../../shared/interfaces';
import { HomeService } from '../services/home.service';
import * as actions from './home.actions';
import { TranslateService } from '@ngx-translate/core';

interface HomeStateModel {
  buyers: Buyer[];
  filters: SearchFilters;
  canLoadMore: boolean;
  pageNumber: number;
  filteredBuyers: Buyer[];
  sortField: string;
  sortDirection: string;
  resetForm: boolean;
}

const defaults: HomeStateModel = {
  buyers: null,
  filters: {
    sourceSystemBuyerId: ['-none'],
  },
  canLoadMore: true,
  pageNumber: 1,
  filteredBuyers: null,
  sortField: 'buyerName',
  sortDirection: 'asc',
  resetForm: false,
};

@State<HomeStateModel>({
  name: 'home',
  defaults,
})
@Injectable()
export class HomeState {
  constructor(
    private homeService: HomeService,
    private searchHelperService: SearchHelperService,
    private toastService: ToastService,
    private store: Store,
    private translate: TranslateService
  ) {}

  @Selector()
  static buyers(state: HomeStateModel): Buyer[] {
    return state.buyers;
  }
  @Selector()
  static filteredBuyers(state: HomeStateModel): Buyer[] {
    return state.filteredBuyers;
  }

  @Selector()
  static canLoadMore(state: HomeStateModel): boolean {
    return state.canLoadMore;
  }

  @Selector()
  static resetForm(state: HomeStateModel): boolean {
    return state.resetForm;
  }

  @Action(actions.QueryBuyers)
  queryBuyers({ getState, patchState }: StateContext<HomeStateModel>): Observable<Buyer[]> {
    const orgId = this.store.selectSnapshot(state => state.core.orgIds);
    const requestBody: SearchBodyRequest = this.searchHelperService.getSearchRequestBody({
      sourceId: SearchContext.AvidSuite,
      filters: { ...getState().filters, sourceSystemBuyerId: orgId },
      page: getState().pageNumber.toString(),
      pageSize: '30',
      sortField: getState().sortField,
      sortDirection: getState().sortDirection,
    });

    return this.homeService.getBuyers(requestBody).pipe(
      tap(buyers =>
        patchState({
          buyers: getState().pageNumber > 1 ? [...getState().buyers, ...buyers] : buyers,
          canLoadMore: true,
          pageNumber: getState().pageNumber + 1,
          filteredBuyers: [],
        })
      ),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          patchState({
            canLoadMore: false,
          });

          if (getState().pageNumber === 1) {
            patchState({ buyers: [] });
          }
        }
        throw err;
      })
    );
  }

  @Action(actions.GetBuyersLookahead)
  getBuyersLookahead(
    { getState, patchState }: StateContext<HomeStateModel>,
    { text }: actions.GetBuyersLookahead
  ): Observable<Buyer[]> {
    const orgId = this.store.selectSnapshot(state => state.core.orgIds);
    const requestBody: SearchBodyRequest = this.searchHelperService.getSearchRequestBody({
      sourceId: SearchContext.AvidSuite,
      filters: { ...getState().filters, sourceSystemBuyerId: orgId },
      groupBy: ['buyerName', 'sourceSystemBuyerId'],
      applyFields: [
        {
          ParameterName: 'buyerName',
          ParameterValue: text,
          Function: SearchApplyFunction.Contains,
          Alias: 'buyer',
        },
      ],
      resultFilters: [
        { ParameterName: 'buyer', ParameterValue: '1', Operation: '==', Chain: null },
      ],
    });
    return this.homeService.getAggregateSearch(requestBody).pipe(
      tap(buyers => {
        patchState({ filteredBuyers: buyers, pageNumber: 1 });
      }),
      catchError((err: HttpErrorResponse) => {
        patchState({ filteredBuyers: [] });
        throw err;
      })
    );
  }

  @Action(actions.SetFilterBuyers)
  setFilterBuyers(
    { getState, patchState, dispatch }: StateContext<HomeStateModel>,
    { buyerName }: actions.SetFilterBuyers
  ): void {
    const filters = { ...getState().filters, buyerName: [buyerName] };
    patchState({ filters, pageNumber: 1 });
    dispatch(new actions.QueryBuyers());
  }

  @Action(actions.ClearFilterBuyers)
  clearFilterBuyers({ getState, patchState, dispatch }: StateContext<HomeStateModel>): void {
    const filters = { ...getState().filters };
    delete filters.buyerName;
    patchState({ filters, pageNumber: 1 });
    dispatch(new actions.QueryBuyers());
  }

  @Action(actions.UpdateBuyer)
  updateBuyer(
    { dispatch }: StateContext<HomeStateModel>,
    { values }: actions.UpdateBuyer
  ): Observable<void> {
    values = {
      ...values,
      portalStatus: values.portalStatus ? 'Active' : 'Inactive',
      displayPredictedValues: values.displayPredictedValues ? '1' : '0',
      displayIdentifierSearchValues: values.displayIdentifierSearchValues ? '1' : '0',
    };

    return this.homeService.updateBuyer(values).pipe(
      tap(() => {
        this.toastService.success(this.translate.instant('bkws.home.home-state.executedToast'));
      }),
      catchError((err: HttpErrorResponse) => {
        this.toastService.error(this.translate.instant('bkws.home.home-state.nonExecutedToast'));
        throw err;
      }),
      finalize(() => dispatch(new actions.UpdateFormStatus(true)))
    );
  }

  @Action(actions.MassVoid)
  massVoid(_: StateContext<HomeStateModel>, { values }: actions.MassVoid): Observable<void> {
    const massVoidRequest: MassVoidBodyRequest = {
      buyerId: values.sourceSystemBuyerId,
      sourceId: SearchContext.AvidSuite,
      startDate: DateTime.local().minus({ years: 2 }).toLocaleString(),
      endDate: DateTime.local().plus({ days: 1 }).toLocaleString(),
    };
    return this.homeService.massVoid(massVoidRequest).pipe(
      tap(() => {
        this.toastService.success(this.translate.instant('bkws.home.home-state.massVoidExecuted'));
      }),
      catchError(err => {
        this.toastService.error(this.translate.instant('bkws.home.home-state.massVoidNonExecuted'));
        throw err;
      })
    );
  }

  @Action(actions.UpdateFormStatus)
  updateFormStatus(
    { patchState }: StateContext<HomeStateModel>,
    { resetForm }: actions.UpdateFormStatus
  ): void {
    patchState({ resetForm });
  }
}
