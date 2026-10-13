# Defect Reports & Evidence Log

This document provides formal bug reports, reproduction steps, severity/priority justification, and evidence logging for the Job Application Workflow.

---

## 1. Executive Summary & Defect Taxonomy

### 1.1 Test Execution Results Breakdown
* **Total Scenarios Evaluated**: 20
* **Automated High-Priority Scenarios (Playwright)**: 7 / 7 Passed (**100% Pass Rate**)
* **Manual / Boundary Scenarios Verified**: 9 Passed
* **Blocked on Live Portal (NCS)**: 4 (Live destructive submission, live network drop, live 500 error induction, production database tampering — marked as Blocked/N/A per safety rules)
* **Defects Identified**: 7 (3 Actual Live Portal Defects, 4 Simulated Edge Defect Scenarios)

### 1.2 Severity & Priority Classification Matrix
* **Severity**:
  * **S1 (Critical)**: Application crash, white screen, inability to apply, or candidate data corruption.
  * **S2 (Major)**: Validation evasion, duplicate submissions accepted, or filter state wipe.
  * **S3 (Minor)**: Cosmetic misalignments, accessibility tag omissions, minor UI inconsistencies.
  * **S4 (Trivial)**: CSS class typos, code comments, spelling discrepancies.
* **Priority**:
  * **P0 (Immediate)**: Must fix before release; directly impacts candidate application completion.
  * **P1 (High)**: Must fix in current sprint; affects data integrity and core user experience.
  * **P2 (Medium)**: Scheduled for subsequent sprint; cosmetic or minor compliance item.

---

## Part A: Actual Observed Defects (Real Production Portal - NCS)

### BUG-01: Typo in Core Header Navigation CSS Class (`.joobseeker-dropdown`)
* **Bug ID**: `BUG-01`
* **Defect Type**: Actual Observed Defect (Real Portal)
* **Severity**: `S4 (Trivial)`
* **Severity Justification**: Does not break layout immediately due to matching CSS selector in template, but violates code quality standards and causes maintainability defects.
* **Priority**: `P2 (Medium)`
* **Target Portal**: National Career Service (`https://www.ncs.gov.in`)
* **Environment**: Chromium 156.0.8078.4 / Windows 11
* **Steps to Reproduce**:
  1. Navigate to `https://www.ncs.gov.in`.
  2. Open Browser DevTools (F12) -> Elements / Sources panel.
  3. Search stylesheet references for class definitions in `.main-ncs-header-div`.
  4. Inspect the dropdown container style definition.
* **Expected Result**: Class name is spelled correctly as `.jobseeker-dropdown`.
* **Actual Result**: Class name is misspelled as `.joobseeker-dropdown`.
* **Evidence / Log**:
  ```css
  /* Found in https://www.ncs.gov.in styles */
  .ncs-nav-bar[_ngcontent-ng-c3049235200] .joobseeker-dropdown[_ngcontent-ng-c3049235200] {
    margin-top: 12px;
  }
  ```
* **Remediation**: Refactor `.joobseeker-dropdown` to `.jobseeker-dropdown` across Angular templates and SCSS stylesheets.

---

### BUG-02: Search & Filter State Wipe on Browser Back Navigation
* **Bug ID**: `BUG-02`
* **Defect Type**: Actual Observed Defect (Real Portal)
* **Severity**: `S2 (Major)`
* **Severity Justification**: Users who spend time filtering jobs by category and state lose their entire filter context when viewing a job and clicking "Back", forcing tedious re-filtering.
* **Priority**: `P1 (High)`
* **Target Portal**: National Career Service (`https://www.ncs.gov.in`)
* **Steps to Reproduce**:
  1. Navigate to Job Search section on `https://www.ncs.gov.in`.
  2. Select sector filter (e.g. "Information Technology") and location filter.
  3. Click on a specific role from the results to open the role details page.
  4. Click the browser's "Back" navigation button (`Alt + Left Arrow`).
* **Expected Result**: Portal returns to the search results with "Information Technology" and location filters preserved.
* **Actual Result**: Filter state resets to default empty/All state, and search input is wiped.
* **Evidence / Log**: URL lacks synchronization query parameters (`?sector=IT&loc=...`), resulting in client-side state loss.
* **Remediation**: Bind filter parameters to URL search params using `useSearchParams` or Angular router query parameters.

---

### BUG-03: Missing Accessible Name (`aria-label`) on Dynamic Search Buttons
* **Bug ID**: `BUG-03`
* **Defect Type**: Actual Observed Defect (Real Portal)
* **Severity**: `S3 (Minor)`
* **Severity Justification**: Violates WCAG 2.1 AA accessibility guidelines; screen readers cannot announce button purpose to visually impaired candidates.
* **Priority**: `P2 (Medium)`
* **Target Portal**: National Career Service (`https://www.ncs.gov.in`)
* **Steps to Reproduce**:
  1. Inspect `.header-search-btn` and mobile navigation icon buttons in header.
  2. Run Lighthouse / Axe Accessibility audit.
* **Expected Result**: Interactive button elements contain `aria-label="Search jobs"` or descriptive text.
* **Actual Result**: Element renders `<a class="header-search-btn"><i></i></a>` without `aria-label` or accessible text.
* **Evidence**: Accessibility tree flags element: `Buttons must have discernible text`.
* **Remediation**: Add explicit `aria-label="Search job listings"` and `role="button"` attributes.

---

## Part B: Simulated Mock Portal Edge Scenarios & Defects

### BUG-04: Unprotected Application Submit Button Allows Accidental Duplicate Submissions
* **Bug ID**: `BUG-04`
* **Defect Type**: Simulated Mock Portal Defect
* **Severity**: `S2 (Major)`
* **Severity Justification**: Rapid double-clicking by a candidate under slow network conditions sends multiple duplicate HTTP POST requests, creating redundant candidate records in ATS.
* **Priority**: `P0 (Critical)`
* **Target System**: Local Mock Application (`http://localhost:3000`)
* **Steps to Reproduce**:
  1. Open Application Modal for role `JOB-101`.
  2. Fill valid candidate details (`name`, `email`, `phone`, `resume.pdf`, `consent`).
  3. Rapidly double-click or triple-click the "Submit Application" button (< 150ms interval).
* **Expected Result**:
  * Button disables immediately on first click (`disabled` state).
  * Animated spinner activates with `"Submitting Application..."`.
  * Exactly 1 application submission record is registered.
* **Actual Result (Before Fix)**: Unprotected button allowed 2–3 simultaneous requests, causing multiple identical records.
* **Actual Result (After Fix)**: Debounce guard in `app.js` and button disabling prevents subsequent clicks; verified in Playwright `TC-13`.
* **Evidence**:
  * Playwright automated test `TC-13` execution log:
  ```text
  ok 4 [chromium] › TC-13: Verify accidental double-click / rapid submission prevention (2.8s)
  Database count for rapid.clicker@example.com = 1 (Duplicates: 0)
  ```

---

### BUG-05: Missing Sanitization Allows Whitespace-Only Full Name & Email Evasion
* **Bug ID**: `BUG-05`
* **Defect Type**: Simulated Mock Portal Defect
* **Severity**: `S2 (Major)`
* **Severity Justification**: Allows empty or whitespace-only records (`"   "`) to bypass required-field checks, polluting database with uncontactable candidate records.
* **Priority**: `P1 (High)`
* **Target System**: Local Mock Application (`http://localhost:3000`)
* **Steps to Reproduce**:
  1. Open application form.
  2. In "Full Name", enter 5 space characters (`"     "`).
  3. Click "Submit Application".
* **Expected Result**: System trims whitespace, detects empty string, highlights field with error: `"Full name cannot be empty or only spaces."`
* **Actual Result (Before Fix)**: Form evaluated `.length > 0` as true and accepted blank spaces.
* **Actual Result (After Fix)**: Strict `.trim()` check applied in both frontend `app.js` and backend `server.js`; verified in Playwright `TC-05/06/07`.
* **Evidence**: Playwright screenshot `test-results/job-application-workflow-...-whitespace-evasion-chromium/test-failed-1.png`.

---

### BUG-06: Unhandled HTTP 500 Server Error Wipes Candidate Form Input
* **Bug ID**: `BUG-06`
* **Defect Type**: Simulated Mock Portal Defect
* **Severity**: `S1 (Critical)`
* **Severity Justification**: If backend throws HTTP 500, unhandled UI resets the entire form or white-screens, causing severe user frustration as extensive cover letters and resumes are lost.
* **Priority**: `P0 (Critical)`
* **Target System**: Local Mock Application (`http://localhost:3000`)
* **Steps to Reproduce**:
  1. Check "Simulate HTTP 500" in QA Test Harness panel.
  2. Fill candidate information and a detailed cover letter.
  3. Click "Submit Application".
* **Expected Result**:
  * Friendly error banner appears: `"Server Error (HTTP 500): Simulated database connection failure."`
  * Candidate input values (`applicant-name`, `applicant-email`, `applicant-cover-letter`) remain preserved in inputs.
  * User can disable error and click "Retry" without re-entering data.
* **Actual Result (After Fix)**: Graceful catch block in `app.js` renders `#form-error-banner` without wiping input state; verified in Playwright `TC-16`.
* **Evidence**: Playwright `TC-16` execution trace and screenshot.

---

### BUG-07: Duplicate Application Detection for Same Candidate Email
* **Bug ID**: `BUG-07`
* **Defect Type**: Simulated Mock Portal Defect
* **Severity**: `S2 (Major)`
* **Severity Justification**: Without duplicate detection, candidates repeatedly submit applications for the same opening, overwhelming recruiters and inflating pipeline metrics.
* **Priority**: `P0 (Critical)`
* **Target System**: Local Mock Application (`http://localhost:3000`)
* **Steps to Reproduce**:
  1. Submit application for `JOB-101` with email `alex.morgan@example.com`.
  2. Open `JOB-101` again and submit with identical email `alex.morgan@example.com`.
* **Expected Result**: Server returns HTTP 409 Conflict; portal displays `#duplicate-modal` with warning: `"Duplicate application detected: An application for this role has already been submitted with this email address."`
* **Actual Result (After Fix)**: Conflict correctly caught and modal displayed; verified in Playwright `TC-14` and Option B `Scenario 6`.
* **Evidence**: Playwright test output:
  ```text
  ok 5 [chromium] › TC-14: Prevent duplicate application submission with identical email for same job (4.6s)
  ok 6 [chromium] › Scenario 6: Prevents duplicate application submission with identical email for the same job (4.4s)
  ```

---

### BUG-08: HTML `maxlength="10"` on Phone Field Truncated Whitespace-Padded Input & Silent Overflow
* **Bug ID**: `BUG-08`
* **Defect Type**: Application Form Implementation Defect (Option B)
* **Severity**: `S2 (Major)`
* **Severity Justification**: Hardcoded browser attribute `maxlength="10"` caused silent truncation: (1) pasting a phone with spaces truncated digits before trimming, causing false validation rejections; (2) entering 11 digits silently sliced the last digit into 10 digits without validation error feedback.
* **Priority**: `P1 (High)`
* **Target System**: Local Mock Application (`src/index.html`)
* **Steps to Reproduce**:
  1. Open Application Modal for role `JOB-101`.
  2. In "Phone Number", enter `'  9876543210  '` (padded with spaces) or `'12345678901'` (11 digits).
  3. Submit application.
* **Expected Result**: Padded input is trimmed and accepted; oversized input displays inline error `"Phone number must be exactly 10 numeric digits."`
* **Actual Result (Before Fix)**: Padded input was truncated to 8 digits by browser `maxlength="10"`, failing submission; 11 digits was silently clipped to 10 digits without notifying the user.
* **Actual Result (After Fix)**: Expanded attribute to `maxlength="15"` to allow client validation script to inspect, trim, and display accessible error messages; verified in Playwright Option B Scenarios 4 and 5.
* **Evidence**: Playwright tests `tests/application-form-validation.spec.js` Scenarios 4 & 5.

---

### BUG-09: Missing Error Container & Accessible `role="alert"` for Cover Letter Boundary Validation
* **Bug ID**: `BUG-09`
* **Defect Type**: Accessibility & Form Validation Defect (Option B)
* **Severity**: `S3 (Minor)`
* **Severity Justification**: Exceeding 1000 character limit on cover letter had no dedicated error span, and error spans lacked ARIA live region / alert roles for screen readers.
* **Priority**: `P2 (Medium)`
* **Target System**: Local Mock Application (`src/index.html`, `src/app.js`)
* **Steps to Reproduce**:
  1. Inspect `#applicant-cover-letter` container in `src/index.html`.
  2. Notice absence of `#error-cover-letter` span.
  3. Enter > 1000 characters in cover letter.
* **Expected Result**: Dedicated `<span id="error-cover-letter" role="alert">` renders error message next to cover letter.
* **Actual Result (Before Fix)**: No error span existed; error could not be rendered inline.
* **Actual Result (After Fix)**: Added `#error-cover-letter` with `role="alert"` and client-side boundary checking in `validateForm()`; verified in Playwright Option B Scenario 5.
* **Evidence**: Verified in Option B test suite.

---

### BUG-10: Blocking Browser `alert()` in QA Test Harness Reset Operation
* **Bug ID**: `BUG-10`
* **Defect Type**: User Experience & Automation Reliability Defect (Option B)
* **Severity**: `S3 (Minor)`
* **Severity Justification**: Native browser `alert()` modal blocked execution thread and interfered with automated CI/CD test harness runs.
* **Priority**: `P2 (Medium)`
* **Target System**: Local Mock Application (`src/app.js`)
* **Steps to Reproduce**:
  1. Click "Reset Applications" in the QA Test Harness Console.
* **Expected Result**: Non-blocking toast/pill notification confirms data reset.
* **Actual Result (Before Fix)**: Browser popup `alert('Local test submissions have been reset successfully!')` blocked page interaction.
* **Actual Result (After Fix)**: Replaced with non-blocking `#qa-status-pill` UI update; verified in Option B Scenario 10.
* **Evidence**: `qaStatusPill.textContent = 'Server: Data Store Reset'`.

---

## 3. Summary of Test Case Execution Status

| Category | Automated Tests | Pass Count | Fail Count | Pass Rate |
| :--- | :---: | :---: | :---: | :---: |
| **Option A — Job Listings & Search Suite** | 9 | 9 | 0 | **100%** |
| **Option B — Form Validation & Workflow Suite** | 12 | 12 | 0 | **100%** |
| **Core Workflow End-to-End Suite** | 7 | 7 | 0 | **100%** |
| **Total Automated Playwright Tests** | **28** | **28** | **0** | **100%** |
