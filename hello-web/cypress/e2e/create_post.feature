Feature: Create post
  Scenario: User creates a post and sees it in the list
    Given I open the homepage
    When I type "T Tester" into the "Name" field
    And I type "t.tester@example.com" into the "Email" field
    And I type "Hello Title" into the "Title" field
    And I type "Hello Body" into the "Body" field
    And I click the "Save Post" button
    Then I should see "Hello Title" in the posts list
