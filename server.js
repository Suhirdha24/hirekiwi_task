// Native Node.js Server for Mock Job Application Portal
try {
  require('dotenv').config();
} catch (e) {}

const http = require('http');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Public DNS for reliable SRV resolution on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'src');

// MongoDB Atlas Integration State
let mongoClient = null;
let submissionsCollection = null;
let isMongoConnected = false;

async function initMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[Database] No MONGODB_URI found; operating in local in-memory mode.');
    return;
  }
  try {
    const { MongoClient } = require('mongodb');
    mongoClient = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await mongoClient.connect();
    const db = mongoClient.db('careerhub');
    submissionsCollection = db.collection('submissions');
    isMongoConnected = true;
    console.log('[MongoDB Atlas] Connected successfully to cluster0.lo94xku.mongodb.net/careerhub');

    const existing = await submissionsCollection.find().toArray();
    if (existing && existing.length > 0) {
      submissions = existing.map(doc => {
        const { _id, ...rest } = doc;
        return rest;
      });
      console.log(`[MongoDB Atlas] Synced ${submissions.length} submission(s) into active session store.`);
    }
  } catch (err) {
    console.warn('[MongoDB Atlas] Connection failed; running in fallback in-memory mode:', err.message);
  }
}

// In-Memory Database for local mock testing
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

// In-Memory Submissions Store: keyed by jobId + email
let submissions = [];

// Simulation State Configuration (Can also be overridden per request via query params)
let serverSimulation = {
  simulate500: false,
  simulateDelayMs: 0
};

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

  // Enable CORS & JSON headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Simulate-Error, X-Simulate-Delay');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Routes
  if (pathname.startsWith('/api/')) {
    // 1. GET /api/jobs
    if (pathname === '/api/jobs' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ jobs }));
      return;
    }

    // 2. GET /api/jobs/:id
    if (pathname.startsWith('/api/jobs/') && req.method === 'GET') {
      const id = pathname.replace('/api/jobs/', '');
      const job = jobs.find(j => j.id === id);
      if (job) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ job }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Job opening not found' }));
      }
      return;
    }

    // 3. POST /api/apply
    if (pathname === '/api/apply' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');

          // Check simulation overrides via query or header or server toggle
          const sim500 = parsedUrl.searchParams.get('simulate500') === 'true' || 
                         req.headers['x-simulate-error'] === '500' || 
                         serverSimulation.simulate500;

          const delayMs = parseInt(parsedUrl.searchParams.get('delay') || req.headers['x-simulate-delay'] || serverSimulation.simulateDelayMs, 10) || 0;

          const executeHandler = () => {
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

            // Input Validation
            const fullName = (data.fullName || '').trim();
            const email = (data.email || '').trim().toLowerCase();
            const phone = (data.phone || '').trim();
            const experience = data.experience;
            const jobId = (data.jobId || '').trim();

            if (!jobId) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Missing Job ID reference.' }));
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

            if (experience !== undefined && (experience < 0 || experience > 40)) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ field: 'experience', error: 'Experience must be between 0 and 40 years.' }));
              return;
            }

            if (!data.consent) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ field: 'consent', error: 'You must agree to the data processing terms.' }));
              return;
            }

            // Duplicate Application Prevention (Check if same email already submitted for this job)
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

            // Save new application
            const applicationId = `APP-${Date.now().toString().slice(-6)}`;
            const submissionRecord = {
              applicationId,
              jobId,
              fullName,
              email,
              phone: phoneDigits,
              experience: experience || 0,
              resumeName: data.resumeName || 'resume.pdf',
              coverLetter: (data.coverLetter || '').trim(),
              submittedAt: new Date().toISOString()
            };
            submissions.push(submissionRecord);
            if (isMongoConnected && submissionsCollection) {
              submissionsCollection.insertOne({ ...submissionRecord }).catch(err => {
                console.error('[MongoDB Atlas] Insert error:', err.message);
              });
            }

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              status: 201,
              success: true,
              message: 'Application submitted successfully!',
              applicationId,
              submission: submissionRecord
            }));
          };

          if (delayMs > 0) {
            setTimeout(executeHandler, delayMs);
          } else {
            executeHandler();
          }

        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Malformed JSON payload.' }));
        }
      });
      return;
    }

    // 4. GET /api/submissions
    if (pathname === '/api/submissions' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        count: submissions.length,
        submissions,
        database: isMongoConnected ? 'MongoDB Atlas' : 'In-Memory Local'
      }));
      return;
    }

    // 5. POST /api/reset (Reset test submissions & toggle states)
    if (pathname === '/api/reset' && req.method === 'POST') {
      submissions = [];
      serverSimulation = { simulate500: false, simulateDelayMs: 0 };
      if (isMongoConnected && submissionsCollection) {
        submissionsCollection.deleteMany({}).catch(err => {
          console.error('[MongoDB Atlas] Reset error:', err.message);
        });
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Test submissions store and simulation states reset.' }));
      return;
    }

    // 6. POST /api/simulate
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

  // Static File Serving
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Fallback to index.html for SPA-style routing if file not found
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
