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
  const filterLocation = document.getElementById('filter-location');
  const filterType = document.getElementById('filter-type');
  const btnClearFiltersHeader = document.getElementById('btn-clear-filters-header');
  const jobsGrid = document.getElementById('jobs-grid');
  const jobsResultsCount = document.getElementById('jobs-results-count');
  const jobsEmptyState = document.getElementById('jobs-empty-state');
  const emptyStateMessage = document.getElementById('empty-state-message');
  const btnResetFilters = document.getElementById('btn-reset-filters');

  // DOM Elements - Job Details Modal
  const jobDetailsModal = document.getElementById('job-details-modal');
  const modalJobTitle = document.getElementById('modal-job-title');
  const modalJobDept = document.getElementById('modal-job-dept');
  const modalJobMeta = document.getElementById('modal-job-meta');
  const modalJobSalary = document.getElementById('modal-job-salary');
  const modalJobExperience = document.getElementById('modal-job-experience');
  const modalJobType = document.getElementById('modal-job-type');
  const modalJobLocation = document.getElementById('modal-job-location');
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
  const errorCoverLetter = document.getElementById('error-cover-letter');
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

  // Candidate Self-Service Dashboard
  const navLinkCandidate = document.getElementById('nav-link-candidate');
  const candidateModal = document.getElementById('candidate-modal');
  const btnCloseCandidate = document.getElementById('btn-close-candidate');
  const btnDismissCandidate = document.getElementById('btn-dismiss-candidate');
  const candidateEmailInput = document.getElementById('candidate-email-input');
  const btnLookupCandidate = document.getElementById('btn-lookup-candidate');
  const btnUseLastEmail = document.getElementById('btn-use-last-email');
  const candidateResultsContainer = document.getElementById('candidate-results-container');
  const candidateCurrentEmail = document.getElementById('candidate-current-email');
  const candidateAppsCount = document.getElementById('candidate-apps-count');
  const candidateAppsList = document.getElementById('candidate-apps-list');
  const candidateEmptyState = document.getElementById('candidate-empty-state');

  // Recruiter Admin Portal
  const navLinkAdmin = document.getElementById('nav-link-admin');
  const adminModal = document.getElementById('admin-modal');
  const btnCloseAdmin = document.getElementById('btn-close-admin');
  const btnDismissAdmin = document.getElementById('btn-dismiss-admin');
  const adminLoginView = document.getElementById('admin-login-view');
  const adminDashboardView = document.getElementById('admin-dashboard-view');
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminPasskey = document.getElementById('admin-passkey');
  const adminLoginError = document.getElementById('admin-login-error');
  const adminAuthBadge = document.getElementById('admin-auth-badge');
  const btnAdminLogout = document.getElementById('btn-admin-logout');

  // Admin Dashboard Elements
  const adminMetricTotal = document.getElementById('admin-metric-total');
  const adminMetricNew = document.getElementById('admin-metric-new');
  const adminMetricReview = document.getElementById('admin-metric-review');
  const adminMetricShortlist = document.getElementById('admin-metric-shortlist');
  const adminMetricRejected = document.getElementById('admin-metric-rejected');
  const adminSearchInput = document.getElementById('admin-search-input');
  const adminFilterStatus = document.getElementById('admin-filter-status');
  const btnAdminRefresh = document.getElementById('btn-admin-refresh');
  const adminTableBody = document.getElementById('admin-table-body');

  let adminApplications = [];

  // Initialize
  async function init() {
    setupEventListeners();
    await fetchJobs();
    await fetchSubmissions();

    // Check if initial URL has deep-link to a job (e.g. #job=JOB-101)
    if (window.location.hash.startsWith('#job=')) {
      const jobId = window.location.hash.replace('#job=', '').trim();
      const targetJob = allJobs.find(j => j.id === jobId);
      if (targetJob) {
        openJobDetailsModal(targetJob, false);
      }
    }
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
    if (filterLocation) filterLocation.addEventListener('change', applyFilters);
    if (filterType) filterType.addEventListener('change', applyFilters);
    btnResetFilters.addEventListener('click', resetFilters);
    if (btnClearFiltersHeader) {
      btnClearFiltersHeader.addEventListener('click', resetFilters);
    }

    // Candidate Self-Service Modal Listeners
    if (navLinkCandidate) navLinkCandidate.addEventListener('click', openCandidateModal);
    if (btnCloseCandidate) btnCloseCandidate.addEventListener('click', closeCandidateModal);
    if (btnDismissCandidate) btnDismissCandidate.addEventListener('click', closeCandidateModal);
    if (btnLookupCandidate) btnLookupCandidate.addEventListener('click', () => lookupCandidateApps());
    if (btnUseLastEmail) btnUseLastEmail.addEventListener('click', () => {
      const lastEmail = localStorage.getItem('careerhub_last_applied_email');
      if (lastEmail) {
        candidateEmailInput.value = lastEmail;
        lookupCandidateApps(lastEmail);
      }
    });
    if (candidateEmailInput) {
      candidateEmailInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          lookupCandidateApps();
        }
      });
    }

    // Recruiter Admin Portal Listeners
    if (navLinkAdmin) navLinkAdmin.addEventListener('click', openAdminModal);
    if (btnCloseAdmin) btnCloseAdmin.addEventListener('click', closeAdminModal);
    if (btnDismissAdmin) btnDismissAdmin.addEventListener('click', closeAdminModal);
    if (adminLoginForm) {
      adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const key = adminPasskey ? adminPasskey.value.trim() : '';
        await verifyAndLoadAdminDashboard(key);
      });
    }
    if (btnAdminLogout) {
      btnAdminLogout.addEventListener('click', () => {
        sessionStorage.removeItem('careerhub_admin_key');
        showAdminLogin();
      });
    }
    if (adminSearchInput) adminSearchInput.addEventListener('input', renderAdminApplications);
    if (adminFilterStatus) adminFilterStatus.addEventListener('change', renderAdminApplications);
    if (btnAdminRefresh) {
      btnAdminRefresh.addEventListener('click', async () => {
        const key = sessionStorage.getItem('careerhub_admin_key');
        if (key) {
          await verifyAndLoadAdminDashboard(key);
        }
      });
    }

    // Job Details Modal
    btnCloseDetails.addEventListener('click', () => closeDetailsModal(true));
    btnCancelDetails.addEventListener('click', () => closeDetailsModal(true));
    btnOpenApply.addEventListener('click', () => {
      closeDetailsModal(false);
      openApplicationModal(currentJob);
    });

    // Browser Back / Popstate Navigation Support
    window.addEventListener('popstate', () => {
      if (jobDetailsModal && jobDetailsModal.style.display !== 'none') {
        closeDetailsModal(false);
      }
    });

    // Application Modal Form & Real-Time Validation Feedback
    btnCancelApplication.addEventListener('click', closeApplicationModal);
    btnCancelAppTop.addEventListener('click', closeApplicationModal);
    jobApplicationForm.addEventListener('submit', handleFormSubmit);
    btnRetrySubmit.addEventListener('click', handleFormSubmit);

    applicantName.addEventListener('input', () => clearSingleFieldError(applicantName, errorName));
    applicantEmail.addEventListener('input', () => clearSingleFieldError(applicantEmail, errorEmail));
    applicantPhone.addEventListener('input', () => clearSingleFieldError(applicantPhone, errorPhone));
    applicantExperience.addEventListener('input', () => clearSingleFieldError(applicantExperience, errorExperience));
    applicantResume.addEventListener('change', () => clearSingleFieldError(applicantResume, errorResume));
    if (applicantCoverLetter && errorCoverLetter) {
      applicantCoverLetter.addEventListener('input', () => clearSingleFieldError(applicantCoverLetter, errorCoverLetter));
    }
    applicantConsent.addEventListener('change', () => clearSingleFieldError(null, errorConsent));

    // Modals Backdrop Close & Escape Key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDetailsModal(true);
        closeApplicationModal();
        closeSuccessModal();
        closeDuplicateModal();
        closeCandidateModal();
        closeAdminModal();
      }
    });

    [jobDetailsModal, applicationModal, successModal, duplicateModal, candidateModal, adminModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            if (modal === jobDetailsModal) {
              closeDetailsModal(true);
            } else if (modal === applicationModal) {
              closeApplicationModal();
            } else if (modal === successModal) {
              closeSuccessModal();
            } else if (modal === duplicateModal) {
              closeDuplicateModal();
            } else if (modal === candidateModal) {
              closeCandidateModal();
            } else if (modal === adminModal) {
              closeAdminModal();
            }
          }
        });
      }
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
      renderJobsGrid(allJobs, false);
    } catch (err) {
      jobsResultsCount.textContent = 'Failed to load jobs';
      jobsGrid.innerHTML = `<div class="empty-state"><p>Unable to connect to local mock server.</p></div>`;
    }
  }

  // Render Job Cards Grid
  function renderJobsGrid(jobs, isFiltered = false) {
    jobsGrid.innerHTML = '';
    
    if (isFiltered) {
      jobsResultsCount.textContent = `Showing ${jobs.length} of ${allJobs.length} open position${allJobs.length === 1 ? '' : 's'}`;
    } else {
      jobsResultsCount.textContent = `Showing all ${jobs.length} open position${jobs.length === 1 ? '' : 's'}`;
    }

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
        <div class="job-card-body">
          <div class="job-card-header">
            <div class="job-card-top-row">
              <span class="job-card-dept">${escapeHtml(job.department)}</span>
              <span class="demo-role-pill">Demo Role</span>
            </div>
            <h3 class="job-card-title">${escapeHtml(job.title)}</h3>
          </div>

          <div class="job-meta-chips">
            <span class="meta-chip salary">💰 ${escapeHtml(job.salary)}</span>
            <span class="meta-chip">⏱️ ${escapeHtml(job.experience)}</span>
            <span class="meta-chip">📍 ${escapeHtml(job.location)}</span>
            <span class="meta-chip type">💼 ${escapeHtml(job.type || 'Full-time')}</span>
          </div>

          <p class="job-card-desc">${escapeHtml(job.description)}</p>

          <div class="job-tags-row">
            ${(job.tags || []).map(tag => `<span class="skill-tag">${escapeHtml(tag)}</span>`).join('')}
          </div>
        </div>

        <div class="job-card-footer">
          <span class="posted-time">Posted ${escapeHtml(job.posted)}</span>
          <div class="card-actions">
            <button type="button" class="btn-view-role" id="btn-view-${job.id}" data-job-id="${job.id}" aria-label="View details for ${escapeHtml(job.title)}">
              View Details →
            </button>
            <button type="button" class="btn-card-apply" id="btn-apply-card-${job.id}" data-job-id="${job.id}" aria-label="Apply now for ${escapeHtml(job.title)}">
              Apply Now
            </button>
          </div>
        </div>
      `;

      card.querySelector(`#btn-view-${job.id}`).addEventListener('click', () => {
        openJobDetailsModal(job);
      });

      card.querySelector(`#btn-apply-card-${job.id}`).addEventListener('click', () => {
        openApplicationModal(job);
      });

      jobsGrid.appendChild(card);
    });
  }

  // Apply Search & Filters
  function applyFilters() {
    const rawQuery = searchInput.value || '';
    const query = rawQuery.trim().toLowerCase();
    const dept = filterDepartment.value || 'ALL';
    const loc = filterLocation ? filterLocation.value || 'ALL' : 'ALL';
    const empType = filterType ? filterType.value || 'ALL' : 'ALL';

    const isFiltered = query.length > 0 || dept !== 'ALL' || loc !== 'ALL' || empType !== 'ALL';

    // Show/hide clear filters button in header
    if (btnClearFiltersHeader) {
      btnClearFiltersHeader.style.display = isFiltered ? 'inline-flex' : 'none';
    }

    // Split search query into multiple whitespace-delimited tokens for flexible keyword search
    const tokens = query.length > 0 ? query.split(/\s+/).filter(Boolean) : [];

    const filtered = allJobs.filter(job => {
      const matchesDept = dept === 'ALL' || (job.department && job.department.toLowerCase() === dept.toLowerCase());
      const matchesLoc = loc === 'ALL' || (job.location && job.location.toLowerCase().includes(loc.toLowerCase()));
      const matchesType = empType === 'ALL' || (job.type && job.type.toLowerCase().includes(empType.toLowerCase()));
      
      let matchesQuery = true;
      if (tokens.length > 0) {
        // Build rich corpus of all searchable fields: title, dept, location, type, description, tags, responsibilities, requirements
        const corpus = [
          job.title || '',
          job.department || '',
          job.location || '',
          job.type || '',
          job.description || '',
          ...(job.tags || []),
          ...(job.responsibilities || []),
          ...(job.requirements || [])
        ].join(' ').toLowerCase();

        matchesQuery = tokens.every(token => corpus.includes(token));
      }

      return matchesDept && matchesLoc && matchesType && matchesQuery;
    });

    // Update empty state contextual message if no matches
    if (filtered.length === 0 && emptyStateMessage) {
      if (rawQuery.trim() && dept !== 'ALL') {
        emptyStateMessage.textContent = `No open roles match "${rawQuery.trim()}" in ${dept}. Try clearing your filters or refining your keywords.`;
      } else if (rawQuery.trim()) {
        emptyStateMessage.textContent = `No open roles match "${rawQuery.trim()}". Try searching for different skills or keywords.`;
      } else if (dept !== 'ALL') {
        emptyStateMessage.textContent = `No open roles currently listed under the ${dept} department.`;
      } else if (loc !== 'ALL') {
        emptyStateMessage.textContent = `No open roles currently listed in ${loc}.`;
      } else {
        emptyStateMessage.textContent = `We couldn't find any job openings matching your current search or filter selections.`;
      }
    }

    renderJobsGrid(filtered, isFiltered);
  }

  function resetFilters() {
    searchInput.value = '';
    btnClearSearch.style.display = 'none';
    filterDepartment.value = 'ALL';
    if (filterLocation) filterLocation.value = 'ALL';
    if (filterType) filterType.value = 'ALL';
    if (btnClearFiltersHeader) {
      btnClearFiltersHeader.style.display = 'none';
    }
    applyFilters();
  }

  // Open Details Modal
  function openJobDetailsModal(job, pushState = true) {
    if (!job) return;
    currentJob = job;
    if (modalJobTitle) modalJobTitle.textContent = job.title;
    if (modalJobDept) modalJobDept.textContent = job.department;
    if (modalJobMeta) modalJobMeta.textContent = `${job.location} • ${job.type || 'Full-time'}`;
    if (modalJobSalary) modalJobSalary.textContent = job.salary;
    if (modalJobExperience) modalJobExperience.textContent = job.experience;
    if (modalJobType) modalJobType.textContent = job.type || 'Full-time';
    if (modalJobLocation) modalJobLocation.textContent = job.location;
    if (modalJobPosted) modalJobPosted.textContent = `Posted ${job.posted}`;
    if (modalJobDescription) modalJobDescription.textContent = job.description;

    if (modalJobResponsibilities) {
      modalJobResponsibilities.innerHTML = (job.responsibilities || [])
        .map(r => `<li>${escapeHtml(r)}</li>`).join('');
    }

    if (modalJobRequirements) {
      modalJobRequirements.innerHTML = (job.requirements || [])
        .map(req => `<li>${escapeHtml(req)}</li>`).join('');
    }

    if (modalJobTags) {
      modalJobTags.innerHTML = (job.tags || [])
        .map(tag => `<span class="skill-tag">${escapeHtml(tag)}</span>`).join('');
    }

    if (jobDetailsModal) {
      jobDetailsModal.style.display = 'flex';
    }

    if (pushState && window.location.hash !== `#job=${job.id}`) {
      window.history.pushState({ modal: 'job-details', jobId: job.id }, '', `#job=${job.id}`);
    }
  }

  function closeDetailsModal(popHistory = false) {
    jobDetailsModal.style.display = 'none';
    if (popHistory && window.location.hash.startsWith('#job=')) {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
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

  // =========================================================================
  // Candidate Self-Service Dashboard Logic
  // =========================================================================
  function openCandidateModal() {
    candidateModal.style.display = 'flex';
    const lastEmail = localStorage.getItem('careerhub_last_applied_email');
    if (lastEmail) {
      if (btnUseLastEmail) btnUseLastEmail.style.display = 'inline-block';
      if (!candidateEmailInput.value) {
        candidateEmailInput.value = lastEmail;
        lookupCandidateApps(lastEmail);
      }
    }
  }

  function closeCandidateModal() {
    candidateModal.style.display = 'none';
  }

  async function lookupCandidateApps(explicitEmail) {
    const email = (explicitEmail || candidateEmailInput.value || '').trim();
    if (!email) {
      candidateEmailInput.focus();
      return;
    }

    try {
      btnLookupCandidate.disabled = true;
      btnLookupCandidate.textContent = 'Searching...';

      const res = await fetch(`/api/candidate/applications?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      const apps = data.applications || [];

      candidateCurrentEmail.textContent = email;
      candidateAppsCount.textContent = `${apps.length} Application${apps.length === 1 ? '' : 's'}`;

      if (apps.length === 0) {
        candidateResultsContainer.style.display = 'none';
        candidateEmptyState.style.display = 'block';
      } else {
        candidateEmptyState.style.display = 'none';
        candidateResultsContainer.style.display = 'block';

        candidateAppsList.innerHTML = apps.map(app => {
          const matchingJob = allJobs.find(j => j.id === app.jobId);
          const jobTitle = matchingJob ? matchingJob.title : (app.jobTitle || app.jobId);
          const dept = matchingJob ? matchingJob.department : (app.department || 'Engineering');
          const statusClass = getStatusBadgeClass(app.status);
          const dateStr = new Date(app.submittedAt).toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          });

          return `
            <div class="candidate-app-item">
              <div class="candidate-app-info">
                <div class="candidate-app-title">${escapeHtml(jobTitle)}</div>
                <div class="candidate-app-meta">
                  <span>Tracking ID: <span class="candidate-app-ticket">${escapeHtml(app.applicationId)}</span></span>
                  <span>•</span>
                  <span>Dept: ${escapeHtml(dept)}</span>
                  <span>•</span>
                  <span>Submitted: ${escapeHtml(dateStr)}</span>
                </div>
              </div>
              <div>
                <span class="badge-status ${statusClass}">${escapeHtml(app.status || 'New')}</span>
              </div>
            </div>
          `;
        }).join('');
      }
    } catch (err) {
      candidateResultsContainer.style.display = 'none';
      candidateEmptyState.style.display = 'block';
      const heading = candidateEmptyState.querySelector('h3');
      if (heading) heading.textContent = 'Lookup Error';
      const text = candidateEmptyState.querySelector('p');
      if (text) text.textContent = 'Unable to fetch applications from server.';
    } finally {
      btnLookupCandidate.disabled = false;
      btnLookupCandidate.textContent = 'Search Applications';
    }
  }

  // =========================================================================
  // Recruiter Admin Portal Logic
  // =========================================================================
  function openAdminModal() {
    adminModal.style.display = 'flex';
    const key = sessionStorage.getItem('careerhub_admin_key');
    if (key) {
      verifyAndLoadAdminDashboard(key);
    } else {
      showAdminLogin();
    }
  }

  function closeAdminModal() {
    adminModal.style.display = 'none';
  }

  function showAdminLogin() {
    adminLoginView.style.display = 'block';
    adminDashboardView.style.display = 'none';
    adminAuthBadge.textContent = 'Authentication Required';
    adminAuthBadge.style.color = '#F59E0B';
    adminAuthBadge.style.borderColor = 'rgba(245, 158, 11, 0.4)';
    if (adminLoginError) adminLoginError.style.display = 'none';
    if (adminPasskey) adminPasskey.value = '';
  }

  async function verifyAndLoadAdminDashboard(key) {
    try {
      const overviewRes = await fetch('/api/admin/overview', {
        headers: { 'X-Admin-Key': key }
      });

      if (!overviewRes.ok) {
        sessionStorage.removeItem('careerhub_admin_key');
        showAdminLogin();
        if (adminLoginError) {
          adminLoginError.textContent = 'Invalid administrative passkey or unauthorized access.';
          adminLoginError.style.display = 'block';
        }
        return false;
      }

      const overviewData = await overviewRes.json();
      sessionStorage.setItem('careerhub_admin_key', key);

      // Switch view
      adminLoginView.style.display = 'none';
      adminDashboardView.style.display = 'block';
      adminAuthBadge.textContent = 'Admin Authenticated';
      adminAuthBadge.style.color = '#10B981';
      adminAuthBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';

      // Update metrics
      updateAdminMetrics(overviewData.metrics);

      // Fetch applications list
      await fetchAdminApplications(key);
      return true;
    } catch (err) {
      if (adminLoginError) {
        adminLoginError.textContent = 'Failed to connect to admin API.';
        adminLoginError.style.display = 'block';
      }
      return false;
    }
  }

  function updateAdminMetrics(metrics) {
    if (!metrics) return;
    if (adminMetricTotal) adminMetricTotal.textContent = metrics.total || 0;
    if (adminMetricNew) adminMetricNew.textContent = metrics.new || 0;
    if (adminMetricReview) adminMetricReview.textContent = metrics.underReview || 0;
    if (adminMetricShortlist) adminMetricShortlist.textContent = metrics.shortlisted || 0;
    if (adminMetricRejected) adminMetricRejected.textContent = metrics.rejected || 0;
  }

  async function fetchAdminApplications(key) {
    try {
      const res = await fetch('/api/admin/applications', {
        headers: { 'X-Admin-Key': key }
      });
      if (res.ok) {
        const data = await res.json();
        adminApplications = data.applications || [];
        renderAdminApplications();
      }
    } catch (_) {}
  }

  function renderAdminApplications() {
    const query = (adminSearchInput ? adminSearchInput.value : '').trim().toLowerCase();
    const statusFilter = adminFilterStatus ? adminFilterStatus.value : 'ALL';

    const filtered = adminApplications.filter(app => {
      const matchesStatus = statusFilter === 'ALL' || (app.status || 'New').toLowerCase() === statusFilter.toLowerCase();
      let matchesQuery = true;
      if (query) {
        const corpus = `${app.applicationId} ${app.fullName} ${app.email} ${app.jobTitle || app.jobId}`.toLowerCase();
        matchesQuery = corpus.includes(query);
      }
      return matchesStatus && matchesQuery;
    });

    if (filtered.length === 0) {
      adminTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center" style="text-align: center; color: var(--text-dim); padding: 24px;">
            No applications match current criteria.
          </td>
        </tr>
      `;
      return;
    }

    adminTableBody.innerHTML = filtered.map(app => {
      const matchingJob = allJobs.find(j => j.id === app.jobId);
      const jobTitle = matchingJob ? matchingJob.title : (app.jobTitle || app.jobId);
      const statusClass = getStatusBadgeClass(app.status);
      const dateStr = new Date(app.submittedAt).toLocaleDateString([], {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      return `
        <tr id="admin-row-${app.applicationId}">
          <td><code style="color: #818CF8; font-weight: 700;">${escapeHtml(app.applicationId)}</code></td>
          <td>
            <strong>${escapeHtml(app.fullName)}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(app.email)}</div>
          </td>
          <td>${escapeHtml(jobTitle)}</td>
          <td>${escapeHtml(String(app.experience))} yrs</td>
          <td>${escapeHtml(dateStr)}</td>
          <td><span class="badge-status ${statusClass}" id="badge-${app.applicationId}">${escapeHtml(app.status || 'New')}</span></td>
          <td>
            <select class="admin-status-select" data-app-id="${app.applicationId}" aria-label="Update status for ${escapeHtml(app.fullName)}">
              <option value="New" ${app.status === 'New' ? 'selected' : ''}>New</option>
              <option value="Under Review" ${app.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
              <option value="Shortlisted" ${app.status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option>
              <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');

    // Attach change handlers to status selectors
    adminTableBody.querySelectorAll('.admin-status-select').forEach(select => {
      select.addEventListener('change', async (e) => {
        const appId = e.target.getAttribute('data-app-id');
        const newStatus = e.target.value;
        await updateApplicationStatus(appId, newStatus, select);
      });
    });
  }

  async function updateApplicationStatus(applicationId, newStatus, selectEl) {
    const key = sessionStorage.getItem('careerhub_admin_key');
    if (!key) return;

    try {
      selectEl.disabled = true;
      const res = await fetch(`/api/admin/applications/${encodeURIComponent(applicationId)}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': key
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // Update local state
        const target = adminApplications.find(a => a.applicationId === applicationId || a.id === applicationId);
        if (target) target.status = newStatus;

        // Update badge
        const badge = document.getElementById(`badge-${applicationId}`);
        if (badge) {
          badge.textContent = newStatus;
          badge.className = `badge-status ${getStatusBadgeClass(newStatus)}`;
        }

        // Refresh overview metrics
        const overviewRes = await fetch('/api/admin/overview', {
          headers: { 'X-Admin-Key': key }
        });
        if (overviewRes.ok) {
          const overviewData = await overviewRes.json();
          updateAdminMetrics(overviewData.metrics);
        }
      }
    } catch (_) {
    } finally {
      selectEl.disabled = false;
    }
  }

  function getStatusBadgeClass(status) {
    const s = (status || 'New').toLowerCase();
    if (s.includes('review')) return 'badge-status-review';
    if (s.includes('shortlist')) return 'badge-status-shortlisted';
    if (s.includes('reject')) return 'badge-status-rejected';
    return 'badge-status-new';
  }

  function clearSingleFieldError(fieldInput, errorSpan) {
    if (fieldInput) {
      fieldInput.classList.remove('is-invalid');
      fieldInput.removeAttribute('aria-invalid');
      fieldInput.removeAttribute('aria-describedby');
    }
    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.style.display = 'none';
    }
  }

  function clearFormErrors() {
    const errorSpans = [errorName, errorEmail, errorPhone, errorExperience, errorResume, errorCoverLetter, errorConsent].filter(Boolean);
    errorSpans.forEach(span => {
      span.textContent = '';
      span.style.display = 'none';
    });

    const inputs = [applicantName, applicantEmail, applicantPhone, applicantExperience, applicantResume, applicantCoverLetter].filter(Boolean);
    inputs.forEach(input => {
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    });
  }

  function setFieldError(fieldInput, errorSpan, message) {
    if (fieldInput) {
      fieldInput.classList.add('is-invalid');
      fieldInput.setAttribute('aria-invalid', 'true');
      if (errorSpan && errorSpan.id) {
        fieldInput.setAttribute('aria-describedby', errorSpan.id);
      }
    }
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.style.display = 'block';
    }
  }

  // Client-Side Validation
  function validateForm() {
    clearFormErrors();
    let isValid = true;

    // 1. Full Name: Required, min 2 chars, max 60 chars, no whitespace-only
    const nameVal = applicantName.value;
    const trimmedName = nameVal.trim();
    if (!trimmedName) {
      setFieldError(applicantName, errorName, 'Full name cannot be empty or only spaces.');
      isValid = false;
    } else if (trimmedName.length < 2) {
      setFieldError(applicantName, errorName, 'Full name must be at least 2 characters.');
      isValid = false;
    } else if (trimmedName.length > 60) {
      setFieldError(applicantName, errorName, 'Full name cannot exceed 60 characters.');
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
    if (!phoneVal) {
      setFieldError(applicantPhone, errorPhone, 'Phone number is required.');
      isValid = false;
    } else if (!/^\d{10}$/.test(phoneVal)) {
      setFieldError(applicantPhone, errorPhone, 'Phone number must be exactly 10 numeric digits.');
      isValid = false;
    }

    // 4. Experience: 0 to 40 years
    const expVal = String(applicantExperience.value).trim();
    if (expVal === '' || isNaN(Number(expVal))) {
      setFieldError(applicantExperience, errorExperience, 'Experience is required.');
      isValid = false;
    } else {
      const expNum = Number(expVal);
      if (expNum < 0) {
        setFieldError(applicantExperience, errorExperience, 'Experience cannot be negative.');
        isValid = false;
      } else if (expNum > 40) {
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
      const fileExt = '.' + (file.name.split('.').pop() || '').toLowerCase();
      if (!validExts.includes(fileExt)) {
        setFieldError(applicantResume, errorResume, 'Only .pdf, .doc, and .docx formats are permitted.');
        isValid = false;
      } else if (file.size > 5 * 1024 * 1024) {
        setFieldError(applicantResume, errorResume, 'File size exceeds maximum limit of 5MB.');
        isValid = false;
      }
    }

    // 6. Cover Letter (Optional, max 1000 characters)
    if (applicantCoverLetter && errorCoverLetter) {
      const coverVal = applicantCoverLetter.value || '';
      if (coverVal.length > 1000) {
        setFieldError(applicantCoverLetter, errorCoverLetter, 'Cover letter cannot exceed 1000 characters.');
        isValid = false;
      }
    }

    // 7. Consent Checkbox
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
        try {
          localStorage.setItem('careerhub_last_applied_email', payload.email);
        } catch (_) {}
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
      qaStatusPill.textContent = 'Server: Data Store Reset';
      qaStatusPill.style.color = '#10B981';
      qaStatusPill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      setTimeout(updateQAStatus, 1500);
    } catch {
      qaStatusPill.textContent = 'Server: Reset Failed';
      qaStatusPill.style.color = '#EF4444';
      qaStatusPill.style.borderColor = 'rgba(239, 68, 68, 0.4)';
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
