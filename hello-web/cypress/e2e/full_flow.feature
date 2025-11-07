Feature: Full flow on hello-web

  Background:
    Given API base is "http://127.0.0.1:3000"
    And Frontend Team exists via API
    And User "Alan Turing" with email "alan@example.com" exists via API
    And a Shift for team "Frontend" exists on "2025-11-08" from "09:00" to "17:00" via API

  Scenario: Create post and see it in Posts list
    When I open the homepage "http://127.0.0.1:3001/"
    And I create a post with name "Alan Turing", email "alan@example.com", title "Hello Title", body "Body text"
    Then I should see "Hello Title" in the posts list

  Scenario: Create an Assignment (assign a user to the shift)
    When I open the homepage "http://127.0.0.1:3001/"
    And I select the user "Alan Turing" in assignment form
    And I select the prepared shift in assignment form
    And I submit the assignment form
    Then I should see an assignment row for "Alan Turing" containing "2025-11-08 09:00-17:00"

  Scenario: Create a Leave and see it listed
    When I open the homepage "http://127.0.0.1:3001/"
    And I create a leave for "Alan Turing" on "2025-11-08" from "09:00" to "12:00" with reason "Doctor" and status "approved"
    Then I should see a leave row for "Alan Turing" containing "[approved]"
