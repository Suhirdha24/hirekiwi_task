# CareerHub QA Portal — Codebase-Driven Master Test Plan

## A. Document Information

| Field | Value |
| :--- | :--- |
| **Project Name** | CareerHub QA Portal — Job Application & Assessment Verification Platform |
| **Assessment Name** | HireKiwi Senior QA Engineer Assessment |
| **Document Purpose** | Comprehensive, codebase-driven Quality Assurance Test Plan defining testing scope, risk mitigations, prioritization taxonomy, scenario matrices, test data strategy, and traceability for CareerHub. |
| **Document Version** | `2.1.0` (Codebase-Audited & Synchronized) |
| **Preparation Date** | October 13, 2026 |
| **Document Author** | Senior QA Engineer & Test Strategy Lead |
| **Target Reviewers** | QA Lead, Engineering Manager, Technical Hiring Evaluators |
| **System Under Test (SUT)** | CareerHub Web Application (`http://localhost:3000`) & REST API Service |
| **Repository Baseline** | [`https://github.com/Suhirdha24/hirekiwi_task`](https://github.com/Suhirdha24/hirekiwi_task) (Branch: `main`) |

### Key Project File References

* **Frontend Structure & Presentation**:
  * [`src/index.html`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/src/index.html) — Semantic HTML5 markup, modal backdrops, QA Test Harness Console, and accessibility attributes.
  * [`src/styles.css`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/src/styles.css) — Dark glassmorphic design system, CSS custom properties, responsive breakpoints, and WCAG focus states.
  * [`src/app.js`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/src/app.js) — Client-side application controller (IIFE architecture, DOM bindings, input validation, debouncing, modal state, history routing).
* **Backend Engine & Database**:
  * [`server.js`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/server.js) — Native Node.js HTTP server, REST endpoints, input sanitization, dual-mode database handler, and administrative access guards.
  * [`.env.example`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/.env.example) — Template configuration defining environment variables (`PORT`, `NODE_ENV`, `CLIENT_ORIGIN`, `ADMIN_KEY`, `MONGODB_URI`).
* **Test Automation & Tooling**:
  * [`playwright.config.js`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/playwright.config.js) — Test runner configuration, worker limits, reporting options, and built-in web server lifecycle.
  * [`tests/pages/JobPortalPage.js`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/tests/pages/JobPortalPage.js) — Page Object Model (POM) encapsulation for DOM locators, form actions, and simulation controls.
  * [`tests/application-form-validation.spec.js`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/tests/application-form-validation.spec.js) — 12 automated form validation and resilience scenarios.
  * [`tests/candidate-admin-portal.spec.js`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/tests/candidate-admin-portal.spec.js) — 8 automated candidate/admin and security regression scenarios.
  * [`tests/job-application-workflow.spec.js`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/tests/job-application-workflow.spec.js) — 7 automated core journey and edge-case scenarios.
  * [`tests/job-listings-ui-validation.spec.js`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/tests/job-listings-ui-validation.spec.js) — 9 automated job listings, search, and navigation scenarios.
  * [`.github/workflows/ci.yml`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/.github/workflows/ci.yml) — Continuous Integration pipeline executing Playwright tests on push/PR.

---

## B. Project Overview

CareerHub is an end-to-end web application developed to demonstrate realistic recruitment platform workflows alongside robust quality engineering practices. The application consists of three interconnected layers:

```
┌───────────────────────────────────────────────────────────────────────────┐
│                        Frontend Presentation Layer                        │
│   • Semantic HTML5 & Dark Glassmorphic CSS (Design Tokens, Zero Bloat)    │
│   • Client Controller (src/app.js) with Responsive UI & Modal Handlers    │
│   • QA Test Harness Console pinned to viewport for non-destructive faults │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │ REST API (JSON)
┌─────────────────────────────────────▼─────────────────────────────────────┐
│                          Backend Service Engine                           │
│   • Native Node.js HTTP Server (server.js on Port 3000)                   │
│   • REST Endpoints (/api/jobs, /api/applications, /api/admin, /api/health)│
│   • Administrative Key Guard (X-Admin-Key Header Validation)              │
│   • Server-Side Input Sanitization, Duplicate Detection, & Latency Engine │
└─────────────────────────────────────┬─────────────────────────────────────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
┌─────────────────────────────────────┐ ┌───────────────────────────────────┐
│      Primary: MongoDB Atlas         │ │    Fallback: In-Memory Store      │
│  • mongodb+srv cloud cluster        │ │  • Active session collections     │
│  • Persistent applications & jobs   │ │  • Zero-downtime offline fallback │
└─────────────────────────────────────┘ └───────────────────────────────────┘
```

### Core User Journeys

1. **Job Seeker Discovery**: Browsing verified job cards (`JOB-101` to `JOB-104`), executing tokenized keyword searches across titles, descriptions, skills, and tags, filtering across Department, Location, and Employment Type, and opening detailed role specifications with HTML5 History state tracking.
2. **Application Submission Workflow**: Submitting candidate details (Full Name, RFC email, 10-digit phone, numeric experience, document upload, optional cover letter, mandatory consent) with immediate inline error feedback, debounced multi-click prevention, and HTTP 409 duplicate submission rejection.
3. **Candidate Self-Service Tracking**: Private email-based application lookup via the "My Applications" dashboard (`#candidate-modal`), displaying tracking IDs (`APP-XXXXXX`) and live stage updates (`New`, `Under Review`, `Shortlisted`, `Rejected`) strictly isolated by candidate ownership.
4. **Recruiter Management Console**: Secure admin portal (`#admin-modal`) requiring passkey authentication (`ADMIN_KEY`), displaying real-time aggregated metrics cards, searchable application tables, and interactive status synchronization.
5. **QA Test Harness & Failure Simulation**: Interactive top controller (`#qa-control-panel`) allowing non-destructive injection of 3-second network delays, simulated HTTP 500 server errors, simulated client offline network drops, and safe data store resetting.

---

## C. Testing Objectives

1. **Functional Correctness**: Verify all job discovery, filtering, application submission, candidate tracking, and admin workflows operate as specified.
2. **Data Integrity & Validation**: Ensure both client-side (`src/app.js`) and server-side (`server.js`) validation reject missing fields, malformed emails, non-numeric phones, negative experiences, and invalid file attachments without crashing or corrupting data.
3. **Concurrency & Duplicate Prevention**: Confirm rapid multi-click submissions are safely debounced (< 400ms lock) and duplicate submissions (same candidate email + job ID) are rejected with HTTP 409 Conflict.
4. **Resilience & Non-Destructive Error Handling**: Validate the application displays actionable error banners during simulated HTTP 500 failures or network drops without clearing the candidate's entered form values.
5. **Authorization & Privacy Enforcement**: Confirm administrative endpoints reject unauthenticated requests with HTTP 401 Unauthorized, and candidate dashboards expose only records belonging to the authenticated email address.
6. **Cross-Platform Compatibility**: Validate UI layout consistency, responsive grid wrapping, and zero horizontal overflow across Desktop (1280x800), Tablet (768x1024), and Mobile (375x667) viewports.
7. **Accessibility Compliance**: Verify WCAG 2.1 AA compliance, accessible focus indicators (`:focus-visible`), ARIA alert announcements (`role="alert"`), and keyboard navigation (Tab, Enter, Space, Escape).
8. **Regression Prevention**: Maintain a 100% automated test execution pass rate across the full 36-test Playwright suite.

---

## D. Scope of Testing

### In-Scope Modules & Features

* **Job Discovery & Listings**: Rendering of all 4 active job cards with complete metadata (Title, Department, CTC Salary, Experience, Location, Employment Type badges).
* **Multi-Attribute Search & Filters**: Tokenized multi-keyword search across titles, skills, and descriptions; filtering by Department (Quality Assurance, Engineering, Infrastructure), Location (Bangalore, Remote, Hyderabad, Pune), and Type (Full-time); dynamic result counters; contextual empty-state messaging; clear-filter actions.
* **Job Details & Navigation**: Role modal opening with responsibilities, requirements, and skill tags; URL deep linking (`#job=JOB-101`); HTML5 History state tracking and browser back/forward preservation.
* **Form Validation & Boundaries**: Inline error rendering on missing required fields; whitespace-only rejection; automatic trimming; RFC 5322 email validation; boundary testing (Name 2–60 chars, Phone 10 digits, Experience 0–40 yrs, File size $\le$ 5MB, File extensions `.pdf`, `.doc`, `.docx`, Cover Letter $\le$ 1000 chars); mandatory consent checkbox.
* **Submission Behavior & Concurrency**: Multi-click debounce lockout (< 400ms); animated loading spinner; HTTP 409 duplicate rejection; success modal rendering with unique tracking ID (`APP-XXXXXX`); automatic form reset upon confirmed success.
* **Candidate Self-Service Tracking**: Private email lookup; candidate data ownership isolation; live status tracking badges (`New`, `Under Review`, `Shortlisted`, `Rejected`); local storage caching of recently applied email.
* **Recruiter Admin Console**: Passkey authentication (`ADMIN_KEY` environment variable); live overview metric cards (Total, New, Under Review, Shortlisted, Rejected); candidate search and status filtering; interactive status updates synchronized to the database.
* **REST API Endpoints**: Full verification of all backend routes (`/api/health`, `/api/jobs`, `/api/jobs/:id`, `/api/applications`, `/api/apply`, `/api/candidate/applications`, `/api/admin/overview`, `/api/admin/applications`, `/api/admin/applications/:id/status`, `/api/submissions`, `/api/reset`, `/api/simulate`).
* **Database Dual-Mode Persistence**: MongoDB Atlas cloud cluster syncing (`applications` and `jobs` collections) with transparent in-memory fallback; health diagnostic reporting (`/api/health`).
* **QA Fault Injection Harness**: Controllable 3s latency injection; HTTP 500 server error injection; client-side offline drop simulation; non-blocking test data store reset.
* **Cross-Viewport & Accessibility**: Testing across Desktop, Tablet, and Mobile viewports; keyboard focus rings; screen reader accessibility tags (`aria-label`, `aria-invalid`, `aria-describedby`, `role="alert"`).
* **Regression Automation**: Playwright Test suite execution and CI integration via GitHub Actions.

---

## E. Out-of-Scope Testing

| Excluded Activity | Rationale for Exclusion |
| :--- | :--- |
| **Submitting Real Data to Live Production Job Boards** | Strictly prohibited by assessment ethical guidelines. All testing is conducted on the isolated local mock application (`http://localhost:3000`) or read-only exploratory reference checks. |
| **High-Volume Load & Stress Testing (DDoS)** | Application is an architectural assessment prototype designed for local quality engineering validation; distributed cloud load testing would exhaust local host resources unnecessarily. |
| **Penetration Testing & OS-Level Vulnerability Fuzzing** | Out of scope for a functional QA assessment; security testing is strictly scoped to application-level authorization, input sanitization, and data privacy. |
| **Third-Party External Services (SMTP Email, SMS OTP, Cloud S3)** | File attachments validate MIME extensions and sizes locally without streaming to external AWS S3 buckets; notifications are surfaced via candidate dashboard rather than live SMTP dispatch. |
| **Enterprise SSO (SAML 2.0, OAuth / Okta)** | Administrative access control is implemented via environment-supplied passkeys (`ADMIN_KEY` / `X-Admin-Key`), which is appropriate and sufficient for this assessment scope. |

---

## F. Test Environment and Tools

* **Host Operating System**: Windows 11 Enterprise (64-bit)
* **Runtime Environment**: Node.js `v24.18.1`, npm `11.16.0`
* **Local Web Server**: Native Node.js HTTP server (`server.js`) listening on `http://localhost:3000`
* **Database Architecture**:
  * *Primary*: MongoDB Atlas cloud cluster (`cluster0.lo94xku.mongodb.net`, database: `careerhub`)
  * *Resilient Fallback*: Local in-memory session store (activated automatically if network/TLS restrictions prevent cloud connection)
* **Test Automation Framework**: `@playwright/test` `v1.58.2`
* **Browser Engines Under Test**:
  * Desktop Chromium (Google Chrome emulated, viewport: 1280x800)
  * Mobile Viewport (Chromium emulated: 375x667)
  * Tablet Viewport (Chromium emulated: 768x1024)
* **Execution Configuration**: Serial execution (`workers: 1`, `fullyParallel: false`) in `playwright.config.js` to guarantee test database isolation across scenarios.
* **Evidence & Reporting Tools**: Playwright HTML Reporter (`playwright-report/index.html`), failure trace archives (`trace.zip`), and automated screenshot captures on failure (`test-results/`).
* **Continuous Integration**: GitHub Actions runner (`ubuntu-latest`, Node.js 20, automated Playwright execution on push/PR).

---

## G. Test Strategy

| Test Type | Objective | Scope & Technique | Execution Mode |
| :--- | :--- | :--- | :---: |
| **Functional Testing** | Validate individual user flows and features operate according to business requirements. | Verify job card display, modal navigation, form filling, submissions, and status lookups. | Automated & Manual |
| **Positive Testing** | Confirm the system accepts valid inputs and succeeds as expected. | Submit valid candidate application (`Jessica Pearson`, valid email, 10-digit phone, `.pdf` resume); verify ticket generation. | Automated (P0) |
| **Negative Testing** | Verify proper rejection of invalid, malformed, or missing inputs. | Submit blank forms, invalid email syntaxes (`user@`, `@domain`), non-numeric phones, disallowed files (`.exe`, `.txt`). | Automated (P0/P1) |
| **Boundary-Value Testing (BVA)** | Test behavior at exact min/max operational limits. | Full Name (1 char, 2 chars, 60 chars, 61 chars); Phone (9 digits, 10 digits, 11 digits); Experience (0 yrs, 40 yrs, 41 yrs, -1 yr); File size ($\le$ 5MB vs > 5MB); Cover letter (1000 chars vs 1001 chars). | Automated (P1) |
| **API Testing** | Verify HTTP status codes, response headers, and JSON structures. | Directly probe `/api/health`, `/api/jobs`, `/api/apply`, `/api/admin/overview` with valid and invalid payloads. | Automated (P0/P1) |
| **Database & Persistence Testing** | Confirm application persists data correctly across operational modes. | Verify applications persist to MongoDB Atlas when connected; verify transparent in-memory fallback when disconnected. | Automated & Manual |
| **Authorization & Privacy Testing** | Enforce security access boundaries and prevent data leakage. | Verify `/api/admin/*` endpoints return HTTP 401 without valid `X-Admin-Key`; verify candidate search isolates records by email. | Automated (P0) |
| **Error-Handling Testing** | Verify user experience during system, network, or server failures. | Trigger simulated HTTP 500 error and offline network drop; verify form values are preserved and actionable retry banner appears. | Automated (P0/P1) |
| **UI & Responsive Testing** | Ensure layout adapts without visual truncation or horizontal scrolling. | Test across Desktop (1280px), Tablet (768px), and Mobile (375px) viewports; verify grid column collapsing and modal responsiveness. | Automated (P1/P2) |
| **Accessibility (a11y) Testing** | Ensure portal is usable for keyboard-only users and assistive technologies. | Verify visible focus rings (`:focus-visible`), Tab sequence, ESC modal closing, `aria-invalid`, `aria-describedby`, and `role="alert"`. | Automated & Manual |
| **Regression Testing** | Confirm new enhancements or fixes do not break existing functionality. | Execute complete 36-test Playwright suite before every release or commit. | Automated (P0) |
| **Automated End-to-End Testing** | Validate complete user journeys using Page Object Model design. | Complete multi-step flows: Search $\rightarrow$ Filter $\rightarrow$ Details $\rightarrow$ Apply $\rightarrow$ Success $\rightarrow$ Candidate Lookup $\rightarrow$ Admin Review. | Automated (P0) |

---

## H. Prioritization Methodology

Scenarios are prioritized using a four-tier classification model based on business risk, user journey criticality, and data integrity:

* **P0 — Critical**:
  * *Definition*: Core workflows essential for application operation, critical data integrity, or security access boundaries.
  * *Impact*: If broken, candidates cannot apply, data corruption occurs, duplicate applications flood the database, or unauthorized users access private candidate data. Blocks release immediately.
  * *Examples*: Valid application submission, HTTP 409 duplicate rejection, double-click debounce guard, required-field blocks, admin 401 authorization guard, candidate data ownership isolation.
* **P1 — High**:
  * *Definition*: Important functionality, input validation, boundary constraints, error recovery, and primary navigation.
  * *Impact*: Prevents invalid data from entering the system, ensures candidates can recover from recoverable errors without retyping, and maintains search/filter usability. Must fix in current release cycle.
  * *Examples*: RFC email syntax enforcement, whitespace trimming, 10-digit phone check, 5MB resume limit, HTTP 500 form preservation, search tokenization, multi-attribute filtering.
* **P2 — Medium**:
  * *Definition*: Secondary behavior, usability polish, responsive details, accessibility standards, and non-destructive maintenance.
  * *Impact*: Enhances user experience and compliance without blocking core application functionality.
  * *Examples*: Mobile/tablet grid adaptation, visible focus indicators, character counter feedback, clear-filter shortcuts, QA console data store reset.
* **P3 — Low**:
  * *Definition*: Minor cosmetic alignments, non-functional text adjustments, or optional enhancements.
  * *Impact*: Negligible business or candidate impact.

---

## I. Prioritized Scenario Matrix

The following table documents 30 distinct, codebase-grounded test scenarios covering all 18 functional and quality areas across CareerHub:

| Scenario ID | Feature Area | Scenario Description | Preconditions | Expected Result | Priority | Test Type | Execution Mode | Code Reference | Verified Status |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- | :---: |
| **SCN-01** | Job Listings | Verify all 4 job cards render with full metadata (Title, Dept, Salary, Exp, Location, Type) | Server running at `http://localhost:3000` | Exactly 4 job cards render with uniform height, badges, and "View Details" buttons | **P0** | Functional | Automated | `src/app.js:337-406`<br>`tests/job-listings-ui-validation.spec.js:17` | **Passed** |
| **SCN-02** | Job Details | Verify "View Details" opens role modal with full specifications and URL hash | Portal open on home section | Modal displays salary CTC, requirements, skills; URL hash updates to `#job=JOB-101` | **P0** | Functional / Nav | Automated | `src/app.js:482-524`<br>`tests/job-listings-ui-validation.spec.js:185` | **Passed** |
| **SCN-03** | Search | Verify search handles titles, skills (e.g. "Playwright"), keywords, and case-insensitivity | 4 active job listings displayed | Matches jobs matching query tokens; updates result counter in real time | **P1** | Functional | Automated | `src/app.js:409-467`<br>`tests/job-listings-ui-validation.spec.js:82` | **Passed** |
| **SCN-04** | Multi-Filtering | Verify department, location, and employment type dropdowns filter in tandem | Search & filter card visible | Only jobs matching all selected filter criteria are displayed | **P1** | Functional | Automated | `src/app.js:409-467`<br>`tests/candidate-admin-portal.spec.js:15` | **Passed** |
| **SCN-05** | Empty Results | Verify nonexistent query displays informative empty state with clear action | Filter inputs populated with non-matching string (e.g. "XYZ999") | Empty state icon, contextual message, and "Clear All Filters" button displayed | **P1** | Negative / UI | Automated | `src/app.js:451-464`<br>`tests/job-listings-ui-validation.spec.js:112` | **Passed** |
| **SCN-06** | Clear Filters | Verify "Clear Filters" button restores full catalog and hides clear button | Active filters applied | All 4 original job cards restored; clear buttons hidden; counter reset to 4 | **P2** | Usability | Automated | `src/app.js:469-479`<br>`tests/job-listings-ui-validation.spec.js:166` | **Passed** |
| **SCN-07** | Form Validation | Verify empty required fields display accessible inline errors and block submission | Application modal open for `JOB-101` | Form submission halted; inline error spans render with `role="alert"` | **P0** | Negative | Automated | `src/app.js:887-975`<br>`tests/application-form-validation.spec.js:46` | **Passed** |
| **SCN-08** | Email Validation | Verify invalid email formats (`test@`, `@domain`, `name@.com`) are rejected | Application form open | Rejection with `"Please provide a valid email address"` error message | **P0** | Negative | Automated | `src/app.js:905-914`<br>`tests/application-form-validation.spec.js:77` | **Passed** |
| **SCN-09** | Whitespace Evasion | Verify whitespace-only input is rejected and leading/trailing spaces are trimmed | Form open; fields filled with spaces | Rejection of whitespace-only strings; trimmed inputs accepted upon valid submission | **P1** | Boundary / Neg | Automated | `src/app.js:892-903`<br>`tests/application-form-validation.spec.js:97` | **Passed** |
| **SCN-10** | Length Boundaries | Enforce boundary limits: Name (2–60 chars), Phone (10 digits), Experience (0–40 yrs) | Form open with edge boundary values | 1-char name rejected; 2-char accepted; 60-char accepted; negative exp rejected; 11-digit phone rejected | **P1** | Boundary (BVA) | Automated | `src/app.js:897-940`<br>`tests/application-form-validation.spec.js:131` | **Passed** |
| **SCN-11** | File Attachments | Enforce resume file constraints: permitted formats (`.pdf`, `.doc`, `.docx`) and $\le$ 5MB | Form open with file attachment | Disallowed files (`.txt`, `.exe`) rejected; files > 5MB rejected with explicit size error | **P1** | Boundary / Neg | Automated | `src/app.js:942-957`<br>`tests/application-form-validation.spec.js:131` | **Passed** |
| **SCN-12** | Valid Submission | Valid application produces success confirmation modal and unique tracking ID | Valid candidate payload entered in form | Application accepted (HTTP 201); success modal displays `APP-XXXXXX` tracking ID; form reset | **P0** | Positive (E2E) | Automated | `src/app.js:978-1040`<br>`tests/application-form-validation.spec.js:18` | **Passed** |
| **SCN-13** | Duplicate Prevention | Prevent duplicate submission using identical candidate email for the same job ID | One valid application already logged | Second submission rejected with HTTP 409 Conflict; duplicate modal displays warning | **P0** | Concurrency / Neg | Automated | `src/app.js:1041-1045`<br>`tests/application-form-validation.spec.js:172` | **Passed** |
| **SCN-14** | Debounce Guard | Prevent rapid repeated clicks on submit button via client-side debouncing lock | Form filled with valid data | Submit button disables immediately; spinner renders; only 1 API call dispatched | **P0** | Concurrency | Automated | `src/app.js:981-997`<br>`tests/application-form-validation.spec.js:215` | **Passed** |
| **SCN-15** | Network Latency | Injected 3s network delay triggers observable loading state and button disablement | "Network Delay (3s)" toggle checked | Submit button enters loading state with spinner; disables repeated input for 3000ms | **P1** | Resilience / UI | Automated | `src/app.js:994-996`<br>`tests/application-form-validation.spec.js:249` | **Passed** |
| **SCN-16** | HTTP 500 Resilience | Simulated HTTP 500 error displays alert banner without wiping candidate form data | "Simulate HTTP 500" toggle checked | Inline error banner rendered; application does not crash; candidate inputs preserved | **P0** | Resilience / Error | Automated | `src/app.js:1046-1049`<br>`tests/application-form-validation.spec.js:279` | **Passed** |
| **SCN-17** | Offline Drop Recovery | Simulated offline network drop displays network error and allows retry on reconnection | "Simulate Offline" toggle checked | Displays offline alert; unchecking toggle and clicking "Retry" successfully submits | **P1** | Resilience / Error | Automated | `src/app.js:1018-1021`<br>`tests/application-form-validation.spec.js:306` | **Passed** |
| **SCN-18** | Candidate Dashboard | Candidate looks up applications by email in Candidate Self-Service Dashboard | Applications exist in system | Dashboard renders tracking code, role, date, and live stage badge matching candidate email | **P0** | Functional | Automated | `src/app.js:557-637`<br>`tests/candidate-admin-portal.spec.js:56` | **Passed** |
| **SCN-19** | Candidate Privacy | Strict candidate ownership: search isolates records and prevents cross-candidate leakage | Multiple applications from different emails | Searching Candidate A's email returns only A's records; Candidate B's email returns only B's | **P0** | Security / Privacy | Automated | `server.js:518-538`<br>`tests/candidate-admin-portal.spec.js:261` | **Passed** |
| **SCN-20** | Admin Authentication | Recruiter Admin Console enforces passkey login via `ADMIN_KEY` environment secret | Admin portal modal opened | Invalid passkey displays authentication error; valid passkey unlocks Recruiter Console | **P0** | Security / Auth | Automated | `src/app.js:642-705`<br>`tests/candidate-admin-portal.spec.js:98` | **Passed** |
| **SCN-21** | Admin 401 Rejection | Direct API calls to admin endpoints without valid `X-Admin-Key` return HTTP 401 | Direct HTTP request to `/api/admin/*` | Request rejected with `HTTP 401 Unauthorized` (`{"error": "Unauthorized: ..."}`) | **P0** | Security / API | Automated | `server.js:544-549`<br>`tests/candidate-admin-portal.spec.js:261` | **Passed** |
| **SCN-22** | Admin Overview Cards | Admin dashboard overview metrics aggregate real-time application stage counts | Submissions exist in system | Metrics cards accurately reflect counts for Total, New, Under Review, Shortlisted, Rejected | **P1** | Functional / API | Automated | `src/app.js:707-714`<br>`tests/candidate-admin-portal.spec.js:136` | **Passed** |
| **SCN-23** | Admin Stage Sync | Recruiter updates candidate stage from "New" to "Shortlisted" with live DB sync | Admin dashboard open | Database record updated; Candidate Self-Service Dashboard immediately reflects new stage | **P0** | Functional / E2E | Automated | `src/app.js:774-835`<br>`tests/candidate-admin-portal.spec.js:180` | **Passed** |
| **SCN-24** | API Payload Validation | Backend validates required fields, phone length, email format, and rejects bad JSON | Direct POST to `/api/applications` | Missing fields return HTTP 400 with specific `{field, error}` JSON payload | **P1** | API / Integrity | Automated | `server.js:377-434`<br>`tests/job-application-workflow.spec.js:96` | **Passed** |
| **SCN-25** | Health Check & DB Mode | `/api/health` accurately reports server status, database mode, and connection health | Server running | Returns HTTP 200 with server uptime, environment, and transparent database connection state | **P0** | API / Diagnostic | Automated | `server.js:275-299`<br>`tests/candidate-admin-portal.spec.js:261` | **Passed** |
| **SCN-26** | Safe Data Store Reset | "Reset Applications" in QA console clears test store without blocking native alerts | Submissions exist in test store | Store cleared; non-blocking status pill updates; production environment guarded with 401 | **P2** | Maintenance | Automated | `src/app.js:19, 1073-1089`<br>`tests/application-form-validation.spec.js:12` | **Passed** |
| **SCN-27** | Viewport Adaptation | Responsive layout adapts across mobile (375x667), tablet (768x1024), and desktop (1280x800) | Browser viewport set to mobile/tablet | Grid wraps to 1 column on mobile; zero horizontal scrolling; tap targets $\ge$ 44px | **P1** | Responsive / UI | Automated | `src/styles.css:760-840`<br>`tests/candidate-admin-portal.spec.js:229` | **Passed** |
| **SCN-28** | Accessibility & Focus | Visible focus rings on all interactive elements; accessible ARIA alert roles | Keyboard navigation (Tab / Shift+Tab) | Focus ring `#818CF8` visible; screen reader labels present; ESC closes active modals | **P2** | Accessibility | Automated | `src/styles.css:122-132`<br>`tests/job-listings-ui-validation.spec.js:238` | **Passed** |
| **SCN-29** | Browser Navigation | Browser back/forward button closes role modal while retaining search and filter queries | Role details modal opened from search | Back button closes modal, restores URL, and preserves search input and department filter | **P1** | Navigation / UX | Automated | `src/app.js:514-524`<br>`tests/job-listings-ui-validation.spec.js:216` | **Passed** |
| **SCN-30** | Regression Suite Run | Full automated test suite executes cleanly without flakes or timing failures | Fresh application instance | 36 / 36 tests execute and pass with 100% pass rate in Playwright Test | **P0** | Regression | Automated | `playwright.config.js`<br>`tests/*.spec.js` | **Passed** |

---

## J. Test Data Strategy

All testing is strictly conducted using isolated, synthetic test data to avoid polluting live recruitment databases or exposing personal details:

1. **Fictional Candidate Personas**:
   * *Jessica Pearson* (`jessica.pearson@example.com`, Phone: `9876543210`, Exp: 5) — Standard valid positive applicant persona.
   * *Eleanor Vance* (`eleanor.vance@hillhouse.org`, Phone: `9876543210`, Exp: 3) — Private applicant persona for candidate isolation and ownership tests.
   * *Harvey Specter* (`harvey.specter@example.com`, Phone: `9123456789`, Exp: 8) — Recruiter pipeline candidate persona for stage transition tests.
   * *Stranger Candidate* (`stranger@external.com`) — Unauthenticated persona for cross-account data isolation verification.
2. **Pre-Seeded Job Catalog**:
   * Exactly 4 verified job openings (`JOB-101`: QA Automation Engineer, `JOB-102`: Associate QA Engineer, `JOB-103`: Frontend Developer, `JOB-104`: DevOps & Cloud Engineer) seeded in `server.js` and synchronized with MongoDB Atlas.
3. **Invalid & Malformed Payloads**:
   * Malformed emails: `invalid-email`, `user@`, `@domain.com`, `name@.com`, `spaces in@email.com`.
   * Whitespace strings: `'   '` (spaces), `'\t\n'` (tabs and newlines) across Name, Email, and Phone fields.
   * Boundary numbers: `-1` years, `41` years, `NaN`, non-integer strings.
   * Phone variations: `98765` (5 digits), `98765432100` (11 digits), `98765abcde` (alphanumeric).
4. **Synthetic Attachment Fixtures**:
   * [`tests/fixtures/sample_resume.pdf`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/tests/fixtures/sample_resume.pdf) — Standard valid 135-byte PDF document.
   * [`tests/fixtures/invalid_file.txt`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/tests/fixtures/invalid_file.txt) — Disallowed text document to verify extension filtering.
5. **Data Protection & Hygiene**:
   * Zero real personal candidate records or sensitive credentials are used in test data.
   * `.env` is verified in `.gitignore`; only sanitized `.env.example` placeholders are stored in version control.

---

## K. Entry and Exit Criteria

### Entry Criteria

* [x] **Application Readiness**: Node.js backend server successfully starts on port 3000 (`http://localhost:3000`).
* [x] **Environment Configuration**: Runtime dependencies installed (`npm install`), Playwright browser binaries installed (`npx playwright install chromium`).
* [x] **Database Connectivity**: Dual-mode database layer initialized (MongoDB Atlas verified with automatic local in-memory fallback active if cloud proxy blocks TLS handshake).
* [x] **Test Artifacts Available**: Page Object Model (`JobPortalPage.js`) and test fixtures (`sample_resume.pdf`, `invalid_file.txt`) present.
* [x] **Seed Data Verified**: Seed job catalog initialized with 4 verified roles.

### Exit Criteria

* [x] **100% P0 & P1 Execution**: All Critical (P0) and High (P1) test scenarios executed and verified.
* [x] **Detailed Test Cases Documented**: Minimum 15 detailed manual test cases fully documented (Exceeded: 26 test cases in [`docs/test-cases.md`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/docs/test-cases.md)).
* [x] **Automated Scenarios Executed**: Minimum 5 high-priority automated scenarios executed (Exceeded: 36 automated tests passing in [`tests/`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/tests)).
* [x] **Zero Open Critical/Major Defects**: 0 open S1 (Critical) or S2 (Major) defects in the local application codebase.
* [x] **Complete Bug Reports Documented**: All discovered defects documented with steps to reproduce, expected/actual results, severity/priority, evidence, and verified resolutions (10 bug reports in [`docs/bug-reports.md`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/docs/bug-reports.md)).
* [x] **Execution Report Generated**: Genuine test run evidence recorded and saved (`playwright-report/index.html` and [`docs/test-execution-report.md`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/docs/test-execution-report.md)).
* [x] **Clean Working Tree**: Clean Git repository with zero uncommitted debug files, secrets, or temporary traces.

---

## L. Defect Management

### Defect Severity Definitions (Technical Impact)

* **S1 — Critical**: Application crash, server process termination, white screen, inability to apply for any role, or candidate data corruption.
* **S2 — Major**: Validation evasion (e.g. whitespace bypass), duplicate submissions accepted, form data lost during recoverable errors, or unauthorized access to admin APIs.
* **S3 — Minor**: Non-blocking UI glitch, missing inline error container, absent accessibility alert attributes (`role="alert"`), or cosmetic misalignments.
* **S4 — Trivial**: Spelling mistakes in code comments, CSS class typos, or minor console warning notices.

### Defect Priority Definitions (Urgency of Fix)

* **P0 — Immediate**: Must fix immediately before any candidate test run or release. Blocks core evaluation.
* **P1 — High**: Must fix within current iteration; directly impacts data integrity or user workflow reliability.
* **P2 — Medium**: Schedule for regular fix; cosmetic polish or secondary usability enhancement.
* **P3 — Low**: Low-urgency enhancement or minor documentation refinement.

### Defect Lifecycle

```
[Discovered & Logged] ──► [Reproduced & Isolated] ──► [Fix Implemented] ──► [Retested & Automated] ──► [Closed & Documented]
```

Every defect report must contain all 8 mandatory fields:
1. **Bug ID & Title**: Clear tracking identifier and descriptive title.
2. **Severity & Priority**: Technical impact and business urgency.
3. **Environment & Preconditions**: Operating system, browser version, and initial application state.
4. **Steps to Reproduce**: Numbered, unambiguous reproduction steps.
5. **Expected Result**: Intended system behavior based on specification.
6. **Actual Result**: Observed defective behavior.
7. **Evidence**: Trace log, DOM code snippet, test output, or screenshot reference.
8. **Resolution & Retest Result**: Specific code change applied and verification status.

---

## M. Risks and Mitigations

| Risk ID | Risk Description | Likelihood | Impact | Mitigation Strategy | Residual Concern |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **RSK-01** | **MongoDB Atlas IP Access Block**: Network environments where outbound client IP is not whitelisted in Atlas Network Access cause TLS Handshake Alert 80. | Medium | Medium | Implement automatic, zero-downtime in-memory fallback in `server.js` with transparent reporting in `/api/health`. | Persistent cloud data across server restarts requires Atlas IP whitelisting (`0.0.0.0/0` for assessment evaluation). |
| **RSK-02** | **Accidental Double-Clicking**: Candidates double-clicking "Submit" create duplicate candidate profiles in the recruitment database. | High | Critical | Client-side timestamp debounce lock (< 400ms), button disablement, and backend HTTP 409 unique constraint on `(email + jobId)`. | Low residual risk; dual-layer client/server protection ensures zero duplicate entries. |
| **RSK-03** | **Whitespace-Only Validation Evasion**: Users submitting spaces bypass required field checks, generating blank applicant records. | High | High | Enforce `.trim()` sanitization across both frontend `src/app.js` and backend `server.js` before checking minimum string length. | Mitigated completely across all text fields. |
| **RSK-04** | **Input Loss on Server 500 Failure**: Server errors cause modal form reset, forcing candidate to re-type cover letter and inputs. | High | High | Display inline `#form-error-banner` without closing modal or executing `form.reset()`; candidate retains all typed values for retry. | Mitigated; verified in automated Scenario 12. |
| **RSK-05** | **Exposed Admin Credentials**: Hardcoded passwords in version control expose candidate data to unauthorized external parties. | Medium | Critical | Remove hardcoded passwords; supply credentials via `ADMIN_KEY` environment variable; exclude `.env` from Git. | Evaluators must ensure `ADMIN_KEY` is configured in `.env` if changing default passkey. |
| **RSK-06** | **Flaky Automation via Timing Races**: Hardcoded `waitForTimeout` calls fail on low-powered machines. | Medium | Medium | Utilize auto-waiting Playwright web-first assertions (`expect(locator).toBeVisible()`) and serial test execution (`workers: 1`). | Test duration is ~1.5–1.7 minutes; zero flakiness observed across consecutive runs. |

---

## N. Deliverables and Reporting

The QA deliverables for this project are organized across the repository as follows:

| Deliverable | Location in Repository | Verification Method |
| :--- | :--- | :--- |
| **1. Master Test Plan** | [`docs/test-plan.md`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/docs/test-plan.md) | Verified against HireKiwi assessment criteria; includes scope, risks, priorities, 30 scenarios, and traceability. |
| **2. Detailed Test Cases** | [`docs/test-cases.md`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/docs/test-cases.md) | 26 test cases (`TC-01` to `TC-26`) with all 8 standard fields, verified passing in automated test runner. |
| **3. Automated Test Suite** | [`tests/`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/tests) | 36 automated Playwright end-to-end tests across 4 modular spec files using Page Object Model design. |
| **4. Defect Reports & Evidence** | [`docs/bug-reports.md`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/docs/bug-reports.md) & [`README.md`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/README.md) Sec. 11 | 10 complete defect reports with reproduction steps, severity, priority, evidence, and retest verification. |
| **5. Comprehensive README** | [`README.md`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/README.md) | Detailed Quick Start setup, architecture diagrams, command references, and actual execution results. |
| **6. Execution Evidence Report** | [`docs/test-execution-report.md`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/docs/test-execution-report.md) & [`playwright-report/index.html`](file:///c:/Users/Suhirdha%20K%20S/OneDrive/Pictures/Infinitica_assessment/playwright-report/index.html) | Interactive HTML execution dashboard, suite timings, and cross-device viewport test matrices. |

---

## O. Assumptions and Limitations

### Confirmed Architectural Facts

1. **Dual-Mode Persistence**: CareerHub operates in dual-mode: it connects to MongoDB Atlas cloud cluster (`cluster0.lo94xku.mongodb.net`) when IP access is permitted, and automatically activates its internal in-memory store when network or TLS restrictions occur.
2. **Transparent Diagnostic Reporting**: `/api/health` accurately and transparently reports the live database connection status (`mode: "mongodb-atlas"` vs `mode: "in-memory-fallback"`, `connected: boolean`), never falsely claiming persistent cloud storage when operating in fallback mode.
3. **Automated Suite Pass Rate**: The 36 Playwright tests pass with 100% reliability in both MongoDB Atlas connected mode and in-memory fallback mode.

### Operational Limitations & Boundaries

1. **MongoDB Atlas Whitelisting**: If testing in environments where the host IP address is not whitelisted in MongoDB Atlas Network Access, the cloud proxy returns TLS Handshake Alert 80. The application seamlessly handles this via in-memory fallback without disrupting user workflows or failing tests.
2. **Document File Storage**: Uploaded resumes (`.pdf`, `.doc`, `.docx`) validate document extensions and the 5MB file size limit client-side and server-side. File metadata is tracked in application state rather than uploading raw binary bytes to cloud S3 buckets.
3. **Session Lifetime in Fallback Mode**: When running in in-memory fallback mode, application submissions persist for the duration of the Node server process. Restarting the server process re-seeds the initial dataset unless MongoDB Atlas is actively connected.
4. **Email Dispatch**: Application confirmations and tracking updates are surfaced directly via candidate dashboard and confirmation modals rather than dispatching live external SMTP emails.
5. **Administrative Authentication**: The Recruiter Admin Portal enforces passkey verification configured via `ADMIN_KEY` / `X-Admin-Key` header checking. Enterprise SSO (OAuth 2.0 / SAML) is intentionally out-of-scope for this local prototype.

---

## P. Requirements Traceability Matrix

The following matrix establishes end-to-end traceability between HireKiwi assessment requirements, test scenarios, codebase components, automated test specifications, execution outcomes, and associated defect reports:

| Assessment Requirement Area | Test Scenario IDs | Codebase Components | Automated Test File | Execution Result | Associated Defect ID |
| :--- | :---: | :--- | :--- | :---: | :---: |
| **1. Job Discovery & Listings Metadata** | `SCN-01`, `SCN-02` | `src/app.js:337-524`<br>`server.js:301-348` | `tests/job-listings-ui-validation.spec.js` (Checks 1, 7) | **Passed** | `BUG-01` |
| **2. Search & Multi-Attribute Filtering** | `SCN-03`, `SCN-04`, `SCN-05`, `SCN-06` | `src/app.js:409-480`<br>`server.js:303-326` | `tests/job-listings-ui-validation.spec.js` (Checks 2–6)<br>`tests/candidate-admin-portal.spec.js` (Scenario 1) | **Passed** | `BUG-02` |
| **3. Required Fields & Input Sanitization** | `SCN-07`, `SCN-08`, `SCN-09` | `src/app.js:887-914`<br>`server.js:397-414` | `tests/application-form-validation.spec.js` (Scenarios 2–4) | **Passed** | `BUG-05` |
| **4. Boundary Enforcement (Lengths & Files)**| `SCN-10`, `SCN-11` | `src/app.js:897-966`<br>`server.js:403-426` | `tests/application-form-validation.spec.js` (Scenario 5) | **Passed** | `BUG-08`, `BUG-09` |
| **5. Application Submission & Ticket Creation**| `SCN-12` | `src/app.js:978-1040`<br>`server.js:448-486` | `tests/application-form-validation.spec.js` (Scenario 1)<br>`tests/job-application-workflow.spec.js` (TC-04) | **Passed** | — |
| **6. Duplicate & Repeated Submission Control**| `SCN-13`, `SCN-14` | `src/app.js:981-985, 1041`<br>`server.js:435-446` | `tests/application-form-validation.spec.js` (Scenarios 6, 7)<br>`tests/job-application-workflow.spec.js` (TC-13, 14) | **Passed** | `BUG-04`, `BUG-07` |
| **7. Network Latency & Loading Feedback** | `SCN-15` | `src/app.js:994-996`<br>`server.js:488-492` | `tests/application-form-validation.spec.js` (Scenario 8)<br>`tests/job-application-workflow.spec.js` (TC-15) | **Passed** | — |
| **8. Fault Tolerance & HTTP 500 Recovery** | `SCN-16`, `SCN-17` | `src/app.js:1018-1049`<br>`server.js:367-375` | `tests/application-form-validation.spec.js` (Scenarios 9, 10, 12)<br>`tests/job-application-workflow.spec.js` (TC-16) | **Passed** | `BUG-06` |
| **9. Candidate Self-Service & Data Privacy** | `SCN-18`, `SCN-19` | `src/app.js:557-637`<br>`server.js:502-540` | `tests/candidate-admin-portal.spec.js` (Scenario 3, 8) | **Passed** | — |
| **10. Admin Authentication & Access Guard** | `SCN-20`, `SCN-21` | `src/app.js:642-705`<br>`server.js:542-608` | `tests/candidate-admin-portal.spec.js` (Scenario 4, 8) | **Passed** | — |
| **11. Recruiter Stage Updates & DB Sync** | `SCN-22`, `SCN-23` | `src/app.js:707-835`<br>`server.js:542-654` | `tests/candidate-admin-portal.spec.js` (Scenarios 5, 6) | **Passed** | — |
| **12. API Protocol & Diagnostic Health** | `SCN-24`, `SCN-25` | `server.js:275-299, 377-446` | `tests/candidate-admin-portal.spec.js` (Scenario 8) | **Passed** | — |
| **13. Non-Destructive QA Test Harness** | `SCN-26` | `src/app.js:15-42, 1073`<br>`server.js:669-713` | `tests/application-form-validation.spec.js` (Scenario 10) | **Passed** | `BUG-10` |
| **14. Responsive Layout & Accessibility (a11y)**| `SCN-27`, `SCN-28` | `src/styles.css:122-132, 760`<br>`src/index.html` | `tests/candidate-admin-portal.spec.js` (Scenario 7)<br>`tests/job-listings-ui-validation.spec.js` (Check 9) | **Passed** | `BUG-03` |
| **15. Navigation State & Regression Control** | `SCN-29`, `SCN-30` | `src/app.js:514-524`<br>`playwright.config.js` | `tests/job-listings-ui-validation.spec.js` (Check 8)<br>Full 36-test suite execution | **Passed** | `BUG-10` |
