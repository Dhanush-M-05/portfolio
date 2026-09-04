const { prisma } = require('../config/database');
const { successResponse } = require('../utils/apiResponse');

/**
 * Helper to get or create singleton Footer
 */
async function getOrCreateFooter() {
  let footer = await prisma.footer.findFirst();
  if (!footer) {
    footer = await prisma.footer.create({
      data: {
        description: 'Motivated Computer Science graduate seeking opportunities in Web Development / Full Stack Development.',
        copyrightText: `© ${new Date().getFullYear()} Dhanush M. All Rights Reserved.`,
        email: 'dhanush2005mp@gmail.com',
        phone: '9344976660',
        location: 'Chennai, Tamil Nadu',
      },
    });
  }
  return footer;
}

/**
 * Get Footer content
 * GET /api/footer
 */
async function getFooter(req, res) {
  const footer = await getOrCreateFooter();
  return successResponse(res, footer, 'Footer content retrieved successfully');
}

/**
 * Update Footer content
 * PUT /api/footer
 */
async function updateFooter(req, res) {
  const existing = await getOrCreateFooter();

  const allowedFields = [
    'description',
    'copyrightText',
    'email',
    'phone',
    'location',
  ];

  const updateData = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  const updatedFooter = await prisma.footer.update({
    where: { id: existing.id },
    data: updateData,
  });

  return successResponse(res, updatedFooter, 'Footer updated successfully');
}

module.exports = {
  getFooter,
  updateFooter,
};
