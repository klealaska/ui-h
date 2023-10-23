Feature: BusHier
  @e2e-test
  Scenario: Manage Page
    Given that I have an organization
    When I navigate to the Manage page
    Then the application must display a tree

  Scenario: Displaying Edit Components
    Given that I am on the Organization Details page
    When I select the Edit button
    Then the page must display the Edit components for that Organization

  Scenario: Display deactivate dialog
    Given that I am on the Organization Details page
    When I click the deactivate button
    Then the page must display deactivate dialog

  Scenario: Successful toast: Deactivating an Organization
    Given that I am on the Organization Details page
    When I click the deactivate button
    When I confirm the deactivate on the dialog
    Then the page must display a deactivate successful toast

  Scenario: Displaying Edit Components
    Given that I am on the Organization Details page
    When I select the Edit button
    Then the page must display the Edit components for that Organization

  Scenario: Display deactivate dialog
    Given that I am on the Organization Details page
    When I click the deactivate button
    Then the page must display deactivate dialog

  Scenario: Successful toast: Deactivating an Organization
    Given that I am on the Organization Details page
    When I click the deactivate button
    When I confirm the deactivate on the dialog
    Then the page must display a deactivate successful toast

  Scenario: Error toast: Deactivating an Organization
    Given that I am on the Organization Details page
    When I click the deactivate button
    When I confirm the deactivate on the dialog and there is network error
    Then the page must display a deactivate failure toast

  Scenario: Editing Organization Details
    Given that I am on the Organization Details - Edit page
    When I enter valid data into the Organization Name and Organization Code
    When I select the Save Org button
    Then the application must update the details of that Organization
    Then a successful toaster message must be displayed

  Scenario: Negative Toaster Test: Network Error
    Given that I am on the Organization Details - Edit page
    When I enter valid data into the Organization Name and Organization Code
    When I click the Save Org button and there is a Network Error
    Then the application must display an unsuccessful toaster message

  Scenario: Updating Name in Tree
    Given that I have successfully updated the Organization Name
    Then the Business Hierarchy Tree must display the new Organization Name

  Scenario: Null Name and/or Code Field Validation
    Given that I am on the Organization Details - Edit page
    When I enter null data into the Organization Name and or Organization Code
    Then the Save button must be disabled

  Scenario: Land on Edit Organization Page
    Given that I am on the Organization Details page
    When I click on edit button
    Then Save button enabled

  Scenario: Displaying the Back Button
    Given that the user navigated from a previous page
    Then the back button must be displayed in the application

  Scenario: Using the Back Button
    Given that the user navigated from a previous page
    When the user selects the back button
    Then the application must navigate the user to the previous page

  Scenario: Editing ERP Details
    Given that I am on the ERP Details - Edit page
    When I enter valid data into the ERP Name and ERP Code
    When I select the Save Erp button
    Then the application must update the details of that ERP
    Then a successful toaster message must be displayed

  Scenario: Negative Toaster Test: Network Error ERP
    Given that I am on the ERP Details - Edit page
    When I enter valid data into the ERP Name and ERP Code
    When I click the Save Erp button and there is a Network Error
    Then the application must display an unsuccessful toaster message

  Scenario: Editing Entity Details
    Given that I am on the Entity Details - Edit page
    When I enter valid data into the Entity Name and Entity Code
    When I select the Save Entity button
    When the application must update the details of that Entity
    Then a successful toaster message must be displayed

  Scenario: Address Header and Divider
    Given that I am on the Organization Details page
    Then I should see the "Addresses" header displayed
    Then I should see a horizontal divider separating the addresses

  Scenario: Addresses Fields
    Given that I am on the Organization Details page
    When I view the address details for each address associated with the Organization
    Then I should see the following all applicable address fields

  Scenario: Validate Ship to and Bill to Addresses Sections
    Given that I am on the Organization Details page
    When I view the address details for each address associated with the Organization
    Then I should see BillTo Header and ShipTo Header

  Scenario: Display Entity Address Header
    Given that I am on the Entity Details page
    Then I should see the "Addresses" header displayed
    Then I should see a horizontal divider separating the addresses

  Scenario: Display all Entity Address Fields
    Given that I am on the Entity Details page
    When I view the address details for each address associated with the Entity
    Then I should see the following all applicable entity address fields

  Scenario: Displaying Multi Org/ERP List page
    Given that my Tenant has multiple Organizations or ERPs
    Then the application must display the list of Organizations associated with my Tenant
    And display the list of ERPs associated with my Tenant
    And the View hierarchy button must be deactivated

  Scenario: Display Edit Name Button
    Given that I am on the Entity list page
    Then I should see the edit name button

  Scenario: Editing Entity Name Should Open Side Sheet
    Given that I am on the Entity list page
    When I click edit name button
    Then the side sheet must be visible

  Scenario: Displaying Deactivate button and Active/Inactive Label
    Given that I am on the Entity Details page
    When I view the address details for each address associated with the Entity
    Then the page must display the Deactivate button for that Entity Address
    And the label must be displayed as Active

  Scenario: Displaying Deactivate Modal Dialog
    Given that I am on the Entity Details page
    When I select the Deactivate button
    Then the page must display the Deactivate Modal Dialog for that Entity Address

  Scenario: Cancel in Deactivate Model Dialog
    Given that the Deactivate Modal Dialog is displayed for an Entity Address
    When I select the Cancel button
    Then the application must close the Modal Dialog

  Scenario: X button in Deactivate Model Dialog
    Given that the Deactivate Modal Dialog is displayed for an Entity Address
    When I select the X button
    Then the application must close the Modal Dialog

  Scenario: Deactivating an entity Address
    Given that the Deactivate Modal Dialog is displayed for an Entity Address
    When I select the Deactivate Entity Address button from Modal
    Then the system must deactivate that Entity Address and a successful toaster message must be displayed
    And the badge must be displayed as Inactive
    And the Reactivate button must be displayed


  Scenario: Displaying Reactivate button and Inactive/Active Label
    Given that I am on the Entity Details page with Inactive Addresses
    When I view the address details for each address associated with the Entity
    Then the page must display the Reactivate button for that Entity Address
    And the label must be displayed as Inactive

  Scenario: Displaying Reactivate Modal Dialog
    Given that I am on the Entity Details page with Inactive Addresses
    When I select the Reactivate button
    Then the page must display the Reactivate Modal Dialog for that Entity Address

  Scenario: Cancel in Reactivate Model Dialog
    Given that the Reactivate Modal Dialog is displayed for an Entity Address
    When I select the Cancel button
    Then the application must close the Modal Dialog

  Scenario: X button in Reactivate Model Dialog
    Given that the Reactivate Modal Dialog is displayed for an Entity Address
    When I select the X button
    Then the application must close the Modal Dialog

  Scenario: Reactivating an entity Address
    Given that the Reactivate Modal Dialog is displayed for an Entity Address
    When I select the Reactivate button from Modal
    Then the system must activate that Entity Address and a successful toaster message must be displayed
    And the badge must be displayed as Activate
    And the Reactivate button must be displayed

  Scenario: Reactivating an entity Address failed
    Given that the Reactivate Modal Dialog is displayed for an Entity Address
    When I select the Reactivate entity address button from Modal with failure
    Then the system must activate that Entity Address and a failure toaster message must be displayed

  Scenario: Default Business Hierarchy page
    Given that my tenant has a business hierarchy for a single organization and single ERP
    When I navigate to the Business Hierarchy page
    Then the page must display the Business Hierarchy tree

  Scenario: Counts of Objects
    Given that my Business Hierarchy contains Organizations, ERPs, and Entities
    Then the Business Hierarchy Tree must display the total count of objects at each level of the Tree

  Scenario: Displaying of Names on Tree
    Given that my tenant has a business hierarchy for a single organization and single ERP
    Then the Organization button on the Tree must display the name of the Organization
    And the ERP button on the Tree must display the name of the ERP

  Scenario: Clicking on Organization Tree Object
    Given that there is a business hierarchy tree
    When the user selects the Organization Tree object
    Then the application must display the details of that Organization

  Scenario: Clicking on ERP Tree Object
    Given that there is a business hierarchy tree
    When the user selects the ERP Tree object
    Then the application must display the details of that ERP

  Scenario: Clicking on Entity (at any given Business Level) Tree Object - Displaying List
    Given that there is a business hierarchy tree and no Entity has been selected
    When the user selects the Entity Tree object
    Then the application should display the list of entities at that Business Level

  Scenario: Clicking on Entity (at any given Business Level) Tree Object - Displaying Details
    Given that there is a business hierarchy tree and the user has selected an Entity
    When the user selects the Entity Tree node
    Then the application must display the details of that Entity

  Scenario: Counts with Back Navigation.
    Given that I have selected a single entity on the list of entities
    And the count of that Business Level equals "1"
    When the user navigates back to the list of entities
    Then the Business Hierarchy tree must display the count of the total number of entities for that parent

  Scenario: View Hierarchy Button
    Given that the user is on the Multiple Org ERP List Page
    When the user selects one Organization AND one ERP
    Then the View hierarchy must be enabled

  Scenario: View hierarchy functionality
    Given that the user has selected one Organization AND one ERP
    When the user selects the View hierarchy button
    Then the application must navigate to the Business Hierarchy Landing Page
    Then generate the Business Hierarchy Tree with the selected Organization and ERP

  Scenario: Disabling ERPs
    Given that a Tenant has multiple ERPs
    When the user selects an Organization
    Then the ERP components that are not associated with that Organization must be disabled

  Scenario: Disabling Organizations
    Given that a Tenant has multiple Organizations
    When the user selects an ERP
    Then the Organization components that are not associated with that ERP must be disabled

  Scenario: Enabling ERP Components
    Given that an Organization is selected
    Given the ERP components that are not associated with that Organization are disabled
    When the user selects the selected Organization
    Then the disabled ERPs must be enabled

  Scenario: Enabling Organization Components
    Given that an ERP is selected
    Given the Organization components that are not associated with that ERP are disabled
    When the user selects the selected ERP
    Then the disabled Organizations must be enabled
  Scenario: Displaying Deactivate Modal Dialog
    Given that I am on the Entity Details page
    When I select the Deactivate button
    Then the page must display the Deactivate Modal Dialog for that Entity Address

  Scenario: Cancel in Deactivate Model Dialog
    Given that the Deactivate Modal Dialog is displayed for an Entity Address
    When I select the Cancel button
    Then the application must close the Modal Dialog

  Scenario: X button in Deactivate Model Dialog
    Given that the Deactivate Modal Dialog is displayed for an Entity Address
    When I select the X button
    Then the application must close the Modal Dialog

  Scenario: Deactivating an entity Address
    Given that the Deactivate Modal Dialog is displayed for an Entity Address
    When I select the Deactivate Entity Address button from Modal
    Then the system must deactivate that Entity Address and a successful toaster message must be displayed
    And the badge must be displayed as Inactive
    And the Reactivate button must be displayed

  Scenario: Displaying Reactivate button and Inactive/Active Label
    Given that I am on the Entity Details page with Inactive Addresses
    When I view the address details for each address associated with the Entity
    Then the page must display the Reactivate button for that Entity Address
    And the label must be displayed as Inactive

  Scenario: Displaying Reactivate Modal Dialog
    Given that I am on the Entity Details page with Inactive Addresses
    When I select the Reactivate button
    Then the page must display the Reactivate Modal Dialog for that Entity Address

  Scenario: Cancel in Reactivate Model Dialog
    Given that the Reactivate Modal Dialog is displayed for an Entity Address
    When I select the Cancel button
    Then the application must close the Modal Dialog

  Scenario: X button in Reactivate Model Dialog
    Given that the Reactivate Modal Dialog is displayed for an Entity Address
    When I select the X button
    Then the application must close the Modal Dialog

  Scenario: Reactivating an entity Address
    Given that the Reactivate Modal Dialog is displayed for an Entity Address
    When I select the Reactivate button from Modal
    Then the system must activate that Entity Address and a successful toaster message must be displayed
    And the badge must be displayed as Activate
    And the Reactivate button must be displayed

  Scenario: Reactivating an entity Address failed
    Given that the Reactivate Modal Dialog is displayed for an Entity Address
    When I select the Reactivate entity address button from Modal with failure
    Then the system must activate that Entity Address and a failure toaster message must be displayed
  Scenario: Default Business Hierarchy page
    Given that my tenant has a business hierarchy for a single organization and single ERP
    When I navigate to the Business Hierarchy page
    Then the page must display the Business Hierarchy tree

  Scenario: Counts of Objects
    Given that my Business Hierarchy contains Organizations, ERPs, and Entities
    Then the Business Hierarchy Tree must display the total count of objects at each level of the Tree

  Scenario: Displaying of Names on Tree
    Given that my tenant has a business hierarchy for a single organization and single ERP
    Then the Organization button on the Tree must display the name of the Organization
    And the ERP button on the Tree must display the name of the ERP

  Scenario: Clicking on Organization Tree Object
    Given that there is a business hierarchy tree
    When the user selects the Organization Tree object
    Then the application must display the details of that Organization

  Scenario: Clicking on ERP Tree Object
    Given that there is a business hierarchy tree
    When the user selects the ERP Tree object
    Then the application must display the details of that ERP

  Scenario: Clicking on Entity (at any given Business Level) Tree Object - Displaying List
    Given that there is a business hierarchy tree and no Entity has been selected
    When the user selects the Entity Tree object
    Then the application should display the list of entities at that Business Level

  Scenario: Clicking on Entity (at any given Business Level) Tree Object - Displaying Details
    Given that there is a business hierarchy tree and the user has selected an Entity
    When the user selects the Entity Tree node
    Then the application must display the details of that Entity

  Scenario: Counts with Back Navigation.
    Given that I have selected a single entity on the list of entities
    And the count of that Business Level equals "1"
    When the user navigates back to the list of entities
    Then the Business Hierarchy tree must display the count of the total number of entities for that parent

  Scenario: Displaying Organization Address Edit Side Sheet
    Given that I am on the Organization Details page
    When I select the pencil icon for a specific Organization Address
    Then the page must display the Edit side sheet for that Organization

  Scenario: Editing Organization Address Details
    Given that I am on the Organization Details - Address Edit side sheet
    When I enter valid data into the Address, City, State, Postal Code, and Address type fields and I select the Save button
    And the side sheet must close
    Then the application must update the details of that Organization Address

  Scenario: Selecting the Cancel button on Address Edit Side Sheet
    Given that I am on the Organization Details - Address Edit side sheet
    When I select the "Cancel" button
    Then the application must return to the Organization Details page
    And the system must not make an update to the Address

  Scenario: Updating Name on the Organization Details page
    Given that I have successfully updated any value for the Organizations Address
    When I return to the Organization Detail page
    Then the Organization Details page must display the updated Address

  Scenario: Displaying Entity Address Edit Side Sheet Entity
    Given that I am on the Entity Details page
    When I select the pencil icon for a specific Entity Address
    Then the page must display the Edit side sheet for that Entity

  Scenario: Editing Entity Address Details
    Given that I am on the Entity Details - Address Edit side sheet
    When I enter valid data into the Entity Address, City, State, Postal Code, and Address type fields and I select the Save button
    And the side sheet must close
    Then the application must update the details of that Entity Address

  Scenario: Selecting the Cancel button on Address Edit Side Sheet
    Given that I am on the Entity Details - Address Edit side sheet
    When I select the "Cancel" button
    Then the application must return to the Entity Details page
    And the system must not make an update to the Entity Address

  Scenario: Editing Entity Address Details Failure
    Given that I am on the Entity Details - Address Edit side sheet
    When I enter valid data into the Entity Address, City, State, Postal Code, and Address type fields and I select the Save button and Failure
    And the side sheet must close
    Then edit Entity Address failure toaster message must be displayed
    And the system must not make an update to the Entity Address

  Scenario: Updating Name on the Organization Details page
    Given that I have successfully updated any value for the Organizations Address
    When I return to the Organization Detail page
    Then the Organization Details page must display the updated Address

  Scenario: Editing Organization Details
    Given that I am on the Organization Details - Address Edit side sheet
    When I enter valid data into the Address, City, State, Postal Code, and Address type fields and I select the Save button
    And the side sheet must close
    Then the application must update the details of that Organization Address
    And a successful toaster message must be displayed

  Scenario: Negative Toaster Test: Network Error
    Given that I am on the Organization Details - Address Edit side sheet and there is a Network Error
    When I enter valid data into the Address, City, State, Postal Code, and Address type fields and I select the Save button and failure
    And the side sheet must close
    Then the application must display an unsuccessful toaster message for address edit failure

  Scenario: Null Fields - Test that we cannot save null fields for any field (UI Validation)
    Given that I am on the Organization Details - Address Edit side sheet
    When I enter null data into any field
    Then the field must display an error message
    And the Save button must be disabled.

  Scenario: Max Characters in each Field
    Given that I am on the Organization Details - Address Edit side sheet
    Then the Address field must limit the character input to 100 characters.
    Then the City field must limit the character input to 40 characters.
    Then the State field must limit the character input to 2 characters.
    Then the Postal Code field must limit the character input to 10 characters.
    Then the Address Code field must limit the character input to 32 characters.

  Scenario: Updating Name on the Organization Details page
    Given that I have successfully updated any value for the Organizations Address
    When I return to the Organization Detail page
    Then the Organization Details page must display the updated Address

  Scenario: Deactivating an organization Address
    Given that the Deactivate Modal Dialog is displayed for an Organization Address
    When I select the Deactivate Organization Address button from Modal
    Then the system must deactivate that Organization Address and a successful toaster message must be displayed
    And the badge must be displayed as Inactive
    And the Reactivate button must be displayed

  Scenario: Displaying Reactivate Modal Dialog organization address
    Given that I am on the Organization Details page with an Inactive Address
    When I select the reactivate button for a deactivated organization address
    Then the page must display the Reactivate Modal Dialog for that Organization Address

  Scenario: Cancel in Reactivate Model Dialog organization address
    Given that the Deactivate Modal Dialog is displayed for an Organization Address
    When I select the Cancel button
    Then the application must close the Modal Dialog

  Scenario: Reactivating an organization Address
    Given that the Deactivate Modal Dialog is displayed for an Organization Address Bill to
    Then I select the Reactivate Organization Address button from Modal
    Then the system must activate that organization Address and a successful toaster message must be displayed

  Scenario: Reactivating an organization Address failed
    Given that the Deactivate Modal Dialog is displayed for an Organization Address Bill to
    When I select the Reactivate org address button from Modal with failure
    Then the system must activate that organization Address and a failure toaster message must be displayed

  Scenario: Reactivating an organization Address
    Given that the Deactivate Modal Dialog is displayed for an Organization Address Bill to
    Then I select the Reactivate Organization Address button from Modal
    Then the system must activate that organization Address and a successful toaster message must be displayed


  Scenario: Editing Entity Details
    Given that I am on the Entity Details - Address Edit side sheet
    When I enter valid data into the Entity Details - Address, City, State, Postal Code, and Address type fields and I select the Save button
    Then the application must update the details of that Entity's Address
    And a successful toaster message must be displayed

  Scenario: Negative Toaster Test: Network Error
    Given that I am on the Entity Details - Address Edit side sheet and there is a Network Error
    When I enter valid data into the Entity Address, City, State, Postal Code, and Address type fields and I select the Save button and failure
    Then the application must display an unsuccessful toaster message for address edit failure

  Scenario: Null Fields - Test that we cannot save null fields for any field (UI Validation)
    Given that I am on the Entity Details - Address Edit side sheet
    When I enter null data into any field
    Then the field must display an error message
    And the Save button must be disabled.

  Scenario: Max Characters in each Field
    Given that I am on the Entity Details - Address Edit side sheet
    Then the Address field must limit the character input to 100 characters.
    Then the City field must limit the character input to 40 characters.
    Then the State field must limit the character input to 2 characters.
    Then the Postal Code field must limit the character input to 10 characters.
    Then the Address Code field must limit the character input to 32 characters.

