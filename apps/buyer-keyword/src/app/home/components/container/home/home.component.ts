import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription, combineLatest, fromEvent } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

import { ClaimsQueries } from '../../../../core/queries/claims.queries';
import { Buyer, BuyerPayload } from '../../../../shared/interfaces';
import * as homeActions from '../../../state/home.actions';
import { HomeState } from '../../../state/home.state';

@Component({
  selector: 'bkws-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @Select(HomeState.buyers) buyers$: Observable<Buyer[]>;
  @Select(HomeState.filteredBuyers) filteredBuyers$: Observable<Buyer[]>;
  @Select(HomeState.canLoadMore) canLoadMore$: Observable<boolean>;
  @Select(HomeState.resetForm) resetForm$: Observable<boolean>;
  @Select(ClaimsQueries.canViewMassVoid) canViewMassVoid$: Observable<boolean>;
  @Select(ClaimsQueries.canViewAttributeFunctions) canViewAttributeFunctions$: Observable<boolean>;
  @Select(ClaimsQueries.canViewThreshold) canViewThreshold$: Observable<boolean>;
  @Select(ClaimsQueries.canViewBuyerGoLive) canViewBuyerGoLive$: Observable<boolean>;

  private subscriptions: Subscription[] = [];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.canViewMassVoid$
        .pipe(
          tap(() => {
            this.store.dispatch(new homeActions.QueryBuyers());
          })
        )
        .subscribe()
    );

    this.subscriptions.push(
      combineLatest([fromEvent(window, 'scroll'), this.canLoadMore$])
        .pipe(
          debounceTime(100),
          tap(([e, canLoadMore]: [Event, boolean]) => {
            if (
              e.target['scrollingElement'] &&
              Number(e.target['scrollingElement'].offsetHeight) +
                Number(e.target['scrollingElement'].scrollTop) >=
                e.target['scrollingElement'].scrollHeight - 1 &&
              canLoadMore
            ) {
              this.loadMore();
            }
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  updateBuyerValues(formValues: BuyerPayload): void {
    this.store.dispatch(new homeActions.UpdateBuyer(formValues));
  }

  loadMore(): void {
    this.store.dispatch(new homeActions.QueryBuyers());
  }

  searchBuyers(searchValue: string): void {
    this.store.dispatch(new homeActions.GetBuyersLookahead(searchValue));
  }

  buyerSelected(value: string): void {
    if (value) {
      this.store.dispatch(new homeActions.SetFilterBuyers(value));
    }
  }

  clearFilterBuyers(): void {
    this.store.dispatch(new homeActions.ClearFilterBuyers());
  }

  executeMassVoid(formValues: BuyerPayload): void {
    this.store.dispatch(new homeActions.MassVoid(formValues));
  }

  updateFormStatus(status: boolean): void {
    this.store.dispatch(new homeActions.UpdateFormStatus(status));
  }
}
