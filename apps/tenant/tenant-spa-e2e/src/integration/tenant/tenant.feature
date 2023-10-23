Feature: Tenant
  Background:
    Given that I am on the tenant list page

  Scenario: View Page Title
    Then the title "Customer Site" must be displayed

  Scenario: Page Title
    When I view the title
    Then the title of "Customer" must have a font-weight of 600px

  Scenario: Page Title Is Present
    Then the title of "Site" must have a font-weight of 300px

  Scenario: Create Site button is in the page and it is enabled
    When I view the list page
    Then the "Create Site" button must display the text as "Create Site"

  Scenario: Create Site button is in the page and it is enabled
    When I view the list page
    Then the "Create Site" button must display the text as "Create Site"

  Scenario: Create Site button is clicked
    When I view the list page and click "Create Site" button
    Then I should be routed to Create Site page

  Scenario: Tenant List Column Data is viewed
    Then I must view the Tenant Names.

  Scenario: Tenant List Column Data is viewed
    Then I must view the Tenant Dates Created.

  Scenario: Tenant List Column Data is viewed
    Then I must view the Tenant Statuses.

  Scenario: Tenant List Column Data is viewed
    When the Date Created is less than or equal to 3 days
    Then the New badge indicator must be displayed.

  Scenario: Selecting tenant and clicking back arrow button
    Given I select a Tenant on the table and I am on the Manage Page
    When I select the back arrow button
    Then I must navigate to the Tenant List page

  Scenario: Tenant List Filter Bar
    Then I must view the Tenant List Filter Bar

  Scenario: Tenant List Filter Bar
    Then the Tenant List Filter Bar contains the "Name" filter

  Scenario: Tenant List Filter Bar
    Then the name filter must be of type "Search"

  Scenario: Tenant List Filter Bar
    When I enter text in the "Name" field
    Then the Tenant List is filtered accordingly

  Scenario: Tenant List Filter Bar
    When I enter text in the "Name" field AND I select the text and delete it
    Then the filter is removed

  Scenario: Tenant List Status Sort Ascending
    When the rows are in the default sort and I select the Status column header
    Then the table must sort the Status rows in ascending alphabetical order (A->Z)

  Scenario: Tenant List Status Sort Descending
    When the rows are sorted in ascending alphabetical order (A->Z) and I select the Status column header
    Then the table must sort the Status rows in descending alphabetical order (Z->A)

  Scenario: Tenant List Date Created Sort Ascending
    When the rows are in the default sort and I select the Date Created column header
    Then the table must sort the Date Created rows in ascending numerical

  Scenario: Tenant List Date Created Sort Descending
    When the rows are sorted in ascending numerical order and I select the Date Created column header
    Then the table must sort the Date Created rows in descending numerical order

  Scenario: Tenant List Site Name Sort Ascending
    When the rows are in the default sort and I select the Site Name column header
    Then the table must sort the Site Name rows in ascending alphabetical order (A->Z)

  Scenario: Tenant List Site Name Sort Descending
    When the rows are sorted in ascending alphabetical order (A->Z) and I select the Site Name column header
    Then the table must sort the Site Name rows in descending alphabetical order (Z->A)

  Scenario: Sorting table with Name filter results
    When I input a valid value into the Name filter AND I sort a column header on the table
    Then the table must sort the rows using the results from the Name filter.
