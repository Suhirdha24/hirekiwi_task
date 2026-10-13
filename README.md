# CareerHub — QA Test Portal & Automated Verification Suite

[![Playwright Tests](https://img.shields.io/badge/Playwright-36%20Passing-brightgreen.svg)](https://playwright.dev/)
[![Node.js Version](https://img.shields.io/badge/Node.js-v24.18.1-blue.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/MongoDB%20Atlas-Integrated%20%2F%20In--Memory%20Fallback-success.svg)](https://www.mongodb.com/atlas)
[![Accessibility](https://img.shields.io/badge/WCAG%202.1-AA%20Compliant-purple.svg)](https://www.w3.org/WAI/WCAG21/quickref/)
[![License](https://img.shields.io/badge/License-ISC-lightgrey.svg)](LICENSE)

> A modern, end-to-end recruitment web application and quality engineering test harness developed for the **HireKiwi QA Engineer Assessment**. Features a cohesive dark glassmorphic design system, multi-attribute job search and filtering, robust application submission validation, candidate self-service application tracking, a password-protected recruiter admin portal, dual-mode MongoDB Atlas integration, and a full 36-test Playwright automation suite with a 100% pass rate.

---

## 📋 Assessment QA Deliverables Index

All five core assessment deliverables are fully authored, structured, and available in the repository:

| Deliverable | Document File | Description |
| :--- | :--- | :--- |
| **1. Master Test Plan** | [`docs/test-plan.md`](docs/test-plan.md) | Dedicated test plan defining testing scope, dual-environment strategy, risks, automation architecture, and entry/exit criteria. |
| **2. Detailed Test Cases (26 Cases)** | [`docs/test-cases.md`](docs/test-cases.md) | 26 prioritized test cases (`TC-01` to `TC-26`) with preconditions, reproduction steps, test data, expected vs actual results, and automation mapping. |
| **3. Automated Test Suite (36 Tests)** | [`tests/`](tests/) & [`docs/test-execution-report.md`](docs/test-execution-report.md) | 36 automated Playwright end-to-end tests across 4 modular specs with 100% pass rate. |
| **4. Comprehensive Bug Reports (10 Defects)** | [`docs/bug-reports.md`](docs/bug-reports.md) | 10 complete defect reports with step-by-step reproduction instructions, expected vs actual behavior, severity, priority, and verified resolutions. |
| **5. Test Execution Evidence & Matrix** | [`docs/test-execution-report.md`](docs/test-execution-report.md) | Execution summary, test duration timings, cross-browser/device viewport matrix (Desktop, Tablet, Mobile), and artifact archives. |

---

## 📌 Table of Contents
1. [Assessment QA Deliverables Index](#-assessment-qa-deliverables-index)
2. [Project Overview & Key Capabilities](#-project-overview--key-capabilities)
3. [Technology Stack & Architecture](#-technology-stack--architecture)
4. [Design System & UI/UX Enhancements](#-design-system--uiux-enhancements)
5. [Candidate Discovery & Self-Service Portal](#-candidate-discovery--self-service-portal)
6. [Recruiter Admin Portal & Stage Management](#-recruiter-admin-portal--stage-management)
7. [Backend, REST APIs & MongoDB Atlas Integration](#-backend-rest-apis--mongodb-atlas-integration)
8. [QA Test Harness Console](#-qa-test-harness-console)
9. [Automated Playwright Test Suite](#-automated-playwright-test-suite)
10. [Detailed Test Plan & Manual Test Matrix](#-detailed-test-plan--manual-test-matrix)
11. [Defect Summary & Complete Bug Reports](#-defect-summary--complete-bug-reports)
12. [Quick Start & Setup Instructions](#-quick-start--setup-instructions)
13. [Environment Configuration](#-environment-configuration)
14. [Known Limitations & Assumptions](#-known-limitations--assumptions)

---

## 🚀 Project Overview & Key Capabilities

CareerHub combines realistic candidate-facing workflows with powerful quality engineering test tooling:

| Module | Core Features | Status |
| :--- | :--- | :---: |
| **Job Discovery Portal** | Title, Dept, Location, Salary, Experience, Employment Type, Tags, Direct Apply & View Details | ✅ Production-Ready |
| **Multi-Attribute Search** | Tokenized keyword search across 8 role attributes, Department, Location, and Type filters | ✅ 100% Functional |
| **Job Details Modal** | Full role specifications, responsibilities, requirements, CTC, browser back-navigation state | ✅ Accessible & Responsive |
| **Application Form** | Strict RFC validation, whitespace rejection, min/max lengths, 5MB document check, debouncing | ✅ Zero Data Loss |
| **Candidate Dashboard** | Private email lookup, submission tracking ID (`APP-XXXXXX`), live stage tracker (`New`, `Under Review`, `Shortlisted`, `Rejected`) | ✅ Candidate-Isolated |
| **Recruiter Admin Console** | Passcode authentication, live metrics cards, candidate application table, interactive stage updates | ✅ Secure Server Access Control |
| **MongoDB Atlas Backend** | Native Node.js HTTP/Express API, MongoDB Atlas cloud cluster syncing, in-memory resilient fallback | ✅ Dual-Mode Operational |
| **QA Test Harness** | Injected 3s network latency, simulated HTTP 500 server error, simulated network drop, data reset | ✅ Non-Destructive |
| **Playwright Test Suite** | 36 automated scenarios covering functional, boundary, negative, error, and responsive behavior | ✅ 36 / 36 Passing (100%) |

---

## 🛠 Technology Stack & Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                       Frontend UI / UX                          │
│   • Semantic HTML5 & Modern CSS Custom Properties (Design Tokens)│
│   • Vanilla JavaScript (Modular ES6 IIFE Architecture)          │
│   • Zero Heavy Framework Bloat • Instant Native Browser Render   │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ JSON REST APIs
┌─────────────────────────────────▼───────────────────────────────┐
│                     Node.js Backend Server                      │
│   • Native HTTP Engine (server.js on Port 3000)                 │
│   • Administrative Access Guard (X-Admin-Key Authentication)    │
│   • Simulation Interceptors (500 Fault & Latency Injection)     │
└───────────────────┬─────────────────────────────┬───────────────┘
                    │                             │
┌───────────────────▼─────────────┐ ┌─────────────▼───────────────┐
│       MongoDB Atlas Cloud       │ │  Local In-Memory Session    │
│   • mongodb+srv Cloud Cluster   │ │   • Resilient Local Sync    │
│   • Persistent Collections      │ │   • Degraded TLS Fallback   │
└─────────────────────────────────┘ └─────────────────────────────┘
```

---

## 🎨 Design System & UI/UX Enhancements

CareerHub implements a focused, accessible dark glassmorphic visual identity:
* **Background Palette**: Deep navy `#0B0F19` and charcoal `#111827`.
* **Elevated Surfaces**: Dark slate `#1E293B` cards with `#24324D` subtle borders.
* **Accent Color**: Violet/purple `#6366F1` with hover states `#4F46E5`.
* **Status Accents**:
  * `New`: Indigo `#818CF8`
  * `Under Review`: Amber `#F59E0B`
  * `Shortlisted`: Emerald `#10B981`
  * `Rejected`: Rose `#EF4444`
* **Typography**: Professional hierarchy using Google's `Plus Jakarta Sans` and monospace `JetBrains Mono` for tracking codes.
* **Focus Indicators**: Standard 2px high-visibility `#818CF8` focus ring for keyboard accessibility (`:focus-visible`).
* **Non-Destructive Error Handling**: Form inputs and values are preserved when recoverable network or server faults occur.

---

## 👤 Candidate Discovery & Self-Service Portal

### 1. Multi-Filter Discovery
Candidates can search positions with instant filtering:
* **Keyword Search**: Matches title, department, description, tags, responsibilities, or requirements.
* **Department Filter**: Quality Assurance, Engineering, Infrastructure.
* **Location Filter**: Bangalore (Hybrid), Remote (India), Hyderabad (On-site), Pune (Hybrid).
* **Employment Type**: Full-time, Contract, Internship.
* **Clear Filters**: Instant reset button in search header.

### 2. Candidate Self-Service Dashboard (`#candidate-modal`)
* Accessed via **"My Applications"** in navigation.
* Candidates enter their email address to retrieve only their own submission history.
* Automatically remembers recently submitted candidate email in local storage.
* Displays tracking code (`APP-XXXXXX`), job role, submission timestamp, and current hiring stage badge.
* Strict candidate privacy: other candidates cannot view records that do not match their email address.

---

## 🛡️ Recruiter Admin Portal & Stage Management

### 1. Access Control & Authorization
* Accessed via **"Admin Portal"** button in navigation.
* Enforces administrative passkey entry configured securely via the `ADMIN_KEY` environment variable.
* API endpoints reject unauthorized requests with `HTTP 401 Unauthorized` unless the valid `X-Admin-Key` header is present.

### 2. Pipeline Overview Cards
Displays live, aggregated metrics directly from active application data:
* **Total Applications**
* **New Applications**
* **Under Review**
* **Shortlisted**
* **Rejected**

### 3. Application Management Table
* Displays candidate name, email, applied position, experience, submission timestamp, and stage badge.
* Includes real-time search input to filter candidates by keyword, email, or tracking ID.
* Status filter to view candidates in specific stages.
* Interactive **"Update Stage"** dropdown allowing recruiters to advance candidates from `New` to `Under Review`, `Shortlisted`, or `Rejected`.
* Changes instantly synchronize to the backend and reflect on the Candidate's Self-Service Dashboard.

---

## 🔌 Backend, REST APIs & MongoDB Atlas Integration

The backend is built in Node.js (`server.js`) with native HTTP routing and MongoDB Atlas connectivity.

### Dual-Mode Database Architecture
1. **Primary**: Connects to MongoDB Atlas cluster (`mongodb+srv://...`).
2. **Fallback**: If cloud access is constrained (e.g. client public IP whitelisting or TLS handshake alert), the backend gracefully falls back to an in-memory session store. Application functionality, validation, candidate lookup, and admin management remain 100% operational without data loss.

### Endpoint Matrix

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/jobs` | Retrieve active job listings with optional filtering (`q`, `department`, `location`, `type`) | No |
| `GET` | `/api/jobs/:id` | Retrieve detailed specifications for a specific job | No |
| `POST` | `/api/apply` | Submit a new job application with duplicate and validation guards | No |
| `GET` | `/api/candidate/applications` | Look up application records for a specific candidate email | No |
| `GET` | `/api/admin/overview` | Retrieve aggregated pipeline stage counts | **Yes (`X-Admin-Key`)** |
| `GET` | `/api/admin/applications` | Retrieve full recruitment candidate list | **Yes (`X-Admin-Key`)** |
| `PATCH`| `/api/admin/applications/:id/status` | Update candidate hiring stage (`New`, `Under Review`, `Shortlisted`, `Rejected`) | **Yes (`X-Admin-Key`)** |
| `GET` | `/api/submissions` | Retrieve all applications for verification audit table | No |
| `POST` | `/api/reset` | Reset test application records to baseline | No |
| `GET` | `/api/health` | Diagnostic health check returning MongoDB and server status | No |

---

## 🧪 QA Test Harness Console

The persistent QA Test Controller pinned to the top of the viewport enables non-destructive quality engineering testing:
* **Network Delay (3s)**: Injects 3000ms server delay to verify loading states, spinner rendering, and submit button lockout.
* **Simulate HTTP 500**: Triggers backend `HTTP 500 Internal Server Error` to verify alert banner rendering and form input preservation.
* **Simulate Offline**: Simulates network drops (`Failed to fetch`) to test offline recovery.
* **Reset Applications**: Resets session records to initial state with clean status feedback.

---

## 📊 Automated Playwright Test Suite

The test suite contains **36 automated end-to-end tests** structured across 4 modular test specification files using the Page Object Model (`JobPortalPage.js`):

```text
Running 36 tests using 1 worker

  ✓ tests/application-form-validation.spec.js (12 tests)
    ✓ Scenario 1: Valid application produces clear success message and tracking ID
    ✓ Scenario 2: Empty required fields display inline field errors and block submission
    ✓ Scenario 3: Invalid email formats are rejected with accessible feedback
    ✓ Scenario 4: Whitespace-only input is rejected while leading and trailing spaces are trimmed
    ✓ Scenario 5: Min/max length boundaries and format constraints are enforced
    ✓ Scenario 6: Prevents duplicate application submission with identical email for the same job
    ✓ Scenario 7: Protects submit button against rapid repeated clicks via debouncing guard
    ✓ Scenario 8: Network delay triggers observable loading indicator and disables submit button
    ✓ Scenario 9: HTTP 500 error displays graceful alert banner without crashing
    ✓ Scenario 10: Simulated offline state produces network error and allows recovery upon reconnection
    ✓ Scenario 11: Successful submission updates audit table with ID, candidate, and status badge
    ✓ Scenario 12: Preserves all entered form values after recoverable HTTP 500 failure

  ✓ tests/candidate-admin-portal.spec.js (8 tests)
    ✓ Scenario 1: Multi-attribute job filtering by location and employment type works in tandem
    ✓ Scenario 2: Direct "Apply Now" button on job card opens application modal with target job
    ✓ Scenario 3: Candidate Self-Service Dashboard isolates application records by candidate email
    ✓ Scenario 4: Recruiter Admin Portal enforces authentication and rejects unauthorized access
    ✓ Scenario 5: Admin metrics overview accurately aggregates live application stage counts
    ✓ Scenario 6: Admin updates hiring stage to Shortlisted with live synchronization to Candidate Portal
    ✓ Scenario 7: Responsive adaptation across mobile (375x667) and tablet (768x1024) viewports
    ✓ Scenario 8: Security regression audit — unauthorized admin endpoints, candidate data privacy, and security headers

  ✓ tests/job-application-workflow.spec.js (7 tests)
    ✓ TC-01/02/03: Verify job listings display correct metadata, search filtering, and role navigation
    ✓ TC-04: Verify successful job application submission flow with ticket generation
    ✓ TC-05/06/07: Form validation for missing required fields, invalid email format, and whitespace evasion
    ✓ TC-13: Verify accidental double-click / rapid submission prevention via button debouncing
    ✓ TC-14: Prevent duplicate application submission with identical email for same job
    ✓ TC-16: Controlled error handling under simulated HTTP 500 server error without form data loss
    ✓ TC-15: Controlled handling of high-latency network response with active loading indicator

  ✓ tests/job-listings-ui-validation.spec.js (9 tests)
    ✓ Check 1: All four jobs render with title, department, salary, experience, location, and employment type
    ✓ Check 2: Search handles titles, skills, keywords, case-insensitivity, and whitespace trimming
    ✓ Check 3: Nonexistent search query displays empty state and offers filter reset
    ✓ Check 4: Department filtering displays correct subset and updates count
    ✓ Check 5: Combined search and department filters work in tandem
    ✓ Check 6: Clear-filters action restores full listing and hides clear button
    ✓ Check 7: Each job card opens the matching details modal with all required information
    ✓ Check 8: Browser back navigation returns from details to listing while preserving search
    ✓ Check 9: Responsive UI remains functional without horizontal overflow across viewports

  ==============================
  36 passed (100% Pass Rate)
  ==============================
```

---

## 📋 Detailed Test Plan & Manual Test Matrix

| Test ID | Scenario Description | Priority | Execution Mode | Result |
| :---: | :--- | :---: | :---: | :---: |
| **TC-01** | Job listings cards display metadata (Title, Salary, Exp, Location, Tags) | **P0** | Automated | Pass |
| **TC-02** | Navigation from job card to role details view via "View Details" | **P0** | Automated | Pass |
| **TC-03** | Keyword search across titles, skills, and departments | **P1** | Automated | Pass |
| **TC-04** | Valid end-to-end job application submission with ticket generation | **P0** | Automated | Pass |
| **TC-05** | Missing required fields validation on blank form submission | **P0** | Automated | Pass |
| **TC-06** | Invalid email syntax rejection (missing `@`, missing domain) | **P0** | Automated | Pass |
| **TC-07** | Whitespace-only Full Name and Email evasion rejection | **P1** | Automated | Pass |
| **TC-08** | Full Name length boundary validation (Min 2 chars, Max 60 chars) | **P1** | Automated | Pass |
| **TC-09** | Phone number boundary validation (Strictly 10 numeric digits) | **P1** | Automated | Pass |
| **TC-10** | Experience field numeric boundaries (0 to 40 years) | **P1** | Automated | Pass |
| **TC-11** | File upload restriction on prohibited extensions (non-PDF/DOC) | **P1** | Automated | Pass |
| **TC-12** | File upload size boundary limit (> 5MB rejected) | **P1** | Automated | Pass |
| **TC-13** | Rapid double-click repeat submission prevention (Debounce Guard) | **P0** | Automated | Pass |
| **TC-14** | Duplicate candidate application rejection for identical email & job role | **P0** | Automated | Pass |
| **TC-15** | Controlled high-latency response handling (3s delay with spinner) | **P1** | Automated | Pass |
| **TC-16** | Controlled HTTP 500 server error handling without form data loss | **P0** | Automated | Pass |
| **TC-17** | State preservation on browser Back navigation | **P1** | Automated | Pass |
| **TC-18** | Multi-attribute filtering (Location + Employment Type + Dept) | **P1** | Automated | Pass |
| **TC-19** | Direct "Apply Now" card action pre-populating target job | **P1** | Automated | Pass |
| **TC-20** | Candidate Self-Service Dashboard private application lookup | **P0** | Automated | Pass |
| **TC-21** | Candidate application privacy and ownership isolation | **P0** | Automated | Pass |
| **TC-22** | Recruiter Admin Portal password authentication guard | **P0** | Automated | Pass |
| **TC-23** | Recruiter Admin live overview metrics aggregation | **P1** | Automated | Pass |
| **TC-24** | Recruiter Admin stage update synchronization with Candidate Dashboard | **P0** | Automated | Pass |
| **TC-25** | Responsive layout across mobile (375px), tablet (768px), and desktop (1280px) | **P1** | Automated | Pass |
| **TC-26** | Security Regression Audit (Admin 401 guard, candidate isolation, security headers, secrets sanitization) | **P0** | Automated | Pass |

---

## 🐛 Defect Summary & Complete Bug Reports

The QA audit identified, reproduced, and verified 10 core defects across the recruitment workflow and infrastructure. Full formal reports, DOM snippets, and execution traces are cataloged in [`docs/bug-reports.md`](docs/bug-reports.md). The confirmed defects with step-by-step reproduction instructions and verified resolutions are detailed below:

### BUG-01: Rapid Double-Click Repeat Submission Race Condition
* **Severity**: `High (S2)` | **Priority**: `P0 (Critical)`
* **Feature Affected**: Application Form Submission Handler & Concurrency Protection
* **Preconditions**: Candidate fills valid inputs in Application Modal for `JOB-101`.
* **Steps to Reproduce**:
  1. Open Application Modal for role `JOB-101`.
  2. Fill valid candidate details (`name`, `email`, `phone`, `resume.pdf`, `consent`).
  3. Rapidly double-click or triple-click the "Submit Application" button (< 150ms interval).
* **Expected Behavior**: Submit button disables immediately upon first click with an active spinner; exactly 1 API call is dispatched; exactly 1 candidate application record is created.
* **Actual Behavior (Before Fix)**: Unprotected submit button dispatched multiple concurrent POST requests, resulting in duplicate database records and multiple confirmation modals.
* **Evidence & Resolution**: Resolved via client-side debouncing lock (`lastSubmitTime < 400ms`), instant button disabling, and animated loading spinner. Verified by automated test `TC-13` in [`tests/job-application-workflow.spec.js`](tests/job-application-workflow.spec.js) and Scenario 7 in [`tests/application-form-validation.spec.js`](tests/application-form-validation.spec.js).

---

### BUG-02: Whitespace-Only String Evasion of Required Fields
* **Severity**: `High (S2)` | **Priority**: `P1 (High)`
* **Feature Affected**: Input Validation & Data Sanitization
* **Preconditions**: Application form is open.
* **Steps to Reproduce**:
  1. Open the application form for any job opening.
  2. In "Full Name", enter 5 space characters (`"     "`).
  3. In "Email Address", enter `"     "`.
  4. Click "Submit Application".
* **Expected Behavior**: Validation engine trims whitespace, detects empty input, blocks submission, and displays inline accessible error: `"Full name cannot be empty or only spaces."`.
* **Actual Behavior (Before Fix)**: Validation checked `.length > 0` without trimming; whitespace strings bypassed required field guards, creating blank candidate records in the database.
* **Evidence & Resolution**: Implemented strict `.trim()` sanitization across both frontend (`src/app.js`) and backend (`server.js`). Verified by automated test Scenario 4 in [`tests/application-form-validation.spec.js`](tests/application-form-validation.spec.js).

---

### BUG-03: Unhandled HTTP 500 Server Error Wipes Candidate Form Input
* **Severity**: `Critical (S1)` | **Priority**: `P0 (Critical)`
* **Feature Affected**: Server Error Handling & Form State Preservation
* **Preconditions**: "Simulate HTTP 500" toggle is enabled in the QA Test Harness Console.
* **Steps to Reproduce**:
  1. Enable "Simulate HTTP 500" in the QA Console toolbar.
  2. Open application form and fill all fields including a multi-paragraph cover letter.
  3. Click "Submit Application".
* **Expected Behavior**: Application displays a non-destructive alert banner: `"Server Error (HTTP 500): Simulated database connection failure."`; all candidate inputs and cover letter text remain intact for safe retry.
* **Actual Behavior (Before Fix)**: Unhandled rejection either triggered a native modal or reset the form, destroying all user-entered data and requiring re-entry from scratch.
* **Evidence & Resolution**: Implemented non-destructive `#form-error-banner` in `src/app.js` with full form value preservation. Verified by automated test Scenario 12 in [`tests/application-form-validation.spec.js`](tests/application-form-validation.spec.js).

---

### BUG-04: Duplicate Candidate Application Allowed for Same Role
* **Severity**: `High (S2)` | **Priority**: `P0 (Critical)`
* **Feature Affected**: Candidate Uniqueness & Duplicate Detection
* **Preconditions**: Candidate `"alex.morgan@example.com"` has previously submitted an application for `JOB-101`.
* **Steps to Reproduce**:
  1. Submit a valid application for `JOB-101` with email `alex.morgan@example.com`.
  2. Open `JOB-101` again and submit with the same email `alex.morgan@example.com`.
* **Expected Behavior**: Server rejects submission with `HTTP 409 Conflict`; portal displays warning modal `#duplicate-modal` explaining an application already exists for this role.
* **Actual Behavior (Before Fix)**: Portal accepted unlimited duplicate submissions for the same candidate email and role, flooding the ATS with redundant records.
* **Evidence & Resolution**: Backend enforces unique `email + jobId` constraint in `server.js` and returns `HTTP 409`; frontend handles 409 with dedicated duplicate warning dialog. Verified by automated test `TC-14` and Scenario 6 in [`tests/application-form-validation.spec.js`](tests/application-form-validation.spec.js).

---

### BUG-05: Browser `maxlength="10"` Silently Truncates Phone Inputs
* **Severity**: `Major (S2)` | **Priority**: `P1 (High)`
* **Feature Affected**: Phone Number Boundary Validation & Format Feedback
* **Preconditions**: Application modal is open.
* **Steps to Reproduce**:
  1. In Phone Number, paste whitespace-padded phone number: `'  9876543210  '`.
  2. Alternatively, enter 11 digits: `'12345678901'`.
  3. Click "Submit Application".
* **Expected Behavior**: Padded numbers are automatically trimmed and accepted; oversized inputs display clear inline error: `"Phone number must be exactly 10 numeric digits."`.
* **Actual Behavior (Before Fix)**: Browser attribute `maxlength="10"` silently truncated padded strings to 8 digits (failing submission) and truncated 11 digits to 10 without user feedback.
* **Evidence & Resolution**: Expanded HTML input to `maxlength="15"` to allow the JavaScript/backend validation engine to inspect the full input and display accessible error feedback. Verified by Playwright Scenario 5 in [`tests/application-form-validation.spec.js`](tests/application-form-validation.spec.js).

---

### BUG-06: Missing Cover Letter Error Container & Absent ARIA Alert Roles
* **Severity**: `Minor (S3)` | **Priority**: `P2 (Medium)`
* **Feature Affected**: Form Boundary Error Accessibility (WCAG 2.1 AA)
* **Preconditions**: Application modal is open.
* **Steps to Reproduce**:
  1. Enter > 1000 characters in the Cover Letter field.
  2. Click "Submit Application".
* **Expected Behavior**: Dedicated `<span id="error-cover-letter" role="alert">` element renders inline error message and is announced by assistive screen readers.
* **Actual Behavior (Before Fix)**: No error container existed for the cover letter; errors could not render inline; existing error spans lacked `role="alert"`.
* **Evidence & Resolution**: Added dedicated `#error-cover-letter` container with `role="alert"` in `src/index.html` and integrated dynamic error clearing. Verified by Playwright Scenario 5 in [`tests/application-form-validation.spec.js`](tests/application-form-validation.spec.js).

---

### BUG-07: Blocking Native Browser `alert()` in QA Test Harness Reset
* **Severity**: `Minor (S3)` | **Priority**: `P2 (Medium)`
* **Feature Affected**: QA Test Harness Console & Automation Reliability
* **Preconditions**: Candidate applications exist in session storage.
* **Steps to Reproduce**:
  1. Click "Reset Applications" in the QA Test Harness toolbar.
* **Expected Behavior**: Non-blocking `#qa-status-pill` updates with confirmation message; automated test scripts continue execution unimpeded.
* **Actual Behavior (Before Fix)**: Native `window.alert()` halted the JavaScript execution thread, requiring manual modal dismissal and causing Playwright automation timeouts.
* **Evidence & Resolution**: Replaced modal popup with non-blocking toast pill notification `#qa-status-pill`. Verified by Playwright Scenario 10 in [`tests/application-form-validation.spec.js`](tests/application-form-validation.spec.js).

---

### BUG-08: Administrative Endpoints Lacked Authentication Guards
* **Severity**: `Critical (S1)` | **Priority**: `P0 (Critical)`
* **Feature Affected**: Recruiter Admin Console & REST API Security
* **Preconditions**: Application server is running on `http://localhost:3000`.
* **Steps to Reproduce**:
  1. Send direct unauthenticated HTTP requests: `GET /api/admin/applications` and `PATCH /api/admin/applications/:id/status`.
* **Expected Behavior**: Server rejects unauthenticated requests with `HTTP 401 Unauthorized` (`{ error: 'Unauthorized: Valid X-Admin-Key header required' }`).
* **Actual Behavior (Before Fix)**: All candidate records and hiring stage update endpoints were publicly readable and mutable without authentication.
* **Evidence & Resolution**: Implemented `X-Admin-Key` authorization middleware in `server.js` and secure passkey modal in `src/app.js`. Verified by automated test Scenario 4 & 8 in [`tests/candidate-admin-portal.spec.js`](tests/candidate-admin-portal.spec.js).

---

### BUG-09: Candidate Application Records Exposed Without Ownership Isolation
* **Severity**: `High (S2)` | **Priority**: `P0 (Critical)`
* **Feature Affected**: Candidate Self-Service Dashboard & Data Privacy
* **Preconditions**: Applications exist for Candidate A (`eleanor.vance@hillhouse.org`) and Candidate B (`alex.morgan@example.com`).
* **Steps to Reproduce**:
  1. Query `GET /api/candidate/applications?email=stranger@external.com`.
  2. Send query with missing or invalid email format.
* **Expected Behavior**: Endpoint validates email format (`HTTP 400` on invalid syntax) and strictly returns only records matching the applicant's exact email address.
* **Actual Behavior (Before Fix)**: Endpoint lacked input validation and could potentially expose cross-candidate application records.
* **Evidence & Resolution**: Implemented RFC email syntax validation (`HTTP 400`) and strict ownership isolation in `server.js` and `src/app.js`. Verified by automated test Scenario 3 & 8 in [`tests/candidate-admin-portal.spec.js`](tests/candidate-admin-portal.spec.js).

---

### BUG-10: Search and Filter State Wipe on Browser Back Navigation
* **Severity**: `Major (S2)` | **Priority**: `P1 (High)`
* **Feature Affected**: Job Search, Department Filtering & History Routing
* **Preconditions**: User searches for jobs on the portal.
* **Steps to Reproduce**:
  1. Filter jobs by keyword `"qa"` or department `"Quality Assurance"`.
  2. Click "View Details" on a job card to open the role modal.
  3. Click the browser's Back navigation button (`Alt + Left Arrow`).
* **Expected Behavior**: Modal closes and returns to the Job Listings page with previous search input, department filter, and matched results fully preserved.
* **Actual Behavior (Before Fix)**: Browser navigation reset the application state to default, wiping search query and resetting the department dropdown.
* **Evidence & Resolution**: Integrated HTML5 History API (`history.pushState` / `popstate` listener) in `src/app.js` to preserve URL state and search parameters across navigation. Verified by Playwright Check 8 in [`tests/job-listings-ui-validation.spec.js`](tests/job-listings-ui-validation.spec.js).

---

## ⚡ Quick Start & Setup Instructions

### 1. Clone & Install
```bash
git clone https://github.com/Suhirdha24/infinitica_task.git
cd infinitica_task
npm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install chromium
```

### 3. Start the Application
```bash
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Admin Portal Authentication
* **Admin Email**: `admin@careerhub.internal`
* **Admin Passkey**: Configured via `ADMIN_KEY` in your `.env` file (e.g., `careerhub-admin-2026` or your chosen secure secret).

---

## 🧪 Running the Tests

```bash
# Run all 36 tests in headless mode
npm test

# Run tests in visible browser window
npm run test:headed

# Run tests using Playwright UI
npm run test:ui

# View HTML Test Execution Report
npm run test:report
```

---

## ⚙️ Environment Configuration

Copy `.env.example` to `.env` to customize settings:

```env
PORT=3000
NODE_ENV=development
CLIENT_ORIGIN=*
ADMIN_KEY=your_secure_admin_passkey_here
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/careerhub?retryWrites=true&w=majority&appName=Cluster0
```

---

## ⚠️ Known Limitations & Assumptions

1. **MongoDB Atlas IP Access Rules**:
   * MongoDB Atlas requires the calling machine's IP address to be whitelisted in Atlas Network Access (or `0.0.0.0/0` enabled for universal access). When executing in environments where outbound IP changes or Atlas network restrictions prevent TLS handshake completion, CareerHub automatically falls back to its internal in-memory store. The application workflow and all 36 Playwright tests operate with 100% reliability regardless of external cloud network state.
2. **Document File Storage**:
   * File uploads validate document extensions (`.pdf`, `.doc`, `.docx`) and file size ($\le$ 5MB). In this assessment test harness, metadata is tracked in the application state rather than streaming bytes to external cloud object storage (e.g. AWS S3 or Google Cloud Storage).
3. **Session vs. Persistent Storage Across Restarts**:
   * When running in in-memory fallback mode, newly submitted candidate applications persist for the entire node server process lifetime and across test runs. A full process restart re-seeds the initial dataset unless MongoDB Atlas is active.
4. **Email Notification Dispatch**:
   * Application receipts and stage updates are tracked live via the Candidate Dashboard and tracking IDs (`APP-XXXXXX`) rather than dispatching external SMTP emails (e.g., SendGrid/AWS SES).
5. **Administrative Authentication**:
   * The Recruiter Admin Portal enforces passkey authentication via `ADMIN_KEY` / `X-Admin-Key` header verification. Enterprise SSO (OAuth 2.0 / SAML) is intentionally out-of-scope for this local assessment prototype.
