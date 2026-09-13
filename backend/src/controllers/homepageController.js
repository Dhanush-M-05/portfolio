import prisma from '../config/database.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Get Homepage Sections
 * GET /api/homepage (and GET /api/sections)
 */
export const getHomepageSections = async (req, res) => {
  let sections = await prisma.homepageSection.findMany({
    orderBy: { order: 'asc' },
  });

  if (!sections || sections.length === 0) {
    const defaults = [
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

    for (const s of defaults) {
      await prisma.homepageSection.create({ data: s });
    }

    sections = await prisma.homepageSection.findMany({
      orderBy: { order: 'asc' },
    });
  }

  // Ensure id is set to sectionKey for frontend section identifier matching
  const mapped = sections.map((s) => ({
    ...s,
    id: s.sectionKey,
    sectionKey: s.sectionKey,
  }));

  return res.status(200).json(mapped);
};

/**
 * Update Homepage Sections (Bulk Reorder / Visibility / Content)
 * PUT /api/homepage (and PUT /api/sections)
 */
export const updateHomepageSections = async (req, res) => {
  const sectionsList = Array.isArray(req.body) ? req.body : req.body.sections;

  if (!Array.isArray(sectionsList)) {
    return errorResponse(res, 400, 'Expected array of homepage sections');
  }

  for (let idx = 0; idx < sectionsList.length; idx++) {
    const s = sectionsList[idx];
    const key = s.sectionKey || s.id;
    if (!key) continue;

    await prisma.homepageSection.upsert({
      where: { sectionKey: key },
      update: {
        ...(s.name !== undefined && { name: s.name }),
        ...(s.label !== undefined && { label: s.label }),
        ...(s.title !== undefined && { title: s.title }),
        ...(s.subtitle !== undefined && { subtitle: s.subtitle }),
        order: s.order !== undefined ? Number(s.order) : idx + 1,
        isVisible: s.isVisible !== undefined ? Boolean(s.isVisible) : true,
        metadata: s.metadata || undefined,
      },
      create: {
        sectionKey: key,
        name: s.name || key,
        label: s.label || '',
        title: s.title || '',
        subtitle: s.subtitle || '',
        order: s.order !== undefined ? Number(s.order) : idx + 1,
        isVisible: s.isVisible !== undefined ? Boolean(s.isVisible) : true,
        metadata: s.metadata || undefined,
      },
    });
  }

  const updatedSections = await prisma.homepageSection.findMany({
    orderBy: { order: 'asc' },
  });

  const mapped = updatedSections.map((s) => ({
    ...s,
    id: s.sectionKey,
  }));

  return successResponse(res, 200, 'Homepage sections updated successfully', mapped);
};

export default {
  getHomepageSections,
  updateHomepageSections,
};
