const { prisma } = require('../config/database');
const { successResponse } = require('../utils/apiResponse');

/**
 * Helper to get or create singleton WebsiteSettings
 */
async function getOrCreateSettings() {
  let settings = await prisma.websiteSettings.findFirst();
  if (!settings) {
    settings = await prisma.websiteSettings.create({
      data: {
        siteTitle: 'Dhanush M | Portfolio',
        siteDescription: 'Personal portfolio of Dhanush M, Full Stack Web Developer.',
        faviconUrl: '/favicon.ico',
        metaKeywords: 'Dhanush M, Web Developer, Full Stack Developer, React, Node.js, Spring Boot, MySQL',
        googleAnalyticsId: null,
        maintenanceMode: false,
      },
    });
  }
  return settings;
}

/**
 * Get website settings
 * GET /api/settings
 */
async function getSettings(req, res) {
  const settings = await getOrCreateSettings();
  return successResponse(res, settings, 'Website settings retrieved successfully');
}

/**
 * Update website settings
 * PUT /api/settings
 */
async function updateSettings(req, res) {
  const existing = await getOrCreateSettings();

  const allowedFields = [
    'siteTitle',
    'siteDescription',
    'faviconUrl',
    'metaKeywords',
    'googleAnalyticsId',
    'maintenanceMode',
    'brandName',
    'brandRole',
    'logoLetters',
    'resumeBtnText',
    'talkBtnText',
  ];

  const updateData = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      if (field === 'maintenanceMode') {
        updateData[field] = Boolean(req.body[field]);
      } else {
        updateData[field] = req.body[field];
      }
    }
  }

  const updated = await prisma.websiteSettings.update({
    where: { id: existing.id },
    data: updateData,
  });

  return successResponse(res, updated, 'Website settings updated successfully');
}

module.exports = {
  getSettings,
  updateSettings,
};
