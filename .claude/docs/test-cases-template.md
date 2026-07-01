@PROJ-412
Feature: Reset password via email

As a registered user
I want to reset my password via an email link
So that I can regain access if I forget it

Background:
Given the user is on the "Forgot password" page

@AC1 @smoke @p1
Scenario: Registered email receives a reset link
When the user requests a reset for "alice@example.com"
Then a confirmation message "Check your email for a reset link" is shown
And a reset email is sent to "alice@example.com"

@AC2 @regression @p1
Scenario Outline: Unregistered or malformed emails show the same confirmation
When the user requests a reset for "<email>"
Then a confirmation message "Check your email for a reset link" is shown
And no reset email is sent

    Examples:
      | email                 |
      | nobody@example.com    |
      | not-an-email          |
      |                       |

@AC3 @regression @p2
Scenario: A reset link expires after 60 minutes
Given a reset link was sent to "alice@example.com" 61 minutes ago
When the user opens the reset link
Then an error message "This reset link has expired" is shown

@AC4 @regression @p2
Scenario: A reset link can only be used once
Given a reset link was sent to "alice@example.com"
And the user has already reset their password with that link
When the user opens the reset link again
Then an error message "This reset link has already been used" is shown