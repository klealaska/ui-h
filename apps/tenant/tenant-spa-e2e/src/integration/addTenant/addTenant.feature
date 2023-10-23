Feature: Tenant
    Background:
        Given that I am on the add tenant page

    Scenario: View Page Title
        Then the title "Customer Site Details" must be displayed

    Scenario: Viewing Page
        Then the background color must be 'Surface-50'

    Scenario: Page Title
        When I view the title
        Then the title of "Customer Site" must have a font-weight of 600

    Scenario: Back Arrow button is in the page and it is enabled
        Then the "Back Arrow" button must be displayed

    Scenario: Back Arrow button is clicked
        When I view the add page and click "Back Arrow" button
        Then I should be routed to Tenant List page

    # Add Tenant page toast message
    Scenario: Create Tenant page toaster
        When I select the Submit button And creating a Tenant was successful
        Then the toaster message must be displayed.

    Scenario: Create Tenant page toaster
        When I select the Submit button And creating a Tenant was successful
        Then the toaster message title is: "New Site ID Created"

    Scenario: Create Tenant page toaster
        When I select the Submit button And creating a Tenant was successful
        Then the user is able to dismiss the toast by clicking the "x".

    Scenario: Create Tenant page toaster
        When I select the Submit button And creating a Tenant was successful
        Then the toaster message must persist for at least 3 seconds

    Scenario: Create Tenant page toaster
        When a user clicks another part of the screen
        Then the toaster message will remain for the 3 seconds or until the user dismisses.

    # Add Tenant page toast error message
    Scenario: Create Tenant page toaster error
        When I select the Submit button and creating a Tenant was unsuccessful
        Then the toaster message must be displayed.

    Scenario: Create Tenant page toaster error
        When I select the Submit button and creating a Tenant was unsuccessful
        Then the toaster message title is: "Site ID Creation Failed"

    Scenario: Create Tenant page toaster error
        When I select the Submit button and creating a Tenant was unsuccessful
        Then the user is able to dismiss the toast by clicking the "x".

    Scenario: Create Tenant page toaster error
        When I select the Submit button and creating a Tenant was unsuccessful
        Then the toaster error message must persist for at least 3 seconds

    Scenario: Create Tenant page toaster error
        When a user clicks outside of the toaster message
        Then the toaster message will remain for the 3 seconds or until the user dismisses.

    Scenario: Navigate to Manage Tenant page on successful tenant creation
        When a user successfully creates a new tenant
        Then the application must redirect the user to that tenant's Manage page.
        And a successful toaster message must be displayed.

    Scenario: Stay on Create Tenant page when creation is unsuccessful
        When creation of a new tenant fails
        Then the user must remain on the Create Tenant page
        And an unsuccessful toaster message must be displayed

    Scenario: Viewing Customer Details anchor
        Then the font-family for the "Customer Details" anchor link must be 'inter Regular'

    Scenario: Viewing Customer Details anchor
        Then the font-weight for the "Customer Details" anchor link must be '400'

    Scenario: Viewing Customer Details anchor
        Then the font-size for the "Customer Details" anchor link must be '14px'

    Scenario: Viewing Customer Details anchor
        Then the text-color for the "Customer Details" anchor link must be 'grey-800'

    Scenario: Site Name Validation
        When I enter a unique site name into the Site Name input field
        Then the system must check if the Site Name is a unique entry.

    Scenario: Site Name Validation
        When I enter an invalid site name into the Site Name input field
        Then the system must check if the Site Name is not a unique entry and the error input field must be red.