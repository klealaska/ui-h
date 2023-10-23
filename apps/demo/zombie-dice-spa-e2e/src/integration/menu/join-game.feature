Feature: Join Game
    @e2e-test
    Scenario: Requires User Name
        Given I'm at menu
        When I select a game
        Then Join Game button should be disabled

    Scenario: Nagivates to lobby
        Given I'm at menu
        When I select a game
        And I enter Uame Name as "CyName"
        Then Join Game button should be successful

    Scenario: Leave Game
        Given I've joined a game
        When I click "Leave Game"
        Then I receive the message "Player has been successfully removed from CyGame."