import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Select, Store, ofActionSuccessful } from '@ngxs/store';
import {
  ClaimsQueries,
  CoreSelectors,
  FeatureFlagTargetQueries,
  Logout,
  QueryDocumentCardSetCounts,
  SendUnlockMessage,
  SetResearchPageEscalationCategoryList,
  UnlockDocument,
} from '@ui-coe/avidcapture/core/data-access';
import { HotkeysService } from '@ui-coe/avidcapture/indexing/util';
import {
  AppPages,
  AvidPartners,
  Buyer,
  CompositeDocument,
  Cookie,
  UserMenuOption,
  UserMenuOptions,
} from '@ui-coe/avidcapture/shared/types';
import { CookieService } from '@ui-coe/avidcapture/shared/util';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { filter, map, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { FullStoryService } from '../../../services/fullStory.service';

@Component({
  selector: 'xdc-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  @Select(CoreSelectors.currentUsername) currentUsername$: Observable<string>;
  @Select(CoreSelectors.userDisplayName) userDisplayName$: Observable<string>;
  @Select(CoreSelectors.currentUserEmail) currentUserEmail$: Observable<string>;
  @Select(CoreSelectors.userMenuOptions) userMenuOptions$: Observable<UserMenuOption[]>;
  @Select(CoreSelectors.pendingDocumentCount) pendingDocumentCount$: Observable<number>;
  @Select(CoreSelectors.researchDocumentCount) researchDocumentCount$: Observable<number>;
  @Select(CoreSelectors.myUploadsDocumentCount) myUploadsDocumentCount$: Observable<number>;
  @Select(CoreSelectors.recycleBinDocumentCount) recycleBinDocumentCount$: Observable<number>;
  @Select(CoreSelectors.filteredBuyers) filteredBuyersCore$: Observable<Buyer[]>;
  @Select(ClaimsQueries.canViewAdmin) canViewAdmin$: Observable<boolean>;
  @Select(ClaimsQueries.canViewAllBuyers) canViewAllBuyers$: Observable<boolean>;
  @Select(ClaimsQueries.canViewArchive) canViewArchive$: Observable<boolean>;
  @Select(ClaimsQueries.canViewRecycleBin) canViewRecycleBin$: Observable<boolean>;
  @Select(ClaimsQueries.canViewResearch) canViewResearch$: Observable<boolean>;
  @Select(ClaimsQueries.canViewDashboard) canViewDashboard$: Observable<boolean>;
  @Select(ClaimsQueries.canViewPending) canViewPending$: Observable<boolean>;
  @Select(ClaimsQueries.canUpload) canUpload$: Observable<boolean>;
  @Select(ClaimsQueries.canViewAvidInbox) canViewAvidInbox$: Observable<boolean>;
  @Select(ClaimsQueries.canViewAvidInvoice) canViewAvidInvoice$: Observable<boolean>;
  @Select(ClaimsQueries.escalationCategoryList) escalationCategoryList$: Observable<string[]>;
  @Select(ClaimsQueries.canViewNavigationBar) canViewNavBar$: Observable<boolean>;
  @Select(FeatureFlagTargetQueries.adminPageIsActive) adminPageIsActive$: Observable<boolean>;
  @Select(FeatureFlagTargetQueries.emailHubIsActive)
  emailHubIsActive$: Observable<boolean>;

  isBeta = environment.isBeta === 'true' || window['Cypress'] ? true : false;
  adminMenu = false;
  menuOptions$: Observable<UserMenuOption[]>;
  titleImage: string;
  avidPartner = AvidPartners.AvidXChange;
  favIcon: HTMLLinkElement = document.querySelector('#favIcon');
  isArchiveExpanded = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private store: Store,
    private actions$: Actions,
    private hotkeysService: HotkeysService,
    private cookieService: CookieService,
    private fullStory: FullStoryService
  ) {}

  ngOnInit(): void {
    this.fullStory.init();
    this.getLogo();

    if (this.router.url.includes(`${AppPages.IndexingPage}`)) {
      this.subscriptions.push(
        combineLatest([
          this.filteredBuyersCore$,
          this.currentUsername$,
          this.userDisplayName$,
          this.currentUserEmail$,
        ])
          .pipe(
            filter(
              ([filteredBuyers, username, displayName, userEmail]) =>
                filteredBuyers.length > 0 &&
                username != null &&
                displayName != null &&
                userEmail != null
            ),
            tap(([filteredBuyers, username, displayName, userEmail]) => {
              this.fullStory.identify(username, displayName, userEmail);
            }),
            switchMap(() => this.escalationCategoryList$),
            tap(escalationCategoryList =>
              this.store.dispatch([
                new SetResearchPageEscalationCategoryList(escalationCategoryList),
                new QueryDocumentCardSetCounts(),
              ])
            ),
            take(1)
          )
          .subscribe()
      );
    } else {
      this.subscriptions.push(
        combineLatest([
          this.filteredBuyersCore$,
          this.currentUsername$,
          this.userDisplayName$,
          this.currentUserEmail$,
        ])
          .pipe(
            filter(
              ([filteredBuyers, username, displayName, userEmail]) =>
                filteredBuyers.length > 0 &&
                username != null &&
                displayName != null &&
                userEmail != null
            ),
            tap(([filteredBuyers, username, displayName, userEmail]) => {
              this.fullStory.identify(username, displayName, userEmail);
            }),
            switchMap(() => this.escalationCategoryList$),
            tap(escalationCategoryList => {
              this.store.dispatch(
                new SetResearchPageEscalationCategoryList(escalationCategoryList)
              );
            }),
            take(1)
          )
          .subscribe()
      );
    }

    this.menuOptions$ = this.userMenuOptions$.pipe(
      withLatestFrom(this.canViewAllBuyers$, this.canViewAvidInbox$, this.canViewAvidInvoice$),
      map(([userMenuOptions, canViewAllBuyers, canViewAvidInbox, canViewAvidInvoice]) => {
        const newOptions = [...userMenuOptions];

        if (canViewAvidInbox) {
          newOptions.push({ text: UserMenuOptions.AvidInbox });
        }
        if (canViewAvidInvoice) {
          newOptions.push({ text: UserMenuOptions.AvidInvoice });
        }
        if (canViewAllBuyers) {
          newOptions.push({ text: UserMenuOptions.ClientGuidelines });
        }

        newOptions.push({
          text: 'Logout',
        });
        return newOptions;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onTitleClick(): void {
    this.router.navigate(['/']);
  }

  onLogout(): void {
    if (this.router.url.includes(`${AppPages.IndexingPage}`)) {
      const document: CompositeDocument = this.store.selectSnapshot(
        state => state.indexingPage.compositeData
      );

      this.store.dispatch(new UnlockDocument(document.unindexed.documentId));

      this.subscriptions.push(
        this.actions$
          .pipe(
            ofActionSuccessful(SendUnlockMessage),
            tap(() => this.store.dispatch(new Logout()))
          )
          .subscribe()
      );
    } else {
      this.store.dispatch(new Logout());
    }
  }

  onMenuItemClick(value: string): void {
    switch (value) {
      case UserMenuOptions.AvidInbox:
        window.open(environment.avidInboxLink, '_blank');
        break;
      case UserMenuOptions.AvidInvoice:
        window.open(environment.avidInvoiceLink, '_blank');
        break;
      case UserMenuOptions.ClientGuidelines:
        window.open(environment.clientGuidelinesLink, '_blank');
        break;
      case UserMenuOptions.HotkeyGuide:
        this.hotkeysService.openHelpModal();
        break;
    }
  }

  getTooltipMessage(): string {
    return this.store.selectSnapshot(state => state.pendingPage?.filteredBuyers || []).length > 0
      ? 'Invoices remaining in filtered queue'
      : 'Invoices remaining in queue';
  }

  private getLogo(): void {
    const cookie = this.cookieService.getCookie(Cookie.AvidPartner);

    switch (cookie) {
      case AvidPartners.AvidXChange:
        this.titleImage = '/assets/mini.svg';
        this.favIcon.href = '/assets/images/favicon/avid.ico';
        this.avidPartner = AvidPartners.AvidXChange;
        break;
      case AvidPartners.BankOfAmerica:
        this.titleImage = environment.titleImage.bofa;
        this.favIcon.href = '/assets/images/favicon/bofa.ico';
        this.avidPartner = AvidPartners.BankOfAmerica;
        break;
      case AvidPartners.ComData:
        this.titleImage = environment.titleImage.comdata;
        this.favIcon.href = '/assets/images/favicon/comdata.ico';
        this.avidPartner = AvidPartners.ComData;
        break;
      case AvidPartners.FifthThird:
        this.titleImage = environment.titleImage.fifth;
        this.favIcon.href = '/assets/images/favicon/fifththird.ico';
        this.avidPartner = AvidPartners.FifthThird;
        break;
      case AvidPartners.KeyBank:
        this.titleImage = environment.titleImage.key;
        this.favIcon.href = '/assets/images/favicon/keybank.ico';
        this.avidPartner = AvidPartners.KeyBank;
        break;
      default:
        this.titleImage = '/assets/mini.svg';
        this.favIcon.href = '/assets/images/favicon/avid.ico';
        this.avidPartner = AvidPartners.AvidXChange;
    }
  }
}
