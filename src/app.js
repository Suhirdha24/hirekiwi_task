/**
 * CareerHub QA Portal - Client Application Logic
 * Implements job browsing, search/filter, form validation, debounced submission,
 * duplicate handling, and QA test harness simulations.
 */

(function () {
  'use strict';

  // Application State
  let allJobs = [];
  let currentJob = null;
  let isSubmitting = false;

  // DOM Elements - Navigation & QA Harness
  const toggleSimDelay = document.getElementById('toggle-sim-delay');
  const toggleSim500 = document.getElementById('toggle-sim-500');
  const toggleSimOffline = document.getElementById('toggle-sim-offline');
  const btnResetData = document.getElementById('btn-reset-data');
  const qaStatusPill = document.getElementById('qa-status-pill');

  // DOM Elements - Search & Filter
  const searchInput = document.getElementById('search-input');
  const btnClearSearch = document.getElementById('btn-clear-search');
  const filterDepartment = document.getElementById('filter-department');
  const jobsGrid = document.getElementById('jobs-grid');
  const jobsResultsCount = document.getElementById('jobs-results-count');
  const jobsEmptyState = document.getElementById('jobs-empty-state');
  const btnResetFilters = document.getElementById('btn-reset-filters');

  // DOM Elements - Job Details Modal
  const jobDetailsModal = document.getElementById('job-details-modal');
  const modalJobTitle = document.getElementById('modal-job-title');
  const modalJobDept = document.getElementById('modal-job-dept');
  const modalJobMeta = document.getElementById('modal-job-meta');
  const modalJobSalary = document.getElementById('modal-job-salary');
  const modalJobExperience = document.getElementById('modal-job-experience');
  const modalJobPosted = document.getElementById('modal-job-posted');
  const modalJobDescription = document.getElementById('modal-job-description');
  const modalJobResponsibilities = document.getElementById('modal-job-responsibilities');
  const modalJobRequirements = document.getElementById('modal-job-requirements');
  const modalJobTags = document.getElementById('modal-job-tags');
  const btnCloseDetails = document.getElementById('btn-close-details');
  const btnCancelDetails = document.getElementById('btn-cancel-details');
  const btnOpenApply = document.getElementById('btn-open-apply');

  // DOM Elements - Application Form Modal
  const applicationModal = document.getElementById('application-modal');
  const applyRoleSummary = document.getElementById('apply-role-summary');
  const jobApplicationForm = document.getElementById('job-application-form');
  const applicantJobId = document.getElementById('applicant-job-id');
  const applicantName = document.getElementById('applicant-name');
  const applicantEmail = document.getElementById('applicant-email');
  const applicantPhone = document.getElementById('applicant-phone');
  const applicantExperience = document.getElementById('applicant-experience');
  const applicantResume = document.getElementById('applicant-resume');
  const applicantCoverLetter = document.getElementById('applicant-cover-letter');
  const applicantConsent = document.getElementById('applicant-consent');
  const btnSubmitApplication = document.getElementById('btn-submit-application');
  const btnCancelApplication = document.getElementById('btn-cancel-application');
  const btnCancelAppTop = document.getElementById('btn-cancel-application-top');
  const submitSpinner = document.getElementById('submit-spinner');
  const formErrorBanner = document.getElementById('form-error-banner');
  const formErrorMessage = document.getElementById('form-error-message');
  const btnRetrySubmit = document.getElementById('btn-retry-submit');

  // Error Message Labels
  const errorName = document.getElementById('error-name');
  const errorEmail = document.getElementById('error-email');
  const errorPhone = document.getElementById('error-phone');
  const errorExperience = document.getElementById('error-experience');
  const errorResume = document.getElementById('error-resume');
  const errorConsent = document.getElementById('error-consent');

  // Feedback Modals
  const successModal = document.getElementById('success-modal');
  const successAppId = document.getElementById('success-app-id');
  const btnCloseSuccess = document.getElementById('btn-close-success');

  const duplicateModal = document.getElementById('duplicate-modal');
  const duplicateMessage = document.getElementById('duplicate-message');
  const btnCloseDuplicate = document.getElementById('btn-close-duplicate');

  // Submissions Registry
  const submissionsTableBody = document.getElementById('submissions-table-body');
  const submissionsBadgeCount = document.getElementById('submissions-badge-count');

  // Initialize
  async function init() {
    setupEventListeners();
    await fetchJobs();
    await fetchSubmissions();
  }

  // Event Listeners Setup
  function setupEventListeners() {
    // Search & Filter
    searchInput.addEventListener('input', () => {
      btnClearSearch.style.display = searchInput.value ? 'inline-block' : 'none';
      applyFilters();
    });

    btnClearSearch.addEventListener('click', () => {
      searchInput.value = '';
      btnClearSearch.style.display = 'none';
      applyFilters();
    });

    filterDepartment.addEventListener('change', applyFilters);
    btnResetFilters.addEventListener('click', resetFilters);

    // Job Details Modal
    btnCloseDetails.addEventListener('click', closeDetailsModal);
    btnCancelDetails.addEventListener('click', closeDetailsModal);
    btnOpenApply.addEventListener('click', () => {
      closeDetailsModal();
      openApplicationModal(currentJob);
    });

    // Application Modal
    btnCancelApplication.addEventListener('click', closeApplicationModal);
    btnCancelAppTop.addEventListener('click', closeApplicationModal);
    jobApplicationForm.addEventListener('submit', handleFormSubmit);
    btnRetrySubmit.addEventListener('click', handleFormSubmit);

    // Modals Backdrop Close & Escape Key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDetailsModal();
        closeApplicationModal();
        closeSuccessModal();
        closeDuplicateModal();
      }
    });

    [jobDetailsModal, applicationModal, successModal, duplicateModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    });

    // Feedback Modal Buttons
    btnCloseSuccess.addEventListener('click', () => {
      closeSuccessModal();
      document.getElementById('submissions-section').scrollIntoView({ behavior: 'smooth' });
    });

    btnCloseDuplicate.addEventListener('click', closeDuplicateModal);

    // QA Reset Data
    btnResetData.addEventListener('click', resetAllSubmissions);

    // QA Toggles change feedback
    [toggleSimDelay, toggleSim500, toggleSimOffline].forEach(toggle => {
      toggle.addEventListener('change', updateQAStatus);
    });
  }

  function updateQAStatus() {
    if (toggleSimOffline.checked) {
      qaStatusPill.textContent = 'Server: Offline Simulated';
      qaStatusPill.style.color = '#EF4444';
      qaStatusPill.style.borderColor = 'rgba(239, 68, 68, 0.4)';
    } else if (toggleSim500.checked) {
      qaStatusPill.textContent = 'Server: 500 Error Simulated';
      qaStatusPill.style.color = '#F59E0B';
      qaStatusPill.style.borderColor = 'rgba(245, 158, 11, 0.4)';
    } else if (toggleSimDelay.checked) {
      qaStatusPill.textContent = 'Server: 3s Delay Active';
      qaStatusPill.style.color = '#818CF8';
      qaStatusPill.style.borderColor = 'rgba(129, 140, 248, 0.4)';
    } else {
      qaStatusPill.textContent = 'Server: Online 200 OK';
      qaStatusPill.style.color = '#10B981';
      qaStatusPill.style.borderColor = 'rgba(16, 185, 129, 0.2)';
    }
  }

  // Fetch Jobs from Mock Server
  async function fetchJobs() {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      allJobs = data.jobs || [];
      renderJobsGrid(allJobs);
    } catch (err) {
      jobsResultsCount.textContent = 'Failed to load jobs';
      jobsGrid.innerHTML = `<div class="empty-state"><p>Unable to connect to local mock server.</p></div>`;
    }
  }

  // Render Job Cards Grid
  function renderJobsGrid(jobs) {
    jobsGrid.innerHTML = '';
    jobsResultsCount.textContent = `${jobs.length} position${jobs.length === 1 ? '' : 's'} available`;

    if (jobs.length === 0) {
      jobsEmptyState.style.display = 'block';
      return;
    }

    jobsEmptyState.style.display = 'none';

    jobs.forEach(job => {
      const card = document.createElement('article');
      card.className = 'job-card';
      card.id = `job-card-${job.id}`;

      card.innerHTML = `
        <div>
          <div class="job-card-header">
            <div>
              <h3 class="job-card-title">${escapeHtml(job.title)}</h3>
              <span class="job-card-dept">${escapeHtml(job.department)}</span>
            </div>
          </div>

          <div class="job-meta-chips">
            <span class="meta-chip salary">💰 ${escapeHtml(job.salary)}</span>
            <span class="meta-chip">⏱️ ${escapeHtml(job.experience)}</span>
            <span class="meta-chip">📍 ${escapeHtml(job.location)}</span>
          </div>

          <p class="job-card-desc">${escapeHtml(job.description)}</p>

          <div class="job-tags-row">
            ${(job.tags || []).map(tag => `<span class="skill-tag">${escapeHtml(tag)}</span>`).join('')}
          </div>
        </div>

        <div class="job-card-footer">
          <span class="posted-time">Posted ${escapeHtml(job.posted)}</span>
          <button type="button" class="btn-view-role" id="btn-view-${job.id}" data-job-id="${job.id}">
            View Details →
          </button>
        </div>
      `;

      card.querySelector(`.btn-view-role`).addEventListener('click', () => {
        openJobDetailsModal(job);
      });

      jobsGrid.appendChild(card);
    });
  }

  // Apply Search & Filters
  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const dept = filterDepartment.value;

    const filtered = allJobs.filter(job => {
      const matchesDept = dept === 'ALL' || job.department === dept;
      const matchesQuery = !query || 
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        (job.tags && job.tags.some(t => t.toLowerCase().includes(query)));
      return matchesDept && matchesQuery;
    });

    renderJobsGrid(filtered);
  }

  function resetFilters() {
    searchInput.value = '';
    btnClearSearch.style.display = 'none';
    filterDepartment.value = 'ALL';
    renderJobsGrid(allJobs);
  }

  // Open Details Modal
  function openJobDetailsModal(job) {
    currentJob = job;
    modalJobTitle.textContent = job.title;
    modalJobDept.textContent = job.department;
    modalJobMeta.textContent = `${job.location} • ${job.type}`;
    modalJobSalary.textContent = job.salary;
    modalJobExperience.textContent = job.experience;
    modalJobPosted.textContent = job.posted;
    modalJobDescription.textContent = job.description;

    modalJobResponsibilities.innerHTML = (job.responsibilities || [])
      .map(r => `<li>${escapeHtml(r)}</li>`).join('');

    modalJobRequirements.innerHTML = (job.requirements || [])
      .map(req => `<li>${escapeHtml(req)}</li>`).join('');

    modalJobTags.innerHTML = (job.tags || [])
      .map(tag => `<span class="skill-tag">${escapeHtml(tag)}</span>`).join('');

    jobDetailsModal.style.display = 'flex';
  }

  function closeDetailsModal() {
    jobDetailsModal.style.display = 'none';
  }

  // Open Application Modal
  function openApplicationModal(job) {
    currentJob = job;
    applicantJobId.value = job ? job.id : '';
    applyRoleSummary.textContent = job ? `${job.title} (${job.location}) • ${job.salary}` : '';
    
    // Clear previous errors
    clearFormErrors();
    formErrorBanner.style.display = 'none';

    applicationModal.style.display = 'flex';
    applicantName.focus();
  }

  function closeApplicationModal() {
    applicationModal.style.display = 'none';
    clearFormErrors();
    formErrorBanner.style.display = 'none';
  }

  function closeSuccessModal() {
    successModal.style.display = 'none';
  }

  function closeDuplicateModal() {
    duplicateModal.style.display = 'none';
  }

  function clearFormErrors() {
    const errorSpans = [errorName, errorEmail, errorPhone, errorExperience, errorResume, errorConsent];
    errorSpans.forEach(span => {
      span.textContent = '';
      span.style.display = 'none';
    });

    const inputs = [applicantName, applicantEmail, applicantPhone, applicantExperience, applicantResume];
    inputs.forEach(input => input.classList.remove('is-invalid'));
  }

  function setFieldError(fieldInput, errorSpan, message) {
    if (fieldInput) fieldInput.classList.add('is-invalid');
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.style.display = 'block';
    }
  }

  // Client-Side Validation
  function validateForm() {
    clearFormErrors();
    let isValid = true;

    // 1. Full Name: Required, min 2 chars, max 50 chars, no whitespace-only
    const nameVal = applicantName.value;
    const trimmedName = nameVal.trim();
    if (!trimmedName) {
      setFieldError(applicantName, errorName, 'Full name cannot be empty or only spaces.');
      isValid = false;
    } else if (trimmedName.length < 2) {
      setFieldError(applicantName, errorName, 'Full name must be at least 2 characters.');
      isValid = false;
    } else if (trimmedName.length > 50) {
      setFieldError(applicantName, errorName, 'Full name cannot exceed 50 characters.');
      isValid = false;
    }

    // 2. Email: Required, proper regex syntax
    const emailVal = applicantEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailVal) {
      setFieldError(applicantEmail, errorEmail, 'Email address is required.');
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      setFieldError(applicantEmail, errorEmail, 'Please provide a valid email address (e.g., name@domain.com).');
      isValid = false;
    }

    // 3. Phone: Exactly 10 digits
    const phoneVal = applicantPhone.value.trim();
    const phoneDigits = phoneVal.replace(/\D/g, '');
    if (!phoneVal) {
      setFieldError(applicantPhone, errorPhone, 'Phone number is required.');
      isValid = false;
    } else if (phoneDigits.length !== 10 || phoneVal !== phoneDigits) {
      setFieldError(applicantPhone, errorPhone, 'Phone number must be exactly 10 numeric digits.');
      isValid = false;
    }

    // 4. Experience: 0 to 40
    const expVal = applicantExperience.value;
    if (expVal === '' || isNaN(expVal)) {
      setFieldError(applicantExperience, errorExperience, 'Experience is required.');
      isValid = false;
    } else {
      const expNum = Number(expVal);
      if (expNum < 0 || expNum > 40) {
        setFieldError(applicantExperience, errorExperience, 'Experience must be between 0 and 40 years.');
        isValid = false;
      }
    }

    // 5. Resume File: Required, format and size
    if (!applicantResume.files || applicantResume.files.length === 0) {
      setFieldError(applicantResume, errorResume, 'Please attach your resume document.');
      isValid = false;
    } else {
      const file = applicantResume.files[0];
      const validExts = ['.pdf', '.doc', '.docx'];
      const fileExt = '.' + file.name.split('.').pop().toLowerCase();
      if (!validExts.includes(fileExt)) {
        setFieldError(applicantResume, errorResume, 'Only .pdf, .doc, and .docx formats are permitted.');
        isValid = false;
      } else if (file.size > 5 * 1024 * 1024) {
        setFieldError(applicantResume, errorResume, 'File size exceeds maximum limit of 5MB.');
        isValid = false;
      }
    }

    // 6. Consent Checkbox
    if (!applicantConsent.checked) {
      setFieldError(null, errorConsent, 'You must agree to the data processing terms.');
      isValid = false;
    }

    return isValid;
  }

  // Handle Form Submission with Concurrency Protection (Debounce)
  async function handleFormSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    // Concurrency Check: If already submitting, ignore accidental duplicate clicks
    if (isSubmitting) {
      console.warn('[QA Guard] Duplicate submission click blocked by debouncing guard.');
      return;
    }

    // Validate inputs
    if (!validateForm()) {
      return;
    }

    // Enter Submitting State
    isSubmitting = true;
    btnSubmitApplication.disabled = true;
    btnSubmitApplication.querySelector('.btn-text').textContent = 'Submitting Application...';
    submitSpinner.style.display = 'inline-block';
    formErrorBanner.style.display = 'none';

    // Prepare Payload
    const payload = {
      jobId: applicantJobId.value,
      fullName: applicantName.value.trim(),
      email: applicantEmail.value.trim(),
      phone: applicantPhone.value.trim(),
      experience: Number(applicantExperience.value),
      resumeName: applicantResume.files[0] ? applicantResume.files[0].name : 'resume.pdf',
      coverLetter: applicantCoverLetter.value.trim(),
      consent: applicantConsent.checked
    };

    // Prepare Request Headers & Simulation Toggles
    const headers = { 'Content-Type': 'application/json' };
    if (toggleSim500.checked) headers['X-Simulate-Error'] = '500';
    if (toggleSimDelay.checked) headers['X-Simulate-Delay'] = '3000';

    try {
      // Simulate Offline failure if toggle active
      if (toggleSimOffline.checked) {
        await new Promise(r => setTimeout(r, 600));
        throw new TypeError('Failed to fetch: Simulated network offline state.');
      }

      const response = await fetch('/api/apply', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.status === 201 && result.success) {
        // Success
        closeApplicationModal();
        jobApplicationForm.reset();
        successAppId.textContent = result.applicationId;
        successModal.style.display = 'flex';
        await fetchSubmissions();
      } else if (response.status === 409) {
        // Duplicate Submission Detected
        closeApplicationModal();
        duplicateMessage.textContent = result.error || 'An application has already been submitted for this position.';
        duplicateModal.style.display = 'flex';
      } else if (response.status === 500) {
        // Server Error (500)
        showFormError('Server Error (HTTP 500)', result.error || 'Internal server error occurred. Please try again.');
      } else {
        // Validation / Client Error (400)
        showFormError('Validation Error', result.error || 'Please correct the highlighted form errors.');
      }

    } catch (networkErr) {
      showFormError('Network Connection Error', 'Unable to reach the server. Please check your network connection and try again.');
    } finally {
      // Teardown Submitting State
      isSubmitting = false;
      btnSubmitApplication.disabled = false;
      btnSubmitApplication.querySelector('.btn-text').textContent = 'Submit Application';
      submitSpinner.style.display = 'none';
    }
  }

  function showFormError(title, message) {
    document.getElementById('form-error-title').textContent = title;
    formErrorMessage.textContent = message;
    formErrorBanner.style.display = 'flex';
  }

  // Fetch Submissions for Verification Registry
  async function fetchSubmissions() {
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      const list = data.submissions || [];
      submissionsBadgeCount.textContent = list.length;

      if (list.length === 0) {
        submissionsTableBody.innerHTML = `
          <tr>
            <td colspan="7" class="text-center" style="text-align: center; color: var(--text-dim); padding: 24px;">
              No applications submitted yet. Apply for a role above!
            </td>
          </tr>
        `;
        return;
      }

      submissionsTableBody.innerHTML = list.map(item => {
        const matchingJob = allJobs.find(j => j.id === item.jobId);
        const jobTitle = matchingJob ? matchingJob.title : item.jobId;
        return `
          <tr>
            <td><code style="color: #818CF8; font-weight: 700;">${escapeHtml(item.applicationId)}</code></td>
            <td><strong>${escapeHtml(jobTitle)}</strong></td>
            <td>${escapeHtml(item.fullName)}</td>
            <td>${escapeHtml(item.email)}</td>
            <td>${escapeHtml(String(item.experience))} yrs</td>
            <td>${new Date(item.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
            <td><span class="status-badge">Submitted</span></td>
          </tr>
        `;
      }).join('');

    } catch {
      // Server error handling
    }
  }

  // Reset Submissions Test Data
  async function resetAllSubmissions() {
    try {
      await fetch('/api/reset', { method: 'POST' });
      toggleSim500.checked = false;
      toggleSimDelay.checked = false;
      toggleSimOffline.checked = false;
      updateQAStatus();
      await fetchSubmissions();
      alert('Local test submissions have been reset successfully!');
    } catch {
      alert('Failed to reset submissions.');
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Bootstrap Application
  document.addEventListener('DOMContentLoaded', init);
})();
