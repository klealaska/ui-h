import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as ContentActions from './content.actions';
import * as ContentSelectors from './content.selectors';

@Injectable({
  providedIn: 'root',
})
export class ContentFacade {
  constructor(private readonly store: Store) {}
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(ContentSelectors.getContentLoaded));
  allContent$ = this.store.pipe(select(ContentSelectors.getAllContent));
  selectedContent$ = this.store.pipe(select(ContentSelectors.getSelected));
  navData$ = this.store.pipe(select(ContentSelectors.getNavData));

  getContentById(productId: string) {
    return this.store.pipe(select(ContentSelectors.getSelectedById(productId)));
  }

  getAllContent() {
    return this.store.pipe(select(ContentSelectors.getAllContentData()));
  }

  isContentLoaded() {
    return this.store.pipe(select(ContentSelectors.getContentLoaded));
  }

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init(locale = 'en') {
    this.store.dispatch(ContentActions.initContent({ locale }));
  }

  initShell(locale = 'en') {
    this.store.dispatch(ContentActions.initShellContent({ locale }));
  }

  initProduct(productId: string) {
    this.store.dispatch(ContentActions.initContentForProduct({ productId }));
  }
}
