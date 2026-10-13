# Phase 1: Understand and Prepare

## 1. Assessment Overview & Submission Rules
* **Target Role**: QA Engineer Assessment (Freshers, 4.5–4.8 LPA).
* **Core Objective**: Assess a job application workflow portal where candidates browse job listings, view requirements, and submit applications. Identify defects, verify expected behavior, and automate key test cases.
* **Testing Scope**:
  1. **Job Listings**: Verify job titles, salaries, experience requirements, tags, and role descriptions.
  2. **Navigation**: Ensure links open appropriate details, state persists, and deep navigation works.
  3. **Form Validation**: Test required fields, invalid email formats, whitespace-only inputs, boundary lengths, and file upload validation.
  4. **Submission Behavior**: Handle success/failure states, prevent duplicate submissions, and debounce accidental repeated clicks.
  5. **Error Handling**: Verify behavior under network failures, slow/laggy responses, invalid payload inputs, and simulated 500 server errors.
  6. **Cross-Browser Compatibility**: Ensure consistency across modern browser engines (Chromium, Firefox, WebKit).
* **Submission Rules & Boundaries**:
  * Public portals (e.g., NCS) may only be used for safe, read-only exploratory testing.
  * **Strict Rule**: Never submit fake applications, alter live data, or perform load tests on live public portals.
  * Scenarios involving form submissions, edge cases, error simulations, and duplicate submissions must be tested using a dedicated local mock application.

---

## 2. Target Portal & Exploration Strategy
* **Safe Exploratory Testing (NCS Portal)**:
  * Browse existing job listings, examine industry-standard information architecture (role titles, CTC/salary brackets, min/max experience).
  * Observe accessibility standards and form element layouts in government/enterprise job boards.
* **Boundary Safeguards**:
  * Zero automated or manual fake application data submitted to any external third-party production system.

---

## 3. Scenarios Requiring Local Mock Application
The following scenarios require a fully controllable local mock application:
1. **End-to-End Application Submission**: Submitting candidate details, phone, email, experience, and resume attachment.
2. **Input Validation Edge Cases**:
   * Blank mandatory fields.
   * Whitespace-only strings in name and email.
   * Invalid email regex (missing `@`, missing domain, special characters).
   * Extreme character boundary lengths (e.g., 2-character names, 500-word cover letters).
3. **Accidental Duplicate Submissions**:
   * Rapid double-clicking on the Submit button.
   * Submitting identical applicant email for the same job posting.
4. **Resilience & Error Handling**:
   * Simulated API network timeouts / slow responses (e.g., 3-second delay).
   * Simulated HTTP 500 Internal Server Errors.
   * Network offline detection.
5. **Cross-Browser Automated Execution**:
   * Running Playwright test suites repeatedly in local CI/headless environments without external rate limits or downtime.

---

## 4. Project Structure & Environment
* **Node.js**: v24.18.1
* **npm**: 11.16.0
* **Test Automation Framework**: Playwright Test (`@playwright/test`)
* **Repository**: `https://github.com/Suhirdha24/infinitica_task.git` (branch `main`)
* **Directory Layout**:
  * `src/`: Mock Job Portal web application.
  * `tests/`: Automated Playwright test suites.
  * `docs/`: Test plans, test cases, bug reports, and assessment notes.
