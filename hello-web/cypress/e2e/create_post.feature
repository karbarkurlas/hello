Feature: Create post
  Scenario: User creates a post and sees it in the list
    Given I open the homepage
    When I fill the form with "Test User", "user@test.com", "Hello Title", "Hello Body"
    And I submit the form
    Then I should see "Hello Title" in the posts list
