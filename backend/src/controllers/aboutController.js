import prisma from '../config/database.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * Get About Section
 * GET /api/about
 */
export const getAbout = async (req, res) => {
  let about = await prisma.about.findFirst();

  if (!about) {
    about = await prisma.about.create({
      data: {
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
        isActive: true,
      },
    });
  }

  // Ensure both camelCase and snake_case properties are available for seamless frontend binding
  const responseData = {
    ...about,
    heading: about.heading,
    subheading: about.subheading,
    short_intro: about.shortIntro,
    professional_summary: about.professionalSummary,
    years_experience: about.yearsExperience,
    projects_completed: about.projectsCompleted,
    skills_highlight: about.skillsHighlight,
    image_url: about.imageUrl,
    image: about.imageUrl,
    cta_text: about.ctaText,
    cta_link: about.ctaLink,
    resume_url: about.resumeUrl,
    core_focus: about.coreFocus,
  };

  return successResponse(res, 200, 'About section retrieved', responseData);
};

/**
 * Update About Section
 * PUT /api/about
 */
export const updateAbout = async (req, res) => {
  let about = await prisma.about.findFirst();
  const body = req.body || {};

  // Map snake_case to model camelCase if sent
  const updateData = {
    heading: body.heading !== undefined ? body.heading : body.title,
    subheading: body.subheading,
    shortIntro: body.shortIntro || body.short_intro,
    description: body.description,
    professionalSummary: body.professionalSummary || body.professional_summary,
    yearsExperience: body.yearsExperience || body.years_experience,
    projectsCompleted: body.projectsCompleted || body.projects_completed,
    degree: body.degree,
    cgpa: body.cgpa,
    skillsHighlight: body.skillsHighlight || body.skills_highlight,
    imageUrl: body.imageUrl || body.image_url || body.image,
    imagePublicId: body.imagePublicId || body.image_public_id,
    ctaText: body.ctaText || body.cta_text,
    ctaLink: body.ctaLink || body.cta_link,
    resumeUrl: body.resumeUrl || body.resume_url,
    email: body.email,
    phone: body.phone,
    location: body.location,
    coreFocus: body.coreFocus || body.core_focus,
    paragraphs: body.paragraphs,
    highlights: body.highlights,
    isActive: body.isActive !== undefined ? body.isActive : true,
  };

  // Remove undefined fields
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined) delete updateData[key];
  });

  let updated;
  if (about) {
    updated = await prisma.about.update({
      where: { id: about.id },
      data: updateData,
    });
  } else {
    updated = await prisma.about.create({
      data: updateData,
    });
  }

  const responseData = {
    ...updated,
    short_intro: updated.shortIntro,
    professional_summary: updated.professionalSummary,
    years_experience: updated.yearsExperience,
    projects_completed: updated.projectsCompleted,
    skills_highlight: updated.skillsHighlight,
    image_url: updated.imageUrl,
    image: updated.imageUrl,
    cta_text: updated.ctaText,
    cta_link: updated.ctaLink,
    resume_url: updated.resumeUrl,
    core_focus: updated.coreFocus,
  };

  return successResponse(res, 200, 'About section updated successfully', responseData);
};

export default {
  getAbout,
  updateAbout,
};
