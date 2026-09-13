import prisma from '../config/database.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Get Social Links
 * GET /api/social-links
 */
export const getSocialLinks = async (req, res) => {
  const showAll = req.query.all === 'true';
  const where = showAll ? {} : { isActive: true };

  const links = await prisma.socialLink.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  // Ensure name property is provided for frontend icon lookup
  const mapped = links.map((l) => ({
    ...l,
    name: l.label || l.platform,
  }));

  return successResponse(res, 200, 'Social links retrieved', mapped);
};

/**
 * Create Social Link
 * POST /api/social-links
 */
export const createSocialLink = async (req, res) => {
  const { platform, label, url, icon, order, isActive } = req.body;

  if (!platform || !url) {
    return errorResponse(res, 400, 'Platform and URL are required');
  }

  const newLink = await prisma.socialLink.create({
    data: {
      platform,
      label: label || platform,
      url,
      icon: icon || `${platform}Icon`,
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    },
  });

  return successResponse(res, 201, 'Social link created successfully', {
    ...newLink,
    name: newLink.label || newLink.platform,
  });
};

/**
 * Update Individual Social Link
 * PUT /api/social-links/:id
 */
export const updateSocialLink = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const existing = await prisma.socialLink.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(res, 404, 'Social link not found');
  }

  const updated = await prisma.socialLink.update({
    where: { id },
    data: {
      ...(data.platform !== undefined && { platform: data.platform }),
      ...(data.label !== undefined && { label: data.label }),
      ...(data.url !== undefined && { url: data.url }),
      ...(data.icon !== undefined && { icon: data.icon }),
      ...(data.order !== undefined && { order: Number(data.order) }),
      ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
    },
  });

  return successResponse(res, 200, 'Social link updated successfully', {
    ...updated,
    name: updated.label || updated.platform,
  });
};

/**
 * Update Multiple Social Links (Bulk Reorder / Save)
 * PUT /api/social-links
 */
export const updateSocialLinks = async (req, res) => {
  const { links } = req.body;
  const items = Array.isArray(links) ? links : req.body;

  if (!Array.isArray(items)) {
    return errorResponse(res, 400, 'Expected array of social links');
  }

  const updatedItems = [];
  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    if (item.id) {
      const up = await prisma.socialLink.update({
        where: { id: item.id },
        data: {
          ...(item.platform !== undefined && { platform: item.platform }),
          ...(item.label !== undefined && { label: item.label }),
          ...(item.url !== undefined && { url: item.url }),
          ...(item.icon !== undefined && { icon: item.icon }),
          ...(item.isActive !== undefined && { isActive: Boolean(item.isActive) }),
          order: item.order !== undefined ? Number(item.order) : idx + 1,
        },
      });
      updatedItems.push({ ...up, name: up.label || up.platform });
    }
  }

  return successResponse(res, 200, 'Social links updated successfully', updatedItems);
};

/**
 * Delete Social Link
 * DELETE /api/social-links/:id
 */
export const deleteSocialLink = async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.socialLink.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(res, 404, 'Social link not found');
  }

  await prisma.socialLink.delete({ where: { id } });

  return successResponse(res, 200, 'Social link deleted successfully');
};

export default {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  updateSocialLinks,
  deleteSocialLink,
};
