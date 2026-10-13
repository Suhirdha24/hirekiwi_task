# Comprehensive QA Test Plan: Job Application Portal

## 1. Document Control & Overview
* **Project**: Job Application Portal QA Assessment
* **Role**: QA Engineer
* **Author**: Suhirdha K S
* **Version**: 1.0.0
* **Date**: 2026-10-13
* **Target Passing Score**: 70/100 (Targeting 95+ Excellence)

---

## 2. Objectives & Testing Strategy
The objective of this test plan is to establish a rigorous, risk-driven quality assurance framework for the Job Application Workflow. The workflow enables job seekers to discover openings, inspect job requirements, and submit applications. 

Our strategy follows a hybrid model:
1. **Safe Exploratory Testing**: Conducted on the public portal (NCS) to study layout standards and navigation conventions without mutating production data.
2. **Local Mock Application Verification**: Used for all destructive, negative, boundary, simulated latency, server failure, and submission testing to ensure complete coverage without violating live production safeguards.

---

## 3. Scope of Testing

### 3.1 In-Scope
* **Job Listings**: Accurate rendering of job titles, company/department, salary CTC brackets, experience requirements, tags, and role descriptions.
* **Navigation & Routing**: Deep links, direct role selection, search filtering, and history navigation (Back/Forward).
* **Form Validation**:
  * Missing required fields (Name, Email, Phone, Experience, Resume, Consent).
  * Invalid email formats (missing `@`, missing domain, invalid characters).
  * Whitespace-only input evasion testing.
  * Length boundaries (Name min/max, Phone length, Experience bounds).
  * File upload format restrictions (.pdf, .doc, .docx) and file size boundaries (< 5MB).
* **Submission Behavior**:
  * Positive flow: successful submission confirmation and form reset.
  * Debouncing / Accidental double-click prevention (rapid multiple clicks).
  * Duplicate application detection for the same applicant and role.
* **Resilience & Error Handling**:
  * Simulated high-latency network responses (loading states & timeouts).
  * Simulated HTTP 500 Internal Server Errors (graceful user recovery).
  * Offline / connection drop behavior.
* **Cross-Browser & Usability**:
  * Consistency across modern rendering engines (Chromium, Firefox, WebKit).
  * Accessible keyboard navigation and visible focus rings.

### 3.2 Out-of-Scope (Exclusions)
* Live production database alterations or submitting fake candidate profiles to government/live portals.
* Volumetric distributed denial-of-service (DDoS) load testing.
* Third-party biometric/Aadhaar/OTP integration verification.

---

## 4. Test Environment & Tooling
* **Operating System**: Windows 11
* **Runtime**: Node.js v24.18.1, npm 11.16.0
* **Test Automation Framework**: Playwright Test v1.64.0
* **Local Application Host**: `http://localhost:3000`
* **Test Browsers**: Chromium, Firefox, WebKit (Desktop Chrome emulation)
* **Reporting & Evidence**: Playwright HTML Reporter, Screenshots on Failure, Network Tracing, Video Capture.

---

## 5. Scenario Prioritization & Risk Reasoning

| Priority | Criteria & Description | Reasoning & Impact |
| :--- | :--- | :--- |
| **P0 (Critical)** | Core business flows without which the application is unusable (Application submission, double-click prevention, required field blocks, 500 error recovery). | Direct revenue/candidate impact. If candidates cannot apply or duplicate submissions flood recruiters, the system fails its core purpose. |
| **P1 (High)** | Important validation, search filters, boundary enforcement, and data integrity (Invalid emails, whitespace handling, file format checks, phone bounds). | Prevents corrupted candidate data from entering the ATS / recruitment database. |
| **P2 (Medium)** | Secondary features, UI polish, keyboard accessibility, draft retention, and cosmetic alignments. | Enhances candidate experience and WCAG compliance without blocking fundamental job applications. |

---

## 6. Defect Severity & Evidence Guidelines

When a test case fails, the QA engineer must log a structured defect with the following evidence:
1. **Severity Classification**:
   * **Critical (S1)**: System crash, unable to apply, data corruption, uncaught 500 error with white screen.
   * **Major (S2)**: Form allows invalid/whitespace data, duplicate submissions accepted, broken navigation.
   * **Minor (S3)**: Validation message grammar, UI styling misalignment, missing placeholder.
   * **Trivial (S4)**: Minor cosmetic discrepancies not affecting usability.
2. **Mandatory Evidence Deliverables**:
   * **Reproduction Steps**: Step-by-step numbered instructions with exact input test data.
   * **Expected vs. Actual Results**: Clear description of what the specification dictates vs. what occurred.
   * **Visual Evidence**: Full-page or element-focused screenshot (`.png`) captured at moment of failure.
   * **Console & Network Logs**: Browser DevTools console errors and HTTP response status code / payload.
   * **Playwright Trace Archive**: `trace.zip` containing DOM snapshot and network timeline.

---

## 7. Entry and Exit Criteria
* **Entry Criteria**: Test environment operational at `http://localhost:3000`, test plan signed off, Playwright dependencies installed.
* **Exit Criteria**: 100% of P0 and P1 test cases executed; 0 open Critical (S1) or Major (S2) defects; at least 5 high-priority automated test cases passing in Playwright; test execution results documented in README.
