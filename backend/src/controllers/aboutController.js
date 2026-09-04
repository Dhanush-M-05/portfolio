const { prisma } = require('../config/database');
const { successResponse } = require('../utils/apiResponse');

/**
 * Helper to get or create singleton About
 */
async function getOrCreateAbout() {
  let about = await prisma.about.findFirst();
  if (!about) {
    about = await prisma.about.create({
      data: {
        title: 'About Me',
        description: 'Motivated Computer Science graduate seeking opportunities in Web Development / Full Stack Development.',
        paragraphs: [
          'Experienced with frontend development, backend APIs, databases, Git, and project-based development.',
          'Strong interest in building responsive web applications and learning modern software development technologies.',
        ],
        highlights: [
          { label: 'Degree', value: 'B.E CSE' },
          { label: 'University', value: 'Anna Univ' },
          { label: 'CGPA', value: '7.20' },
        ],
        isActive: true,
      },
    });
  }
  return about;
}

/**
 * Get About section
 * GET /api/about
 */
async function getAbout(req, res) {
  const about = await getOrCreateAbout();
  return successResponse(res, about, 'About section retrieved successfully');
}

/**
 * Update About section
 * PUT /api/about
 */
async function updateAbout(req, res) {
  const existing = await getOrCreateAbout();

  const allowedFields = [
    'title',
    'description',
    'paragraphs',
    'highlights',
    'isActive',
  ];

  const updateData = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  const updatedAbout = await prisma.about.update({
    where: { id: existing.id },
    data: updateData,
  });

  return successResponse(res, updatedAbout, 'About section updated successfully');
}

module.exports = {
  getAbout,
  updateAbout,
};
