import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';

import { SubscriptionManagerService } from '@ui-coe/shared/util/services';
import { TenantFacade } from '@ui-coe/tenant/data-access';
import { ContentKeys, FontFamily, IGetTenantParams } from '@ui-coe/tenant/shared/types';

import { ADD_TENANT } from '../../routing';

@Component({
  selector: 'ui-coe-tenant-list-container',
  templateUrl: './tenant-list-container.component.html',
  styleUrls: ['./tenant-list-container.component.scss'],
})
export class TenantListContainerComponent implements OnInit, OnDestroy {
  title = ContentKeys.TITLE;
  addSiteBtnText = ContentKeys.ADD_BTN;
  siteNameHeader = ContentKeys.SITE_NAME_HEADER;
  dateCreatedHeader = ContentKeys.DATE_CREATED_HEADER;
  statusHeader = ContentKeys.STATUS_HEADER;
  newBadgeText = ContentKeys.NEW_BADGE_TEXT;
  tableDisplayedColumns = ContentKeys.TABLE_DISPLAYED_COLUMNS;
  showBackBtn;

  fontFamilySemibold = FontFamily.INTER_SEMIBOLD;
  fontFamilyLight = FontFamily.INTER_LIGHT;

  tenants$ = this.tenantFacade.tenantListItems$;
  filterSort$ = this.tenantFacade.filterSort$;

  private _subKey = this.subManager.init();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private subManager: SubscriptionManagerService,
    private tenantFacade: TenantFacade,
    private zone: NgZone
  ) {}

  addSiteClick() {
    this.router.navigate([`../${ADD_TENANT}`], { relativeTo: this.route });
  }

  ngOnInit(): void {
    this.tenantFacade.getTenants();

    this.subManager.add(this._subKey, this.filterSort$, (params: IGetTenantParams) => {
      this.tenantFacade.getTenants(params);
    });
  }

  onTenantId(tenantId: string): void {
    /**
     * !! DO WE STILL NEED THIS?
     * TODO: this is a TEMPORARY hack to fix the issue with the manage page not loading
     * when clicking a row in the tenant list.
     * there is an issue with the virtual scrolling messing with angular zones
     * we need to figure out what is causing the issue there and remove this hack
     */
    this.zone.run(() => {
      this.router.navigate([`../${tenantId}`], { relativeTo: this.route });
    });
  }

  onFilterValue(filterValue: IGetTenantParams): void {
    this.tenantFacade.filterSortTenantList(filterValue);
  }

  onSortChange(sortChange: Sort): void {
    const sort: IGetTenantParams = {
      sortBy: sortChange.direction ? `${sortChange.direction}:${sortChange.active}` : null,
    };

    this.tenantFacade.filterSortTenantList(sort);
  }

  ngOnDestroy(): void {
    this.subManager.tearDown(this._subKey);
  }
}
