const { prisma } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Get all social links
 * GET /api/social-links
 */
async function getSocialLinks(req, res) {
  const { all } = req.query;
  const where = all === 'true' ? {} : { isActive: true };

  const socialLinks = await prisma.socialLink.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  return successResponse(res, socialLinks, 'Social links retrieved successfully');
}

/**
 * Create social link
 * POST /api/social-links
 */
async function createSocialLink(req, res) {
  const { platform, label, url, icon, order, isActive } = req.body;

  if (!platform || !url) {
    return errorResponse(res, 'Platform and URL are required', 400);
  }

  const newLink = await prisma.socialLink.create({
    data: {
      platform,
      label: label || platform,
      url,
      icon: icon || null,
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    },
  });

  return successResponse(res, newLink, 'Social link created successfully', 201);
}

/**
 * Update social link
 * PUT /api/social-links/:id
 */
async function updateSocialLink(req, res) {
  const { id } = req.params;
  const { platform, label, url, icon, order, isActive } = req.body;

  const updateData = {};
  if (platform !== undefined) updateData.platform = platform;
  if (label !== undefined) updateData.label = label;
  if (url !== undefined) updateData.url = url;
  if (icon !== undefined) updateData.icon = icon;
  if (order !== undefined) updateData.order = Number(order);
  if (isActive !== undefined) updateData.isActive = Boolean(isActive);

  const updated = await prisma.socialLink.update({
    where: { id: Number(id) },
    data: updateData,
  });

  return successResponse(res, updated, 'Social link updated successfully');
}

/**
 * Bulk update social links
 * PUT /api/social-links
 */
async function updateSocialLinks(req, res) {
  const links = Array.isArray(req.body) ? req.body : req.body.links;
  if (!Array.isArray(links)) {
    return errorResponse(res, 'Array of links required', 400);
  }

  const results = [];
  for (let i = 0; i < links.length; i++) {
    const item = links[i];
    const platform = item.platform || item.name || 'other';
    const label = item.label || item.name || platform;
    const url = item.url;
    const icon = item.icon || null;
    const order = item.order !== undefined ? Number(item.order) : i + 1;
    const isActive = item.isActive !== undefined ? Boolean(item.isActive) : true;

    if (item.id && !isNaN(Number(item.id))) {
      const updated = await prisma.socialLink.upsert({
        where: { id: Number(item.id) },
        update: { platform, label, url, icon, order, isActive },
        create: { platform, label, url, icon, order, isActive },
      });
      results.push(updated);
    } else {
      const created = await prisma.socialLink.create({
        data: { platform, label, url, icon, order, isActive },
      });
      results.push(created);
    }
  }

  return successResponse(res, results, 'Social links updated successfully');
}

/**
 * Delete social link
 * DELETE /api/social-links/:id
 */
async function deleteSocialLink(req, res) {
  const { id } = req.params;

  await prisma.socialLink.delete({
    where: { id: Number(id) },
  });

  return successResponse(res, null, 'Social link deleted successfully');
}

module.exports = {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  updateSocialLinks,
  deleteSocialLink,
};
