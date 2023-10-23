import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, filter, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { ToastComponent } from '@ui-coe/shared/ui-v2';
import { IScrollSection, ScrollService } from '@ui-coe/shared/util/directives';
import { SubscriptionManagerService } from '@ui-coe/shared/util/services';
import { SiteNameValidator, TenantFacade } from '@ui-coe/tenant/data-access';
import { ContentKeys, FontFamily, ICreateTenant, IMenuItem } from '@ui-coe/tenant/shared/types';

import { LIST_TENANTS } from '../../routing';

@Component({
  selector: 'ui-coe-tenant-add-container',
  templateUrl: './tenant-add-container.component.html',
  styleUrls: ['./tenant-add-container.component.scss'],
})
export class TenantAddContainerComponent implements OnInit, OnDestroy {
  title = ContentKeys.DETAILS_TITLE;
  siteNameLabel = ContentKeys.SITE_NAME_LABEL_TEXT;
  cmpLabel = ContentKeys.CMP_LABEL_TEXT;
  customerDetailsCardTitle = ContentKeys.CUSTOMER_DETAILS_CARD_TITLE;
  submitButtonText = ContentKeys.CUSTOMER_DETAILS_CARD_SUBMIT_BUTTON_TEXT;
  accountIdLabel = ContentKeys.ACCOUNT_ID_LABEL_TEXT;
  customerNameLabel = ContentKeys.CUSTOMER_NAME_LABEL_TEXT;
  cmpIdHelperLabel = ContentKeys.CUSTOMER_DETAILS_CARD_CMP_ID_HELPER_TEXT;
  showBackBtn = true;
  showBtn;
  smallTitle = true;
  smallHeaderHeight = true;

  fontFamilySemibold = FontFamily.INTER_SEMIBOLD;
  fontFamilyLight = FontFamily.INTER_LIGHT;

  siteNameValidatorFn = this.siteNameValidator;

  //TODO: put this is state
  menuItems$: BehaviorSubject<IMenuItem[]> = new BehaviorSubject([]);
  sections: IScrollSection[] = [{ id: 'customer-details' }];

  private readonly _subKey = this.subManager.init();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private scrollService: ScrollService,
    private subManager: SubscriptionManagerService,
    private translateService: TranslateService,
    private tenantFacade: TenantFacade,
    private snackBar: MatSnackBar,
    private siteNameValidator: SiteNameValidator
  ) {
    this.subManager.add(
      this._subKey,
      this.scrollService.currentNavItem$.pipe(distinctUntilChanged()),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (navid: string) => {
        //dispatch to store
      }
    );
  }

  ngOnInit(): void {
    this.subManager.add(this._subKey, this.tenantFacade.toast$, toastConfig => {
      if (toastConfig) {
        this.snackBar
          .openFromComponent(ToastComponent, toastConfig)
          .afterDismissed()
          .pipe(take(1))
          .subscribe(() => this.tenantFacade.dismissToast());
      }
    });

    this.subManager.add(
      this._subKey,
      this.tenantFacade.currentTenant$.pipe(filter(currentTenant => currentTenant != null)),
      currentTenant => {
        this.router.navigate([`../${currentTenant.tenantId}`], { relativeTo: this.route });
      }
    );

    this.buildSideMenu();
  }

  backBtnClick() {
    this.router.navigate([`../${LIST_TENANTS}`], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.subManager.tearDown(this._subKey);
  }

  buildSideMenu(): void {
    const menuItems = [];
    this.translateService
      // add all menu keys below comma separated
      .get([ContentKeys.SIDE_MENU_CUSTOMER_DETAILS])
      .pipe(take(1))
      .subscribe(translations => {
        Object.keys(translations).forEach(translation => {
          menuItems.push({
            name: translations[translation],
            isActive: true,
            anchorId: 'customer-details',
          });
        });
        this.menuItems$.next(menuItems);
      });
  }

  handleCustomerDetailsSubmit(form: FormGroup): void {
    const postTenant: ICreateTenant = {
      siteName: form.get('siteName').value,
      storageRegion: 'eastus', // TODO temporary hardcode value
      tenantType: 'Production', // TODO temporary hardcode value
      cmpId: form.get('cmpId').value,
      ownerType: 'Buyer', // TODO temporary hardcode value
      sourceSystem: 'AvidPayNetwork', // TODO temporary hardcode value
    };
    this.tenantFacade.postTenant(postTenant);
  }
}
