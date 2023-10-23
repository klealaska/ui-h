import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import TenantListPage from '../../pages/tenant';

Given(/^that I am on the tenant list page$/, () => {
  TenantListPage.visit();
});
Given(/^I select a Tenant on the table and I am on the Manage Page$/, () => {
  TenantListPage.selectTenant();
  cy.url().should('eq', Cypress.config().baseUrl + 'syn9jaqeyiu352243ckw');
});
When(/^I view the list page$/, () => {
  TenantListPage.visit();
});

When(/^I view the list page and click "Create Site" button$/, () => {
  TenantListPage.visit();
  TenantListPage.clickOnAddSite();
});

When(/^the title is present$/, () => {
  TenantListPage.titleIsPresent();
});

When(/^I select the back arrow button$/, () => {
  TenantListPage.clickBackBtn();
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
When(/^the Date Created is more than 3 days$/, () => {});

// eslint-disable-next-line @typescript-eslint/no-empty-function
When(/^the Date Created is less than or equal to 3 days$/, () => {});

When(/^I scroll through the list of Tenants$/, () => {
  TenantListPage.virtualScrollViewport().scrollTo(0, 500);
});

When(/^I click on table row$/, () => {
  TenantListPage.clickOnFirstItemOfTheTable();
});

When(/^I enter text in the "Name" field$/, () => {
  TenantListPage.filterByName('Burger', TenantListPage.fixtures.getTenantNameFilter);
});

When(/^I enter text in the "Name" field AND I select the text and delete it$/, () => {
  TenantListPage.filterByName('Burger', TenantListPage.fixtures.getTenantNameFilter);
  TenantListPage.clearNameFilter();
});

When(/^the rows are in the default sort and I select the Status column header$/, () => {
  TenantListPage.clickTableColumnHeader(
    TenantListPage.tenantStatusHeader,
    TenantListPage.tenantStatusColumnName,
    'asc'
  );
});

When(
  /^the rows are sorted in ascending alphabetical order \(A->Z\) and I select the Status column header$/,
  () => {
    TenantListPage.clickTableColumnHeader(
      TenantListPage.tenantStatusHeader,
      TenantListPage.tenantStatusColumnName,
      'desc'
    );
  }
);

When(/^the rows are in the default sort and I select the Date Created column header$/, () => {
  TenantListPage.clickTableColumnHeader(
    TenantListPage.dateCreatedHeader,
    TenantListPage.dateCreatedColumnName,
    'asc'
  );
});

When(
  /^the rows are sorted in ascending numerical order and I select the Date Created column header$/,
  () => {
    TenantListPage.clickTableColumnHeader(
      TenantListPage.dateCreatedHeader,
      TenantListPage.dateCreatedColumnName,
      'desc'
    );
  }
);

When(/^the rows are in the default sort and I select the Site Name column header$/, () => {
  TenantListPage.clickTableColumnHeader(
    TenantListPage.siteNameHeader,
    TenantListPage.siteNameColumnName,
    'asc'
  );
});

When(
  /^the rows are sorted in ascending alphabetical order \(A->Z\) and I select the Site Name column header$/,
  () => {
    TenantListPage.clickTableColumnHeader(
      TenantListPage.siteNameHeader,
      TenantListPage.site,
      'desc'
    );
  }
);

When(/^I input a valid value into the Name filter AND I sort a column header on the table$/, () => {
  TenantListPage.filterSort();
});

Then(/^the title "Customer Site" must be displayed$/, () => {
  TenantListPage.titleDiv().contains('Customer Site');
});

Then(/^the title of "Customer" must have a font-weight of 600px$/, () => {
  TenantListPage.titleDiv().find('span').should('have.class', 'font-["inter-semibold"]');
});

Then(/^the title of "Site" must have a font-weight of 300px$/, () => {
  TenantListPage.titleDiv().find('span').should('have.class', 'font-["inter-light"]');
});

Then(/^the title must have a 36px font size$/, () => {
  TenantListPage.titleDiv().should('have.class', 'text-[36px]');
});

Then(/^the title must have Grey - 800 text color$/, () => {
  TenantListPage.titleDiv().should('have.class', 'text-grey-800');
});

Then(/^the "Create Site" button must display the text as "Create Site"$/, () => {
  TenantListPage.addSiteButton().contains('Create Site');
  TenantListPage.addSiteButton().should('be.enabled');
});

Then('I should be routed to Create Site page', () => {
  TenantListPage.verifyCreateTenantUrl();
});

Then(/^the first header column must display as "Name".$/, () => {
  TenantListPage.columnHeaders().eq(1).contains('Name');
});

Then(/^the second header column must display as "Date Created".$/, () => {
  TenantListPage.columnHeaders().eq(2).contains('Date Created');
});

Then(/^the third header column must display as "Status".$/, () => {
  TenantListPage.columnHeaders().eq(3).contains('Status');
});

Then(/^I must view the Tenant Names.$/, () => {
  TenantListPage.checkListRowsForClass(0, 'mat-column-Name');
});

Then(/^I must view the Tenant Dates Created.$/, () => {
  TenantListPage.checkListRowsForClass(1, 'mat-column-Date-Created');
});

Then(/^I must view the Tenant Statuses.$/, () => {
  TenantListPage.checkListRowsForClass(2, 'mat-column-Status');
});

Then(/^the header must be fixed to the top.$/, () => {
  TenantListPage.columnHeaders().each(th => {
    cy.get(th).should('have.class', 'mat-table-sticky');
  });
});

Then(/^the New badge indicator must be displayed.$/, () => {
  TenantListPage.checkListRowsForNewBadge(true, 'contain.html', 'ax-tag');
});

Then(/^the New badge indicator should not be displayed$/, () => {
  TenantListPage.checkListRowsForNewBadge(false, 'be.empty');
});

// add page test
// Then(/^the Submit button must be displayed on the page$/, () => {
//   AddTenantPage.customerDetailsSubmitButton().should('be.visible');
// });

Then(/^I must navigate to the Tenant List page$/, () => {
  TenantListPage.verifyTenantListUrl();
});

Then(/^I must view the Tenant List Filter Bar$/, () => {
  TenantListPage.getFilterBar().should('exist');
});

Then(/^the Tenant List Filter Bar contains the "Name" filter$/, () => {
  TenantListPage.getNameFilterInput().invoke('attr', 'placeholder').should('eq', 'Name');
});

Then(/^the name filter must be of type "Search"$/, () => {
  TenantListPage.getNameFilterInput().invoke('attr', 'type').should('eq', 'search');
});

Then(/^the Tenant List is filtered accordingly$/, () => {
  TenantListPage.verifyNameFilter();
});

Then(/^the filter is removed$/, () => {
  TenantListPage.getNameFilterInput().should('be.empty');
  TenantListPage.verifyEmptyNameFilter();
});

// Status column sort
Then(/^the table must sort the Status rows in ascending alphabetical order \(A->Z\)$/, () => {
  TenantListPage.checkTableColumnSort(
    TenantListPage.getTableColumnData(TenantListPage.tenantStatusData),
    'asc'
  );
});

Then(/^the table must sort the Status rows in descending alphabetical order \(Z->A\)$/, () => {
  TenantListPage.checkTableColumnSort(
    TenantListPage.getTableColumnData(TenantListPage.tenantStatusData),
    'desc'
  );
});

// Date Created column sort
Then(/^the table must sort the Date Created rows in ascending numerical$/, () => {
  TenantListPage.checkTableColumnSort(
    TenantListPage.getTableColumnData(TenantListPage.dateCreatedData),
    'asc'
  );
});

Then(/^the table must sort the Date Created rows in descending numerical order$/, () => {
  TenantListPage.checkTableColumnSort(
    TenantListPage.getTableColumnData(TenantListPage.dateCreatedData),
    'desc'
  );
});

// Site Name column sort
Then(/^the table must sort the Site Name rows in ascending alphabetical order \(A->Z\)$/, () => {
  TenantListPage.checkTableColumnSort(
    TenantListPage.getTableColumnData(TenantListPage.siteNameData),
    'asc'
  );
});

Then(/^the table must sort the Site Name rows in descending alphabetical order \(Z->A\)$/, () => {
  TenantListPage.checkTableColumnSort(
    TenantListPage.getTableColumnData(TenantListPage.siteNameData),
    'desc'
  );
});

Then(/^the table must sort the rows using the results from the Name filter.$/, () => {
  TenantListPage.verifyNameFilter('Bu');
});
