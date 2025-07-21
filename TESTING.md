Testing Guide
This document outlines the manual testing procedures to ensure the application is working correctly.

Prerequisites
The application has been successfully deployed as a web app.

You have access to the web app's URL.

You have a Gmail account with various types of emails to test against.

Test Cases
Follow these test cases to verify the functionality of the email extraction feature. For each test, check if the results match your expectations.

1. Basic Keyword Tests
These tests check if the basic search functionality is working.

Test Case

Input Query

Expected Outcome

1.1 Single Keyword

A common word from an email

Emails containing that word are returned.

1.2 Phrase Search

"A specific phrase"

Emails containing the exact phrase are returned.

1.3 No Results

a_very_unlikely_string_xyz

"該当するメールは見つかりませんでした。" is displayed.

2. Operator Tests
These tests verify that Gmail's search operators are functioning correctly.

Test Case

Input Query

Expected Outcome

2.1 From a specific sender

from:test@example.com

Only emails from test@example.com are returned.

2.2 In the subject

subject:Important

Only emails with "Important" in the subject are returned.

2.3 Has attachment

has:attachment

Only emails with attachments are returned.

2.4 Is unread

is:unread

Only unread emails are returned.

2.5 Is starred

is:starred

Only starred emails are returned.

3. Combination & Advanced Tests
These tests check complex queries.

Test Case

Input Query

Expected Outcome

3.1 AND search

from:info@example.com is:unread

Unread emails from info@example.com are returned.

3.2 Exclusion search

subject:Meeting -from:internal@company.com

Emails with "Meeting" in the subject, but not from internal@company.com, are returned.

3.3 Date search (after)

after:2025/07/20

Only emails received after July 20, 2025 are returned.

3.4 Date search (before)

before:2025/07/01

Only emails received before July 1, 2025 are returned.

3.5 OR search with parentheses

subject:(Urgent OR Important)

Emails with either "Urgent" or "Important" in the subject are returned.

4. Input Field Tests
These tests check the behavior of the input fields themselves.

Test Case

Action

Expected Outcome

4.1 Max Results (Low)

Set "最大件数" to 1 and search.

A maximum of 1 email is returned.

4.2 Max Results (High)

Set "最大件数" to 500 and search.

A maximum of 500 emails are returned.

4.3 Empty Query

Clear the "検索クエリ" field and click the button.

`An error occurred: Search query must be a non-empty string.` というエラーメッセージが表示される。

After making any code changes, it is recommended to run through these test cases to check for any regressions.