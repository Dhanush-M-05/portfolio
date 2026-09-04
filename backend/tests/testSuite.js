const http = require('http');
const app = require('../src/app');
const environment = require('../src/config/environment');
const { prisma, connectDatabase, disconnectDatabase } = require('../src/config/database');
const { setTransporter, escapeHtml } = require('../src/services/emailService');

const TEST_PORT = 5099;
let server;
let adminToken = '';

// Helper for HTTP requests
async function request(path, options = {}) {
  const url = `http://localhost:${TEST_PORT}${path}`;
  const method = options.method || 'GET';
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const fetchOptions = {
    method,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    fetchOptions.body = JSON.stringify(options.body);
  } else if (options.body) {
    fetchOptions.body = options.body;
  }

  const response = await fetch(url, fetchOptions);
  let json = null;
  let text = '';
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    json = await response.json();
  } else {
    text = await response.text();
  }

  return {
    status: response.status,
    headers: response.headers,
    json,
    text,
  };
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✔ PASS: ${message}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Starting Backend Automated Test Suite');
  console.log('====================================================\n');

  try {
    await connectDatabase();

    await new Promise((resolve) => {
      server = app.listen(TEST_PORT, () => {
        console.log(`Test server running on port ${TEST_PORT}\n`);
        resolve();
      });
    });

    // 1. Health Check
    console.log('--- 1. Health Check ---');
    const healthRes = await request('/api/health');
    assert(healthRes.status === 200, 'Health check returns 200 status');
    assert(healthRes.json?.database === 'connected', 'Database is reported as connected');
    assert(healthRes.json?.success === true, 'Success flag is true');

    // 2. Authentication
    console.log('\n--- 2. Authentication Tests ---');
    const badLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: environment.ADMIN_EMAIL, password: 'WrongPassword@123' },
    });
    assert(badLoginRes.status === 401, 'Invalid password returns 401 Unauthorized');
    assert(badLoginRes.json?.success === false, 'Invalid login response success is false');

    const goodLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: environment.ADMIN_EMAIL, password: environment.ADMIN_PASSWORD },
    });
    assert(goodLoginRes.status === 200, 'Valid admin login returns 200 OK');
    assert(!!goodLoginRes.json?.data?.token, 'Login returns JWT token');
    assert(goodLoginRes.json?.data?.user?.email === environment.ADMIN_EMAIL, 'Login returns user email');
    assert(!goodLoginRes.json?.data?.user?.password, 'Login NEVER returns password hash');

    adminToken = goodLoginRes.json?.data?.token;

    // 3. JWT Protection
    console.log('\n--- 3. JWT Protection Tests ---');
    const unauthMe = await request('/api/auth/me');
    assert(unauthMe.status === 401, 'GET /api/auth/me without token returns 401');

    const authMe = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(authMe.status === 200, 'GET /api/auth/me with valid Bearer token returns 200');
    assert(authMe.json?.data?.email === environment.ADMIN_EMAIL, 'GET /api/auth/me returns current admin');
    assert(!authMe.json?.data?.password, 'Admin info does not expose password');

    // 4. Profile CMS
    console.log('\n--- 4. Profile CMS Tests ---');
    const profileRes = await request('/api/profile');
    assert(profileRes.status === 200, 'GET /api/profile returns 200');
    assert(profileRes.json?.data?.name === 'Dhanush M', 'Profile name is Dhanush M');

    const updateProfileRes = await request('/api/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { shortBio: 'Updated short bio for verification.' },
    });
    assert(updateProfileRes.status === 200, 'PUT /api/profile returns 200');
    assert(updateProfileRes.json?.data?.shortBio === 'Updated short bio for verification.', 'Profile shortBio updated');

    // 5. Hero CMS
    console.log('\n--- 5. Hero CMS Tests ---');
    const heroRes = await request('/api/hero');
    assert(heroRes.status === 200, 'GET /api/hero returns 200');
    assert(heroRes.json?.data?.subtitle === 'Dhanush M', 'Hero subtitle is Dhanush M');

    const updateHeroRes = await request('/api/hero', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { primaryButtonText: 'Explore Work' },
    });
    assert(updateHeroRes.status === 200, 'PUT /api/hero returns 200');
    assert(updateHeroRes.json?.data?.primaryButtonText === 'Explore Work', 'Hero button text updated');

    // 6. About CMS
    console.log('\n--- 6. About CMS Tests ---');
    const aboutRes = await request('/api/about');
    assert(aboutRes.status === 200, 'GET /api/about returns 200');
    assert(aboutRes.json?.data?.title === 'Professional Summary', 'About title matches');

    // 7. Services CMS
    console.log('\n--- 7. Services CMS Tests ---');
    const servicesRes = await request('/api/services');
    assert(servicesRes.status === 200, 'GET /api/services returns 200');
    assert(Array.isArray(servicesRes.json?.data), 'Services data is an array');

    const createServiceRes = await request('/api/services', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        title: 'Cloud Architecture & DevOps',
        description: 'Automated CI/CD pipelines, containerization with Docker, and cloud hosting.',
        icon: 'CloudIcon',
        order: 5,
        isActive: true,
      },
    });
    assert(createServiceRes.status === 201, 'POST /api/services returns 201 Created');
    const createdServiceId = createServiceRes.json?.data?.id;

    const deleteServiceRes = await request(`/api/services/${createdServiceId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(deleteServiceRes.status === 200, 'DELETE /api/services/:id returns 200');

    // 8. Skills CMS
    console.log('\n--- 8. Skills CMS Tests ---');
    const skillsRes = await request('/api/skills');
    assert(skillsRes.status === 200, 'GET /api/skills returns 200');

    const createSkillRes = await request('/api/skills', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        name: 'TypeScript',
        category: 'languages',
        proficiency: 'Advanced',
        order: 16,
        isActive: true,
      },
    });
    assert(createSkillRes.status === 201, 'POST /api/skills returns 201 Created');
    const createdSkillId = createSkillRes.json?.data?.id;

    const deleteSkillRes = await request(`/api/skills/${createdSkillId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(deleteSkillRes.status === 200, 'DELETE /api/skills/:id returns 200');

    // 9. Projects CMS & Slugs & Pagination
    console.log('\n--- 9. Projects CMS Tests ---');
    const projectsPaginated = await request('/api/projects?page=1&limit=2');
    assert(projectsPaginated.status === 200, 'GET /api/projects?page=1&limit=2 returns 200');
    assert(!!projectsPaginated.json?.pagination, 'Pagination metadata is present');
    assert(projectsPaginated.json?.pagination?.limit === 2, 'Pagination limit is 2');

    // Test automatic unique slug generation
    const createProjectRes = await request('/api/projects', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        title: 'Microservices E-Commerce Platform',
        shortDescription: 'Scalable distributed e-commerce backend with message queuing.',
        description: 'Engineered a full microservices architecture with authentication, cart, inventory, and payment gateways.',
        technologies: ['Node.js', 'Express', 'MySQL', 'Docker'],
        featured: true,
        order: 10,
        isActive: true,
      },
    });
    assert(createProjectRes.status === 201, 'POST /api/projects returns 201 Created');
    const createdProjectId = createProjectRes.json?.data?.id;
    const generatedSlug = createProjectRes.json?.data?.slug;
    assert(generatedSlug === 'microservices-e-commerce-platform', 'Auto-generated slug is URL-friendly');

    // Get project by slug
    const projectBySlugRes = await request(`/api/projects/slug/${generatedSlug}`);
    assert(projectBySlugRes.status === 200, 'GET /api/projects/slug/:slug returns 200');
    assert(projectBySlugRes.json?.data?.id === createdProjectId, 'Retrieved project matches created id');

    // Add project image via URL
    const addImageRes = await request(`/api/projects/${createdProjectId}/images`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        altText: 'Architecture Diagram',
        order: 1,
      },
    });
    assert(addImageRes.status === 201, 'POST /api/projects/:id/images returns 201 Created');
    const createdImageId = addImageRes.json?.data?.id;

    // Delete project image
    const deleteImageRes = await request(`/api/projects/${createdProjectId}/images/${createdImageId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(deleteImageRes.status === 200, 'DELETE /api/projects/:id/images/:imageId returns 200');

    // Delete project
    const deleteProjectRes = await request(`/api/projects/${createdProjectId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(deleteProjectRes.status === 200, 'DELETE /api/projects/:id returns 200');

    // 10. Experience CMS
    console.log('\n--- 10. Experience CMS Tests ---');
    const expRes = await request('/api/experience');
    assert(expRes.status === 200, 'GET /api/experience returns 200');

    // 11. Education CMS
    console.log('\n--- 11. Education CMS Tests ---');
    const eduRes = await request('/api/education');
    assert(eduRes.status === 200, 'GET /api/education returns 200');

    // 12. Certifications CMS
    console.log('\n--- 12. Certifications CMS Tests ---');
    const certsRes = await request('/api/certifications');
    assert(certsRes.status === 200, 'GET /api/certifications returns 200');
    assert(Array.isArray(certsRes.json?.data) && certsRes.json?.data?.length > 0, 'Certifications list returned');
    assert(certsRes.json?.data[0]?.fileUrl, 'Active certificate has a valid fileUrl');

    // Test rejection when certificate file is missing on creation
    const noFileCertRes = await request('/api/certifications', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        title: 'Cert Without File',
        issuer: 'Some Issuer',
      },
    });
    assert(noFileCertRes.status === 400, 'POST /api/certifications without file returns 400 Bad Request');
    assert(noFileCertRes.json?.message === 'Certificate file is required', 'Error message matches "Certificate file is required"');

    // Test inline file streaming for certificate
    const certViewRes = await request('/api/certifications/1/view');
    assert(certViewRes.status === 200, 'GET /api/certifications/:id/view returns 200');
    const certDisp = certViewRes.headers.get('content-disposition');
    assert(certDisp.includes('inline'), `Certificate Content-Disposition is inline (got: ${certDisp})`);

    // 13. Achievements CMS
    console.log('\n--- 13. Achievements CMS Tests ---');
    const achRes = await request('/api/achievements');
    assert(achRes.status === 200, 'GET /api/achievements returns 200');

    // 14. Resume CMS & PDF Download
    console.log('\n--- 14. Resume CMS & PDF Download Tests ---');
    const resumeRes = await request('/api/resume');
    assert(resumeRes.status === 200, 'GET /api/resume returns 200');
    assert(resumeRes.json?.data?.isActive === true, 'Active resume is returned');

    const downloadRes = await request('/api/resume/download');
    assert(downloadRes.status === 200, 'GET /api/resume/download returns 200');
    const contentType = downloadRes.headers.get('content-type');
    const contentDisposition = downloadRes.headers.get('content-disposition');
    assert(contentType.includes('application/pdf'), `Content-Type is application/pdf (got: ${contentType})`);
    assert(contentDisposition.includes('attachment') && contentDisposition.includes('Dhanush-M-Resume.pdf'), `Content-Disposition sets attachment; filename="Dhanush-M-Resume.pdf" (got: ${contentDisposition})`);
    assert(downloadRes.text.startsWith('%PDF-'), 'Downloaded file content is a genuine PDF file');

    // Test resume transaction: uploading a new active resume deactivates prior
    const newResumeRes = await request('/api/resume', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        fileUrl: '/uploads/resumes/Dhanush-M-Resume.pdf',
        fileName: 'Dhanush-M-Resume-v2.pdf',
        fileSize: 1024,
        isActive: true,
      },
    });
    assert(newResumeRes.status === 201, 'POST /api/resume creates new active resume');
    const newResumeId = newResumeRes.json?.data?.id;

    // Check all resumes to verify prior active was deactivated in transaction
    const allResumesRes = await request('/api/resume?all=true');
    const activeResumes = allResumesRes.json?.data?.filter((r) => r.isActive);
    assert(activeResumes.length === 1, 'Only one resume remains active after transactional upload');
    assert(activeResumes[0].id === newResumeId, 'New resume is the single active resume');

    // Clean up created test resume
    await request(`/api/resume/${newResumeId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    // 15. Social Links CMS
    console.log('\n--- 15. Social Links CMS Tests ---');
    const socialRes = await request('/api/social-links');
    assert(socialRes.status === 200, 'GET /api/social-links returns 200');
    assert(socialRes.json?.data?.some((l) => l.platform === 'LinkedIn'), 'LinkedIn link is present');
    assert(socialRes.json?.data?.some((l) => l.platform === 'GitHub'), 'GitHub link is present');

    // 16. Navigation CMS
    console.log('\n--- 16. Navigation CMS Tests ---');
    const navRes = await request('/api/navigation');
    assert(navRes.status === 200, 'GET /api/navigation returns 200');
    assert(navRes.json?.data?.length >= 5, 'Navigation links exist');

    // 17. Footer CMS
    console.log('\n--- 17. Footer CMS Tests ---');
    const footerRes = await request('/api/footer');
    assert(footerRes.status === 200, 'GET /api/footer returns 200');
    assert(footerRes.json?.data?.email === 'dhanush2005mp@gmail.com', 'Footer email is correct');

    // 18. Website Settings CMS
    console.log('\n--- 18. Website Settings CMS Tests ---');
    const settingsRes = await request('/api/settings');
    assert(settingsRes.status === 200, 'GET /api/settings returns 200');
    assert(settingsRes.json?.data?.siteTitle === 'Dhanush M | Portfolio', 'Site title matches');

    // 19. Contact Form & Admin Message Management + Email Notifications
    console.log('\n--- 19. Contact System & Email Notification Tests ---');

    // Unit test: HTML Sanitization
    const rawXss = '<script>alert("XSS & injection")</script>';
    const sanitizedXss = escapeHtml(rawXss);
    assert(!sanitizedXss.includes('<script>'), 'HTML entities are escaped to prevent XSS in email notifications');
    assert(sanitizedXss.includes('&lt;script&gt;'), 'Sanitized text properly encodes tags');

    // Setup mock transporter to verify email options and delivery
    let capturedMail = null;
    setTransporter({
      sendMail: async (options) => {
        capturedMail = options;
        return { messageId: 'mock-msg-id-778899' };
      },
      verify: async () => true,
    });

    // Public submission with mock transporter
    const submitContactRes = await request('/api/contact', {
      method: 'POST',
      body: {
        name: 'John Recruiter',
        email: 'recruiter@techcompany.com',
        subject: 'Exciting Full Stack Opportunity',
        message: 'Hello Dhanush, we reviewed your impressive projects and would love to discuss an engineering role with our team.',
      },
    });
    assert(submitContactRes.status === 201, 'POST /api/contact returns 201 Created');
    assert(submitContactRes.json?.data?.emailDelivered === true, 'Response indicates email was delivered');
    assert(submitContactRes.json?.message === 'Message sent successfully', 'Success message matches expected text');
    const createdMsgId = submitContactRes.json?.data?.id;

    // Verify captured email options
    assert(capturedMail !== null, 'sendMail was called by contact submission');
    assert(capturedMail?.to === (environment.CONTACT_RECEIVER_EMAIL || 'dhanush2005mp@gmail.com'), 'Email recipient matches CONTACT_RECEIVER_EMAIL');
    assert(capturedMail?.replyTo === 'recruiter@techcompany.com', 'replyTo header is set to the visitor email');
    assert(capturedMail?.subject.includes('Exciting Full Stack Opportunity'), 'Subject line contains message subject');
    assert(capturedMail?.html.includes('John Recruiter'), 'HTML email body includes visitor name');
    assert(capturedMail?.html.includes('recruiter@techcompany.com'), 'HTML email body includes visitor email');
    assert(typeof capturedMail?.text === 'string' && capturedMail.text.length > 50, 'Plain-text fallback version is generated');

    // Test SMTP failure resilience (database record must NOT be lost if SMTP throws error)
    setTransporter({
      sendMail: async () => {
        throw new Error('SMTP connection timed out: 504 Gateway Timeout');
      },
      verify: async () => false,
    });

    const failingSmtpRes = await request('/api/contact', {
      method: 'POST',
      body: {
        name: 'Jane Candidate',
        email: 'jane@talent.io',
        subject: 'Follow-up Interview',
        message: 'Checking in regarding our technical interview schedule.',
      },
    });
    assert(failingSmtpRes.status === 201, 'POST /api/contact still returns 201 even when SMTP delivery fails');
    assert(failingSmtpRes.json?.data?.emailDelivered === false, 'Response indicates email delivery failed gracefully');
    const fallbackMsgId = failingSmtpRes.json?.data?.id;
    assert(Boolean(fallbackMsgId), 'Message ID was still created in MySQL');

    // Verify MySQL database record exists despite SMTP failure
    const dbCheck = await prisma.contactMessage.findUnique({
      where: { id: fallbackMsgId },
    });
    assert(dbCheck !== null, 'Visitor message remains securely persisted in MySQL despite SMTP failure');

    // Clean up fallback test message
    await prisma.contactMessage.delete({ where: { id: fallbackMsgId } });

    // Reset transporter
    setTransporter(null);

    // Contact form validation failure test
    const badContactRes = await request('/api/contact', {
      method: 'POST',
      body: {
        name: '',
        email: 'invalid-email',
        subject: '',
        message: 'hi',
      },
    });
    assert(badContactRes.status === 422, 'Invalid contact submission returns 422 Unprocessable Entity');
    assert(Array.isArray(badContactRes.json?.errors), 'Validation errors array is returned');

    // Admin message list
    const adminMessagesRes = await request('/api/contact', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminMessagesRes.status === 200, 'GET /api/contact returns 200 for admin');

    // Admin mark as read
    const markReadRes = await request(`/api/contact/${createdMsgId}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { isRead: true },
    });
    assert(markReadRes.status === 200, 'PATCH /api/contact/:id/read returns 200');
    assert(markReadRes.json?.data?.isRead === true, 'Message isRead updated to true');

    // Admin delete message
    const deleteMsgRes = await request(`/api/contact/${createdMsgId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(deleteMsgRes.status === 200, 'DELETE /api/contact/:id returns 200');

    // 20. 404 Route Handler
    console.log('\n--- 20. 404 & Centralized Error Handler Tests ---');
    const notFoundRes = await request('/api/non-existent-endpoint-test');
    assert(notFoundRes.status === 404, 'Undefined route returns 404');
    assert(notFoundRes.json?.success === false, '404 response follows standard error format');

  } catch (err) {
    console.error('Unhandled test failure:', err);
    failed++;
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await disconnectDatabase();

    console.log('\n====================================================');
    console.log(`📊 Test Summary: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
