# Comprehensive QA Master Test Plan: CareerHub QA Portal

## 1. Document Control & Overview
* **Project**: CareerHub QA Portal — Job Application Workflow
* **Assessment**: HireKiwi Senior QA Engineer Assessment
* **Author**: Senior QA Engineer & Test Automation Lead
* **Role**: Senior QA Engineer & Test Automation Architect
* **Version**: 2.0.0 (Option C Final QA Readiness)
* **Date**: October 13, 2026
* **Status**: Complete & Verified

---

## 2. Objectives & Testing Strategy

The primary objective of this Master Test Plan is to establish a rigorous, risk-driven Quality Assurance strategy for the complete end-to-end Job Application Workflow in the CareerHub QA Portal. The portal enables job seekers to discover openings, filter and search by department/skills, inspect detailed job requirements, and submit applications with real-time validation, concurrency protection, and error resilience.

### Dual-Environment Testing Strategy:
1. **Safe Exploratory Testing (External Reference Hiring Portal)**:
   - **Target**: `[External Reference Portal]` (Reference Benchmark)
   - **Purpose**: Real-world baseline analysis of UI patterns, accessibility tags, DOM hierarchies, and navigation ergonomics.
   - **Safety Boundary**: Strictly non-destructive read-only exploration. No fake candidate submissions, no automated fuzzing, and zero data tampering on external production servers.
2. **Local Mock Application Verification (CareerHub Portal)**:
   - **Target**: `http://localhost:3000` (backed by Node.js server and MongoDB Atlas cluster).
   - **Purpose**: Full-scope automated and manual testing of all positive, negative, boundary, debouncing, duplicate prevention, and simulated error scenarios (Network Delay, HTTP 500, Offline Drop).
   - **Advantage**: Full control over network conditions, backend response codes, and test database state without polluting external systems.

---

## 3. Scope of Testing

### 3.1 In-Scope Features (Option A, Option B & Option C)
* **Job Listings Discovery & Metadata (Option A)**:
  - Rendering of all active jobs with title, department, salary CTC range, experience level, location, and employment type badges.
  - Multi-token keyword, job title, and skill search with case-insensitivity and whitespace trimming.
  - Department filtering dropdown with dynamic match count and empty-state messaging.
  - Role details modal opening matching role with responsibilities and requirements.
  - History preservation on browser back/forward navigation.
* **Application Form Validation & Submission Workflow (Option B)**:
  - Required field validation on missing inputs (Full Name, Email, Phone, Experience, Resume, Consent).
  - Whitespace-only input rejection across text inputs.
  - Automatic trimming of leading/trailing whitespace.
  - RFC 5322-compliant email format validation.
  - Boundary checking:
    * Full Name (2 to 60 characters).
    * Phone Number (exactly 10 numeric digits).
    * Experience (0 to 40 years; non-negative integers).
    * Resume Upload (permitted extensions: `.pdf`, `.doc`, `.docx`; max file size: 5MB).
    * Cover Letter (optional; maximum 1000 characters).
  - Multi-click debounce protection (< 400ms) and submit button loading state.
  - Duplicate application prevention (HTTP 409 Conflict based on candidate email + job ID).
  - Recoverable error handling (HTTP 500 server error, simulated offline drop) preserving candidate input.
  - Dynamic update of the Submitted Applications Registry audit table.
* **QA Test Harness Console (Options A, B & C)**:
  - 3-second network latency simulation toggle.
  - HTTP 500 Internal Server Error simulation toggle.
  - Client-side offline network drop simulation toggle.
  - "Reset Applications" data store restoration toggle.
* **Cross-Browser, Responsive & Accessibility Verification (Option C)**:
  - Viewports: Desktop (1280x800), Tablet (768x1024), and Mobile (375x667).
  - Keyboard navigation (Tab order, Enter/Space activation, ESC modal dismissal) and visible focus rings.
  - High contrast text readability and WCAG 2.1 AA alert roles (`role="alert"`).

### 3.2 Out-of-Scope Features
* Submitting real personal candidate data to third-party recruitment systems or live government job boards.
* Distributed Denial of Service (DDoS) high-volume load testing.
* Third-party biometric or SMS OTP authentication gateways.

---

## 4. Test Approach & Methodologies

| Test Type | Objective | Tools & Techniques |
| :--- | :--- | :--- |
| **Functional Testing** | Validate individual user journeys (Search, Apply, Modal Open/Close). | Playwright POM tests, manual exploratory testing. |
| **Negative Testing** | Verify rejection of invalid inputs, missing fields, and disallowed attachments. | Automated boundary tests, edge-case payload injections. |
| **Boundary Testing** | Test length limits (2–60 chars, 10-digit phone, 0–40 yrs exp, 5MB file). | Playwright boundary suite, boundary value analysis (BVA). |
| **Concurrency & Debouncing** | Ensure rapid repeated clicks do not create duplicate API requests. | Rapid button clicks (< 100ms interval) via Playwright evaluate. |
| **Error Resilience Testing** | Verify behavior during server failure (500) and network disconnects. | QA Console toggles, simulated latency injection. |
| **Regression Testing** | Confirm changes to application form do not break job search/filtering. | Full 28-test Playwright suite execution. |
| **Accessibility (a11y)** | Ensure screen reader compatibility, ARIA alert roles, and visible focus. | DevTools a11y audit, keyboard tab-traversal inspection. |
| **Cross-Viewport Testing** | Verify no horizontal scrolling, responsive grid wrapping, and tap targets. | Playwright viewport resizing (Desktop, Tablet, Mobile). |

---

## 5. Risk Assessment & Mitigation Matrix

| Risk ID | Risk Description | Likelihood | Impact | Severity | Mitigation Strategy |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **R-01** | Rapid double-clicking creates duplicate candidate records in ATS. | High | High | Critical | Implement client-side debounce lock (< 400ms) and button loading state; enforce server-side HTTP 409 unique constraint. |
| **R-02** | Whitespace-only input bypasses required field validation, creating empty profiles. | Medium | High | High | Apply `.trim()` sanitization across both frontend and backend before field length verification. |
| **R-03** | Server 500 error causes form reset, losing candidate's cover letter & inputs. | High | High | Critical | Render inline `#form-error-banner` without wiping input state; keep form values intact for user retry. |
| **R-04** | Browser input clipping (`maxlength`) creates false negative validation errors. | Medium | Medium | Medium | Set HTML input lengths to allow validation script to inspect and display accessible error messages. |
| **R-05** | Flaky automation due to hardcoded wait timeouts (`page.waitForTimeout`). | Medium | Medium | Medium | Utilize auto-waiting Playwright web-first assertions (`expect(locator).toBeVisible()`). |

---

## 6. Priority Definitions & Criteria

| Priority | Criteria & Description | Business & Candidate Impact |
| :--- | :--- | :--- |
| **P0 (Critical)** | Core flows essential for system operation: submitting applications, duplicate detection, double-click prevention, required-field blocks, and 500 error recovery. | If broken, candidates cannot apply, or recruiters receive duplicate/corrupted submissions. Blocks release immediately. |
| **P1 (High)** | Data integrity, boundary enforcement, and essential navigation: invalid email formats, whitespace sanitization, phone digit validation, file extension checks, and search/filter state preservation. | Prevents bad data from polluting the database and avoids candidate frustration during browsing. Must fix in current sprint. |
| **P2 (Medium)** | Usability polish, accessibility standards, cosmetic alignments, and secondary interactions: keyboard focus indicators, draft close confirmation, character counters, and filter reset shortcuts. | Enhances overall user experience and WCAG compliance without blocking the core application workflow. |

---

## 7. Test Environment & Tooling

* **Host Operating System**: Windows 11 (build-verified)
* **Runtime**: Node.js `v24.18.1`, npm `11.16.0`
* **Local Web Server**: Native Node.js HTTP server at `http://localhost:3000`
* **Database Layer**: MongoDB Atlas cluster (`careerhub` database) with local in-memory fallback
* **Test Automation Framework**: Playwright Test `v1.58.2+`
* **Test Browser Engines**: Chromium (Desktop Chrome), emulated Firefox/WebKit, and mobile viewport runners
* **Reporting Artifacts**: Playwright HTML Reporter (`playwright-report/`), screenshots, and failure traces (`test-results/`)

---

## 8. Entry and Exit Criteria

### 8.1 Entry Criteria
* [x] Local mock server successfully boots on `http://localhost:3000`.
* [x] Playwright dependencies and Chromium browser binaries installed.
* [x] Test plan, test cases matrix, and page object models defined.
* [x] Seed job listings dataset initialized (4 roles across Engineering, Quality Assurance, Product, and Infrastructure).

### 8.2 Exit Criteria
* [x] 100% of P0 and P1 test cases executed.
* [x] Minimum 15 detailed manual test cases fully documented (Exceeded: 26 test cases).
* [x] Minimum 5 automated scenarios executed (Exceeded: 36 automated tests passing with 100% pass rate).
* [x] 0 open Critical (S1) or Major (S2) defects.
* [x] All QA Test Harness toggles verified and functional.
* [x] Full regression test run completes with 100% pass rate.
* [x] Clean Git repository with zero uncommitted debug files or exposed secrets.
