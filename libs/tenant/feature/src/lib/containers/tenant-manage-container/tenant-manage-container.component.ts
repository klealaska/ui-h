import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { SubscriptionManagerService } from '@ui-coe/shared/util/services';
import { IScrollSection, ScrollService } from '@ui-coe/shared/util/directives';
import { EntitlementsFacade, SiteNameValidator, TenantFacade } from '@ui-coe/tenant/data-access';
import {
  ContentKeys,
  IMenuItem,
  IUpdateTenant,
  IProductEntitlementMapped,
  ITenantEntitlementMapped,
  FontFamily,
} from '@ui-coe/tenant/shared/types';
import { ToastComponent } from '@ui-coe/shared/ui-v2';

import { LIST_TENANTS } from '../../routing';
import { kebabCase } from 'lodash';

@Component({
  selector: 'ui-coe-tenant-manage-container',
  templateUrl: './tenant-manage-container.component.html',
  styleUrls: ['./tenant-manage-container.component.scss'],
})
export class TenantManageContainerComponent implements OnInit, OnDestroy {
  title = ContentKeys.MANAGE_DETAILS_TITLE;
  siteNameLabel = ContentKeys.SITE_NAME_LABEL_TEXT;
  cmpLabel = ContentKeys.CMP_LABEL_TEXT;
  siteIdLabel = ContentKeys.SITE_ID_LABEL_TEXT;
  customerDetailsCardTitle = ContentKeys.CUSTOMER_DETAILS_CARD_TITLE;
  submitButtonText = ContentKeys.CUSTOMER_DETAILS_CARD_SUBMIT_BUTTON_TEXT;
  accountIdLabel = ContentKeys.ACCOUNT_ID_LABEL_TEXT;
  customerNameLabel = ContentKeys.CUSTOMER_NAME_LABEL_TEXT;
  cmpIdHelperLabel = ContentKeys.CUSTOMER_DETAILS_CARD_CMP_ID_HELPER_TEXT;
  entitlementsCardTitle = ContentKeys.ENTITLEMENTS_CARD_TITLE;
  entitlementsHelperText = ContentKeys.ENTITLEMENTS_CARD_HELPER_TEXT;

  fontFamilySemibold = FontFamily.INTER_SEMIBOLD;
  fontFamilyLight = FontFamily.INTER_LIGHT;

  showBackBtn = true;
  smallTitle = true;
  smallHeaderHeight = true;
  enableSubmitButton = false;

  menuItems$: BehaviorSubject<IMenuItem[]> = new BehaviorSubject([]);
  sections: IScrollSection[] = [{ id: 'customer-details' }];

  currentTenant$ = this.tenantFacade.currentTenant$;

  productEntitlements$ = this.entitlementFacade.productEntitlements$;
  tenantEntitlements$ = this.entitlementFacade.tenantEntitlements$;

  combinedEntitlements$ = combineLatest([this.productEntitlements$, this.tenantEntitlements$]).pipe(
    map(
      ([productEntitlements, tenantEntitlements]: [
        IProductEntitlementMapped[],
        ITenantEntitlementMapped[]
      ]) => {
        return productEntitlements.map((productEntitlement: IProductEntitlementMapped) => {
          const isAssigned = Boolean(
            tenantEntitlements?.find(
              (tenantEntitlement: ITenantEntitlementMapped) =>
                tenantEntitlement.productEntitlementId === productEntitlement.id
            )
          );

          return {
            ...productEntitlement,
            isDisabled: isAssigned,
          };
        });
      }
    )
  );

  siteNameValidatorFn = this.siteNameValidator;
  tenantId: string;

  private _subKey = this.subManager.init();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scrollService: ScrollService,
    private subManager: SubscriptionManagerService,
    private translateService: TranslateService,
    private tenantFacade: TenantFacade,
    private snackBar: MatSnackBar,
    private siteNameValidator: SiteNameValidator,
    private entitlementFacade: EntitlementsFacade
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
    this.entitlementFacade.getEntitlements();
    this.subManager.add(this._subKey, this.route.params, params => {
      this.tenantId = params.id;
      this.tenantFacade.getTenantById(params.id);
      this.entitlementFacade.getEntitlementsByTenantId(params.id);
    });
    this.subManager.add(this._subKey, this.tenantFacade.toast$, toastConfig => {
      if (toastConfig) {
        this.snackBar
          .openFromComponent(ToastComponent, toastConfig)
          .afterDismissed()
          .pipe(take(1))
          .subscribe(() => this.tenantFacade.dismissToast());
      }
    });

    this.buildSideMenu();
  }

  onProductEntitlementChecked(id: string) {
    this.entitlementFacade.assignProductEntitlementToTenant(id, this.tenantId, {
      // TODO: hardcoding this for now. What should these values be?
      amount: 0,
      assignmentDate: new Date().toISOString().split('T')[0],
      assignmentSource: 'somewhere',
      sourceSystem: 'somewhere else',
    });
  }

  buildSideMenu(): void {
    const menuItems = [];
    this.translateService
      // add all menu keys below comma separated
      .get([ContentKeys.SIDE_MENU_CUSTOMER_DETAILS, ContentKeys.SIDE_MENU_ENTITLEMENTS])
      .pipe(take(1))
      .subscribe(translations => {
        Object.keys(translations).forEach((translation: string, index: number) => {
          const split = translation.split('.');
          menuItems.push({
            name: translations[translation],
            isActive: index === 0 ? true : false,
            anchorId: kebabCase(split[split.length - 1]),
          });
        });
        this.menuItems$.next(menuItems);
      });
  }

  onBackBtnClick() {
    this.router.navigate([`../${LIST_TENANTS}`], { relativeTo: this.route });
  }

  onSiteNameUpdated(newSiteName: string, oldSiteName: string): void {
    this.enableSubmitButton = newSiteName.trim() !== oldSiteName.trim();
  }

  onSubmitButtonClick(id: string, { value: { siteName } }: FormGroup): void {
    const updateTenantBody: IUpdateTenant = {
      siteName: siteName,
    };
    this.tenantFacade.updateTenant(id, updateTenantBody);
    this.enableSubmitButton = false;
  }

  ngOnDestroy(): void {
    this.subManager.tearDown(this._subKey);
    this.tenantFacade.clearCurrentTenant();
  }
}
