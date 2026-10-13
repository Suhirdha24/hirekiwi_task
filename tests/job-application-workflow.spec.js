// @ts-check
const { test, expect } = require('@playwright/test');
const { JobPortalPage } = require('./pages/JobPortalPage');

test.describe('Job Application Workflow - QA Assessment Test Suite', () => {
  test.describe.configure({ mode: 'serial' });
  let portal;

  test.beforeEach(async ({ page }) => {
    portal = new JobPortalPage(page);
    await portal.goto();
    await portal.resetData();
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 1: Job Listings Display & Detail Navigation (TC-01, TC-02, TC-03)
  // ---------------------------------------------------------------------------
  test('TC-01/02/03: Verify job listings display correct metadata, search filtering, and navigation to role details', async ({ page }) => {
    // 1. Verify Job Cards Rendering
    await expect(portal.jobCards).toHaveCount(4);
    
    const firstCard = portal.jobCards.first();
    await expect(firstCard.locator('.job-card-title')).toContainText('QA Automation Engineer');
    await expect(firstCard.locator('.meta-chip.salary')).toContainText('₹6.5 - ₹8.5 LPA');
    await expect(firstCard.locator('.meta-chip').nth(1)).toContainText('1 - 3 yrs');
    await expect(firstCard.locator('.skill-tag').first()).toContainText('Playwright');

    // 2. Verify Search Filtering
    await portal.searchInput.fill('DevOps');
    await expect(portal.jobCards).toHaveCount(1);
    await expect(portal.jobCards.first().locator('.job-card-title')).toHaveText('DevOps & Cloud Engineer');

    // Clear search
    await portal.searchInput.fill('');
    await expect(portal.jobCards).toHaveCount(4);

    // Filter by Department
    await portal.filterDepartment.selectOption('Quality Assurance');
    await expect(portal.jobCards).toHaveCount(2);

    // Reset Filter
    await portal.filterDepartment.selectOption('ALL');
    await expect(portal.jobCards).toHaveCount(4);

    // 3. Navigation to Role Details Modal
    await portal.openJobDetails('JOB-101');
    await expect(portal.jobDetailsModal).toBeVisible();
    await expect(portal.modalJobTitle).toHaveText('QA Automation Engineer');
    await expect(portal.modalJobSalary).toHaveText('₹6.5 - ₹8.5 LPA');
    await expect(portal.modalJobExperience).toHaveText('1 - 3 yrs');
    await expect(portal.btnOpenApply).toBeVisible();

    // Close Details Modal
    await portal.btnCloseDetails.click();
    await expect(portal.jobDetailsModal).toBeHidden();
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 2: Valid Application Submission End-to-End (TC-04)
  // ---------------------------------------------------------------------------
  test('TC-04: Verify successful job application submission flow with ticket generation', async ({ page }) => {
    await portal.openApplicationForJob('JOB-101');
    await expect(portal.applicationModal).toBeVisible();

    // Fill valid application data
    await portal.fillApplicationForm({
      name: 'Sarah Connor',
      email: 'sarah.connor@example.com',
      phone: '9876543210',
      experience: 2,
      resumeFileName: 'sample_resume.pdf',
      coverLetter: 'Passionate about QA automation and reliability testing.',
      consent: true
    });

    // Submit form
    await portal.submitForm();

    // Verify Success Modal & Ticket
    await expect(portal.successModal).toBeVisible({ timeout: 5000 });
    await expect(portal.successAppId).toHaveText(/^APP-\d+$/);

    // Close success modal & verify registry persistence
    await portal.btnCloseSuccess.click();
    await expect(portal.successModal).toBeHidden();

    // Check registry table has the candidate
    await expect(portal.submissionsTableBody).toContainText('Sarah Connor');
    await expect(portal.submissionsTableBody).toContainText('sarah.connor@example.com');
    await expect(portal.submissionsBadgeCount).toHaveText('1');
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 3: Validation - Missing Fields, Invalid Email, Whitespace (TC-05, TC-06, TC-07)
  // ---------------------------------------------------------------------------
  test('TC-05/06/07: Form validation for missing required fields, invalid email format, and whitespace evasion', async ({ page }) => {
    await portal.openApplicationForJob('JOB-102');

    // 1. Submit Completely Blank Form -> Expect Required Errors
    await portal.submitForm();
    await expect(portal.errorName).toBeVisible();
    await expect(portal.errorName).toHaveText('Full name cannot be empty or only spaces.');
    await expect(portal.errorEmail).toBeVisible();
    await expect(portal.errorEmail).toHaveText('Email address is required.');
    await expect(portal.errorPhone).toBeVisible();
    await expect(portal.errorPhone).toHaveText('Phone number is required.');
    await expect(portal.errorConsent).toBeVisible();

    // 2. Whitespace-Only Name
    await portal.applicantName.fill('     ');
    await portal.submitForm();
    await expect(portal.errorName).toHaveText('Full name cannot be empty or only spaces.');

    // 3. Short Name Boundary (< 2 chars)
    await portal.applicantName.fill('A');
    await portal.submitForm();
    await expect(portal.errorName).toHaveText('Full name must be at least 2 characters.');

    // Valid Name
    await portal.applicantName.fill('John Doe');

    // 4. Invalid Email Format (missing domain)
    await portal.applicantEmail.fill('johndoe@');
    await portal.submitForm();
    await expect(portal.errorEmail).toHaveText('Please provide a valid email address (e.g., name@domain.com).');

    await portal.applicantEmail.fill('johndoe.com');
    await portal.submitForm();
    await expect(portal.errorEmail).toHaveText('Please provide a valid email address (e.g., name@domain.com).');

    // 5. Invalid Phone Format (less than 10 digits)
    await portal.applicantEmail.fill('john.doe@example.com');
    await portal.applicantPhone.fill('12345');
    await portal.submitForm();
    await expect(portal.errorPhone).toHaveText('Phone number must be exactly 10 numeric digits.');
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 4: Concurrency & Accidental Rapid Repeat Submissions (TC-13)
  // ---------------------------------------------------------------------------
  test('TC-13: Verify accidental double-click / rapid submission prevention via button debouncing', async ({ page }) => {
    await portal.openApplicationForJob('JOB-101');

    await portal.fillApplicationForm({
      name: 'Rapid Clicker',
      email: 'rapid.clicker@example.com',
      phone: '9888888888',
      experience: 3,
      resumeFileName: 'sample_resume.pdf',
      consent: true
    });

    // Trigger rapid clicks within 50ms using page.evaluate to simulate frantic clicking
    await page.evaluate(() => {
      const btn = document.getElementById('btn-submit-application');
      if (btn) {
        btn.click();
        btn.click();
        btn.click();
      }
    });

    // Success modal appears
    await expect(portal.successModal).toBeVisible({ timeout: 5000 });
    await portal.btnCloseSuccess.click();

    // Verify exactly 1 submission was registered in the database, NOT duplicate records
    const res = await page.request.get('/api/submissions');
    const data = await res.json();
    const countForEmail = data.submissions.filter(s => s.email === 'rapid.clicker@example.com').length;
    expect(countForEmail).toBe(1);
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 5: Duplicate Candidate Submission Prevention (TC-14)
  // ---------------------------------------------------------------------------
  test('TC-14: Prevent duplicate application submission with identical email for same job', async ({ page }) => {
    // Initial Valid Application
    await portal.openApplicationForJob('JOB-101');
    await portal.fillApplicationForm({
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      phone: '9123456789',
      experience: 1,
      resumeFileName: 'sample_resume.pdf',
      consent: true
    });
    await portal.submitForm();
    await expect(portal.successModal).toBeVisible();
    await portal.btnCloseSuccess.click();

    // Attempt second application with same email for SAME job ID
    await portal.openApplicationForJob('JOB-101');
    await portal.fillApplicationForm({
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      phone: '9123456789',
      experience: 1,
      resumeFileName: 'sample_resume.pdf',
      consent: true
    });
    await portal.submitForm();

    // Verify Duplicate Warning Modal is displayed
    await expect(portal.duplicateModal).toBeVisible({ timeout: 5000 });
    await expect(portal.duplicateMessage).toContainText('Duplicate application detected');
    await portal.btnCloseDuplicate.click();
    await expect(portal.duplicateModal).toBeHidden();
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 6: Controlled Error Handling - Simulated HTTP 500 Server Error (TC-16)
  // ---------------------------------------------------------------------------
  test('TC-16: Controlled error handling under simulated HTTP 500 server error without form data loss', async ({ page }) => {
    // Enable 500 Server Error Simulation via QA Harness toggle
    await portal.enableSim500();
    await expect(portal.qaStatusPill).toContainText('500 Error Simulated');

    await portal.openApplicationForJob('JOB-101');
    await portal.fillApplicationForm({
      name: 'Resilient Tester',
      email: 'resilient@example.com',
      phone: '9999999999',
      experience: 4,
      resumeFileName: 'sample_resume.pdf',
      coverLetter: 'Important cover letter notes that should not be erased.',
      consent: true
    });

    // Submit under simulated 500 error
    await portal.submitForm();

    // Verify Form Error Banner displays gracefully
    await expect(portal.formErrorBanner).toBeVisible();
    await expect(portal.formErrorMessage).toContainText('Internal Server Error: Simulated database connection failure.');

    // Verify form input values are preserved (no data loss)
    await expect(portal.applicantName).toHaveValue('Resilient Tester');
    await expect(portal.applicantEmail).toHaveValue('resilient@example.com');
    await expect(portal.applicantCoverLetter).toHaveValue('Important cover letter notes that should not be erased.');

    // Recover: disable simulated 500 error and click Retry button
    await portal.disableSim500();
    await portal.btnRetrySubmit.click();

    // Verify successful submission upon recovery
    await expect(portal.successModal).toBeVisible({ timeout: 5000 });
    await portal.btnCloseSuccess.click();
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 7: Controlled Resilience - Simulated High Latency Response (TC-15)
  // ---------------------------------------------------------------------------
  test('TC-15: Controlled handling of high-latency network response with active loading indicator', async ({ page }) => {
    // Enable 3s network delay simulation
    await portal.enableSimDelay();
    await expect(portal.qaStatusPill).toContainText('3s Delay Active');

    await portal.openApplicationForJob('JOB-102');
    await portal.fillApplicationForm({
      name: 'Latency Tester',
      email: 'latency@example.com',
      phone: '9871234560',
      experience: 1,
      resumeFileName: 'sample_resume.pdf',
      consent: true
    });

    // Submit form
    await portal.submitForm();

    // Verify Submit button enters disabled state with animated spinner during delay
    await expect(portal.btnSubmitApplication).toBeDisabled();
    await expect(portal.submitSpinner).toBeVisible();
    await expect(portal.btnSubmitApplication.locator('.btn-text')).toHaveText('Submitting Application...');

    // Wait for delayed response to complete
    await expect(portal.successModal).toBeVisible({ timeout: 8000 });
    await portal.btnCloseSuccess.click();

    // Turn off delay toggle
    await portal.disableSimDelay();
  });
});
