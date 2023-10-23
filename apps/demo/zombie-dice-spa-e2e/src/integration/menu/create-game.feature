Feature: Create Game
    @e2e-test
    Scenario: Requires User Name
        Given I'm at menu
        When I enter Game Name as "CyGame"
        Then Create button should be disabled

    Scenario: Requires Game Name
        Given I'm at menu
        When I enter User Name as "CyName"
        Then Create button should be disabled

    Scenario: Nagivates to lobby
        Given I'm at menu
        When I enter User Name as "CyName"
        And I enter Game Name as "CyGame"
        Then Create Game should be successful