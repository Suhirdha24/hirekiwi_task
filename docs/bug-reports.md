# Formal Defect Reports & Evidence Log

This document provides structured, professional defect reports discovered during testing of the Job Application Workflow. Findings are categorized into **Part A: Actual Observed Defects on the External Reference Portal**, **Part B: Application Edge Scenarios & Mitigations on the Local Mock Portal (CareerHub)**, and **Part C: Code Defects Identified & Resolved during Option B Development**.

---

## 1. Executive Summary & Defect Taxonomy

### 1.1 Defect Classification Matrix
* **Total Defects Documented**: 10
  * **Observed on Live NCS Portal**: 3 (`BUG-01`, `BUG-02`, `BUG-03`)
  * **Application Edge Mitigations**: 4 (`BUG-04`, `BUG-05`, `BUG-06`, `BUG-07`)
  * **Resolved Code Implementation Defects**: 3 (`BUG-08`, `BUG-09`, `BUG-10`)
* **Severity Definitions**:
  * **S1 (Critical)**: Application crash, white screen, inability to apply, or candidate data corruption.
  * **S2 (Major)**: Validation evasion, duplicate submissions accepted, or filter state wipe.
  * **S3 (Minor)**: Cosmetic misalignments, accessibility tag omissions, minor UI inconsistencies.
  * **S4 (Trivial)**: CSS class typos, code comments, spelling discrepancies.
* **Priority Definitions**:
  * **P0 (Immediate)**: Must fix before release; directly impacts candidate application completion.
  * **P1 (High)**: Must fix in current sprint; affects data integrity and core user experience.
  * **P2 (Medium)**: Scheduled for subsequent sprint; cosmetic or minor compliance item.

---

## Part A: Actual Observed Defects (External Reference Hiring Portal)

### BUG-01: Typo in Core Header Navigation CSS Class (`.joobseeker-dropdown`)
* **Bug ID**: `BUG-01`
* **Short Title**: Header dropdown CSS class typo `.joobseeker-dropdown`
* **Feature Affected**: Navigation & Global Header Stylesheet
* **Preconditions**: Public network access to the external reference job portal.
* **Reproduction Steps**:
  1. Navigate to the external reference job portal.
  2. Open Browser DevTools (F12) -> Elements / Sources panel.
  3. Search stylesheet references for class definitions in `.main-ncs-header-div`.
  4. Inspect the dropdown container style definition.
* **Expected Behavior**: Class name is spelled correctly as `.jobseeker-dropdown`.
* **Actual Behavior**: Class name is misspelled as `.joobseeker-dropdown` in production styles.
* **Severity**: `S4 (Trivial)`
* **Priority**: `P2 (Medium)`
* **Environment**: Chromium 156.0.8078.4 / Windows 11 / Reference Portal
* **Evidence**:
  ```css
  /* Found in external portal styles */
  .ncs-nav-bar[_ngcontent-ng-c3049235200] .joobseeker-dropdown[_ngcontent-ng-c3049235200] {
    margin-top: 12px;
  }
  ```
* **Status**: `Open (External Third-Party Production System)`

---

### BUG-02: Search & Filter State Wipe on Browser Back Navigation
* **Bug ID**: `BUG-02`
* **Short Title**: Filter and query parameters wiped on browser Back navigation
* **Feature Affected**: Job Search, Department Filtering & History Routing
* **Preconditions**: Candidate is browsing jobs on the external reference job portal.
* **Reproduction Steps**:
  1. Navigate to Job Search section on the external reference job portal.
  2. Select sector filter (e.g. "Information Technology") and enter a keyword.
  3. Click on a specific role from the results to open the role details page.
  4. Click the browser's "Back" navigation button (`Alt + Left Arrow`).
* **Expected Behavior**: Portal returns to search results with sector filter and search query preserved.
* **Actual Behavior**: Filter state resets to empty/default; search input is completely wiped.
* **Severity**: `S2 (Major)`
* **Priority**: `P1 (High)`
* **Environment**: Chromium 156.0.8078.4 / Windows 11 / Reference Portal
* **Evidence**: URL lacks query parameters (`?sector=IT&q=...`); state loss confirmed upon history navigation.
* **Status**: `Open (External Third-Party Production System; Resolved in CareerHub via History API)`

---

### BUG-03: Missing Accessible Name (`aria-label`) on Dynamic Search Buttons
* **Bug ID**: `BUG-03`
* **Short Title**: Icon-only search buttons lack `aria-label` accessibility attributes
* **Feature Affected**: Global Search Bar Accessibility (WCAG 2.1 AA)
* **Preconditions**: Portal loaded on the external reference job portal.
* **Reproduction Steps**:
  1. Inspect `.header-search-btn` and mobile navigation icon buttons in header.
  2. Run Lighthouse / Axe Accessibility audit.
* **Expected Behavior**: Interactive icon elements contain `aria-label="Search jobs"` or descriptive accessible name.
* **Actual Behavior**: Element renders `<a class="header-search-btn"><i></i></a>` without `aria-label` or text.
* **Severity**: `S3 (Minor)`
* **Priority**: `P2 (Medium)`
* **Environment**: Chromium 156.0.8078.4 / Windows 11
* **Evidence**: Accessibility tree audit flags element: `"Buttons must have discernible text"`.
* **Status**: `Open (External Third-Party Production System; Resolved in CareerHub with ARIA tags)`

---

## Part B: Application Portal Edge Scenarios & Mitigations

### BUG-04: Unprotected Application Submit Button Allows Accidental Duplicate Submissions
* **Bug ID**: `BUG-04`
* **Short Title**: Accidental double-click submits multiple simultaneous API requests
* **Feature Affected**: Application Form Submission Handler & Concurrency Guard
* **Preconditions**: Candidate fills valid application inputs in `#application-modal`.
* **Reproduction Steps**:
  1. Open Application Modal for role `JOB-101`.
  2. Fill valid candidate details (`name`, `email`, `phone`, `resume.pdf`, `consent`).
  3. Rapidly double-click or triple-click the "Submit Application" button (< 150ms interval).
* **Expected Behavior**: Submit button disables immediately on first click; exactly 1 API call is processed; exactly 1 record is created.
* **Actual Behavior (Before Fix)**: Unprotected button allowed 2–3 simultaneous requests, creating multiple identical records.
* **Severity**: `S2 (Major)`
* **Priority**: `P0 (Critical)`
* **Environment**: Local Mock Application (`http://localhost:3000`)
* **Evidence**: Automated test `TC-13` in `tests/job-application-workflow.spec.js` and Scenario 7 in `tests/application-form-validation.spec.js`.
* **Status**: `Resolved & Verified (Debounce guard implemented in app.js)`

---

### BUG-05: Missing Sanitization Allows Whitespace-Only Full Name & Email Evasion
* **Bug ID**: `BUG-05`
* **Short Title**: Whitespace-only strings evade required field validation
* **Feature Affected**: Input Validation & Data Sanitization
* **Preconditions**: Application form is open.
* **Reproduction Steps**:
  1. Open application form.
  2. In "Full Name", enter 5 space characters (`"     "`).
  3. Click "Submit Application".
* **Expected Behavior**: System trims whitespace, detects empty value, and renders `"Full name cannot be empty or only spaces."`.
* **Actual Behavior (Before Fix)**: Form evaluated `.length > 0` as true and accepted blank spaces.
* **Severity**: `S2 (Major)`
* **Priority**: `P1 (High)`
* **Environment**: Local Mock Application (`http://localhost:3000`)
* **Evidence**: Automated test Scenario 4 in `tests/application-form-validation.spec.js`.
* **Status**: `Resolved & Verified (.trim() validation applied across frontend and server.js)`

---

### BUG-06: Unhandled HTTP 500 Server Error Wipes Candidate Form Input
* **Bug ID**: `BUG-06`
* **Short Title**: HTTP 500 server error causes white-screen or resets entered form data
* **Feature Affected**: Server Error Handling & State Preservation
* **Preconditions**: QA Test Harness toggle "Simulate HTTP 500" is enabled.
* **Reproduction Steps**:
  1. Check "Simulate HTTP 500" in QA Test Harness panel.
  2. Fill candidate information and a detailed cover letter.
  3. Click "Submit Application".
* **Expected Behavior**: Friendly error banner appears: `"Server Error (HTTP 500): Simulated database connection failure."`; entered values remain preserved.
* **Actual Behavior (Before Fix)**: Page threw uncaught error or reset form, causing user data loss.
* **Severity**: `S1 (Critical)`
* **Priority**: `P0 (Critical)`
* **Environment**: Local Mock Application (`http://localhost:3000`)
* **Evidence**: Automated test `TC-16` and Scenario 9 in `tests/application-form-validation.spec.js`.
* **Status**: `Resolved & Verified (Graceful error banner and form value retention implemented)`

---

### BUG-07: Duplicate Application Detection for Same Candidate Email
* **Bug ID**: `BUG-07`
* **Short Title**: Candidates can submit multiple applications for the same opening with identical email
* **Feature Affected**: Candidate Uniqueness & Duplicate Detection
* **Preconditions**: An application for `JOB-101` already exists for candidate `"alex.morgan@example.com"`.
* **Reproduction Steps**:
  1. Submit application for `JOB-101` with email `alex.morgan@example.com`.
  2. Open `JOB-101` again and submit with identical email `alex.morgan@example.com`.
* **Expected Behavior**: Server returns `HTTP 409 Conflict`; portal displays `#duplicate-modal` warning candidate.
* **Actual Behavior (Before Fix)**: System allowed unlimited duplicate entries for the same role.
* **Severity**: `S2 (Major)`
* **Priority**: `P0 (Critical)`
* **Environment**: Local Mock Application (`http://localhost:3000`)
* **Evidence**: Automated test `TC-14` and Scenario 6 in `tests/application-form-validation.spec.js`.
* **Status**: `Resolved & Verified (HTTP 409 Conflict check implemented in server.js and app.js)`

---

## Part C: Code Implementation Defects Identified & Fixed During Option B

### BUG-08: HTML `maxlength="10"` on Phone Field Truncated Whitespace-Padded Input & Silent Overflow
* **Bug ID**: `BUG-08`
* **Short Title**: Browser `maxlength="10"` silently clips phone input before JavaScript validation
* **Feature Affected**: Phone Number Boundary Validation
* **Preconditions**: Application modal is open.
* **Reproduction Steps**:
  1. In Phone Number, enter `'  9876543210  '` (padded with spaces) or `'12345678901'` (11 digits).
  2. Click Submit Application.
* **Expected Behavior**: Padded input is trimmed and accepted; oversized input displays error `"Phone number must be exactly 10 numeric digits."`.
* **Actual Behavior (Before Fix)**: Browser attribute `maxlength="10"` truncated padded string to 8 digits (failing submission) and silently sliced 11 digits to 10 without error feedback.
* **Severity**: `S2 (Major)`
* **Priority**: `P1 (High)`
* **Environment**: Local Mock Application (`src/index.html`)
* **Evidence**: Playwright tests Scenarios 4 & 5 in `tests/application-form-validation.spec.js`.
* **Status**: `Resolved & Verified (Expanded to maxlength="15" in index.html; strict JS/backend regex)`

---

### BUG-09: Missing Error Container & Accessible `role="alert"` for Cover Letter Boundary Validation
* **Bug ID**: `BUG-09`
* **Short Title**: Missing `#error-cover-letter` span and absent ARIA alert roles
* **Feature Affected**: Accessibility & Form Boundary Error Display
* **Preconditions**: Candidate enters > 1000 characters in cover letter.
* **Reproduction Steps**:
  1. Inspect `#applicant-cover-letter` container in `src/index.html`.
  2. Enter > 1000 characters in cover letter.
  3. Submit application.
* **Expected Behavior**: Error appears in dedicated `<span id="error-cover-letter" role="alert">` element next to the input.
* **Actual Behavior (Before Fix)**: No error span existed; error could not render inline; error spans lacked `role="alert"`.
* **Severity**: `S3 (Minor)`
* **Priority**: `P2 (Medium)`
* **Environment**: Local Mock Application (`src/index.html`, `src/app.js`)
* **Evidence**: Playwright Scenario 5 in `tests/application-form-validation.spec.js`.
* **Status**: `Resolved & Verified (Added #error-cover-letter with role="alert" and dynamic clear)`

---

### BUG-10: Blocking Browser `alert()` in QA Test Harness Reset Operation
* **Bug ID**: `BUG-10`
* **Short Title**: Native browser `alert()` modal blocks automation execution thread
* **Feature Affected**: QA Test Harness Console & Automation Reliability
* **Preconditions**: Applications exist in the test store.
* **Reproduction Steps**:
  1. Click "Reset Applications" in the QA Test Harness Console.
* **Expected Behavior**: Non-blocking toast/pill notification updates to confirm data store reset.
* **Actual Behavior (Before Fix)**: Native `alert('Local test submissions have been reset successfully!')` blocked browser execution and broke test automation runners.
* **Severity**: `S3 (Minor)`
* **Priority**: `P2 (Medium)`
* **Environment**: Local Mock Application (`src/app.js`)
* **Evidence**: Playwright Scenario 10 in `tests/application-form-validation.spec.js`.
* **Status**: `Resolved & Verified (Replaced with non-blocking #qa-status-pill UI update)`

---

## 3. Summary of Defect Resolution Status

| Defect ID | Title | Severity | Priority | System | Resolution Status |
| :--- | :--- | :---: | :---: | :--- | :---: |
| **BUG-01** | Header CSS typo `.joobseeker-dropdown` | S4 | P2 | Live NCS | Open (Third-party) |
| **BUG-02** | Filter state loss on Back navigation | S2 | P1 | Live NCS | Open (Third-party; resolved in mock) |
| **BUG-03** | Missing `aria-label` on search buttons | S3 | P2 | Live NCS | Open (Third-party; resolved in mock) |
| **BUG-04** | Rapid double-click duplicate API calls | S2 | P0 | CareerHub | **Resolved & Verified** |
| **BUG-05** | Whitespace-only string validation evasion | S2 | P1 | CareerHub | **Resolved & Verified** |
| **BUG-06** | Form input loss on HTTP 500 error | S1 | P0 | CareerHub | **Resolved & Verified** |
| **BUG-07** | Duplicate application allowed for same email | S2 | P0 | CareerHub | **Resolved & Verified** |
| **BUG-08** | Browser `maxlength="10"` early phone truncation | S2 | P1 | CareerHub | **Resolved & Verified** |
| **BUG-09** | Missing `#error-cover-letter` and ARIA alert roles | S3 | P2 | CareerHub | **Resolved & Verified** |
| **BUG-10** | Blocking browser `alert()` in QA reset | S3 | P2 | CareerHub | **Resolved & Verified** |
