const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

/**
 * Creates a valid minimal PDF file if not already present
 */
function createSampleResumePdf(targetPath) {
  const resumeDir = path.dirname(targetPath);
  if (!fs.existsSync(resumeDir)) {
    fs.mkdirSync(resumeDir, { recursive: true });
  }

  if (!fs.existsSync(targetPath)) {
    // Standard minimal valid PDF 1.4 specification
    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 174 >>
stream
BT
/F1 22 Tf
50 720 Td
(Dhanush M - Full Stack Developer Resume) Tj
0 -36 Td
/F1 12 Tf
(Email: dhanush2005mp@gmail.com | Phone: 9344976660 | Location: Chennai, India) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000226 00000 n 
0000000453 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
525
%%EOF`;
    fs.writeFileSync(targetPath, pdfContent, 'utf-8');
    console.log('[Seed] Created sample resume PDF at:', targetPath);
  }
}

async function main() {
  console.log('[Seed] Starting database seed...');

  const adminName = process.env.ADMIN_NAME || 'Dhanush M';
  const adminEmail = (process.env.ADMIN_EMAIL || 'dhanush2005mp@gmail.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword@2026';

  // 1. Seed Admin User
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log(`[Seed] Created admin user: ${adminEmail}`);
  } else {
    console.log(`[Seed] Admin user ${adminEmail} already exists. Skipping.`);
  }

  // 2. Seed Profile
  const existingProfile = await prisma.profile.findFirst();
  if (!existingProfile) {
    await prisma.profile.create({
      data: {
        name: 'Dhanush M',
        title: 'Web Developer / Full Stack Developer',
        college: 'JNN Institute of Engineering',
        department: 'Computer Science and Engineering',
        course: 'B.E. Computer Science and Engineering',
        location: 'Chennai, Tamil Nadu',
        email: 'dhanush2005mp@gmail.com',
        phone: '9344976660',
        profileImageUrl: '/dhanush-profile.jpg',
        profileImageFileName: 'dhanush-profile.jpg',
        bio: 'Motivated Computer Science graduate seeking opportunities in Web Development / Full Stack Development. Experienced with frontend development, backend APIs, databases, Git, and project-based development. Strong interest in building responsive web applications and learning modern software development technologies.',
        shortBio: 'Motivated Computer Science graduate seeking opportunities in Web Development / Full Stack Development.',
      },
    });
    console.log('[Seed] Created Profile record');
  }

  // 3. Seed Hero
  const existingHero = await prisma.hero.findFirst();
  if (!existingHero) {
    await prisma.hero.create({
      data: {
        title: "HELLO, I'M",
        subtitle: 'Dhanush M',
        description: 'Experienced with frontend development, backend APIs, databases, Git, and project-based development. Strong interest in building responsive web applications and learning modern software development technologies.',
        primaryButtonText: 'View My Work',
        primaryButtonUrl: '#projects',
        secondaryButtonText: "Let's Talk",
        secondaryButtonUrl: '#contact',
        isActive: true,
      },
    });
    console.log('[Seed] Created Hero record');
  }

  // 4. Seed About
  const existingAbout = await prisma.about.findFirst();
  if (!existingAbout) {
    await prisma.about.create({
      data: {
        title: 'Professional Summary',
        description: 'Motivated Computer Science graduate seeking opportunities in Web Development / Full Stack Development. Experienced with frontend development, backend APIs, databases, Git, and project-based development. Strong interest in building responsive web applications and learning modern software development technologies.',
        paragraphs: [
          'Motivated Computer Science graduate seeking opportunities in Web Development / Full Stack Development.',
          'Experienced with frontend development, backend APIs, databases, Git, and project-based development.',
          'Strong interest in building responsive web applications and learning modern software development technologies.',
        ],
        highlights: [
          { label: 'Degree', value: 'B.E CSE' },
          { label: 'University', value: 'Anna Univ' },
          { label: 'Expected Year', value: '2027' },
          { label: 'CGPA', value: '7.20' },
        ],
        isActive: true,
      },
    });
    console.log('[Seed] Created About record');
  }

  // 5. Seed Services
  const servicesCount = await prisma.service.count();
  if (servicesCount === 0) {
    await prisma.service.createMany({
      data: [
        {
          title: 'Full Stack Web Development',
          description: 'Building end-to-end web applications with modern frontend frameworks and robust backend services.',
          icon: 'CodeIcon',
          order: 1,
          isActive: true,
        },
        {
          title: 'Frontend Development & UI Design',
          description: 'Designing responsive, accessible, and dynamic user interfaces using React, CSS, and interactive state management.',
          icon: 'LayoutIcon',
          order: 2,
          isActive: true,
        },
        {
          title: 'Backend & RESTful API Architecture',
          description: 'Developing secure, scalable RESTful API services with Node.js, Spring Boot, Django, and clean MVC/MVT patterns.',
          icon: 'ServerIcon',
          order: 3,
          isActive: true,
        },
        {
          title: 'Relational Database Engineering',
          description: 'Architecting normalized database schemas, queries, migrations, and transactions with MySQL.',
          icon: 'DatabaseIcon',
          order: 4,
          isActive: true,
        },
      ],
    });
    console.log('[Seed] Created Services records');
  }

  // 6. Seed Skills
  const skillsCount = await prisma.skill.count();
  if (skillsCount === 0) {
    await prisma.skill.createMany({
      data: [
        { name: 'Java', category: 'languages', proficiency: 'Advanced', icon: 'JavaIcon', order: 1, isActive: true },
        { name: 'Python', category: 'languages', proficiency: 'Intermediate', icon: 'PythonIcon', order: 2, isActive: true },
        { name: 'JavaScript', category: 'languages', proficiency: 'Advanced', icon: 'JsIcon', order: 3, isActive: true },
        { name: 'SQL', category: 'languages', proficiency: 'Intermediate', icon: 'SqlIcon', order: 4, isActive: true },
        { name: 'HTML5', category: 'frontend', proficiency: 'Advanced', icon: 'HtmlIcon', order: 5, isActive: true },
        { name: 'CSS3', category: 'frontend', proficiency: 'Advanced', icon: 'CssIcon', order: 6, isActive: true },
        { name: 'React.js', category: 'frontend', proficiency: 'Advanced', icon: 'ReactIcon', order: 7, isActive: true },
        { name: 'Node.js', category: 'backend', proficiency: 'Intermediate', icon: 'NodeIcon', order: 8, isActive: true },
        { name: 'Express.js', category: 'backend', proficiency: 'Intermediate', icon: 'ExpressIcon', order: 9, isActive: true },
        { name: 'Spring Boot', category: 'backend', proficiency: 'Intermediate', icon: 'SpringIcon', order: 10, isActive: true },
        { name: 'Django', category: 'backend', proficiency: 'Intermediate', icon: 'DjangoIcon', order: 11, isActive: true },
        { name: 'REST APIs', category: 'backend', proficiency: 'Advanced', icon: 'ApiIcon', order: 12, isActive: true },
        { name: 'MySQL', category: 'database', proficiency: 'Advanced', icon: 'MysqlIcon', order: 13, isActive: true },
        { name: 'Git & GitHub', category: 'tools', proficiency: 'Advanced', icon: 'GitIcon', order: 14, isActive: true },
        { name: 'VS Code', category: 'tools', proficiency: 'Advanced', icon: 'VscodeIcon', order: 15, isActive: true },
      ],
    });
    console.log('[Seed] Created Skills records');
  }

  // 7. Seed Projects & Project Images
  const projectsCount = await prisma.project.count();
  if (projectsCount === 0) {
    const p1 = await prisma.project.create({
      data: {
        title: 'Yeast Production System',
        slug: 'yeast-production-system',
        shortDescription: 'A web-based production management system with workflow, reporting, analysis, and data-management modules.',
        description: 'Built a web-based production management system designed to streamline fermentation monitoring, batch tracking, and production analytics. Implemented workflow, reporting, analysis, and data-management modules with backend APIs and structured database integration using Django and MySQL.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Django', 'MySQL'],
        githubUrl: 'https://github.com/Dhanush-M-05/yeast-production-system',
        liveUrl: null,
        thumbnailUrl: '/yeast-production.jpg',
        featured: true,
        order: 1,
        isActive: true,
        images: {
          create: [
            { imageUrl: '/yeast-production.jpg', altText: 'Yeast Production Dashboard', order: 1 },
          ],
        },
      },
    });

    const p2 = await prisma.project.create({
      data: {
        title: 'Reverse Marketplace',
        slug: 'reverse-marketplace',
        shortDescription: 'A platform where buyers post requirements and sellers submit itemized quotations.',
        description: 'Engineered a reverse marketplace platform enabling demand-driven procurement. Buyers create structured requirement posts and verified sellers submit itemized price quotations with transparent order management using React, Spring Boot, and Java.',
        technologies: ['React.js', 'HTML', 'CSS', 'Spring Boot', 'MySQL'],
        githubUrl: 'https://github.com/Dhanush-M-05/reverse-marketplace',
        liveUrl: null,
        thumbnailUrl: '/reverse-marketplace.jpg',
        featured: true,
        order: 2,
        isActive: true,
        images: {
          create: [
            { imageUrl: '/reverse-marketplace.jpg', altText: 'Reverse Marketplace Platform', order: 1 },
          ],
        },
      },
    });

    const p3 = await prisma.project.create({
      data: {
        title: 'Campus Event Management System (NexEvent)',
        slug: 'campus-event-management',
        shortDescription: 'A full-stack campus event platform designed for students, organizers, and administrators.',
        description: 'Developed a full-stack campus event platform designed for students, organizers, and administrators to discover events, register attendees, and review submissions through automated administrative workflows.',
        technologies: ['React.js', 'HTML', 'CSS', 'Spring Boot', 'MySQL'],
        githubUrl: 'https://github.com/Dhanush-M-05/campus-event-management',
        liveUrl: null,
        thumbnailUrl: '/campus-event.jpg',
        featured: true,
        order: 3,
        isActive: true,
        images: {
          create: [
            { imageUrl: '/campus-event.jpg', altText: 'Campus Event Management UI', order: 1 },
          ],
        },
      },
    });

    console.log('[Seed] Created Projects records with Project Images');
  }

  // 8. Seed Experience
  const expCount = await prisma.experience.count();
  if (expCount === 0) {
    await prisma.experience.createMany({
      data: [
        {
          company: 'AURA Institute & Technology',
          position: 'Full Stack Developer Intern — Java',
          location: 'Chennai, India',
          startDate: 'May 2026',
          endDate: 'June 2026',
          isCurrent: false,
          description: 'Developed a full-stack Reverse Marketplace web application using React.js, Spring Boot, and Java. Implemented buyer, seller, and admin workflows with role-based access control and RESTful APIs.',
          technologies: ['React.js', 'Spring Boot', 'Java', 'REST APIs', 'MySQL'],
          order: 1,
          isActive: true,
        },
        {
          company: 'VCODEZ',
          position: 'Full Stack Development Intern — Python',
          location: 'Chennai, India',
          startDate: 'December 2024',
          endDate: 'February 2025',
          isCurrent: false,
          description: 'Developed, tested, and deployed web application features using modern frontend technologies, Python, and relational database systems. Maintained database data accuracy and currency.',
          technologies: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Python', 'MySQL'],
          order: 2,
          isActive: true,
        },
      ],
    });
    console.log('[Seed] Created Experience records');
  }

  // 9. Seed Education
  const eduCount = await prisma.education.count();
  if (eduCount === 0) {
    await prisma.education.create({
      data: {
        institution: 'JNN Institute of Engineering',
        degree: 'B.E - Computer Science and Engineering',
        department: 'Computer Science and Engineering',
        startYear: '2023',
        endYear: '2027',
        grade: 'CGPA: 7.20',
        description: 'Coursework in Data Structures, Algorithms, Object-Oriented Programming, Database Management Systems, Web Development, and Software Engineering principles. Affiliated with Anna University (Autonomous).',
        order: 1,
        isActive: true,
      },
    });
    console.log('[Seed] Created Education record');
  }

  // 10. Seed Certifications
  const certCount = await prisma.certification.count();
  if (certCount === 0) {
    await prisma.certification.createMany({
      data: [
        {
          title: 'Introduction to Generative AI',
          issuer: 'IBM SkillsBuild',
          issueDate: '2025',
          credentialId: 'IBM-GENAI-2025',
          credentialUrl: null,
          fileUrl: null,
          order: 1,
          isActive: true,
        },
        {
          title: 'Industrial Internet of Things',
          issuer: 'NPTEL',
          issueDate: '2025',
          credentialId: 'NPTEL-IIOT-2025',
          credentialUrl: null,
          fileUrl: null,
          order: 2,
          isActive: true,
        },
        {
          title: 'Java in depth Become a complete Java Engineer',
          issuer: 'Infosys Springboard',
          issueDate: '2026',
          credentialId: 'INFOSYS-JAVA-2026',
          credentialUrl: null,
          fileUrl: null,
          order: 3,
          isActive: true,
        },
        {
          title: 'GitHub Copilot',
          issuer: 'Infosys Springboard',
          issueDate: '2026',
          credentialId: 'INFOSYS-COPILOT-2026',
          credentialUrl: null,
          fileUrl: null,
          order: 4,
          isActive: true,
        },
      ],
    });
    console.log('[Seed] Created Certifications records');
  }

  // 11. Seed Achievements
  const achCount = await prisma.achievement.count();
  if (achCount === 0) {
    await prisma.achievement.createMany({
      data: [
        {
          title: '1st Place — Campus Web Dev Hackathon',
          description: 'Built the Campus Event Management System in under 24 hours featuring role-based workflows and real-time event coordination.',
          date: '2024',
          link: null,
          order: 1,
          isActive: true,
        },
        {
          title: 'Finalist — Regional Open Innovation Challenge',
          description: 'Presented the Reverse Marketplace procurement solution focusing on transparent buyer-seller quotation management.',
          date: '2023',
          link: null,
          order: 2,
          isActive: true,
        },
      ],
    });
    console.log('[Seed] Created Achievements records');
  }

  // 12. Seed Resume (and sample PDF)
  const resumeFilePath = path.resolve(__dirname, '../uploads/resumes/Dhanush-M-Resume.pdf');
  createSampleResumePdf(resumeFilePath);

  const anyResume = await prisma.resume.findFirst({
    orderBy: { uploadedAt: 'desc' },
  });

  if (!anyResume) {
    const stats = fs.statSync(resumeFilePath);
    await prisma.resume.create({
      data: {
        fileName: 'Dhanush-M-Resume.pdf',
        fileUrl: '/uploads/resumes/Dhanush-M-Resume.pdf',
        fileType: 'application/pdf',
        fileSize: stats.size,
        isActive: true,
      },
    });
    console.log('[Seed] Created active Resume record');
  } else {
    const hasActive = await prisma.resume.findFirst({ where: { isActive: true } });
    if (!hasActive) {
      await prisma.resume.update({
        where: { id: anyResume.id },
        data: { isActive: true },
      });
      console.log('[Seed] Re-activated latest resume record');
    }
  }

  // 13. Seed Social Links
  const socialCount = await prisma.socialLink.count();
  if (socialCount === 0) {
    await prisma.socialLink.createMany({
      data: [
        {
          platform: 'LinkedIn',
          label: 'LinkedIn',
          url: 'https://www.linkedin.com/in/dhanush151005/',
          icon: 'LinkedinIcon',
          order: 1,
          isActive: true,
        },
        {
          platform: 'GitHub',
          label: 'GitHub',
          url: 'https://github.com/Dhanush-M-05',
          icon: 'GithubIcon',
          order: 2,
          isActive: true,
        },
        {
          platform: 'Email',
          label: 'Email',
          url: 'mailto:dhanush2005mp@gmail.com',
          icon: 'MailIcon',
          order: 3,
          isActive: true,
        },
      ],
    });
    console.log('[Seed] Created Social Links records');
  }

  // 14. Seed Navigation
  const navCount = await prisma.navigationItem.count();
  if (navCount === 0) {
    await prisma.navigationItem.createMany({
      data: [
        { label: 'Home', url: '#home', order: 1, isActive: true, openInNewTab: false },
        { label: 'About', url: '#about', order: 2, isActive: true, openInNewTab: false },
        { label: 'Services', url: '#services', order: 3, isActive: true, openInNewTab: false },
        { label: 'Skills', url: '#skills', order: 4, isActive: true, openInNewTab: false },
        { label: 'Projects', url: '#projects', order: 5, isActive: true, openInNewTab: false },
        { label: 'Experience', url: '#experience', order: 6, isActive: true, openInNewTab: false },
        { label: 'Education', url: '#education', order: 7, isActive: true, openInNewTab: false },
        { label: 'Certifications', url: '#certifications', order: 8, isActive: true, openInNewTab: false },
        { label: 'Contact', url: '#contact', order: 9, isActive: true, openInNewTab: false },
      ],
    });
    console.log('[Seed] Created Navigation Items records');
  }

  // 15. Seed Footer
  const existingFooter = await prisma.footer.findFirst();
  if (!existingFooter) {
    await prisma.footer.create({
      data: {
        description: 'Motivated Computer Science graduate seeking opportunities in Web Development / Full Stack Development.',
        copyrightText: `© ${new Date().getFullYear()} Dhanush M. Designed & Built with React and Pure CSS.`,
        email: 'dhanush2005mp@gmail.com',
        phone: '9344976660',
        location: 'Chennai, Tamil Nadu',
      },
    });
    console.log('[Seed] Created Footer record');
  }

  // 16. Seed Website Settings
  const existingSettings = await prisma.websiteSettings.findFirst();
  if (!existingSettings) {
    await prisma.websiteSettings.create({
      data: {
        siteTitle: 'Dhanush M | Portfolio',
        siteDescription: 'Personal portfolio of Dhanush M, Full Stack Web Developer.',
        faviconUrl: '/favicon.ico',
        metaKeywords: 'Dhanush M, Web Developer, Full Stack Developer, React, Node.js, Spring Boot, MySQL',
        googleAnalyticsId: null,
        maintenanceMode: false,
      },
    });
    console.log('[Seed] Created Website Settings record');
  }

  console.log('[Seed] Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('[Seed] Seed script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
