Feature: Create Game
    @e2e-test
    Scenario: Removes Game
        Given I've created a game
        When I click "Remove Game"
        Then I receive the message "Player has been successfully removed from CyGame."

    Scenario: Starts Game
        Given I've created a game
        When I click "Start Game"
        Then I will be rerouted to "game"
