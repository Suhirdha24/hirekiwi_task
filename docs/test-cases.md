# Comprehensive Test Cases Specification: CareerHub QA Portal

This document provides 20 detailed, structured test cases covering all 18 evaluation areas required for the HireKiwi QA Engineer assessment. Each test case includes exact preconditions, step-by-step reproduction instructions, test data, expected versus actual results, execution status, and evidence references.

---

## Master Test Execution Summary Matrix

| ID | Feature Area | Scenario Description | Priority | Execution Status | Automated? | Evidence Reference |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **TC-01** | Job Listing Display | Verify all 4 job cards render with full metadata (Title, Dept, Salary, Exp, Location, Type) | **P0** | **Passed** | Yes | `tests/job-listings-ui-validation.spec.js` (Check 1) |
| **TC-02** | Search Functionality | Verify search by job title, keywords, and specific skills with case-insensitivity | **P1** | **Passed** | Yes | `tests/job-listings-ui-validation.spec.js` (Check 2) |
| **TC-03** | Department Filtering | Verify department dropdown filters matching roles and updates counter | **P1** | **Passed** | Yes | `tests/job-listings-ui-validation.spec.js` (Check 4) |
| **TC-04** | Combined & Clear Filters | Verify search and department work together, and "Clear Filters" restores full list | **P1** | **Passed** | Yes | `tests/job-listings-ui-validation.spec.js` (Checks 5 & 6) |
| **TC-05** | Job Details Navigation | Verify "View Details" opens modal with description, responsibilities & requirements | **P0** | **Passed** | Yes | `tests/job-listings-ui-validation.spec.js` (Check 7) |
| **TC-06** | Required Fields Validation | Verify submission with empty required fields is rejected with accessible inline errors | **P0** | **Passed** | Yes | `tests/application-form-validation.spec.js` (Scenario 2) |
| **TC-07** | Invalid Email Syntax | Verify invalid email formats are rejected and valid emails are accepted | **P0** | **Passed** | Yes | `tests/application-form-validation.spec.js` (Scenario 3) |
| **TC-08** | Whitespace-Only Input | Verify whitespace-only strings are rejected and leading/trailing spaces are trimmed | **P1** | **Passed** | Yes | `tests/application-form-validation.spec.js` (Scenario 4) |
| **TC-09** | Length & Boundaries | Verify boundary validation on Name (2–60 chars), Phone (10 digits), Exp (0–40), File (5MB) | **P1** | **Passed** | Yes | `tests/application-form-validation.spec.js` (Scenario 5) |
| **TC-10** | Valid Application Flow | Verify valid submission produces success modal, tracking ID (`APP-XXXXXX`), and resets form | **P0** | **Passed** | Yes | `tests/application-form-validation.spec.js` (Scenario 1) |
| **TC-11** | Duplicate Prevention | Verify duplicate application with identical email for same job ID returns HTTP 409 | **P0** | **Passed** | Yes | `tests/application-form-validation.spec.js` (Scenario 6) |
| **TC-12** | Repeated Click Protection | Verify submit button debounces (< 400ms) and prevents rapid multiple submissions | **P0** | **Passed** | Yes | `tests/application-form-validation.spec.js` (Scenario 7) |
| **TC-13** | Network Delay & Spinner | Verify 3s network delay produces visible loading spinner and disables submit button | **P1** | **Passed** | Yes | `tests/application-form-validation.spec.js` (Scenario 8) |
| **TC-14** | HTTP 500 Error Handling | Verify simulated HTTP 500 displays graceful error banner without crashing or wiping form | **P0** | **Passed** | Yes | `tests/application-form-validation.spec.js` (Scenario 9) |
| **TC-15** | Offline Drop & Recovery | Verify simulated offline drop displays network alert, and reconnecting allows successful retry | **P1** | **Passed** | Yes | `tests/application-form-validation.spec.js` (Scenario 10) |
| **TC-16** | Submission History Audit | Verify successful applications populate the Submitted Applications Registry audit table | **P1** | **Passed** | Yes | `tests/application-form-validation.spec.js` (Scenario 11) |
| **TC-17** | Browser Back Navigation | Verify browser Back button returns from details modal to listing with search state preserved | **P1** | **Passed** | Yes | `tests/job-listings-ui-validation.spec.js` (Check 8) |
| **TC-18** | Responsive Layout & a11y | Verify responsive layout across viewports (375px, 768px, 1280px) and visible focus rings | **P2** | **Passed** | Yes | `tests/job-listings-ui-validation.spec.js` (Check 9) |
| **TC-19** | Resume File Validation | Verify rejection of disallowed file extensions (.txt, .exe) and enforcement of 5MB limit | **P1** | **Passed** | Yes | `tests/application-form-validation.spec.js` (Scenario 5) |
| **TC-20** | QA Harness Reset State | Verify "Reset Applications" resets data store without blocking browser alerts | **P2** | **Passed** | Yes | `src/app.js` (`resetSubmissions`) & Scenario 10 |

---

## Detailed Test Cases Specification

### TC-01: Job Listing Display and Job Information
* **Test Case ID**: `TC-01`
* **Feature & Objective**: Job Listings UI — Verify that all active job cards display complete metadata including Title, Department, Salary Bracket, Experience Level, Location, and Employment Type badges.
* **Priority**: `P0 (Critical)`
* **Preconditions**: Mock portal is running at `http://localhost:3000`.
* **Test Steps**:
  1. Open `http://localhost:3000` in the browser.
  2. Inspect the `#jobs-grid` container.
  3. Verify that exactly 4 job cards are rendered (`JOB-101`, `JOB-102`, `JOB-103`, `JOB-104`).
  4. Inspect the metadata chips on each card: Title, Department badge, Salary, Experience, Location, and Employment Type.
* **Test Data**: Seed job listings (`JOB-101`: QA Automation Engineer, `JOB-102`: Associate QA Engineer, `JOB-103`: Senior Frontend Developer, `JOB-104`: DevOps & Cloud Engineer).
* **Expected Result**: All 4 job cards render with full metadata, uniform card heights, and visible "View Details" buttons.
* **Actual Result**: Passed. Verified in Playwright Check 1 (`tests/job-listings-ui-validation.spec.js`).
* **Execution Status**: `Passed`
* **Evidence Reference**: `test-results/` trace snapshot; Playwright Check 1.

---

### TC-02: Search by Title, Keyword, and Skill
* **Test Case ID**: `TC-02`
* **Feature & Objective**: Search Engine — Verify real-time search filtering across job titles, descriptions, and required skill tags with case-insensitivity and whitespace trimming.
* **Priority**: `P1 (High)`
* **Preconditions**: User is on `http://localhost:3000` with 4 jobs visible.
* **Test Steps**:
  1. In `#search-input`, type `"qa"`. Verify only `JOB-101` and `JOB-102` appear.
  2. Clear search and type `"Playwright"`. Verify only `JOB-101` appears.
  3. Clear search and type `"  react  "` (with leading/trailing spaces). Verify only `JOB-103` appears.
  4. Clear search and type `"XYZNONEXISTENT"`.
* **Test Data**: Search queries: `"qa"`, `"Playwright"`, `"  react  "`, `"XYZNONEXISTENT"`.
* **Expected Result**: Results update dynamically matching titles and skill tags; searching for a nonexistent query renders the `#jobs-empty-state` container.
* **Actual Result**: Passed. Verified in Playwright Checks 2 & 3.
* **Execution Status**: `Passed`
* **Evidence Reference**: `tests/job-listings-ui-validation.spec.js` Check 2.

---

### TC-03: Department Filtering
* **Test Case ID**: `TC-03`
* **Feature & Objective**: Department Filter — Verify filtering job openings by specific department category via the department dropdown.
* **Priority**: `P1 (High)`
* **Preconditions**: User is on the Job Listings page with all roles displayed.
* **Test Steps**:
  1. Open `#department-filter` dropdown.
  2. Select `"Quality Assurance"`.
  3. Verify that only roles belonging to the QA department are displayed.
  4. Verify that `#jobs-count` updates to `"Showing 2 of 4 open positions"`.
* **Test Data**: Department: `"Quality Assurance"`.
* **Expected Result**: Only QA roles (`JOB-101`, `JOB-102`) appear; counter reflects exact matches.
* **Actual Result**: Passed. Verified in Playwright Check 4.
* **Execution Status**: `Passed`
* **Evidence Reference**: Playwright Check 4 trace.

---

### TC-04: Combined Filters and Clearing Filters
* **Test Case ID**: `TC-04`
* **Feature & Objective**: Filter Combination & Reset — Verify search and department filters work simultaneously in tandem and that "Clear All Filters" resets the full listing.
* **Priority**: `P1 (High)`
* **Preconditions**: User is on the Job Listings page.
* **Test Steps**:
  1. Select `"Engineering"` from `#department-filter`.
  2. Enter `"react"` in `#search-input`.
  3. Verify only `JOB-103` (Senior Frontend Developer) is displayed.
  4. Click the "Clear Filters" button (`#btn-clear-search` or `#btn-reset-filters`).
* **Test Data**: Dept: `"Engineering"`, Query: `"react"`.
* **Expected Result**: Combined search narrows listing accurately; clicking "Clear Filters" resets the search input and department dropdown, displaying all 4 jobs.
* **Actual Result**: Passed. Verified in Playwright Checks 5 & 6.
* **Execution Status**: `Passed`
* **Evidence Reference**: Playwright Checks 5 & 6.

---

### TC-05: Job Details Navigation
* **Test Case ID**: `TC-05`
* **Feature & Objective**: Role Details View — Verify that clicking "View Details" opens the detailed job view modal with complete role description, responsibilities, and an enabled "Apply Now" button.
* **Priority**: `P0 (Critical)`
* **Preconditions**: Job cards are displayed on the home page.
* **Test Steps**:
  1. On `JOB-101` card, click "View Details" (`#btn-view-JOB-101`).
  2. Verify `#job-details-modal` is displayed.
  3. Verify `#details-title` displays `"QA Automation Engineer"`.
  4. Verify Key Responsibilities and Requirements lists contain itemized entries.
  5. Click `#btn-apply-from-details`.
* **Test Data**: Target Job ID: `JOB-101`.
* **Expected Result**: Detail view opens cleanly; clicking "Apply Now" launches the application form modal with pre-selected Job ID `JOB-101`.
* **Actual Result**: Passed. Verified in Playwright Check 7.
* **Execution Status**: `Passed`
* **Evidence Reference**: Playwright Check 7.

---

### TC-06: Required-Field Validation
* **Test Case ID**: `TC-06`
* **Feature & Objective**: Client & Server Form Validation — Verify that submitting an application with empty mandatory fields is blocked and displays accessible inline errors.
* **Priority**: `P0 (Critical)`
* **Preconditions**: Application modal is open (`#application-modal`).
* **Test Steps**:
  1. Open application form for `JOB-101`.
  2. Leave all inputs empty.
  3. Click `#btn-submit-application`.
  4. Inspect inline error elements: `#error-name`, `#error-email`, `#error-phone`, `#error-resume`, `#error-consent`.
* **Test Data**: Empty input payload `{ name: '', email: '', phone: '', resume: null, consent: false }`.
* **Expected Result**: Submission is halted; error spans display clear text with `role="alert"`; no network POST request creates a database record.
* **Actual Result**: Passed. Verified in Playwright Option B Scenario 2.
* **Execution Status**: `Passed`
* **Evidence Reference**: `tests/application-form-validation.spec.js` Scenario 2.

---

### TC-07: Invalid Email Syntax
* **Test Case ID**: `TC-07`
* **Feature & Objective**: Email Format Enforcement — Verify that invalid email formats are rejected with accessible feedback, while valid RFC-compliant emails are accepted.
* **Priority**: `P0 (Critical)`
* **Preconditions**: Application form is open.
* **Test Steps**:
  1. Enter Full Name `"Harvey Specter"`.
  2. In `#applicant-email`, test invalid variations: `"plainaddress"`, `"missingatsign.com"`, `"user@.com"`, `"user@domain"`.
  3. Click `#btn-submit-application`.
  4. Enter valid email `"harvey.specter@pearsonhardman.com"`.
* **Test Data**: Invalid: `"invalid-email-format"`; Valid: `"harvey.specter@pearsonhardman.com"`.
* **Expected Result**: Invalid emails display `"Please enter a valid email address (e.g., name@domain.com)"` and block submission; valid email clears error indicator immediately.
* **Actual Result**: Passed. Verified in Playwright Option B Scenario 3.
* **Execution Status**: `Passed`
* **Evidence Reference**: `tests/application-form-validation.spec.js` Scenario 3.

---

### TC-08: Whitespace-Only Input
* **Test Case ID**: `TC-08`
* **Feature & Objective**: Input Sanitization — Verify whitespace-only strings are rejected and leading/trailing whitespace is safely trimmed before submission.
* **Priority**: `P1 (High)`
* **Preconditions**: Application form is open.
* **Test Steps**:
  1. In `#applicant-name`, enter `"     "` (spaces only).
  2. Click Submit. Verify error: `"Full name cannot be empty or only spaces."`.
  3. Fill valid candidate data padded with leading and trailing spaces:
     - Name: `"   Donna Paulsen   "`
     - Email: `"   donna@firm.com   "`
     - Phone: `"  9876543210  "`
  4. Submit form.
  5. Inspect backend database record in Submitted Applications Registry.
* **Test Data**: Whitespace name `"     "`; Padded name `"   Donna Paulsen   "`.
* **Expected Result**: Whitespace-only input is rejected; padded data is trimmed and stored as `"Donna Paulsen"`, `"donna@firm.com"`, `"9876543210"`.
* **Actual Result**: Passed. Verified in Playwright Option B Scenario 4.
* **Execution Status**: `Passed`
* **Evidence Reference**: `tests/application-form-validation.spec.js` Scenario 4.

---

### TC-09: Minimum and Maximum Input Boundaries
* **Test Case ID**: `TC-09`
* **Feature & Objective**: Boundary Value Analysis — Verify minimum and maximum boundary enforcement across Name, Phone, Experience, and Cover Letter fields.
* **Priority**: `P1 (High)`
* **Preconditions**: Application form is open.
* **Test Steps**:
  1. Name < 2 characters (`"A"`): Verify error `"Full name must be at least 2 characters."`.
  2. Phone != 10 digits (`"12345"` or `"12345678901"`): Verify error `"Phone number must be exactly 10 numeric digits."`.
  3. Experience < 0 (`"-5"`): Verify error `"Experience cannot be negative."`.
  4. Experience > 40 (`"50"`): Verify error `"Experience must be between 0 and 40 years."`.
  5. Resume with invalid format (`"invalid_file.txt"`): Verify error `"Only .pdf, .doc, and .docx formats are permitted."`.
* **Test Data**: Boundaries: Name=`"A"`, Phone=`"12345"`, Exp=`"-5"`, Exp=`"50"`, File=`"invalid_file.txt"`.
* **Expected Result**: All boundary violations trigger dedicated inline error messages next to the affected inputs.
* **Actual Result**: Passed. Verified in Playwright Option B Scenario 5.
* **Execution Status**: `Passed`
* **Evidence Reference**: `tests/application-form-validation.spec.js` Scenario 5.

---

### TC-10: Valid Application Submission
* **Test Case ID**: `TC-10`
* **Feature & Objective**: Happy Path Submission — Verify a complete valid application generates a unique tracking ID (`APP-XXXXXX`), displays the success modal, and resets form fields.
* **Priority**: `P0 (Critical)`
* **Preconditions**: Application form is open for `JOB-101`.
* **Test Steps**:
  1. Fill Name: `"Rachel Zane"`.
  2. Fill Email: `"rachel.zane@firm.com"`.
  3. Fill Phone: `"9876543210"`.
  4. Select Experience: `2`.
  5. Attach valid resume: `sample_resume.pdf`.
  6. Fill Cover Letter: `"Passionate QA specialist eager to join the team."`.
  7. Check Consent declaration.
  8. Click Submit.
* **Test Data**: Complete valid candidate payload.
* **Expected Result**: `#success-modal` opens; displays `"Application Submitted!"` and unique Tracking ID (`APP-XXXXXX`); form resets.
* **Actual Result**: Passed. Verified in Playwright Option B Scenario 1.
* **Execution Status**: `Passed`
* **Evidence Reference**: `tests/application-form-validation.spec.js` Scenario 1.

---

### TC-11: Duplicate Submission Prevention
* **Test Case ID**: `TC-11`
* **Feature & Objective**: Duplicate Detection — Verify that applying twice to the same job opening using the identical email address is rejected with HTTP 409 Conflict.
* **Priority**: `P0 (Critical)`
* **Preconditions**: Candidate `"mike.ross@firm.com"` has already submitted an application for `JOB-101`.
* **Test Steps**:
  1. Re-open application modal for `JOB-101`.
  2. Fill identical email `"mike.ross@firm.com"` with all valid inputs.
  3. Click Submit Application.
* **Test Data**: Email: `"mike.ross@firm.com"`, Job: `JOB-101`.
* **Expected Result**: Backend responds with HTTP 409 Conflict; portal displays `#duplicate-modal` warning candidate of existing submission; no duplicate record is stored.
* **Actual Result**: Passed. Verified in Playwright Option B Scenario 6 and Core Workflow TC-14.
* **Execution Status**: `Passed`
* **Evidence Reference**: `tests/application-form-validation.spec.js` Scenario 6.

---

### TC-12: Repeated Submit-Button Clicks (Debouncing)
* **Test Case ID**: `TC-12`
* **Feature & Objective**: Concurrency & Debounce Guard — Verify that rapidly clicking the submit button (< 150ms interval) does not trigger multiple simultaneous API requests.
* **Priority**: `P0 (Critical)`
* **Preconditions**: Valid form inputs filled in application modal.
* **Test Steps**:
  1. Fill form with candidate `"rapid.clicker@firm.com"`.
  2. Rapidly double-click or triple-click `#btn-submit-application` within 100ms.
  3. Verify submit button disables immediately (`disabled` attribute).
  4. Verify button text changes to `"Submitting Application..."` with spinner.
  5. Inspect backend database records for `"rapid.clicker@firm.com"`.
* **Test Data**: 3 rapid clicks on `#btn-submit-application`.
* **Expected Result**: Submit button disables on first click; exactly 1 HTTP POST is processed; exactly 1 record is created in the database.
* **Actual Result**: Passed. Verified in Playwright Option B Scenario 7 and Core Workflow TC-13.
* **Execution Status**: `Passed`
* **Evidence Reference**: `tests/application-form-validation.spec.js` Scenario 7.

---

### TC-13: Network Delay and Loading State
* **Test Case ID**: `TC-13`
* **Feature & Objective**: Latency Resilience — Verify that enabling the 3-second network delay in the QA Test Harness produces an observable loading indicator and disables the submit button during in-flight requests.
* **Priority**: `P1 (High)`
* **Preconditions**: User is on `http://localhost:3000`.
* **Test Steps**:
  1. Check `#toggle-network-delay` (Network Delay 3s) in the QA Test Harness Console.
  2. Open application modal and fill valid data.
  3. Click Submit Application.
  4. Assert button state and text immediately after click.
* **Test Data**: QA Delay toggle: `true` (3000ms delay).
* **Expected Result**: Submit button is disabled; spinner animation is visible; button text shows `"Submitting Application..."` for 3 seconds before completing.
* **Actual Result**: Passed. Verified in Playwright Option B Scenario 8.
* **Execution Status**: `Passed`
* **Evidence Reference**: `tests/application-form-validation.spec.js` Scenario 8.

---

### TC-14: HTTP 500 Server Error Handling
* **Test Case ID**: `TC-14`
* **Feature & Objective**: Server Fault Tolerance — Verify that simulated HTTP 500 Internal Server Error displays a friendly error banner without crashing the application or wiping candidate form inputs.
* **Priority**: `P0 (Critical)`
* **Preconditions**: QA Console toggle "Simulate HTTP 500" is enabled.
* **Test Steps**:
  1. Check `#toggle-sim-500` in the QA Console.
  2. Open application modal and fill candidate information including a detailed cover letter.
  3. Click Submit Application.
  4. Inspect `#form-error-banner`.
  5. Verify that entered form values in `#applicant-name`, `#applicant-email`, `#applicant-phone`, and `#applicant-cover-letter` remain intact.
* **Test Data**: Toggle `#toggle-sim-500` = `true`.
* **Expected Result**: Server error banner displays `"Server Error (HTTP 500): Simulated database connection failure."`; form does not white-screen; user inputs are preserved intact for retry.
* **Actual Result**: Passed. Verified in Playwright Option B Scenario 9 and Core Workflow TC-16.
* **Execution Status**: `Passed`
* **Evidence Reference**: `tests/application-form-validation.spec.js` Scenario 9.

---

### TC-15: Offline Failure and Recovery
* **Test Case ID**: `TC-15`
* **Feature & Objective**: Network Drop Resilience — Verify that simulating an offline connection produces a controlled network error and that turning offline mode off allows instant recovery without re-entering data.
* **Priority**: `P1 (High)`
* **Preconditions**: User has filled the application form.
* **Test Steps**:
  1. Enable `#toggle-sim-offline` in the QA Test Harness Console.
  2. Click Submit Application.
  3. Verify error banner: `"Network Error: You appear to be offline. Please check your internet connection."`.
  4. Verify candidate form fields remain filled.
  5. Uncheck `#toggle-sim-offline`.
  6. Click Submit Application again.
* **Test Data**: Offline toggle on -> submit -> offline toggle off -> submit.
* **Expected Result**: Offline state displays a clean banner; unchecking offline mode allows immediate successful submission without data re-entry.
* **Actual Result**: Passed. Verified in Playwright Option B Scenario 10.
* **Execution Status**: `Passed`
* **Evidence Reference**: `tests/application-form-validation.spec.js` Scenario 10.

---

### TC-16: Submission History Consistency
* **Test Case ID**: `TC-16`
* **Feature & Objective**: Audit Trail Synchronization — Verify that every successful application submission dynamically updates the Submitted Applications Registry table with unique ID, candidate details, timestamp, and status.
* **Priority**: `P1 (High)`
* **Preconditions**: User is on `http://localhost:3000`.
* **Test Steps**:
  1. Submit a valid application for `"Jessica Pearson"` (`"jessica.pearson@firm.com"`).
  2. Close the success modal.
  3. Scroll down to `#submissions-section`.
  4. Inspect `#submissions-table-body`.
  5. Verify matching row exists with Application ID, Role, Candidate Name, Email, and Status badge (`SUBMITTED`).
* **Test Data**: Candidate: `"Jessica Pearson"`, Job: `JOB-101`.
* **Expected Result**: Registry table contains the newly submitted candidate with formatted badge and matching ID.
* **Actual Result**: Passed. Verified in Playwright Option B Scenario 11.
* **Execution Status**: `Passed`
* **Evidence Reference**: `tests/application-form-validation.spec.js` Scenario 11.

---

### TC-17: Browser Back Navigation State Preservation
* **Test Case ID**: `TC-17`
* **Feature & Objective**: Browser History & State — Verify that navigating from a filtered search to a role details view and pressing browser "Back" restores the previous search query and filter state.
* **Priority**: `P1 (High)`
* **Preconditions**: User is on `http://localhost:3000`.
* **Test Steps**:
  1. In `#search-input`, type `"QA"`. Verify 2 roles visible.
  2. Click "View Details" on `JOB-101`.
  3. Press browser Back button (`page.goBack()`).
* **Test Data**: Query: `"QA"`; Navigation: `page.goBack()`.
* **Expected Result**: Details modal closes, portal returns to listings view, and search input value `"QA"` remains preserved.
* **Actual Result**: Passed. Verified in Playwright Check 8 (`tests/job-listings-ui-validation.spec.js`).
* **Execution Status**: `Passed`
* **Evidence Reference**: Playwright Check 8.

---

### TC-18: Responsive Layout and Accessibility Basics
* **Test Case ID**: `TC-18`
* **Feature & Objective**: Responsive Layout & WCAG Compliance — Verify that the portal renders cleanly without horizontal overflow across mobile (375px), tablet (768px), and desktop (1280px) viewports, and that interactive elements contain visible focus rings.
* **Priority**: `P2 (Medium)`
* **Preconditions**: Application is loaded.
* **Test Steps**:
  1. Resize browser viewport to 375x667 (Mobile).
  2. Check for horizontal overflow: `scrollWidth <= clientWidth`.
  3. Verify job cards and QA console controls stack vertically.
  4. Resize to 768x1024 (Tablet) and 1280x800 (Desktop).
  5. Traverse interactive buttons using `Tab` key and verify focus outlines.
* **Test Data**: Viewports: `375x667`, `768x1024`, `1280x800`.
* **Expected Result**: Zero horizontal scrolling across all viewports; focus rings visible on Tab navigation; text contrast meets WCAG 2.1 AA standards.
* **Actual Result**: Passed. Verified in Playwright Check 9.
* **Execution Status**: `Passed`
* **Evidence Reference**: Playwright Check 9.

---

### TC-19: Resume File Upload Validation
* **Test Case ID**: `TC-19`
* **Feature & Objective**: Document Security & Format Validation — Verify that non-permitted file extensions (.txt, .exe, .sh) and oversized documents (> 5MB) are rejected with clear user feedback.
* **Priority**: `P1 (High)`
* **Preconditions**: Application modal is open.
* **Test Steps**:
  1. In `#applicant-resume`, upload `invalid_file.txt`.
  2. Click Submit Application.
  3. Verify `#error-resume` displays: `"Only .pdf, .doc, and .docx formats are permitted."`.
  4. Upload valid `sample_resume.pdf`. Verify error clears.
* **Test Data**: `invalid_file.txt` (plain text) vs. `sample_resume.pdf` (valid document).
* **Expected Result**: Invalid file extension is rejected; valid PDF is accepted.
* **Actual Result**: Passed. Verified in Playwright Option B Scenario 5.
* **Execution Status**: `Passed`
* **Evidence Reference**: `tests/fixtures/invalid_file.txt`; Scenario 5.

---

### TC-20: QA Test Harness Console Reset Function
* **Test Case ID**: `TC-20`
* **Feature & Objective**: Data Store Reset — Verify that clicking "Reset Applications" in the QA Test Harness resets in-memory submissions, clears MongoDB Atlas test collections, and updates the status pill non-destructively.
* **Priority**: `P2 (Medium)`
* **Preconditions**: Applications exist in the test database.
* **Test Steps**:
  1. Submit application.
  2. Click `#btn-reset-data` in QA Console.
  3. Inspect `#qa-status-pill` and `#submissions-table-body`.
* **Test Data**: Click `#btn-reset-data`.
* **Expected Result**: Status pill updates to `"Server: Data Store Reset"`; submissions registry clears; no blocking native browser alert interrupts execution.
* **Actual Result**: Passed. Verified in Option B Scenario 10 and `src/app.js`.
* **Execution Status**: `Passed`
* **Evidence Reference**: `src/app.js` (`resetSubmissions`).
