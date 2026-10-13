// @ts-check
const path = require('path');

class JobPortalPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Header & QA Harness
    this.navBrandLogo = page.locator('#nav-brand-logo');
    this.toggleSimDelay = page.locator('#toggle-sim-delay');
    this.toggleSim500 = page.locator('#toggle-sim-500');
    this.toggleSimOffline = page.locator('#toggle-sim-offline');
    this.btnResetData = page.locator('#btn-reset-data');
    this.qaStatusPill = page.locator('#qa-status-pill');

    // Search & Filter
    this.searchInput = page.locator('#search-input');
    this.filterDepartment = page.locator('#filter-department');
    this.jobsGrid = page.locator('#jobs-grid');
    this.jobCards = page.locator('.job-card');
    this.jobsResultsCount = page.locator('#jobs-results-count');
    this.jobsEmptyState = page.locator('#jobs-empty-state');

    // Job Details Modal
    this.jobDetailsModal = page.locator('#job-details-modal');
    this.modalJobTitle = page.locator('#modal-job-title');
    this.modalJobDept = page.locator('#modal-job-dept');
    this.modalJobSalary = page.locator('#modal-job-salary');
    this.modalJobExperience = page.locator('#modal-job-experience');
    this.btnCloseDetails = page.locator('#btn-close-details');
    this.btnOpenApply = page.locator('#btn-open-apply');

    // Application Modal & Form
    this.applicationModal = page.locator('#application-modal');
    this.applyModalTitle = page.locator('#apply-modal-title');
    this.applyRoleSummary = page.locator('#apply-role-summary');
    this.jobApplicationForm = page.locator('#job-application-form');

    // Form Fields
    this.applicantJobId = page.locator('#applicant-job-id');
    this.applicantName = page.locator('#applicant-name');
    this.applicantEmail = page.locator('#applicant-email');
    this.applicantPhone = page.locator('#applicant-phone');
    this.applicantExperience = page.locator('#applicant-experience');
    this.applicantResume = page.locator('#applicant-resume');
    this.applicantCoverLetter = page.locator('#applicant-cover-letter');
    this.applicantConsent = page.locator('#applicant-consent');

    // Form Action Buttons & Feedback
    this.btnSubmitApplication = page.locator('#btn-submit-application');
    this.btnCancelApplication = page.locator('#btn-cancel-application');
    this.submitSpinner = page.locator('#submit-spinner');
    this.formErrorBanner = page.locator('#form-error-banner');
    this.formErrorMessage = page.locator('#form-error-message');
    this.btnRetrySubmit = page.locator('#btn-retry-submit');

    // Field Error Labels
    this.errorName = page.locator('#error-name');
    this.errorEmail = page.locator('#error-email');
    this.errorPhone = page.locator('#error-phone');
    this.errorExperience = page.locator('#error-experience');
    this.errorResume = page.locator('#error-resume');
    this.errorConsent = page.locator('#error-consent');

    // Modals
    this.successModal = page.locator('#success-modal');
    this.successAppId = page.locator('#success-app-id');
    this.btnCloseSuccess = page.locator('#btn-close-success');

    this.duplicateModal = page.locator('#duplicate-modal');
    this.duplicateMessage = page.locator('#duplicate-message');
    this.btnCloseDuplicate = page.locator('#btn-close-duplicate');

    // Submissions Registry
    this.submissionsTable = page.locator('#submissions-table');
    this.submissionsTableBody = page.locator('#submissions-table-body');
    this.submissionsBadgeCount = page.locator('#submissions-badge-count');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async resetData() {
    await this.page.request.post('/api/reset');
    await this.page.reload();
  }

  async openJobDetails(jobId) {
    const viewBtn = this.page.locator(`#btn-view-${jobId}`);
    await viewBtn.click();
    await this.jobDetailsModal.waitFor({ state: 'visible' });
  }

  async openApplicationForJob(jobId) {
    await this.openJobDetails(jobId);
    await this.btnOpenApply.click();
    await this.applicationModal.waitFor({ state: 'visible' });
  }

  /**
   * Fills application form inputs
   */
  async fillApplicationForm({
    name = 'Jane Doe',
    email = 'jane.doe@example.com',
    phone = '9876543210',
    experience = '2',
    resumeFileName = 'sample_resume.pdf',
    coverLetter = 'I am an enthusiastic QA Engineer applying for this role.',
    consent = true
  } = {}) {
    if (name !== undefined) await this.applicantName.fill(name);
    if (email !== undefined) await this.applicantEmail.fill(email);
    if (phone !== undefined) await this.applicantPhone.fill(phone);
    if (experience !== undefined) await this.applicantExperience.fill(String(experience));

    if (resumeFileName) {
      const filePath = path.join(__dirname, '..', 'fixtures', resumeFileName);
      await this.applicantResume.setInputFiles(filePath);
    }

    if (coverLetter !== undefined) await this.applicantCoverLetter.fill(coverLetter);

    if (consent) {
      if (!(await this.applicantConsent.isChecked())) {
        await this.applicantConsent.check();
      }
    } else {
      if (await this.applicantConsent.isChecked()) {
        await this.applicantConsent.uncheck();
      }
    }
  }

  async enableSim500() {
    await this.toggleSim500.evaluate(el => {
      // @ts-ignore
      el.checked = true;
      el.dispatchEvent(new Event('change'));
    });
  }

  async disableSim500() {
    await this.toggleSim500.evaluate(el => {
      // @ts-ignore
      el.checked = false;
      el.dispatchEvent(new Event('change'));
    });
  }

  async enableSimDelay() {
    await this.toggleSimDelay.evaluate(el => {
      // @ts-ignore
      el.checked = true;
      el.dispatchEvent(new Event('change'));
    });
  }

  async disableSimDelay() {
    await this.toggleSimDelay.evaluate(el => {
      // @ts-ignore
      el.checked = false;
      el.dispatchEvent(new Event('change'));
    });
  }

  async submitForm() {
    await this.btnSubmitApplication.click();
  }
}

module.exports = { JobPortalPage };
