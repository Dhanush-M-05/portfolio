import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Admin User from .env
  const adminEmail = process.env.ADMIN_EMAIL || 'dhanush2005mp@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Md@15102005';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.adminUser.findFirst();
  let admin;
  if (existingAdmin) {
    admin = await prisma.adminUser.update({
      where: { id: existingAdmin.id },
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
      },
    });
  } else {
    admin = await prisma.adminUser.create({
      data: {
        email: adminEmail,
        username: 'admin',
        passwordHash: hashedPassword,
        role: 'admin',
      },
    });
  }
  console.log(`✅ Admin user synchronized from .env: ${admin.email}`);

  // 2. Seed Profile
  const existingProfile = await prisma.profile.findFirst();
  const profileData = {
    name: 'Dhanush M',
    role: 'Web Developer',
    title: 'Full Stack Developer',
    college: 'J.N.N Institute of Engineering',
    department: 'Computer Science and Engineering',
    degree: 'B.E.',
    course: 'B.E. Computer Science and Engineering',
    domain: 'Full Stack Web Development',
    location: 'Chennai, Tamil Nadu, India',
    email: 'dhanush2005mp@gmail.com',
    phone: '+91 98765 43210',
    tagline: 'Crafting performant web experiences, scalable backend architectures, and clean software solutions.',
    bio: 'Motivated and detail-oriented Computer Science undergraduate with hands-on experience in modern web development technologies including React, Node.js, Express, MySQL, and REST APIs.',
    shortBio: 'Full stack developer focused on responsive web applications and scalable APIs.',
    heroDescription: 'Building modern responsive web applications, robust backend microservices, and high-performance user interfaces with clean architecture.',
    aboutHeading: 'Professional Summary',
    aboutSubheading: 'A dedicated developer focused on responsive web development, robust backend APIs, and clean software practices.',
    avatarUrl: '/dhanush-profile.jpg',
    stats: [
      { label: 'Years Experience', value: '1+' },
      { label: 'Completed Projects', value: '5+' },
      { label: 'Code Commits', value: '250+' },
      { label: 'CGPA', value: '7.20' }
    ]
  };

  if (existingProfile) {
    await prisma.profile.update({
      where: { id: existingProfile.id },
      data: profileData,
    });
  } else {
    await prisma.profile.create({ data: profileData });
  }
  console.log('✅ Profile seeded');

  // 3. Seed Hero Section
  const existingHero = await prisma.hero.findFirst();
  const heroData = {
    greeting: "HELLO, I'M",
    roleTitle: 'Web Developer',
    tagline: 'Engineering robust frontend experiences and scalable backend services.',
    description: 'Specializing in React, Node.js, Express, MySQL, and modern web application development with clean code practices.',
    primaryBtnText: 'View My Work',
    primaryBtnLink: '#projects',
    secondaryBtnText: "Let's Talk",
    secondaryBtnLink: '#contact',
    talkLinkText: "Let's Talk",
    resumeBtnText: 'Download Resume',
    isActive: true,
  };

  if (existingHero) {
    await prisma.hero.update({
      where: { id: existingHero.id },
      data: heroData,
    });
  } else {
    await prisma.hero.create({ data: heroData });
  }
  console.log('✅ Hero section seeded');

  // 4. Seed About Section
  const existingAbout = await prisma.about.findFirst();
  const aboutData = {
    heading: 'Professional Summary',
    subheading: 'A dedicated developer focused on responsive web development, robust backend APIs, and clean software practices.',
    shortIntro: "Hi, I'm Dhanush M — Web Developer.",
    description: 'Motivated Computer Science graduate seeking opportunities in Web Development / Full Stack Development. Experienced in designing interactive, accessible interfaces using React and building secure, performant REST APIs with Node.js, Express, and MySQL.',
    professionalSummary: 'Proficient in modern frontend component architecture, responsive styling with pure CSS, relational database modeling, and version control workflows with Git and GitHub.',
    yearsExperience: '1+',
    projectsCompleted: '5+',
    degree: 'B.E CSE',
    cgpa: '7.20',
    skillsHighlight: 'React, Node.js, Express, MySQL, JavaScript, Git',
    imageUrl: '/dhanush-profile.jpg',
    ctaText: 'View Projects',
    ctaLink: '#projects',
    resumeUrl: '/resume.pdf',
    email: 'dhanush2005mp@gmail.com',
    phone: '+91 98765 43210',
    location: 'Chennai, India',
    coreFocus: [
      {
        title: 'Frontend Engineering',
        description: 'Building responsive, modular user interfaces with HTML, CSS, JavaScript, and React.js.'
      },
      {
        title: 'Backend & REST APIs',
        description: 'Designing structured backend services, view logic, and API endpoints using Express and Node.js.'
      },
      {
        title: 'Database Management',
        description: 'Engineering relational database schemas, tables, and optimized queries with MySQL and Prisma.'
      },
      {
        title: 'Developer Workflows',
        description: 'Collaborating with Git version control, GitHub repositories, and structured debugging in VS Code.'
      }
    ],
    isActive: true,
  };

  if (existingAbout) {
    await prisma.about.update({
      where: { id: existingAbout.id },
      data: aboutData,
    });
  } else {
    await prisma.about.create({ data: aboutData });
  }
  console.log('✅ About section seeded');

  // 5. Seed Services
  const services = [
    {
      title: 'Frontend Web Development',
      description: 'Engineering responsive, accessible, and performant web interfaces with modern React, pure CSS, and intuitive user experiences.',
      icon: 'CodeIcon',
      order: 1,
      isActive: true,
    },
    {
      title: 'Backend & API Engineering',
      description: 'Architecting robust RESTful API endpoints, secure authentication, rate limiting, and business logic with Node.js and Express.',
      icon: 'LayersIcon',
      order: 2,
      isActive: true,
    },
    {
      title: 'Database Architecture',
      description: 'Designing relational MySQL schemas, indexes, queries, and ORM migrations with Prisma for reliable data persistence.',
      icon: 'ShieldCheckIcon',
      order: 3,
      isActive: true,
    },
    {
      title: 'Full Stack Integration',
      description: 'Connecting frontend clients to cloud media storage (Cloudinary), transactional email providers (Resend), and production deployments.',
      icon: 'SparklesIcon',
      order: 4,
      isActive: true,
    },
  ];

  for (const s of services) {
    const existing = await prisma.service.findFirst({ where: { title: s.title } });
    if (!existing) {
      await prisma.service.create({ data: s });
    }
  }
  console.log('✅ Services seeded');

  // 6. Seed Skills
  const skills = [
    // Frontend
    { name: 'JavaScript (ES6+)', category: 'Frontend', proficiency: 90, icon: 'javascript', order: 1 },
    { name: 'React.js', category: 'Frontend', proficiency: 88, icon: 'react', order: 2 },
    { name: 'HTML5 & Semantic Markup', category: 'Frontend', proficiency: 95, icon: 'html5', order: 3 },
    { name: 'CSS3 & Modern Layouts', category: 'Frontend', proficiency: 90, icon: 'css3', order: 4 },
    { name: 'Responsive Design', category: 'Frontend', proficiency: 92, icon: 'responsive', order: 5 },

    // Backend
    { name: 'Node.js', category: 'Backend', proficiency: 85, icon: 'nodejs', order: 6 },
    { name: 'Express.js', category: 'Backend', proficiency: 86, icon: 'express', order: 7 },
    { name: 'RESTful API Architecture', category: 'Backend', proficiency: 88, icon: 'api', order: 8 },
    { name: 'JWT Authentication', category: 'Backend', proficiency: 85, icon: 'jwt', order: 9 },

    // Database
    { name: 'MySQL', category: 'Database', proficiency: 84, icon: 'mysql', order: 10 },
    { name: 'Prisma ORM', category: 'Database', proficiency: 82, icon: 'prisma', order: 11 },
    { name: 'Database Schema Design', category: 'Database', proficiency: 85, icon: 'database', order: 12 },

    // Tools & Cloud
    { name: 'Git & GitHub', category: 'Tools', proficiency: 90, icon: 'git', order: 13 },
    { name: 'Cloudinary CDN', category: 'Tools', proficiency: 80, icon: 'cloudinary', order: 14 },
    { name: 'VS Code & Debugging', category: 'Tools', proficiency: 90, icon: 'vscode', order: 15 },
  ];

  for (const sk of skills) {
    const existing = await prisma.skill.findFirst({ where: { name: sk.name } });
    if (!existing) {
      await prisma.skill.create({ data: sk });
    }
  }
  console.log('✅ Skills seeded');

  // 7. Seed Projects (Empty by default - to be managed dynamically via Admin CMS)
  const projects = [];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log('✅ Projects seed step complete (0 placeholder projects)');

  // 8. Seed Experience (Empty by default - to be managed dynamically via Admin CMS)
  const experiences = [];

  for (const exp of experiences) {
    const existing = await prisma.experience.findFirst({ where: { company: exp.company } });
    if (!existing) {
      await prisma.experience.create({ data: exp });
    }
  }
  console.log('✅ Experience seed step complete (0 placeholder items)');

  // 9. Seed Education
  const educations = [
    {
      institution: 'J.N.N Institute of Engineering',
      degree: 'Bachelor of Engineering (B.E.)',
      department: 'Computer Science and Engineering',
      startYear: '2022',
      endYear: '2026',
      grade: 'CGPA: 7.20 / 10',
      description: 'Core coursework includes Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Computer Networks, and Web Technology.',
      order: 1,
      isActive: true,
    }
  ];

  for (const edu of educations) {
    const existing = await prisma.education.findFirst({ where: { institution: edu.institution } });
    if (!existing) {
      await prisma.education.create({ data: edu });
    }
  }
  console.log('✅ Education seeded');

  // 10. Seed Certifications (Empty by default - to be managed dynamically via Admin CMS)
  const certifications = [];

  for (const c of certifications) {
    const existing = await prisma.certification.findFirst({ where: { title: c.title } });
    if (!existing) {
      await prisma.certification.create({ data: c });
    }
  }
  console.log('✅ Certifications seed step complete (0 placeholder items)');

  // 11. Seed Achievements (Empty by default - to be managed dynamically via Admin CMS)
  const achievements = [];

  for (const ach of achievements) {
    const existing = await prisma.achievement.findFirst({ where: { title: ach.title } });
    if (!existing) {
      await prisma.achievement.create({ data: ach });
    }
  }
  console.log('✅ Achievements seed step complete (0 placeholder items)');

  // 12. Seed Social Links
  const socialLinks = [
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
    }
  ];

  for (const sl of socialLinks) {
    const existing = await prisma.socialLink.findFirst({ where: { platform: sl.platform } });
    if (!existing) {
      await prisma.socialLink.create({ data: sl });
    }
  }
  console.log('✅ Social links seeded');

  // 13. Seed Navigation Items
  const navItems = [
    { label: 'Home', url: '#home', target: 'home', order: 1, isActive: true, isVisible: true },
    { label: 'About', url: '#about', target: 'about', order: 2, isActive: true, isVisible: true },
    { label: 'Services', url: '#services', target: 'services', order: 3, isActive: true, isVisible: true },
    { label: 'Skills', url: '#skills', target: 'skills', order: 4, isActive: true, isVisible: true },
    { label: 'Projects', url: '#projects', target: 'projects', order: 5, isActive: true, isVisible: true },
    { label: 'Experience', url: '#experience', target: 'experience', order: 6, isActive: true, isVisible: true },
    { label: 'Education', url: '#education', target: 'education', order: 7, isActive: true, isVisible: true },
    { label: 'Certifications', url: '#certifications', target: 'certifications', order: 8, isActive: true, isVisible: true },
    { label: 'Contact', url: '#contact', target: 'contact', order: 9, isActive: true, isVisible: true },
  ];

  for (const ni of navItems) {
    const existing = await prisma.navigationItem.findFirst({ where: { label: ni.label } });
    if (!existing) {
      await prisma.navigationItem.create({ data: ni });
    }
  }
  console.log('✅ Navigation items seeded');

  // 14. Seed Footer
  const existingFooter = await prisma.footer.findFirst();
  const footerData = {
    brandName: 'Dhanush M',
    brandRole: 'Web Developer',
    tagline: 'Motivated Computer Science graduate seeking opportunities in Web Development / Full Stack Development.',
    quickLinksHeading: 'Navigation',
    deepLinksHeading: 'Portfolio',
    contactHeading: 'Direct Inquiries',
    contactDesc: 'Available for web development projects, freelance collaborations, and full-time opportunities.',
    copyrightText: 'Designed & Built with React and Pure CSS.',
    email: 'dhanush2005mp@gmail.com',
    phone: '+91 98765 43210',
    location: 'Chennai, India',
  };

  if (existingFooter) {
    await prisma.footer.update({
      where: { id: existingFooter.id },
      data: footerData,
    });
  } else {
    await prisma.footer.create({ data: footerData });
  }
  console.log('✅ Footer seeded');

  // 15. Seed Website Settings
  const existingSettings = await prisma.websiteSettings.findFirst();
  const settingsData = {
    siteTitle: 'Dhanush M | Web Developer Portfolio',
    siteDescription: 'Full Stack Web Developer portfolio of Dhanush M showcasing projects, technical skills, certifications, and experience.',
    favicon: '/favicon.ico',
    metaKeywords: 'Dhanush M, Web Developer, Full Stack, React, Node.js, Express, MySQL, Portfolio',
    brandName: 'Dhanush M',
    brandRole: 'Web Developer',
    logoLetters: 'DM',
    resumeBtnText: 'Resume',
    talkBtnText: "Let's Talk",
    maintenanceMode: false,
  };

  if (existingSettings) {
    await prisma.websiteSettings.update({
      where: { id: existingSettings.id },
      data: settingsData,
    });
  } else {
    await prisma.websiteSettings.create({ data: settingsData });
  }
  console.log('✅ Website settings seeded');

  // 16. Seed Homepage Sections
  const sections = [
    { sectionKey: 'hero', name: 'Hero', label: "HELLO, I'M", title: 'Hero Section', order: 1, isVisible: true },
    { sectionKey: 'about', name: 'About', label: 'About Me', title: 'Professional Summary', subtitle: 'A dedicated developer focused on responsive web development, robust backend APIs, and clean software practices.', order: 2, isVisible: true },
    { sectionKey: 'services', name: 'Services', label: 'Services', title: 'What I Do', subtitle: 'Specialized web development capabilities focused on scalable code, performant user interfaces, and seamless API integrations.', order: 3, isVisible: true },
    { sectionKey: 'skills', name: 'Skills', label: 'Skills & Stack', title: 'Technical Skills', subtitle: 'Core competencies across programming languages, modern frontend libraries, backend architectures, databases, and version control tooling.', order: 4, isVisible: true },
    { sectionKey: 'projects', name: 'Projects', label: 'Featured Work', title: 'Projects', subtitle: 'Real-world web platforms, database applications, and full-stack solutions built with modern technology stacks.', order: 5, isVisible: true },
    { sectionKey: 'experience', name: 'Experience', label: 'Career Journey', title: 'Work Experience', subtitle: 'Professional internships and development roles focused on production web systems.', order: 6, isVisible: true },
    { sectionKey: 'education', name: 'Education', label: 'Academic Background', title: 'Education', subtitle: 'Formal university degree and foundational coursework in computer science and engineering.', order: 7, isVisible: true },
    { sectionKey: 'certifications', name: 'Certifications', label: 'Credentials', title: 'Certificates & Training', subtitle: 'Industry-recognized engineering certifications and technical continuous learning accomplishments.', order: 8, isVisible: true },
    { sectionKey: 'achievements', name: 'Achievements', label: 'Recognition', title: 'Honors & Achievements', subtitle: 'Hackathons, technical competitions, and academic milestones.', order: 9, isVisible: true },
    { sectionKey: 'resume', name: 'Resume', label: 'Curriculum Vitae', title: 'Professional Resume', subtitle: 'Preview or download the latest ATS-compliant developer resume.', order: 10, isVisible: true },
    { sectionKey: 'contact', name: 'Contact', label: 'Get In Touch', title: "Let's Connect", subtitle: 'Have a project in mind, an internship opportunity, or want to discuss modern web development? Drop a message below.', order: 11, isVisible: true },
  ];

  for (const sec of sections) {
    await prisma.homepageSection.upsert({
      where: { sectionKey: sec.sectionKey },
      update: sec,
      create: sec,
    });
  }
  console.log('✅ Homepage sections seeded');

  // 17. Seed Initial Default Resume if none exists
  const existingResume = await prisma.resume.findFirst({ where: { isActive: true } });
  if (!existingResume) {
    await prisma.resume.create({
      data: {
        title: 'ATS-Compliant Software Developer Resume',
        fileName: 'Dhanush-M-Resume.pdf',
        fileUrl: '/resume.pdf',
        publicId: 'local-default-resume',
        mimeType: 'application/pdf',
        fileSize: 102400,
        isActive: true,
      }
    });
    console.log('✅ Default Resume record seeded');
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
