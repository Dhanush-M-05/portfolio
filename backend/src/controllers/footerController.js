import prisma from '../config/database.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * Get Footer Content
 * GET /api/footer
 */
export const getFooter = async (req, res) => {
  let footer = await prisma.footer.findFirst();

  if (!footer) {
    footer = await prisma.footer.create({
      data: {
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
      },
    });
  }

  return successResponse(res, 200, 'Footer retrieved', footer);
};

/**
 * Update Footer Content
 * PUT /api/footer
 */
export const updateFooter = async (req, res) => {
  let footer = await prisma.footer.findFirst();
  const updateData = { ...req.body };

  delete updateData.id;
  delete updateData.createdAt;
  delete updateData.updatedAt;

  let updated;
  if (footer) {
    updated = await prisma.footer.update({
      where: { id: footer.id },
      data: updateData,
    });
  } else {
    updated = await prisma.footer.create({
      data: updateData,
    });
  }

  return successResponse(res, 200, 'Footer updated successfully', updated);
};

export default {
  getFooter,
  updateFooter,
};
