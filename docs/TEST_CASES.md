# Test Cases Specification: Job Application Workflow

This document details 20 prioritized test cases spanning Positive, Negative, Boundary, Concurrency, and Error-Handling scenarios for the Job Application Workflow.

---

## Summary Matrix

| ID | Title | Category | Priority | Automated | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Verify Job Listings Display Correct Metadata | Positive | P0 | Yes | Cards show Title, Salary, Exp, Tags |
| **TC-02** | Verify Navigation from Card to Role Details | Positive | P0 | Yes | Opens detail view with matching role data |
| **TC-03** | Verify Department & Keyword Search Filtering | Positive | P1 | Yes | Filtered subset matches query |
| **TC-04** | Verify Successful Job Application Submission | Positive | P0 | Yes | Form submits, modal shows success, form resets |
| **TC-05** | Form Submission with Missing Required Fields | Negative | P0 | Yes | Inline validation highlights missing fields |
| **TC-06** | Form Submission with Invalid Email Syntax | Negative | P0 | Yes | Rejects format without proper `@domain.ext` |
| **TC-07** | Form Submission with Whitespace-Only Name & Email | Negative/Boundary | P1 | Yes | Rejects whitespace-only; trims before submit |
| **TC-08** | Full Name Boundary Length Validation (Min/Max) | Boundary | P1 | No | Rejects 1 char; accepts 2-50 chars |
| **TC-09** | Phone Number Boundary Length (10 Digits) | Boundary | P1 | Yes | Accepts 10 digits; rejects 9, 11, or alpha |
| **TC-10** | Experience Field Boundary (0 to 40 Years) | Boundary | P1 | No | Rejects negative numbers; accepts 0-40 |
| **TC-11** | Resume Upload with Prohibited File Extension | Negative | P1 | No | Rejects non-PDF/DOC files with clear alert |
| **TC-12** | Resume Upload Exceeding Maximum Size (>5MB) | Boundary | P1 | No | Rejects file > 5MB with size error |
| **TC-13** | Prevent Accidental Rapid Double-Click Submission | Concurrency | P0 | Yes | Submit button debounces; only 1 API call made |
| **TC-14** | Duplicate Candidate Application Prevention | Negative/State | P0 | Yes | Rejects duplicate email for same job ID |
| **TC-15** | Handle High-Latency / Slow Network Response | Error Handling | P1 | Yes | Displays loading spinner; disables controls |
| **TC-16** | Handle Simulated HTTP 500 Server Error | Error Handling | P0 | Yes | Displays error banner; keeps form values safe |
| **TC-17** | State Preservation on Browser Back Navigation | Navigation | P1 | No | Preserves search filter state on return |
| **TC-18** | Application Modal Close Confirmation / ESC Key | Usability | P2 | No | Modal closes smoothly or prompts on dirty form |
| **TC-19** | Cross-Browser Compatibility (Chromium / Firefox / WebKit) | Compatibility | P1 | Yes | Consistent UI rendering across all engines |
| **TC-20** | Accessible Keyboard Navigation (Tab & Focus Rings) | Accessibility | P2 | No | All form inputs reachable via Tab with focus outline |

---

## Detailed Test Cases

### TC-01: Verify Job Listings Display Correct Metadata
* **Priority**: P0 (Critical) | **Category**: Positive
* **Preconditions**: Mock portal is running at `http://localhost:3000`.
* **Test Steps**:
  1. Open `http://localhost:3000` in browser.
  2. Locate the job listing grid.
  3. Inspect the first 3 job cards for Job Title, Department, Salary Bracket, Experience Range, and Skills tags.
* **Test Data**: Default mock dataset (e.g., "QA Automation Engineer", "Frontend Developer", "DevOps Specialist").
* **Expected Result**: All job cards display complete metadata without missing placeholders or broken layout.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Screenshot of job grid, DOM element inspection.

---

### TC-02: Verify Navigation from Card to Role Details
* **Priority**: P0 (Critical) | **Category**: Positive
* **Preconditions**: Job listings grid is visible.
* **Test Steps**:
  1. Click on "View Details" or role card for "QA Automation Engineer".
  2. Verify the URL or view switches to the Role Details view.
  3. Inspect the Job Description, Key Responsibilities, and "Apply Now" button.
* **Expected Result**: The active view updates to show the selected role details with an enabled "Apply Now" button.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Screenshot of navigation error or blank detail container.

---

### TC-03: Verify Department & Keyword Search Filtering
* **Priority**: P1 (High) | **Category**: Positive
* **Preconditions**: User is on the Job Listings page with all roles displayed.
* **Test Steps**:
  1. Enter "QA" into the search bar.
  2. Verify that only roles matching "QA" remain visible in the grid.
  3. Clear the search and select "Engineering" from the Department dropdown.
* **Expected Result**: The grid dynamically filters matching listings and displays a friendly "No jobs found" if no results match.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Screenshot showing irrelevant job cards remaining in results.

---

### TC-04: Verify Successful Job Application Submission
* **Priority**: P0 (Critical) | **Category**: Positive
* **Preconditions**: Application modal/form is open for a selected job.
* **Test Steps**:
  1. Fill "Full Name" with `Jane Doe`.
  2. Fill "Email Address" with `jane.doe@example.com`.
  3. Fill "Phone Number" with `9876543210`.
  4. Select "Years of Experience" as `3`.
  5. Upload a valid resume file `resume.pdf` (under 2MB).
  6. Fill "Cover Letter" with `Excited to apply for this QA position!`.
  7. Check the "I agree to data processing" consent checkbox.
  8. Click "Submit Application".
* **Expected Result**: A success modal or toast displays ("Application submitted successfully!"), application ID is generated, and the form resets.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Network request payload, console log error, failure screenshot.

---

### TC-05: Form Submission with Missing Required Fields
* **Priority**: P0 (Critical) | **Category**: Negative
* **Preconditions**: Application form is opened with all inputs empty.
* **Test Steps**:
  1. Leave all input fields completely blank.
  2. Click "Submit Application".
  3. Inspect the form response.
* **Expected Result**: Form is not submitted. Clear inline error alerts appear under "Full Name", "Email", "Phone", and "Consent", and focus jumps to the first invalid field.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Screenshot showing submission occurred or missing error messages.

---

### TC-06: Form Submission with Invalid Email Syntax
* **Priority**: P0 (Critical) | **Category**: Negative
* **Preconditions**: Application form is opened.
* **Test Steps**:
  1. Enter valid Name and Phone.
  2. Enter `janedoe` (missing `@` and domain) into Email field.
  3. Click "Submit Application".
  4. Repeat with `jane@` and `jane@domain`.
* **Expected Result**: System rejects the submission and displays an error: `"Please provide a valid email address (e.g., name@domain.com)"`.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Screenshot of accepted invalid email submission, network response.

---

### TC-07: Form Submission with Whitespace-Only Name & Email
* **Priority**: P1 (High) | **Category**: Negative / Boundary
* **Preconditions**: Application form is opened.
* **Test Steps**:
  1. Enter `"   "` (3 whitespace characters) in "Full Name".
  2. Enter `"    "` in "Email".
  3. Attempt to submit.
* **Expected Result**: Inputs are trimmed prior to validation check; the form treats them as blank and prevents submission with `"Full name cannot be empty or only spaces"`.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Screenshot of whitespace-only submission accepted into state.

---

### TC-08: Full Name Boundary Length Validation (Min/Max)
* **Priority**: P1 (High) | **Category**: Boundary
* **Preconditions**: Application form is opened.
* **Test Steps**:
  1. Test Lower Boundary - 1: Enter `A` (1 character) -> Expect error `"Name must be at least 2 characters"`.
  2. Test Lower Boundary Valid: Enter `Al` (2 characters) -> Expect accepted.
  3. Test Upper Boundary Valid: Enter a 50-character string -> Expect accepted.
  4. Test Upper Boundary + 1: Enter a 51-character string -> Expect truncation or validation warning.
* **Expected Result**: Name accepts between 2 and 50 characters inclusive and rejects values outside boundaries.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Screenshot showing accepted 1-character name.

---

### TC-09: Phone Number Boundary Length (10 Digits)
* **Priority**: P1 (High) | **Category**: Boundary
* **Preconditions**: Application form is opened.
* **Test Steps**:
  1. Test 9 digits: `987654321` -> Click Submit -> Expect `"Phone number must be exactly 10 digits"`.
  2. Test 11 digits: `98765432101` -> Click Submit -> Expect rejection or input limitation.
  3. Test alphabetic characters: `98765ABCD0` -> Expect non-digit rejection.
  4. Test valid 10 digits: `9876543210` -> Expect accepted.
* **Expected Result**: Strictly accepts 10-digit numeric format.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Screenshot of accepted 9-digit or alphabetical phone number.

---

### TC-10: Experience Field Boundary (0 to 40 Years)
* **Priority**: P1 (High) | **Category**: Boundary
* **Preconditions**: Application form is opened.
* **Test Steps**:
  1. Enter `-1` into Experience -> Expect `"Experience cannot be negative"`.
  2. Enter `0` (Fresher) -> Expect accepted.
  3. Enter `40` -> Expect accepted.
  4. Enter `45` -> Expect `"Experience must be between 0 and 40 years"`.
* **Expected Result**: Only values within 0–40 years are accepted.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Screenshot showing negative experience accepted.

---

### TC-11: Resume Upload with Prohibited File Extension
* **Priority**: P1 (High) | **Category**: Negative
* **Preconditions**: Application form is opened.
* **Test Steps**:
  1. Attempt to upload `script.exe` or `malicious.bat`.
  2. Inspect the file input response.
* **Expected Result**: File input restricts selection via `accept=".pdf,.doc,.docx"` and displays error: `"Only .pdf, .doc, and .docx formats are permitted"`.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Screenshot showing `.exe` file attached to form.

---

### TC-12: Resume Upload Exceeding Maximum Size (>5MB)
* **Priority**: P1 (High) | **Category**: Boundary
* **Preconditions**: Application form is opened.
* **Test Steps**:
  1. Select a file sized 6.5 MB (`large_resume.pdf`).
  2. Attempt to attach or submit.
* **Expected Result**: System rejects the file with `"File size exceeds maximum limit of 5MB"`.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Screenshot of upload container displaying accepted oversized file.

---

### TC-13: Prevent Accidental Rapid Double-Click Submission
* **Priority**: P0 (Critical) | **Category**: Concurrency / Submission
* **Preconditions**: Application form is filled with valid data.
* **Test Steps**:
  1. Rapidly click the "Submit Application" button 3 times in quick succession (< 200ms interval).
  2. Monitor the network requests and button state.
* **Expected Result**: The Submit button immediately enters a disabled / loading state upon the first click, debouncing subsequent clicks. Only one application submission is registered.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Network trace showing multiple identical HTTP POST requests, or duplicate application IDs created.

---

### TC-14: Duplicate Candidate Application Prevention
* **Priority**: P0 (Critical) | **Category**: Negative / State
* **Preconditions**: Candidate `jane.doe@example.com` has already applied for Job ID `JOB-101`.
* **Test Steps**:
  1. Re-open application form for Job ID `JOB-101`.
  2. Enter `jane.doe@example.com` as the applicant email.
  3. Fill required fields and submit.
* **Expected Result**: System detects prior submission and displays alert: `"An application with this email address has already been submitted for this role."`
* **Actual Result**: Pass
* **Required Evidence on Failure**: Screenshot showing duplicate application registered in database/state.

---

### TC-15: Handle High-Latency / Slow Network Response
* **Priority**: P1 (High) | **Category**: Error Handling / Resilience
* **Preconditions**: Simulated network delay toggle is set to 3000ms.
* **Test Steps**:
  1. Fill valid application form.
  2. Click "Submit Application".
  3. Observe UI during the 3-second delay.
* **Expected Result**: Submit button shows loading spinner with `"Submitting..."`, interactive controls are disabled to prevent state changes, and success modal renders gracefully once resolved.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Screenshot of UI freezing or unhandled button clicks during delay.

---

### TC-16: Handle Simulated HTTP 500 Server Error
* **Priority**: P0 (Critical) | **Category**: Error Handling
* **Preconditions**: Simulated Server Error toggle is enabled (returns 500 Internal Server Error).
* **Test Steps**:
  1. Fill application form with valid candidate data.
  2. Click "Submit Application".
  3. Observe UI response.
* **Expected Result**: Form catches the 500 response, displays a polite error banner: `"Server error occurred. Please try again later."`, does NOT wipe the candidate's entered input fields, and allows re-trying.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Screenshot of white screen crash, unhandled browser console uncaught promise rejection, or lost candidate inputs.

---

### TC-17: State Preservation on Browser Back Navigation
* **Priority**: P1 (High) | **Category**: Navigation
* **Preconditions**: User has filtered the job grid by "Engineering".
* **Test Steps**:
  1. Click into a role to open details.
  2. Click browser "Back" button.
* **Expected Result**: User is returned to the listings grid with "Engineering" filter still active.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Screenshot showing filter reset back to "All".

---

### TC-18: Application Modal Close Confirmation / ESC Key
* **Priority**: P2 (Medium) | **Category**: Usability
* **Preconditions**: Application form is partially filled with candidate inputs.
* **Test Steps**:
  1. Press the `Escape` key or click the modal close button (`×`).
  2. Observe system prompt.
* **Expected Result**: If form has unsaved modifications, system prompts for confirmation before discarding data.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Modal closes instantly with accidental loss of extensive entered text.

---

### TC-19: Cross-Browser Compatibility (Chromium / Firefox / WebKit)
* **Priority**: P1 (High) | **Category**: Compatibility
* **Preconditions**: Local mock application running at `http://localhost:3000`.
* **Test Steps**:
  1. Execute automated Playwright suite on Desktop Chromium, Firefox, and WebKit (Safari engine).
  2. Compare visual layout and form submission behavior.
* **Expected Result**: All 3 rendering engines render the application consistently with zero engine-specific layout breaking.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Playwright cross-browser test failure report with screenshot diff.

---

### TC-20: Accessible Keyboard Navigation (Tab & Focus Rings)
* **Priority**: P2 (Medium) | **Category**: Accessibility
* **Preconditions**: Application form is opened.
* **Test Steps**:
  1. Use only the `Tab` key to traverse through all form controls.
  2. Press `Space` to toggle consent checkbox.
  3. Press `Enter` to submit.
* **Expected Result**: High-contrast focus indicator is visible on every focused element; all controls can be operated entirely via keyboard.
* **Actual Result**: Pass
* **Required Evidence on Failure**: Screenshot showing missing focus outline on active field.
