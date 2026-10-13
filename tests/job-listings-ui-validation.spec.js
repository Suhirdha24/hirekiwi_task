// @ts-check
const { test, expect } = require('@playwright/test');
const { JobPortalPage } = require('./pages/JobPortalPage');

test.describe('Option A — CareerHub Job Listings UI & Functional Validation', () => {
  let portal;

  test.beforeEach(async ({ page }) => {
    portal = new JobPortalPage(page);
    await portal.goto();
    await portal.resetData();
  });

  // ---------------------------------------------------------------------------
  // Check 1: All four jobs render correctly with required metadata
  // ---------------------------------------------------------------------------
  test('Check 1: All four jobs render with title, department, salary, experience, location, and employment type', async ({ page }) => {
    const jobCards = page.locator('.job-card');
    await expect(jobCards).toHaveCount(4);

    // Verify Demo Data badge in header and results count
    await expect(page.locator('.demo-data-badge')).toContainText('Demo Data');
    await expect(page.locator('#jobs-results-count')).toContainText('Showing all 4 open positions');

    const expectedJobs = [
      {
        id: 'JOB-101',
        title: 'QA Automation Engineer',
        dept: 'Quality Assurance',
        salary: '₹6.5 - ₹8.5 LPA',
        exp: '1 - 3 yrs',
        location: 'Bangalore (Hybrid)',
        type: 'Full-time'
      },
      {
        id: 'JOB-102',
        title: 'Associate QA Engineer',
        dept: 'Quality Assurance',
        salary: '₹4.5 - ₹5.5 LPA',
        exp: '0 - 1 yr (Freshers Welcome)',
        location: 'Remote (India)',
        type: 'Full-time'
      },
      {
        id: 'JOB-103',
        title: 'Frontend Developer (React)',
        dept: 'Engineering',
        salary: '₹8.0 - ₹12.0 LPA',
        exp: '2 - 4 yrs',
        location: 'Hyderabad (On-site)',
        type: 'Full-time'
      },
      {
        id: 'JOB-104',
        title: 'DevOps & Cloud Engineer',
        dept: 'Infrastructure',
        salary: '₹10.0 - ₹15.0 LPA',
        exp: '3 - 5 yrs',
        location: 'Pune (Hybrid)',
        type: 'Full-time'
      }
    ];

    for (const expected of expectedJobs) {
      const card = page.locator(`#job-card-${expected.id}`);
      await expect(card).toBeVisible();
      await expect(card.locator('.job-card-title')).toHaveText(expected.title);
      await expect(card.locator('.job-card-dept')).toHaveText(expected.dept);
      await expect(card.locator('.demo-role-pill')).toHaveText('Demo Role');
      await expect(card.locator('.meta-chip.salary')).toContainText(expected.salary);
      await expect(card.locator('.meta-chip').nth(1)).toContainText(expected.exp);
      await expect(card.locator('.meta-chip').nth(2)).toContainText(expected.location);
      await expect(card.locator('.meta-chip.type')).toContainText(expected.type);
      await expect(card.locator(`#btn-view-${expected.id}`)).toBeVisible();
      await expect(card.locator(`#btn-apply-card-${expected.id}`)).toBeVisible();
    }
  });

  // ---------------------------------------------------------------------------
  // Check 2: Searching for an existing job returns expected result (case & whitespace insensitive)
  // ---------------------------------------------------------------------------
  test('Check 2: Search handles titles, skills, keywords, case-insensitivity, and whitespace trimming', async ({ page }) => {
    // Distinctive title search: 'DevOps & Cloud'
    await portal.searchInput.fill('DevOps & Cloud');
    await expect(page.locator('.job-card')).toHaveCount(1);
    await expect(page.locator('.job-card').first().locator('.job-card-title')).toHaveText('DevOps & Cloud Engineer');

    // Case-insensitive with leading and trailing whitespace: '   frontend developer   '
    await portal.searchInput.fill('   frontend developer   ');
    await expect(page.locator('.job-card')).toHaveCount(1);
    await expect(page.locator('.job-card').first().locator('.job-card-title')).toHaveText('Frontend Developer (React)');

    // Skill tag search: 'Docker'
    await portal.searchInput.fill('Docker');
    await expect(page.locator('.job-card')).toHaveCount(1);
    await expect(page.locator('.job-card').first().locator('.job-card-title')).toHaveText('DevOps & Cloud Engineer');

    // Multi-token keyword search: 'playwright javascript'
    await portal.searchInput.fill('playwright javascript');
    await expect(page.locator('.job-card')).toHaveCount(1);
    await expect(page.locator('.job-card').first().locator('.job-card-title')).toHaveText('QA Automation Engineer');

    // Location keyword search: 'Hyderabad'
    await portal.searchInput.fill('Hyderabad');
    await expect(page.locator('.job-card')).toHaveCount(1);
    await expect(page.locator('.job-card').first().locator('.job-card-title')).toHaveText('Frontend Developer (React)');
  });

  // ---------------------------------------------------------------------------
  // Check 3: Searching for a nonexistent job shows helpful empty state
  // ---------------------------------------------------------------------------
  test('Check 3: Nonexistent search query displays empty state and offers filter reset', async ({ page }) => {
    await portal.searchInput.fill('Quantum Computing AI');
    await expect(page.locator('.job-card')).toHaveCount(0);
    await expect(portal.jobsEmptyState).toBeVisible();
    await expect(page.locator('#empty-state-message')).toContainText('Quantum Computing AI');

    // Reset via empty state button
    await page.locator('#btn-reset-filters').click();
    await expect(page.locator('.job-card')).toHaveCount(4);
    await expect(portal.searchInput).toHaveValue('');
    await expect(portal.jobsEmptyState).toBeHidden();
  });

  // ---------------------------------------------------------------------------
  // Check 4: Department filtering returns correct jobs
  // ---------------------------------------------------------------------------
  test('Check 4: Department filtering displays correct subset and updates count', async ({ page }) => {
    // Quality Assurance
    await portal.filterDepartment.selectOption('Quality Assurance');
    await expect(page.locator('.job-card')).toHaveCount(2);
    await expect(page.locator('#jobs-results-count')).toHaveText('Showing 2 of 4 open positions');

    // Engineering
    await portal.filterDepartment.selectOption('Engineering');
    await expect(page.locator('.job-card')).toHaveCount(1);
    await expect(page.locator('.job-card').first().locator('.job-card-title')).toHaveText('Frontend Developer (React)');
    await expect(page.locator('#jobs-results-count')).toHaveText('Showing 1 of 4 open positions');

    // Infrastructure
    await portal.filterDepartment.selectOption('Infrastructure');
    await expect(page.locator('.job-card')).toHaveCount(1);
    await expect(page.locator('.job-card').first().locator('.job-card-title')).toHaveText('DevOps & Cloud Engineer');
  });

  // ---------------------------------------------------------------------------
  // Check 5: Search and department filters work together
  // ---------------------------------------------------------------------------
  test('Check 5: Combined search and department filters work in tandem', async ({ page }) => {
    await portal.filterDepartment.selectOption('Quality Assurance');
    await portal.searchInput.fill('Manual');

    // Should only match Associate QA Engineer
    await expect(page.locator('.job-card')).toHaveCount(1);
    await expect(page.locator('.job-card').first().locator('.job-card-title')).toHaveText('Associate QA Engineer');

    // Search keyword that exists in another dept but not in QA
    await portal.searchInput.fill('React');
    await expect(page.locator('.job-card')).toHaveCount(0);
    await expect(portal.jobsEmptyState).toBeVisible();
  });

  // ---------------------------------------------------------------------------
  // Check 6: Clearing filters restores the full list
  // ---------------------------------------------------------------------------
  test('Check 6: Clear-filters action restores full listing and hides clear button', async ({ page }) => {
    const btnClearHeader = page.locator('#btn-clear-filters-header');
    await expect(btnClearHeader).toBeHidden();

    // Activate filters
    await portal.filterDepartment.selectOption('Infrastructure');
    await expect(btnClearHeader).toBeVisible();

    // Click header clear button
    await btnClearHeader.click();
    await expect(page.locator('.job-card')).toHaveCount(4);
    await expect(portal.filterDepartment).toHaveValue('ALL');
    await expect(portal.searchInput).toHaveValue('');
    await expect(btnClearHeader).toBeHidden();
  });

  // ---------------------------------------------------------------------------
  // Check 7: Each job opens the correct details modal with full content
  // ---------------------------------------------------------------------------
  test('Check 7: Each job card opens the matching details modal with all required information', async ({ page }) => {
    const jobList = [
      { id: 'JOB-101', title: 'QA Automation Engineer', salary: '₹6.5 - ₹8.5 LPA', exp: '1 - 3 yrs', type: 'Full-time', loc: 'Bangalore (Hybrid)' },
      { id: 'JOB-102', title: 'Associate QA Engineer', salary: '₹4.5 - ₹5.5 LPA', exp: '0 - 1 yr (Freshers Welcome)', type: 'Full-time', loc: 'Remote (India)' },
      { id: 'JOB-103', title: 'Frontend Developer (React)', salary: '₹8.0 - ₹12.0 LPA', exp: '2 - 4 yrs', type: 'Full-time', loc: 'Hyderabad (On-site)' },
      { id: 'JOB-104', title: 'DevOps & Cloud Engineer', salary: '₹10.0 - ₹15.0 LPA', exp: '3 - 5 yrs', type: 'Full-time', loc: 'Pune (Hybrid)' }
    ];

    for (const job of jobList) {
      await portal.openJobDetails(job.id);
      await expect(portal.modalJobTitle).toHaveText(job.title);
      await expect(portal.modalJobSalary).toHaveText(job.salary);
      await expect(portal.modalJobExperience).toHaveText(job.exp);
      await expect(page.locator('#modal-job-type')).toHaveText(job.type);
      await expect(page.locator('#modal-job-location')).toHaveText(job.loc);

      // Verify sections: Responsibilities, Requirements, Skills
      await expect(page.locator('#modal-job-responsibilities li')).not.toHaveCount(0);
      await expect(page.locator('#modal-job-requirements li')).not.toHaveCount(0);
      await expect(page.locator('#modal-job-tags .skill-tag')).not.toHaveCount(0);
      await expect(portal.btnOpenApply).toBeVisible();

      // Return to listing
      await portal.btnCloseDetails.click();
      await expect(portal.jobDetailsModal).toBeHidden();
    }
  });

  // ---------------------------------------------------------------------------
  // Check 8: Browser back navigation works without losing search state
  // ---------------------------------------------------------------------------
  test('Check 8: Browser back navigation returns from details to listing while preserving search', async ({ page }) => {
    // User performs search
    await portal.searchInput.fill('Frontend');
    await expect(page.locator('.job-card')).toHaveCount(1);

    // Opens details modal
    await portal.openJobDetails('JOB-103');
    await expect(portal.jobDetailsModal).toBeVisible();
    expect(page.url()).toContain('#job=JOB-103');

    // User navigates back via browser Back button
    await page.goBack();
    await expect(portal.jobDetailsModal).toBeHidden();

    // Verify search query and filtered card are retained
    await expect(portal.searchInput).toHaveValue('Frontend');
    await expect(page.locator('.job-card')).toHaveCount(1);
  });

  // ---------------------------------------------------------------------------
  // Check 9: Responsive UI at desktop, tablet, and mobile viewports
  // ---------------------------------------------------------------------------
  test('Check 9: Responsive UI remains functional without horizontal overflow across viewports', async ({ page }) => {
    const viewports = [
      { name: 'Desktop', width: 1280, height: 800 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // Check no horizontal overflow
      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalOverflow, `Horizontal overflow detected at ${vp.name} (${vp.width}px)`).toBeFalsy();

      // Ensure jobs grid has 4 cards
      await expect(page.locator('.job-card')).toHaveCount(4);

      // Verify direct Apply button on card
      const applyBtn = page.locator('#btn-apply-card-JOB-101');
      await expect(applyBtn).toBeVisible();

      // Verify touch target height is at least 40px
      const boundingBox = await applyBtn.boundingBox();
      expect(boundingBox?.height).toBeGreaterThanOrEqual(40);
    }
  });
});
