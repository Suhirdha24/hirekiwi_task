// @ts-check
const { test, expect } = require('@playwright/test');
const { JobPortalPage } = require('./pages/JobPortalPage');
const path = require('path');

test.describe('Option B — Application Form Validation & Submission Workflow', () => {
  let portal;

  test.beforeEach(async ({ page }) => {
    portal = new JobPortalPage(page);
    await portal.goto();
    await portal.resetData();
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 1: Valid Application Submission
  // ---------------------------------------------------------------------------
  test('Scenario 1: Valid application produces clear success message and tracking ID', async ({ page }) => {
    await portal.openApplicationForJob('JOB-101');
    await expect(portal.applicationModal).toBeVisible();

    await portal.fillApplicationForm({
      name: 'Jessica Pearson',
      email: 'jessica.pearson@example.com',
      phone: '9876543210',
      experience: 5,
      resumeFileName: 'sample_resume.pdf',
      coverLetter: 'Extensive background in enterprise QA automation architecture.',
      consent: true
    });

    await portal.submitForm();

    // Verify success modal and tracking ID
    await expect(portal.successModal).toBeVisible({ timeout: 5000 });
    await expect(portal.successAppId).toHaveText(/^APP-\d+$/);

    // Close success modal
    await portal.btnCloseSuccess.click();
    await expect(portal.successModal).toBeHidden();
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 2: Empty Required Fields Rejected
  // ---------------------------------------------------------------------------
  test('Scenario 2: Empty required fields display inline field errors and block submission', async ({ page }) => {
    await portal.openApplicationForJob('JOB-101');

    // Submit empty form
    await portal.submitForm();

    // Verify error labels for all required inputs
    await expect(portal.errorName).toBeVisible();
    await expect(portal.errorName).toHaveText('Full name cannot be empty or only spaces.');

    await expect(portal.errorEmail).toBeVisible();
    await expect(portal.errorEmail).toHaveText('Email address is required.');

    await expect(portal.errorPhone).toBeVisible();
    await expect(portal.errorPhone).toHaveText('Phone number is required.');

    await expect(portal.errorResume).toBeVisible();
    await expect(portal.errorResume).toHaveText('Please attach your resume document.');

    await expect(portal.errorConsent).toBeVisible();
    await expect(portal.errorConsent).toHaveText('You must agree to the data processing terms.');

    // Verify form was not submitted
    const res = await page.request.get('/api/submissions');
    const data = await res.json();
    expect(data.submissions.length).toBe(0);
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 3: Invalid Email Format Rejected
  // ---------------------------------------------------------------------------
  test('Scenario 3: Invalid email formats are rejected with accessible feedback', async ({ page }) => {
    await portal.openApplicationForJob('JOB-101');
    await portal.applicantName.fill('Harvey Specter');

    const invalidEmails = ['plainaddress', 'harvey@', '@pearson.com', 'harvey@specter'];
    for (const invalidEmail of invalidEmails) {
      await portal.applicantEmail.fill(invalidEmail);
      await portal.submitForm();
      await expect(portal.errorEmail).toBeVisible();
      await expect(portal.errorEmail).toHaveText('Please provide a valid email address (e.g., name@domain.com).');
    }

    // Enter valid email and verify error clears
    await portal.applicantEmail.fill('harvey.specter@firm.com');
    await expect(portal.errorEmail).toBeHidden();
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 4: Whitespace-Only Input Rejected & Spaces Trimmed
  // ---------------------------------------------------------------------------
  test('Scenario 4: Whitespace-only input is rejected while leading and trailing spaces are trimmed', async ({ page }) => {
    await portal.openApplicationForJob('JOB-101');

    // Whitespace-only name
    await portal.applicantName.fill('     ');
    await portal.submitForm();
    await expect(portal.errorName).toHaveText('Full name cannot be empty or only spaces.');

    // Fill valid data with leading and trailing spaces
    await portal.fillApplicationForm({
      name: '   Donna Paulsen   ',
      email: '   donna@firm.com   ',
      phone: '  9876543210  ',
      experience: 3,
      resumeFileName: 'sample_resume.pdf',
      consent: true
    });

    await portal.submitForm();
    await expect(portal.successModal).toBeVisible({ timeout: 5000 });
    await portal.btnCloseSuccess.click();

    // Verify backend stored properly trimmed values
    const res = await page.request.get('/api/submissions');
    const data = await res.json();
    const sub = data.submissions.find(s => s.email === 'donna@firm.com');
    expect(sub).toBeDefined();
    expect(sub?.fullName).toBe('Donna Paulsen');
    expect(sub?.phone).toBe('9876543210');
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 5: Input Length & Boundary Validation
  // ---------------------------------------------------------------------------
  test('Scenario 5: Min/max length boundaries and format constraints are enforced', async ({ page }) => {
    await portal.openApplicationForJob('JOB-102');

    // 1. Name < 2 characters
    await portal.applicantName.fill('X');
    await portal.submitForm();
    await expect(portal.errorName).toHaveText('Full name must be at least 2 characters.');

    // 2. Phone not 10 digits
    await portal.applicantName.fill('Louis Litt');
    await portal.applicantEmail.fill('louis.litt@firm.com');
    await portal.applicantPhone.fill('12345');
    await portal.submitForm();
    await expect(portal.errorPhone).toHaveText('Phone number must be exactly 10 numeric digits.');

    await portal.applicantPhone.fill('12345678901'); // 11 digits
    await portal.submitForm();
    await expect(portal.errorPhone).toHaveText('Phone number must be exactly 10 numeric digits.');

    // 3. Negative Experience
    await portal.applicantPhone.fill('9876543210');
    await portal.applicantExperience.fill('-5');
    await portal.submitForm();
    await expect(portal.errorExperience).toHaveText('Experience cannot be negative.');

    // 4. Experience > 40
    await portal.applicantExperience.fill('50');
    await portal.submitForm();
    await expect(portal.errorExperience).toHaveText('Experience must be between 0 and 40 years.');

    // 5. Unsupported resume file format (.txt)
    await portal.applicantExperience.fill('4');
    const invalidFilePath = path.join(__dirname, 'fixtures', 'invalid_file.txt');
    await portal.applicantResume.setInputFiles(invalidFilePath);
    await portal.submitForm();
    await expect(portal.errorResume).toHaveText('Only .pdf, .doc, and .docx formats are permitted.');
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 6: Duplicate Submission Prevention
  // ---------------------------------------------------------------------------
  test('Scenario 6: Prevents duplicate application submission with identical email for the same job', async ({ page }) => {
    // First valid submission
    await portal.openApplicationForJob('JOB-103');
    await portal.fillApplicationForm({
      name: 'Rachel Zane',
      email: 'rachel.zane@firm.com',
      phone: '9988776655',
      experience: 2,
      resumeFileName: 'sample_resume.pdf',
      consent: true
    });
    await portal.submitForm();
    await expect(portal.successModal).toBeVisible();
    await portal.btnCloseSuccess.click();

    // Second submission with identical email for same job
    await portal.openApplicationForJob('JOB-103');
    await portal.fillApplicationForm({
      name: 'Rachel Zane',
      email: 'rachel.zane@firm.com',
      phone: '9988776655',
      experience: 2,
      resumeFileName: 'sample_resume.pdf',
      consent: true
    });
    await portal.submitForm();

    // Verify Duplicate Warning Modal is displayed
    await expect(portal.duplicateModal).toBeVisible({ timeout: 5000 });
    await expect(portal.duplicateMessage).toContainText('Duplicate application detected');
    await portal.btnCloseDuplicate.click();
    await expect(portal.duplicateModal).toBeHidden();

    // Verify backend database contains only 1 record for this email
    const res = await page.request.get('/api/submissions');
    const data = await res.json();
    const count = data.submissions.filter(s => s.email === 'rachel.zane@firm.com').length;
    expect(count).toBe(1);
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 7: Repeated Clicks on Submit Button (Debouncing)
  // ---------------------------------------------------------------------------
  test('Scenario 7: Protects submit button against rapid repeated clicks via debouncing guard', async ({ page }) => {
    await portal.openApplicationForJob('JOB-101');
    await portal.fillApplicationForm({
      name: 'Mike Ross',
      email: 'mike.ross@firm.com',
      phone: '9123456780',
      experience: 2,
      resumeFileName: 'sample_resume.pdf',
      consent: true
    });

    // Simulate multi-click race condition within single event tick
    await page.evaluate(() => {
      const btn = document.getElementById('btn-submit-application');
      if (btn) {
        btn.click();
        btn.click();
        btn.click();
      }
    });

    await expect(portal.successModal).toBeVisible({ timeout: 5000 });
    await portal.btnCloseSuccess.click();

    // Assert only 1 application record created
    const res = await page.request.get('/api/submissions');
    const data = await res.json();
    const records = data.submissions.filter(s => s.email === 'mike.ross@firm.com');
    expect(records.length).toBe(1);
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 8: Network Delay & Active Loading State
  // ---------------------------------------------------------------------------
  test('Scenario 8: Network delay triggers observable loading indicator and disables submit button', async ({ page }) => {
    await portal.enableSimDelay();
    await expect(portal.qaStatusPill).toContainText('3s Delay Active');

    await portal.openApplicationForJob('JOB-104');
    await portal.fillApplicationForm({
      name: 'Katrina Bennett',
      email: 'katrina@firm.com',
      phone: '9871112233',
      experience: 4,
      resumeFileName: 'sample_resume.pdf',
      consent: true
    });

    await portal.submitForm();

    // Verify active loading state during delay
    await expect(portal.btnSubmitApplication).toBeDisabled();
    await expect(portal.submitSpinner).toBeVisible();
    await expect(portal.btnSubmitApplication.locator('.btn-text')).toHaveText('Submitting Application...');

    // Wait for resolution
    await expect(portal.successModal).toBeVisible({ timeout: 7000 });
    await portal.btnCloseSuccess.click();
    await portal.disableSimDelay();
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 9: HTTP 500 Server Error Handling
  // ---------------------------------------------------------------------------
  test('Scenario 9: HTTP 500 error displays graceful alert banner without crashing', async ({ page }) => {
    await portal.enableSim500();
    await expect(portal.qaStatusPill).toContainText('500 Error Simulated');

    await portal.openApplicationForJob('JOB-101');
    await portal.fillApplicationForm({
      name: 'Harold Gunderson',
      email: 'harold@firm.com',
      phone: '9876500000',
      experience: 1,
      resumeFileName: 'sample_resume.pdf',
      consent: true
    });

    await portal.submitForm();

    // Verify error banner displays server failure message
    await expect(portal.formErrorBanner).toBeVisible();
    await expect(portal.formErrorMessage).toContainText('Internal Server Error: Simulated database connection failure.');

    await portal.disableSim500();
    await portal.btnCancelApplication.click();
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 10: Offline Error Handling & Recovery
  // ---------------------------------------------------------------------------
  test('Scenario 10: Simulated offline state produces network error and allows recovery upon reconnection', async ({ page }) => {
    await portal.enableSimOffline();
    await expect(portal.qaStatusPill).toContainText('Offline Simulated');

    await portal.openApplicationForJob('JOB-102');
    await portal.fillApplicationForm({
      name: 'Samantha Wheeler',
      email: 'samantha.wheeler@firm.com',
      phone: '9876540987',
      experience: 6,
      resumeFileName: 'sample_resume.pdf',
      coverLetter: 'Prepared for trial and automated test executions.',
      consent: true
    });

    // Attempt submit while offline
    await portal.submitForm();

    // Verify Network Connection Error banner
    await expect(portal.formErrorBanner).toBeVisible();
    await expect(portal.formErrorMessage).toContainText('Unable to reach the server');

    // Verify inputs preserved
    await expect(portal.applicantName).toHaveValue('Samantha Wheeler');
    await expect(portal.applicantCoverLetter).toHaveValue('Prepared for trial and automated test executions.');

    // Recover: disable simulated offline state and click Retry
    await portal.disableSimOffline();
    await portal.btnRetrySubmit.click();

    // Successful submission after recovery
    await expect(portal.successModal).toBeVisible({ timeout: 5000 });
    await portal.btnCloseSuccess.click();
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 11: Submission History Registry Updates Consistently
  // ---------------------------------------------------------------------------
  test('Scenario 11: Successful submission updates audit table with ID, candidate, and status badge', async ({ page }) => {
    await portal.openApplicationForJob('JOB-103');
    await portal.fillApplicationForm({
      name: 'Alex Williams',
      email: 'alex.williams@firm.com',
      phone: '9887766554',
      experience: 3,
      resumeFileName: 'sample_resume.pdf',
      consent: true
    });

    await portal.submitForm();
    await expect(portal.successModal).toBeVisible();
    const trackingId = await portal.successAppId.textContent();
    await portal.btnCloseSuccess.click();

    // Verify registry table row
    const row = portal.submissionsTableBody.locator('tr').first();
    await expect(row).toContainText(trackingId || '');
    await expect(row).toContainText('Alex Williams');
    await expect(row).toContainText('alex.williams@firm.com');
    await expect(row).toContainText('3 yrs');
    await expect(row.locator('.status-badge')).toBeVisible();

    // Verify badge count increment
    await expect(portal.submissionsBadgeCount).toHaveText('1');
  });

  // ---------------------------------------------------------------------------
  // SCENARIO 12: Form Value Preservation After Recoverable Failure
  // ---------------------------------------------------------------------------
  test('Scenario 12: Preserves all entered form values after recoverable HTTP 500 failure', async ({ page }) => {
    await portal.enableSim500();

    await portal.openApplicationForJob('JOB-101');
    const candidateData = {
      name: 'Dana Scott',
      email: 'dana.scott@firm.com',
      phone: '9123456789',
      experience: 4,
      resumeFileName: 'sample_resume.pdf',
      coverLetter: 'Comprehensive notes that must not be lost upon network failure.',
      consent: true
    };

    await portal.fillApplicationForm(candidateData);
    await portal.submitForm();

    // Verify server error banner
    await expect(portal.formErrorBanner).toBeVisible();

    // Verify every single field remains intact
    await expect(portal.applicantName).toHaveValue(candidateData.name);
    await expect(portal.applicantEmail).toHaveValue(candidateData.email);
    await expect(portal.applicantPhone).toHaveValue(candidateData.phone);
    await expect(portal.applicantExperience).toHaveValue(String(candidateData.experience));
    await expect(portal.applicantCoverLetter).toHaveValue(candidateData.coverLetter);
    await expect(portal.applicantConsent).toBeChecked();

    // Fix server condition and retry submission
    await portal.disableSim500();
    await portal.btnRetrySubmit.click();

    // Submits successfully with preserved data
    await expect(portal.successModal).toBeVisible({ timeout: 5000 });
    await portal.btnCloseSuccess.click();

    // Verify backend record matches preserved values
    const res = await page.request.get('/api/submissions');
    const data = await res.json();
    const saved = data.submissions.find(s => s.email === candidateData.email);
    expect(saved?.coverLetter).toBe(candidateData.coverLetter);
  });
});
