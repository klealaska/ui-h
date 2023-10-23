import { checkSort } from '../utils';

const fixtures = {
  getTenant: 'get-tenant.json',
  getTenantById: 'get-tenant-by-id.json',
  getTenantNameFilter: 'get-tenant-name-filter.json',
  getTenantNameFilterSort: 'get-tenant-name-filter-site_name-asc.json',
};

const siteId = 'syn9jaqeyiu352243ckw';
const titleDiv = '[data-cy=title-div]';
const headerDivListPage = '[data-cy=main-header-list-page-div]';
const addSiteBtn = '[data-cy=add-site-btn]';
const backBtn = '[data-cy=back-btn]';
const filterBar = '[data-cy=filter-bar]';
const nameFilterInput = '[id=name-filter-input]';
const dateCreatedFilterInput = '[data-cy=date-created-filter-input]';
const statusFilterInput = '[data-cy=status-filter-input]';
const siteNameHeader = '[data-cy=site-name-header]';
const siteNameData = '[data-cy=site-name-data]';
const dateCreatedHeader = '[data-cy=date-created-header]';
const dateCreatedData = '[data-cy=date-created-data]';
const tenantStatusHeader = '[data-cy=tenant-status-header]';
const tenantStatusData = '[data-cy=tenant-status-data]';
const assets = '/assets/i18n/en.json';

const tenantUrl = {
  url: '/api/tenants*',
  query: { limit: '100' },
};

class TenantListPage {
  currentTenant;

  static fixtures = fixtures;

  static siteNameColumnName = 'site_name';
  static siteNameHeader = siteNameHeader;
  static siteNameData = siteNameData;

  static dateCreatedColumnName = 'created_date';
  static dateCreatedHeader = dateCreatedHeader;
  static dateCreatedData = dateCreatedData;

  static tenantStatusColumnName = 'tenant_status';
  static tenantStatusHeader = tenantStatusHeader;
  static tenantStatusData = tenantStatusData;

  static visit() {
    cy.intercept(assets, { fixture: 'en.json' }).as('getAssets');
    cy.intercept(tenantUrl, { fixture: 'get-tenant.json' }).as('getTenant');
    cy.intercept(
      'https://getfeatureflags-qa-dkgyd2ane0abc4g8.z01.azurefd.net/api/getfeatureflags?flagname=cms-data',
      { fixture: 'en.json' }
    );
    cy.visit('/list');
    cy.wait('@getTenant');
  }

  static clickOnAddSite() {
    cy.get(addSiteBtn).first().click();
  }

  static titleDiv() {
    return cy.get(titleDiv);
  }

  static titleIsPresent() {
    return cy.get(titleDiv).should('be.visible');
  }

  static headerDivListPage() {
    return cy.get(headerDivListPage);
  }

  static addSiteButton() {
    return cy.get(addSiteBtn);
  }

  static verifyCreateTenantUrl() {
    let url = Cypress.config().baseUrl;
    cy.url().should('eq', `${url}add`);
  }

  static virtualScrollViewport() {
    return cy.get('cdk-virtual-scroll-viewport');
  }

  static columnHeaders() {
    return cy.get('th');
  }

  static listTableRows() {
    return cy.get('table').find('tbody').find('tr');
  }

  static checkListRowsForClass(index, elClass) {
    this.listTableRows().each((_, idx) => {
      // the 0th element is the empy placeholder element
      // so we want to skip it
      if (idx > 0) {
        cy.get('td').eq(index).should('have.class', elClass);
        cy.get('td').eq(index).should('not.be.empty');
      }
    });
  }

  static showNewBadge(date) {
    const displayWindow = 3 * 24 * 60 * 60 * 1000; // 3 days in mil sec
    return Date.now() - new Date(date).getTime() <= displayWindow;
  }

  static checkListRowsForNewBadge(expectBadge, ...shouldArgs) {
    this.listTableRows().each((el, idx) => {
      // the 0th element is the empy placeholder element
      // so we want to skip it
      if (idx > 0) {
        const date = el.children()[2].innerText;
        const shouldShowBadge = this.showNewBadge(date);
        const predicate = expectBadge ? shouldShowBadge : !shouldShowBadge;
        if (predicate) {
          cy.wrap(el.children())
            .eq(0)
            .should(...shouldArgs);
        }
      }
    });
  }

  static clickOnFirstItemOfTheTable() {
    let id;
    let first;
    cy.get('[data-cy*=table-row]')
      .then(val => {
        first = val.first();
        id = first.attr('data-cy').split('|')[1];
        return cy.wrap(first).get('td:nth-child(2)');
      })
      .then($el => {
        const name = $el.first().text();
        this.currentTenant = { id, name };
        cy.wrap(first).click({ force: true });
      });
  }

  static navigateToManageTenant(tenant) {
    cy.url().should('not.contain', `list`);
    cy.url().should('contain', tenant.id);
    // TODO to enable this check once we have fixture full enabled
    //cy.get(titleDiv).contains(tenant.name);
  }

  static siteId() {
    return siteId;
  }

  static selectTenant() {
    cy.intercept(`/api/tenants/${this.siteId()}`, {
      fixture: 'get-tenant-by-id.json',
    }).as('selected');
    cy.intercept('/api/tenants', { fixture: 'get-tenant.json' }).as('getTenant');
    cy.get('td').eq(1).click({ force: true });
  }

  static clickBackBtn() {
    cy.get(backBtn).click();
  }

  static verifyTenantListUrl() {
    cy.url().should('eq', Cypress.config().baseUrl + 'list');
  }

  static getFilterBar() {
    return cy.get(filterBar);
  }

  static getNameFilterInput() {
    return cy.get(nameFilterInput);
  }

  static getDateCreatedFilterInput() {
    return cy.get(dateCreatedFilterInput);
  }

  static getStatusFilterInput() {
    return cy.get(statusFilterInput);
  }

  static filterByName(name, fixture) {
    cy.intercept(
      {
        ...tenantUrl,
        query: {
          ...tenantUrl.query,
          siteName: name,
        },
      },
      { fixture }
    ).as('filteredByName');
    this.getNameFilterInput().type(name);
    return cy.wait('@filteredByName');
  }

  static clearNameFilter() {
    this.getNameFilterInput().type('foo'); // adding this to force a clear in case of no prior input
    this.getNameFilterInput().clear();
    cy.intercept(tenantUrl, { fixture: this.fixtures.getTenant }).as('getTenant');
    return cy.wait('@getTenant');
  }

  static filterSort() {
    return this.clearNameFilter()
      .then(() => {
        return this.clickTableColumnHeader(this.siteNameHeader, this.siteNameColumnName, 'asc');
      })
      .then(() => {
        return this.filterByName('Bu', this.fixtures.getTenantNameFilterSort);
      });
  }

  static verifyNameFilter(name = 'Burger') {
    return this.listTableRows().each((el, idx) => {
      if (idx > 0) {
        cy.wrap(el).contains(name);
      }
    });
  }

  // verifies that when Name Filter is empty, there are table rows that do NOT have an name that includes 'Burger'
  static verifyEmptyNameFilter(name = 'Burger') {
    return !this.listTableRows().each((el, idx) => {
      if (idx > 0) {
        cy.wrap(el).contains(name);
      }
    });
  }

  static clickTableColumnHeader(header, column = '', direction = '') {
    /**
     * column will be one of the following:
     * site_name
     * date_created
     * tenant_status
     * or don't pass in column to use the default get-tenant data
     *
     * direction will be:
     * asc
     * desc
     * and only needs to be passed in if a column is
     */
    const baseFilePath = 'get-tenant';
    const fixture = !column
      ? `${baseFilePath}.json`
      : `${baseFilePath}-${column}-${direction}.json`;
    const qs = column ? `sortBy=${direction}:${column}&` : '';
    cy.intercept(`/api/tenants?${qs}limit=100`, {
      fixture,
    });
    return cy.get(header).click();
  }

  static getTableColumnData(dataArr) {
    const arr = [];
    cy.get(dataArr).each(el => {
      arr.push(el.text());
    });
    return arr;
  }

  static checkTableColumnSort(data, direction, invertCheck = false) {
    const shouldString = invertCheck ? 'not.be.true' : 'be.true';
    const sorted = checkSort(data, direction);
    cy.wrap(sorted).should(shouldString);
  }
}

export default TenantListPage;
