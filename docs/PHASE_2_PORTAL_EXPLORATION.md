# Phase 2: Reference Portal Exploration & Defect Log

## 1. Exploration Metadata
* **Portal Name**: External Reference Career Portal (Benchmark)
* **Target URL**: `[External Reference Portal - Sanitized]`
* **Inspection Date**: 2026-10-13
* **Environment / Engine**: Chromium (Chrome 156.0.8078.4 / Playwright Engine v1.64.0 / HTTP DOM Inspector)
* **Auditor Role**: QA Engineer Assessment

---

## 2. Portal Inspection & Structural Analysis

### 2.1 Job Listings & Information Architecture
* **Frontend Framework**: Angular Single Page Application (SPA) with Bootstrap 5.0.2 styling.
* **Component Structure**:
  * Top accessibility toolbar (`.main-access-header-div`)
  * Navigation header (`.main-ncs-header-div`)
  * Jobseeker categories menu (`.joobseeker-dropdown`)
  * Dynamic job search bar (`.header-search-btn`)
  * Mobile responsive drawer (`.mobi-header`, `.sidebar-menu`)
* **Job Attributes Evaluated**:
  * **Job Titles**: Rendered dynamically via Angular client templates.
  * **Salaries**: Formatted as monthly/annual wage brackets or "As per company standards".
  * **Experience Requirements**: Split into minimum/maximum years range.
  * **Descriptions & Qualifications**: Loaded via modal overlay or dedicated role route.

### 2.2 Navigation, Search, and Filters
* **Search Inputs**: Keyword search, Sector dropdown, Location/State selector.
* **Navigation Behavior**: Deep linking is managed via Angular hash/push-state routing. Refreshing certain dynamic child routes triggers redirect to portal root without state preservation.
* **Back Navigation**: Browser back button intermittently drops active filter states due to lack of synchronized URL query parameters for dynamic pagination filters.

---

## 3. Observed Defects & Observations on Real Portal

| Defect ID | Component / Area | Observation & Defect Details | Severity |
| :--- | :--- | :--- | :--- |
| **OBS-01** | Header CSS / Codebase | Typo in stylesheet class name: `.joobseeker-dropdown` instead of `.jobseeker-dropdown` found in core navigation styles. | Low (Cosmetic/Code Quality) |
| **OBS-02** | Accessibility (a11y) | Navigation search buttons and icon buttons lack explicit `aria-label` or descriptive text, failing WCAG 2.1 AA accessibility checks. | Medium |
| **OBS-03** | State Persistence | Applying filters and navigating back from role details clears filter selection, forcing users to re-filter. | Medium |
| **OBS-04** | Live Application Form | Live submission forms require Aadhaar/PAN identity verification and OTP on production backend. Non-destructive exploratory testing only. | Operational Constraint |

---

## 4. Scenario Applicability Matrix (Real Portal vs. Mock App)

| Scenario / Test Scope | Real Portal Status | Reason & Action Taken |
| :--- | :--- | :--- |
| Browse Job Listings & Metadata | **Completed (Explored)** | Verified layout, titles, salary brackets, and qualifications. |
| Navigation & Link Routing | **Completed (Explored)** | Verified navigation headers, dropdown triggers, and back navigation. |
| Search & Category Filtering | **Completed (Explored)** | Observed sector/location filter mechanisms. |
| Form Validation: Missing Required Fields | **Blocked / N/A on Live** | Cannot submit invalid forms to live government database. Delegated to Local Mock App. |
| Form Validation: Invalid Email / Regex | **Blocked / N/A on Live** | Unsafe to test on production portal. Delegated to Local Mock App. |
| Form Validation: Whitespace-only Inputs | **Blocked / N/A on Live** | Unsafe to test on production portal. Delegated to Local Mock App. |
| Submission: Prevent Accidental Double-Click | **Blocked / N/A on Live** | Would generate duplicate application requests on live portal. Delegated to Local Mock App. |
| Submission: Duplicate Candidate Email | **Blocked / N/A on Live** | Cannot create mock candidate entries on live portal. Delegated to Local Mock App. |
| Resilience: Network Latency / Lag | **Blocked / N/A on Live** | Cannot throttle production government APIs. Delegated to Local Mock App. |
| Resilience: HTTP 500 Server Error Handling | **Blocked / N/A on Live** | Cannot induce server faults on live infrastructure. Delegated to Local Mock App. |

---

## 5. Conclusion & Transition to Local Mock Application
Following the assessment testing rules:
> *"Use the publicly accessible hiring portal for safe, non-destructive exploratory testing, or create a small local mock application for scenarios that require submitting test data. Do not submit fake applications to the live portal, alter production data, or run load tests."*

The exploration phase successfully confirmed the functional and structural requirements for a modern job portal. All submission, boundary, validation, and error scenarios are transferred to our local mock application suite for comprehensive automated and manual verification.
