import prisma from '../config/database.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * Get Website Settings
 * GET /api/settings
 */
export const getSettings = async (req, res) => {
  let settings = await prisma.websiteSettings.findFirst();

  if (!settings) {
    settings = await prisma.websiteSettings.create({
      data: {
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
      },
    });
  }

  return successResponse(res, 200, 'Website settings retrieved', settings);
};

/**
 * Update Website Settings
 * PUT /api/settings
 */
export const updateSettings = async (req, res) => {
  let settings = await prisma.websiteSettings.findFirst();
  const updateData = { ...req.body };

  delete updateData.id;
  delete updateData.createdAt;
  delete updateData.updatedAt;

  if (Array.isArray(updateData.logoLetters)) {
    updateData.logoLetters = updateData.logoLetters.join('');
  }

  let updated;
  if (settings) {
    updated = await prisma.websiteSettings.update({
      where: { id: settings.id },
      data: updateData,
    });
  } else {
    updated = await prisma.websiteSettings.create({
      data: updateData,
    });
  }

  return successResponse(res, 200, 'Website settings updated successfully', updated);
};

export default {
  getSettings,
  updateSettings,
};
