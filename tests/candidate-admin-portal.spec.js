// @ts-check
const { test, expect } = require('@playwright/test');
const { JobPortalPage } = require('./pages/JobPortalPage');

test.describe('CareerHub — Candidate Self-Service & Recruiter Admin Portal', () => {
  let portal;

  test.beforeEach(async ({ page }) => {
    portal = new JobPortalPage(page);
    await portal.resetData();
    await portal.goto();
  });

  test('Scenario 1: Multi-attribute job filtering by location and employment type works in tandem', async ({ page }) => {
    // 1. Initial job count should be 4
    await expect(portal.jobCards).toHaveCount(4);

    // 2. Filter by Location: Remote
    await portal.filterLocation.selectOption('Remote');
    await expect(portal.jobCards).toHaveCount(1);
    await expect(page.locator('#job-card-JOB-102')).toBeVisible();
    await expect(portal.jobsResultsCount).toContainText('Showing 1 of 4 open positions');

    // 3. Filter by Bangalore
    await portal.filterLocation.selectOption('Bangalore');
    await expect(portal.jobCards).toHaveCount(1);
    await expect(page.locator('#job-card-JOB-101')).toBeVisible();

    // 4. Combine Bangalore + Full-time
    await portal.filterType.selectOption('Full-time');
    await expect(portal.jobCards).toHaveCount(1);

    // 5. Clear all filters via header button
    await page.locator('#btn-clear-filters-header').click();
    await expect(portal.jobCards).toHaveCount(4);
    await expect(portal.filterLocation).toHaveValue('ALL');
    await expect(portal.filterType).toHaveValue('ALL');
  });

  test('Scenario 2: Direct "Apply Now" button on job card opens application modal with target job', async ({ page }) => {
    const directApplyBtn = page.locator('#btn-apply-card-JOB-103');
    await expect(directApplyBtn).toBeVisible();
    await directApplyBtn.click();

    // Application modal should open immediately
    await expect(portal.applicationModal).toBeVisible();
    await expect(portal.applyRoleSummary).toContainText('Frontend Developer (React)');
    await expect(portal.applicantJobId).toHaveValue('JOB-103');

    // Close application modal
    await portal.btnCancelApplication.click();
    await expect(portal.applicationModal).toBeHidden();
  });

  test('Scenario 3: Candidate Self-Service Dashboard isolates application records by candidate email', async ({ page }) => {
    // 1. Submit an application as Sarah Connor
    await portal.openApplicationForJob('JOB-101');
    await portal.fillApplicationForm({
      name: 'Sarah Connor',
      email: 'sarah.connor@resistance.net',
      phone: '9876543210',
      experience: '5',
      resumeFileName: 'sample_resume.pdf'
    });
    await portal.submitForm();
    await expect(portal.successModal).toBeVisible();
    const appTicket = (await portal.successAppId.textContent()).trim();
    expect(appTicket).toMatch(/^APP-\d+$/);
    await portal.btnCloseSuccess.click();

    // 2. Open Candidate Portal via navigation
    await portal.navLinkCandidate.click();
    await expect(portal.candidateModal).toBeVisible();

    // 3. Look up Sarah's applications
    await portal.candidateEmailInput.fill('sarah.connor@resistance.net');
    await portal.btnLookupCandidate.click();

    // Verify candidate sees their own application
    await expect(portal.candidateResultsContainer).toBeVisible();
    await expect(portal.candidateAppsCount).toHaveText('1 Application');
    await expect(portal.candidateAppsList).toContainText('QA Automation Engineer');
    await expect(portal.candidateAppsList).toContainText(appTicket.trim());
    await expect(portal.candidateAppsList.locator('.badge-status-new')).toHaveText('New');

    // 4. Verify candidate isolation: another email cannot see Sarah's application
    await portal.candidateEmailInput.fill('stranger@example.com');
    await portal.btnLookupCandidate.click();
    await expect(portal.candidateResultsContainer).toBeHidden();
    await expect(portal.candidateEmptyState).toBeVisible();
    await expect(portal.candidateEmptyState).toContainText('No applications found');

    await portal.btnCloseCandidate.click();
    await expect(portal.candidateModal).toBeHidden();
  });

  test('Scenario 4: Recruiter Admin Portal enforces authentication and rejects unauthorized access', async ({ page, request }) => {
    // 1. Direct API security test: unauthorized GET /api/admin/overview must return 401
    const unauthApiRes = await request.get('/api/admin/overview');
    expect(unauthApiRes.status()).toBe(401);
    const unauthBody = await unauthApiRes.json();
    expect(unauthBody.error).toContain('Unauthorized');

    // 2. Open Admin Portal in UI
    await portal.navLinkAdmin.click();
    await expect(portal.adminModal).toBeVisible();
    await expect(portal.adminLoginView).toBeVisible();
    await expect(portal.adminDashboardView).toBeHidden();

    // 3. Attempt login with wrong passkey
    await portal.adminPasskey.fill('incorrect-password-xyz');
    await portal.btnAdminLogin.click();
    await expect(portal.adminLoginError).toBeVisible();
    await expect(portal.adminLoginError).toContainText('Invalid administrative passkey');
    await expect(portal.adminDashboardView).toBeHidden();

    // 4. Submit valid admin key
    await portal.adminPasskey.fill('careerhub-admin-2026');
    await portal.btnAdminLogin.click();

    // Dashboard view should activate
    await expect(portal.adminLoginView).toBeHidden();
    await expect(portal.adminDashboardView).toBeVisible();
    await expect(page.locator('#admin-auth-badge')).toHaveText('Admin Authenticated');

    // Sign out
    await portal.btnAdminLogout.click();
    await expect(portal.adminLoginView).toBeVisible();
    await expect(portal.adminDashboardView).toBeHidden();

    await portal.btnCloseAdmin.click();
    await expect(portal.adminModal).toBeHidden();
  });

  test('Scenario 5: Admin metrics overview accurately aggregates live application stage counts', async ({ page }) => {
    // 1. Submit two distinct applications
    await portal.openApplicationForJob('JOB-101');
    await portal.fillApplicationForm({
      name: 'Alice Walker',
      email: 'alice.walker@example.com',
      phone: '9876543211',
      experience: '3'
    });
    await portal.submitForm();
    await expect(portal.successModal).toBeVisible();
    await portal.btnCloseSuccess.click();

    await portal.openApplicationForJob('JOB-102');
    await portal.fillApplicationForm({
      name: 'Bob Ross',
      email: 'bob.ross@example.com',
      phone: '9876543212',
      experience: '6'
    });
    await portal.submitForm();
    await expect(portal.successModal).toBeVisible();
    await portal.btnCloseSuccess.click();

    // 2. Open Admin Portal and authenticate
    await portal.navLinkAdmin.click();
    await portal.adminPasskey.fill('careerhub-admin-2026');
    await portal.btnAdminLogin.click();

    // 3. Verify overview metrics
    await expect(portal.adminMetricTotal).toHaveText('2');
    await expect(portal.adminMetricNew).toHaveText('2');
    await expect(portal.adminMetricReview).toHaveText('0');
    await expect(portal.adminMetricShortlist).toHaveText('0');
    await expect(portal.adminMetricRejected).toHaveText('0');

    // Verify applications rendered in admin table
    await expect(portal.adminTableBody.locator('tr')).toHaveCount(2);
    await expect(portal.adminTableBody).toContainText('Alice Walker');
    await expect(portal.adminTableBody).toContainText('Bob Ross');

    await portal.btnCloseAdmin.click();
  });

  test('Scenario 6: Admin updates hiring stage to Shortlisted with live synchronization to Candidate Portal', async ({ page }) => {
    // 1. Candidate submits application
    await portal.openApplicationForJob('JOB-104');
    await portal.fillApplicationForm({
      name: 'David Miller',
      email: 'david.miller@example.com',
      phone: '9876543213',
      experience: '4'
    });
    await portal.submitForm();
    await expect(portal.successModal).toBeVisible();
    const appTicket = (await portal.successAppId.textContent()).trim();
    await portal.btnCloseSuccess.click();

    // 2. Admin logs in and updates stage
    await portal.navLinkAdmin.click();
    await portal.adminPasskey.fill('careerhub-admin-2026');
    await portal.btnAdminLogin.click();
    await expect(portal.adminDashboardView).toBeVisible();

    // Find David's row and update stage to 'Shortlisted'
    const statusSelect = portal.adminTableBody.locator(`select[data-app-id="${appTicket}"]`);
    await expect(statusSelect).toBeVisible();
    await statusSelect.selectOption('Shortlisted');

    // Verify badge in admin table updates
    const adminBadge = portal.adminTableBody.locator(`#badge-${appTicket}`);
    await expect(adminBadge).toHaveText('Shortlisted');
    await expect(adminBadge).toHaveClass(/badge-status-shortlisted/);

    // Verify metrics updated
    await expect(portal.adminMetricShortlist).toHaveText('1');
    await expect(portal.adminMetricNew).toHaveText('0');

    await portal.btnCloseAdmin.click();

    // 3. Candidate verifies status sync in Candidate Self-Service Dashboard
    await portal.navLinkCandidate.click();
    await portal.candidateEmailInput.fill('david.miller@example.com');
    await portal.btnLookupCandidate.click();

    await expect(portal.candidateResultsContainer).toBeVisible();
    const candidateStatusBadge = portal.candidateAppsList.locator('.badge-status');
    await expect(candidateStatusBadge).toHaveText('Shortlisted');
    await expect(candidateStatusBadge).toHaveClass(/badge-status-shortlisted/);

    await portal.btnCloseCandidate.click();
  });

  test('Scenario 7: Responsive adaptation across mobile (375x667) and tablet (768x1024) viewports', async ({ page }) => {
    // 1. Test Tablet Viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(portal.navBrandLogo).toBeVisible();
    await expect(portal.jobsGrid).toBeVisible();

    // Open candidate modal on tablet
    await portal.navLinkCandidate.click();
    await expect(portal.candidateModal).toBeVisible();
    const tabletModalBox = await portal.candidateModal.locator('.modal-card').boundingBox();
    expect(tabletModalBox.width).toBeLessThanOrEqual(768);
    await portal.btnCloseCandidate.click();

    // 2. Test Mobile Viewport (iPhone SE style)
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(portal.navBrandLogo).toBeVisible();

    // Verify no horizontal document overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // 1px rounding margin

    // Open Admin modal on mobile
    await portal.navLinkAdmin.click();
    await expect(portal.adminModal).toBeVisible();
    const mobileAdminBox = await portal.adminModal.locator('.modal-card').boundingBox();
    expect(mobileAdminBox.width).toBeLessThanOrEqual(375);

    await portal.btnCloseAdmin.click();
    await expect(portal.adminModal).toBeHidden();
  });
});
