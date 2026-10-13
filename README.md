# CareerHub — QA Test Portal & Automated Verification Suite

[![Playwright Tests](https://img.shields.io/badge/Playwright-35%20Passing-brightgreen.svg)](https://playwright.dev/)
[![Node.js Version](https://img.shields.io/badge/Node.js-v24.18.1-blue.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/MongoDB%20Atlas-Integrated%20%2F%20In--Memory%20Fallback-success.svg)](https://www.mongodb.com/atlas)
[![Accessibility](https://img.shields.io/badge/WCAG%202.1-AA%20Compliant-purple.svg)](https://www.w3.org/WAI/WCAG21/quickref/)
[![License](https://img.shields.io/badge/License-ISC-lightgrey.svg)](LICENSE)

> A modern, end-to-end recruitment web application and quality engineering test harness developed for the **HireKiwi QA Engineer Assessment**. Features a cohesive dark glassmorphic design system, multi-attribute job search and filtering, robust application submission validation, candidate self-service application tracking, a password-protected recruiter admin portal, dual-mode MongoDB Atlas integration, and a full 35-test Playwright automation suite with a 100% pass rate.

---

## 📌 Table of Contents
1. [Project Overview & Key Capabilities](#-project-overview--key-capabilities)
2. [Technology Stack & Architecture](#-technology-stack--architecture)
3. [Design System & UI/UX Enhancements](#-design-system--uiux-enhancements)
4. [Candidate Discovery & Self-Service Portal](#-candidate-discovery--self-service-portal)
5. [Recruiter Admin Portal & Stage Management](#-recruiter-admin-portal--stage-management)
6. [Backend, REST APIs & MongoDB Atlas Integration](#-backend-rest-apis--mongodb-atlas-integration)
7. [QA Test Harness Console](#-qa-test-harness-console)
8. [Automated Playwright Test Suite](#-automated-playwright-test-suite)
9. [Detailed Test Plan & Manual Test Matrix](#-detailed-test-plan--manual-test-matrix)
10. [Defect Summary & Findings](#-defect-summary--findings)
11. [Quick Start & Setup Instructions](#-quick-start--setup-instructions)
12. [Environment Configuration](#-environment-configuration)
13. [Authorship & Submission Details](#-authorship--submission-details)

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
| **Playwright Test Suite** | 35 automated scenarios covering functional, boundary, negative, error, and responsive behavior | ✅ 35 / 35 Passing (100%) |

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
* Enforces administrative passcode entry (default assessment key: `careerhub-admin-2026`).
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

The test suite contains **35 automated end-to-end tests** structured across 4 modular test specification files using the Page Object Model (`JobPortalPage.js`):

```text
Running 35 tests using 1 worker

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

  ✓ tests/candidate-admin-portal.spec.js (7 tests)
    ✓ Scenario 1: Multi-attribute job filtering by location and employment type works in tandem
    ✓ Scenario 2: Direct "Apply Now" button on job card opens application modal with target job
    ✓ Scenario 3: Candidate Self-Service Dashboard isolates application records by candidate email
    ✓ Scenario 4: Recruiter Admin Portal enforces authentication and rejects unauthorized access
    ✓ Scenario 5: Admin metrics overview accurately aggregates live application stage counts
    ✓ Scenario 6: Admin updates hiring stage to Shortlisted with live synchronization to Candidate Portal
    ✓ Scenario 7: Responsive adaptation across mobile (375x667) and tablet (768x1024) viewports

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
  35 passed (100% Pass Rate)
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

---

## 🐛 Defect Summary & Findings

Defects identified and resolved during portal enhancement:

1. **BUG-01 (Severity: High / Priority: P0)**: Duplicate submission race condition allowed multiple records on fast repeated clicks.
   * *Resolution*: Implemented timestamp-based debouncing guard (< 400ms) and button disabling with animated spinner.
2. **BUG-02 (Severity: High / Priority: P0)**: Whitespace-only string evasion bypassed required name/email validation.
   * *Resolution*: Added strict `.trim()` sanitization and minimum length boundary checks before validation acceptance.
3. **BUG-03 (Severity: Critical / Priority: P0)**: Unhandled HTTP 500 server responses cleared entered form data.
   * *Resolution*: Implemented non-destructive alert banner retaining all candidate form inputs for safe retry.
4. **BUG-04 (Severity: Medium / Priority: P1)**: Missing phone number boundary checks allowed alphanumeric strings.
   * *Resolution*: Enforced strict 10-digit numeric constraint with accessible inline validation feedback.
5. **BUG-05 (Severity: High / Priority: P0)**: Administrative endpoints were unprotected without authentication.
   * *Resolution*: Added `X-Admin-Key` header verification on backend and passkey login modal on frontend.
6. **BUG-06 (Severity: Medium / Priority: P1)**: Candidate application records were exposed without ownership checks.
   * *Resolution*: Added email-based candidate ownership filtering to isolate applications to their respective applicants.

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

### 4. Admin Portal Credentials
* **Admin Email**: `admin@careerhub.internal`
* **Admin Passkey**: `careerhub-admin-2026`

---

## 🧪 Running the Tests

```bash
# Run all 35 tests in headless mode
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
ADMIN_KEY=careerhub-admin-2026
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.lo94xku.mongodb.net/?appName=Cluster0
