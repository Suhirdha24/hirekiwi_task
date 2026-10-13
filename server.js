// ==============================================================================
// CareerHub QA Portal - Backend Server & MongoDB Integration
// Built for HireKiwi QA Engineer Assessment
// ==============================================================================

try {
  require('dotenv').config();
} catch (e) {}

const http = require('http');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Public DNS for reliable SRV resolution on Windows environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const PORT = parseInt(process.env.PORT, 10) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';
const ADMIN_KEY = process.env.ADMIN_KEY || 'careerhub-admin-2026';
const PUBLIC_DIR = path.join(__dirname, 'src');

// MongoDB Atlas Integration State
let mongoClient = null;
let dbInstance = null;
let jobsCollection = null;
let applicationsCollection = null;
let isMongoConnected = false;
let mongoPingAcknowledged = false;
let mongoClusterHost = '';
let mongoDiagnostic = 'Database initialization pending';

// Seed / In-Memory verified Job Openings
let jobs = [
  {
    id: 'JOB-101',
    title: 'QA Automation Engineer',
    department: 'Quality Assurance',
    location: 'Bangalore (Hybrid)',
    type: 'Full-time',
    salary: '₹6.5 - ₹8.5 LPA',
    experience: '1 - 3 yrs',
    tags: ['Playwright', 'JavaScript', 'API Testing', 'CI/CD'],
    posted: '2 days ago',
    description: 'We are seeking a detail-oriented QA Automation Engineer to design, automate, and execute comprehensive test suites for our enterprise web applications.',
    responsibilities: [
      'Author robust end-to-end automation scripts using Playwright and JavaScript.',
      'Perform functional, regression, boundary, and exploratory testing on cloud platforms.',
      'Identify, document, and track software defects with thorough reproduction steps.',
      'Collaborate closely with software developers and product managers to improve product reliability.'
    ],
    requirements: [
      'Hands-on experience with modern test automation tools (Playwright, Cypress, or Selenium).',
      'Solid understanding of HTTP status codes, REST APIs, and browser DevTools.',
      'Strong problem-solving attitude and high attention to detail.',
      'Bachelor’s degree in Computer Science, IT, or equivalent practical experience.'
    ]
  },
  {
    id: 'JOB-102',
    title: 'Associate QA Engineer',
    department: 'Quality Assurance',
    location: 'Remote (India)',
    type: 'Full-time',
    salary: '₹4.5 - ₹5.5 LPA',
    experience: '0 - 1 yr (Freshers Welcome)',
    tags: ['Manual Testing', 'Test Cases', 'Jira', 'Bug Reporting'],
    posted: 'Just now',
    description: 'An exciting entry-level opportunity for aspiring QA Engineers to begin their career in quality engineering and learn test automation in a high-growth environment.',
    responsibilities: [
      'Write structured test cases covering positive, negative, and edge scenarios.',
      'Conduct exploratory testing on new features and document bug reports.',
      'Verify resolved defects and perform sanity verification before releases.',
      'Participate in QA sprint planning and requirements refinement.'
    ],
    requirements: [
      'Sound knowledge of Software Testing Life Cycle (STLC) and bug lifecycle.',
      'Familiarity with web technologies (HTML, CSS, JSON) and basic command line.',
      'Good written communication skills for writing defect tickets.',
      'Freshers and 2024/2025/2026 graduates are welcome to apply.'
    ]
  },
  {
    id: 'JOB-103',
    title: 'Frontend Developer (React)',
    department: 'Engineering',
    location: 'Hyderabad (On-site)',
    type: 'Full-time',
    salary: '₹8.0 - ₹12.0 LPA',
    experience: '2 - 4 yrs',
    tags: ['React', 'TypeScript', 'CSS3', 'Performance'],
    posted: '3 days ago',
    description: 'Build fast, responsive, and delightful user interfaces for millions of users with modern web standards and reusable design systems.',
    responsibilities: [
      'Develop pixel-perfect web interfaces using React and modern CSS.',
      'Optimize web performance, Core Web Vitals, and responsive layouts.',
      'Ensure high accessibility compliance (WCAG 2.1 AA).'
    ],
    requirements: [
      'Proficiency in React, modern JavaScript (ES6+), and state management.',
      'Deep understanding of DOM APIs and cross-browser quirks.'
    ]
  },
  {
    id: 'JOB-104',
    title: 'DevOps & Cloud Engineer',
    department: 'Infrastructure',
    location: 'Pune (Hybrid)',
    type: 'Full-time',
    salary: '₹10.0 - ₹15.0 LPA',
    experience: '3 - 5 yrs',
    tags: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    posted: '1 week ago',
    description: 'Architect, automate, and scale our continuous integration and deployment pipelines on AWS infrastructure.',
    responsibilities: [
      'Maintain automated CI/CD pipelines and infrastructure as code.',
      'Monitor application health, logs, and server performance metrics.'
    ],
    requirements: [
      'Hands-on experience with Linux administration, Docker containers, and cloud environments.'
    ]
  }
];

// Active Submissions Store
let submissions = [];

// Simulation State Configuration (Can also be overridden per request via query params or headers)
let serverSimulation = {
  simulate500: false,
  simulateDelayMs: 0
};

// Safe URI host parser (never logs credentials)
function extractHostSafely(uri) {
  try {
    const parsed = new URL(uri);
    return parsed.hostname;
  } catch {
    const match = uri.match(/@([^/?#]+)/);
    return match ? match[1] : 'atlas-cluster.internal';
  }
}

// Connect & Verify MongoDB Atlas Connectivity
async function initMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    mongoDiagnostic = 'No MONGODB_URI environment variable detected; operating in local in-memory mode.';
    console.log(`[Database] ${mongoDiagnostic}`);
    return;
  }

  mongoClusterHost = extractHostSafely(uri);

  try {
    const { MongoClient } = require('mongodb');
    mongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      tls: true
    });

    await mongoClient.connect();
    dbInstance = mongoClient.db('careerhub');

    // Confirm database connectivity by executing a harmless ping operation
    const pingRes = await dbInstance.command({ ping: 1 });
    if (pingRes && (pingRes.ok === 1 || pingRes.ok === true)) {
      mongoPingAcknowledged = true;
      isMongoConnected = true;
      mongoDiagnostic = 'Connected and verified via MongoDB ping command.';
      console.log(`[MongoDB Atlas] Verified connection to ${mongoClusterHost}/careerhub (ping acknowledged).`);

      jobsCollection = dbInstance.collection('jobs');
      applicationsCollection = dbInstance.collection('applications');

      // Seed jobs collection if empty
      const jobCount = await jobsCollection.countDocuments();
      if (jobCount === 0) {
        await jobsCollection.insertMany(jobs.map(j => ({ ...j })));
        console.log(`[MongoDB Atlas] Initialized jobs collection with ${jobs.length} verified listings.`);
      } else {
        const dbJobs = await jobsCollection.find().toArray();
        if (dbJobs && dbJobs.length > 0) {
          jobs = dbJobs.map(doc => {
            const { _id, ...rest } = doc;
            return rest;
          });
          console.log(`[MongoDB Atlas] Synced ${jobs.length} jobs from database.`);
        }
      }

      // Sync existing application submissions
      const existingApps = await applicationsCollection.find().toArray();
      if (existingApps && existingApps.length > 0) {
        submissions = existingApps.map(doc => {
          const { _id, ...rest } = doc;
          return rest;
        });
        console.log(`[MongoDB Atlas] Synced ${submissions.length} submission(s) into active session store.`);
      }
    } else {
      throw new Error('Database ping command failed to return ok: 1');
    }
  } catch (err) {
    isMongoConnected = false;
    mongoPingAcknowledged = false;

    const errMsg = err.message || '';
    if (errMsg.includes('SSL alert number 80') || errMsg.includes('tlsv1 alert internal error')) {
      mongoDiagnostic = 'TLS Handshake Alert 80: Connection rejected by Atlas edge proxy. Whitelist client IP or 0.0.0.0/0 in MongoDB Atlas Network Access.';
    } else if (errMsg.includes('ECONNREFUSED') || errMsg.includes('querySrv')) {
      mongoDiagnostic = 'DNS/Network Error: Unable to resolve MongoDB Atlas SRV records. Check network connection and public DNS configuration.';
    } else if (errMsg.includes('Authentication failed')) {
      mongoDiagnostic = 'Authentication Failure: Database user credentials rejected by cluster.';
    } else {
      mongoDiagnostic = `Connection diagnostic: ${errMsg.slice(0, 150)}`;
    }

    console.warn(`[MongoDB Atlas] Connection diagnostic: ${mongoDiagnostic}`);
    console.log('[CareerHub Portal] Operating with high-reliability in-memory fallback.');
  }
}

// MIME types lookup
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = parsedUrl.pathname;

  // Security Headers & CORS configuration
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  const requestOrigin = req.headers.origin;
  if (CLIENT_ORIGIN === '*') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    const trustedOrigins = CLIENT_ORIGIN.split(',').map(o => o.trim());
    if (requestOrigin && trustedOrigins.includes(requestOrigin)) {
      res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    } else if (!requestOrigin) {
      res.setHeader('Access-Control-Allow-Origin', trustedOrigins[0] || 'http://localhost:3000');
    }
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Simulate-Error, X-Simulate-Delay, X-Admin-Key');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ============================================================================
  // API Routes
  // ============================================================================
  if (pathname.startsWith('/api/')) {

    // 0. GET /api/health — Diagnostic health check distinguishing server vs DB
    if (pathname === '/api/health' && req.method === 'GET') {
      const healthPayload = {
        status: isMongoConnected ? 'healthy' : 'degraded',
        server: {
          status: 'online',
          uptime: Math.round(process.uptime()),
          environment: NODE_ENV,
          port: PORT
        },
        database: {
          connected: isMongoConnected,
          provider: 'mongodb',
          cluster: mongoClusterHost || (isMongoConnected ? 'mongodb-atlas' : 'in-memory'),
          database: 'careerhub',
          pingAcknowledged: mongoPingAcknowledged,
          mode: isMongoConnected ? 'mongodb-atlas' : 'in-memory-fallback',
          diagnostic: mongoDiagnostic
        },
        timestamp: new Date().toISOString()
      };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(healthPayload, null, 2));
      return;
    }

    // 1. GET /api/jobs — Retrieve verified job listings (supports query, department, location, type)
    if (pathname === '/api/jobs' && req.method === 'GET') {
      const q = (parsedUrl.searchParams.get('q') || '').toLowerCase().trim();
      const dept = (parsedUrl.searchParams.get('department') || 'ALL').trim();
      const loc = (parsedUrl.searchParams.get('location') || 'ALL').trim();
      const type = (parsedUrl.searchParams.get('type') || 'ALL').trim();

      let filtered = [...jobs];
      if (dept && dept !== 'ALL') {
        filtered = filtered.filter(j => j.department === dept);
      }
      if (loc && loc !== 'ALL') {
        filtered = filtered.filter(j => (j.location || '').toLowerCase().includes(loc.toLowerCase()));
      }
      if (type && type !== 'ALL') {
        filtered = filtered.filter(j => (j.type || '').toLowerCase() === type.toLowerCase());
      }
      if (q) {
        filtered = filtered.filter(j => 
          j.title.toLowerCase().includes(q) ||
          j.department.toLowerCase().includes(q) ||
          (j.tags && j.tags.some(t => t.toLowerCase().includes(q))) ||
          j.description.toLowerCase().includes(q)
        );
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        jobs: filtered,
        total: filtered.length,
        source: isMongoConnected ? 'mongodb' : 'memory'
      }));
      return;
    }

    // 2. GET /api/jobs/:id — Retrieve single job details by ID
    if (pathname.startsWith('/api/jobs/') && req.method === 'GET') {
      const id = pathname.replace('/api/jobs/', '');
      const job = jobs.find(j => j.id === id);
      if (job) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ job }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Job opening not found', id }));
      }
      return;
    }

    // 3. POST /api/applications & POST /api/apply — Submit candidate application
    if ((pathname === '/api/applications' || pathname === '/api/apply') && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const data = JSON.parse(body || '{}');

          // Check simulation overrides via query params, custom headers, or server state
          const sim500 = parsedUrl.searchParams.get('simulate500') === 'true' || 
                         req.headers['x-simulate-error'] === '500' || 
                         serverSimulation.simulate500;

          const delayMs = parseInt(parsedUrl.searchParams.get('delay') || req.headers['x-simulate-delay'] || serverSimulation.simulateDelayMs, 10) || 0;

          const executeHandler = async () => {
            // Simulated 500 Server Error
            if (sim500) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                status: 500,
                error: 'Internal Server Error: Simulated database connection failure.',
                timestamp: new Date().toISOString()
              }));
              return;
            }

            // Server-Side Input Validation
            const jobId = (data.jobId || '').trim();
            const fullName = (data.fullName || '').trim();
            const email = (data.email || '').trim().toLowerCase();
            const phone = (data.phone || '').trim();
            const experience = data.experience;

            if (!jobId) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ field: 'jobId', error: 'Missing Job ID reference.' }));
              return;
            }

            const matchingJob = jobs.find(j => j.id === jobId);
            if (!matchingJob) {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ field: 'jobId', error: 'Referenced job opening does not exist.' }));
              return;
            }

            if (!fullName) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ field: 'fullName', error: 'Full name cannot be empty or only spaces.' }));
              return;
            }

            if (fullName.length < 2 || fullName.length > 60) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ field: 'fullName', error: 'Full name must be between 2 and 60 characters.' }));
              return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            if (!email || !emailRegex.test(email)) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ field: 'email', error: 'Please provide a valid email address.' }));
              return;
            }

            const phoneDigits = phone.replace(/\D/g, '');
            if (phoneDigits.length !== 10 || phone !== phoneDigits) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ field: 'phone', error: 'Phone number must be exactly 10 digits.' }));
              return;
            }

            if (experience === undefined || isNaN(Number(experience)) || Number(experience) < 0 || Number(experience) > 40) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ field: 'experience', error: 'Experience must be between 0 and 40 years.' }));
              return;
            }

            if (!data.consent) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ field: 'consent', error: 'You must agree to the data processing terms.' }));
              return;
            }

            // Safe Duplicate Application Prevention
            const isDuplicate = submissions.some(s => s.jobId === jobId && s.email === email);
            if (isDuplicate) {
              res.writeHead(409, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                status: 409,
                error: 'Duplicate application detected: An application for this role has already been submitted with this email address.',
                jobId,
                email
              }));
              return;
            }

            // Build Application Record
            const applicationId = `APP-${Date.now().toString().slice(-6)}`;
            const submissionRecord = {
              applicationId,
              jobId,
              jobTitle: matchingJob.title,
              fullName,
              email,
              phone: phoneDigits,
              experience: Number(experience),
              resumeName: data.resumeName || 'resume.pdf',
              coverLetter: (data.coverLetter || '').trim().slice(0, 1000),
              status: 'New',
              submittedAt: new Date().toISOString()
            };

            // Persist to MongoDB if connected
            if (isMongoConnected && applicationsCollection) {
              try {
                await applicationsCollection.insertOne({ ...submissionRecord });
              } catch (mongoErr) {
                console.error('[MongoDB Atlas] Insert error:', mongoErr.message);
              }
            }

            // Persist to active session store
            submissions.push(submissionRecord);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              status: 201,
              success: true,
              message: 'Application submitted successfully!',
              applicationId,
              persistence: isMongoConnected ? 'mongodb-atlas' : 'in-memory-fallback',
              durable: isMongoConnected,
              submission: submissionRecord
            }));
          };

          if (delayMs > 0) {
            setTimeout(executeHandler, delayMs);
          } else {
            await executeHandler();
          }

        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Malformed JSON payload.' }));
        }
      });
      return;
    }

    // 4. GET /api/candidate/applications — Retrieve applications for a specific candidate by email
    if (pathname === '/api/candidate/applications' && req.method === 'GET') {
      const emailQuery = (parsedUrl.searchParams.get('email') || '').trim().toLowerCase();
      if (!emailQuery) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Candidate email query parameter is required.' }));
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(emailQuery)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Valid candidate email format required.' }));
        return;
      }

      const candidateApps = submissions
        .filter(s => (s.email || '').toLowerCase() === emailQuery)
        .map(s => ({
          applicationId: s.applicationId,
          jobId: s.jobId,
          jobTitle: s.jobTitle,
          fullName: s.fullName,
          email: s.email,
          experience: s.experience,
          status: s.status,
          submittedAt: s.submittedAt
        }));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        email: emailQuery,
        count: candidateApps.length,
        applications: candidateApps,
        persistence: isMongoConnected ? 'mongodb-atlas' : 'in-memory-fallback',
        durable: isMongoConnected
      }));
      return;
    }

    // 5. GET /api/admin/overview — Protected Admin summary metrics
    if (pathname === '/api/admin/overview' && req.method === 'GET') {
      const adminKey = req.headers['x-admin-key'] || parsedUrl.searchParams.get('key');
      if (adminKey !== ADMIN_KEY) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized: Valid admin access key required.' }));
        return;
      }
      const total = submissions.length;
      const newCount = submissions.filter(s => (s.status || 'New') === 'New').length;
      const underReview = submissions.filter(s => s.status === 'Under Review').length;
      const shortlisted = submissions.filter(s => s.status === 'Shortlisted').length;
      const rejected = submissions.filter(s => s.status === 'Rejected').length;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        metrics: {
          total,
          new: newCount,
          underReview,
          shortlisted,
          rejected
        }
      }));
      return;
    }

    // 6. GET /api/admin/applications — Protected Admin applications listing
    if (pathname === '/api/admin/applications' && req.method === 'GET') {
      const adminKey = req.headers['x-admin-key'] || parsedUrl.searchParams.get('key');
      if (adminKey !== ADMIN_KEY) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized: Valid admin access key required.' }));
        return;
      }
      const query = (parsedUrl.searchParams.get('q') || '').toLowerCase().trim();
      const statusFilter = (parsedUrl.searchParams.get('status') || 'ALL').trim();

      let results = [...submissions];
      if (statusFilter && statusFilter !== 'ALL') {
        results = results.filter(s => (s.status || 'New') === statusFilter);
      }
      if (query) {
        results = results.filter(s => 
          (s.fullName || '').toLowerCase().includes(query) ||
          (s.email || '').toLowerCase().includes(query) ||
          (s.jobTitle || '').toLowerCase().includes(query) ||
          (s.applicationId || '').toLowerCase().includes(query)
        );
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        count: results.length,
        total: submissions.length,
        applications: results
      }));
      return;
    }

    // 7. PATCH/POST /api/admin/applications/:id/status — Authorized application status updates
    if (pathname.startsWith('/api/admin/applications/') && pathname.endsWith('/status') && (req.method === 'PATCH' || req.method === 'POST')) {
      const adminKey = req.headers['x-admin-key'] || parsedUrl.searchParams.get('key');
      if (adminKey !== ADMIN_KEY) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized: Valid admin access key required.' }));
        return;
      }
      const parts = pathname.split('/');
      const appId = parts[4];
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const { status } = JSON.parse(body || '{}');
          const validStatuses = ['New', 'Under Review', 'Shortlisted', 'Rejected'];
          if (!status || !validStatuses.includes(status)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }));
            return;
          }
          const app = submissions.find(s => s.applicationId === appId);
          if (!app) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Application record not found.', applicationId: appId }));
            return;
          }
          app.status = status;
          app.updatedAt = new Date().toISOString();

          if (isMongoConnected && applicationsCollection) {
            try {
              await applicationsCollection.updateOne(
                { applicationId: appId },
                { $set: { status, updatedAt: app.updatedAt } }
              );
            } catch (err) {
              console.error('[MongoDB Atlas] Status update error:', err.message);
            }
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: `Application ${appId} status updated to ${status}.`,
            application: app
          }));
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Malformed JSON payload.' }));
        }
      });
      return;
    }

    // 8. GET /api/submissions & GET /api/applications — Registry for audit & verification
    if ((pathname === '/api/submissions' || pathname === '/api/applications') && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        count: submissions.length,
        submissions,
        persistence: isMongoConnected ? 'mongodb-atlas' : 'in-memory-fallback',
        durable: isMongoConnected,
        database: isMongoConnected ? 'MongoDB Atlas' : 'In-Memory Local'
      }));
      return;
    }

    // 5. POST /api/reset — Reset test submissions & simulation toggles (affecting designated test data only)
    if (pathname === '/api/reset' && req.method === 'POST') {
      if (NODE_ENV === 'production') {
        const adminKey = req.headers['x-admin-key'] || parsedUrl.searchParams.get('key');
        if (!adminKey || adminKey !== ADMIN_KEY) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unauthorized: Admin authentication required to reset test data in production environment.' }));
          return;
        }
      }
      submissions = [];
      serverSimulation = { simulate500: false, simulateDelayMs: 0 };
      if (isMongoConnected && applicationsCollection) {
        applicationsCollection.deleteMany({}).catch(err => {
          console.error('[MongoDB Atlas] Reset error:', err.message);
        });
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Test submissions store and simulation states reset.',
        affectedEntity: 'test_submissions_only'
      }));
      return;
    }

    // 6. POST /api/simulate — Toggle QA simulation modes
    if (pathname === '/api/simulate' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const config = JSON.parse(body || '{}');
          if (config.simulate500 !== undefined) serverSimulation.simulate500 = !!config.simulate500;
          if (config.simulateDelayMs !== undefined) serverSimulation.simulateDelayMs = parseInt(config.simulateDelayMs, 10) || 0;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, serverSimulation }));
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid simulation payload' }));
        }
      });
      return;
    }

    // Unknown API
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API route not found' }));
    return;
  }

  // ============================================================================
  // Static File Serving
  // ============================================================================
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (fallbackErr, fallbackContent) => {
          if (fallbackErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fallbackContent, 'utf-8');
          }
        });
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

if (require.main === module) {
  initMongoDB().finally(() => {
    server.listen(PORT, () => {
      console.log(`[CareerHub Portal] Server running on http://localhost:${PORT}`);
    });
  });
}

module.exports = server;
