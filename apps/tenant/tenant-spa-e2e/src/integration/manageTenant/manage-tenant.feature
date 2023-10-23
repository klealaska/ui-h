Feature: Manage Tenant
  Background:
    Given that I have a valid tenant ID AND I am on the Manage Tenant Page

  Scenario: Manage Page Customer Details header
    Then the header Customer Details must be displayed.

  Scenario: Viewing Page
    Then the background color should be 'Surface-50'

  #    Site Name/CMP ID Fields
  Scenario: Manage Page *Site Name label
    Then the Section Label "*Site Name" must be displayed above the first input field.

  Scenario: Manage Page Site Name text
    Then the Site Name must be displayed in the Site Name input field

  Scenario: Manage Page Site Name field enabled
    Then the Site Name input field must be enabled

  Scenario: Manage Page *CMP ID label
    Then the Section Label "*CMP ID" must be displayed above the second input field.

  Scenario: Manage Page CMP ID text
    Then the CMP ID must be displayed in the CMP ID field.

  Scenario: Manage Page CMP ID helper text
    Then the Text Label "20 case-sensitive characters" must be displayed under the second input field.

  #      Site ID Field
  Scenario: Manage Page Site ID section
    Then the Section Label "Site ID" must be displayed on the right side of the Card.

  Scenario: Manage Page Site ID Text
    Then the Site ID must be displayed on the right side of the Card.

  #      Submit Button
  Scenario: Manage Page Submit Button
    Then the Submit Button must be displayed

  Scenario: Manage Page Submit Button disabled
    Then the Submit Button must be disabled

  Scenario: Manage Page Submit Button enabled
    When the Site Name is edited
    Then the Submit Button must be enabled

  Scenario: Manage Page Title update on Submit
    When the Site Name is edited and the Submit Button is clicked
    Then the Page Title must be updated to the new Site Name

  # Update Tenant Toast
  Scenario: Update Tenant Success Toast
    When I select the Submit button And editing a Tenant was successful
    Then the successful toaster message "Customer Details Updated" must be displayed.

  Scenario: Update Tenant Failure Toast
    When I select the Submit button And editing a Tenant was unsuccessful
    Then the toaster message error "Customer Details Update Failed" must be displayed.

  Scenario: Viewing Customer Details anchor
    Then the font-family for the "Customer Details" link must be 'inter Regular'

  Scenario: Viewing Customer Details anchor
    Then the font-weight for the "Customer Details" link must be '400'

  Scenario: Viewing Customer Details anchor
    Then the font-size for the "Customer Details" link must be '14px'

  Scenario: Viewing Customer Details anchor
    Then the text-color for the "Customer Details" link must be 'grey-800'

  Scenario: Site Name Validation
    When I enter a unique site name into the Site Name input field
    Then the system must check if the updated Site Name is a unique entry.

  Scenario: Site Name Validation
    When I enter an invalid site name into the Site Name input field
    Then the system must check if the updated Site Name is not a unique entry and the error input field must be red.

  # Product Entitlements
  Scenario: View Product Entitlements on Manage Tenant
    Then values for Product Entitlements must be displayed.

  Scenario: Assign Product Entitlement to Tenant
    When I select one or more entitlements
    Then the system must assign those entitlements to the tenant

  Scenario: Prevent unassigning a Tenant
    When a product entitlement is assigned to a Tenant
    Then that entitlement must be unable to be selected in the UI
