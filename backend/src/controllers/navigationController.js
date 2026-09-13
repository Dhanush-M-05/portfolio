import prisma from '../config/database.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Get Navigation Items & Brand Config
 * GET /api/navigation
 */
export const getNavigation = async (req, res) => {
  const showAll = req.query.all === 'true';
  const where = showAll ? {} : { isActive: true };

  const [items, settings] = await Promise.all([
    prisma.navigationItem.findMany({
      where,
      orderBy: { order: 'asc' },
    }),
    prisma.websiteSettings.findFirst(),
  ]);

  const links = items.map((i) => ({
    id: i.id,
    label: i.label,
    url: i.url,
    target: i.target || i.url.replace(/^#/, ''),
    order: i.order,
    isActive: i.isActive,
    isVisible: i.isVisible,
    openInNewTab: i.openInNewTab,
  }));

  // If full=true requested, return combined navigation object
  const responseData = {
    links,
    brandName: settings?.brandName || 'Dhanush M',
    brandRole: settings?.brandRole || 'Web Developer',
    logoLetters: settings?.logoLetters ? settings.logoLetters.split('') : ['D', 'M'],
    resumeBtnText: settings?.resumeBtnText || 'Resume',
    talkBtnText: settings?.talkBtnText || "Let's Talk",
  };

  return res.status(200).json({
    success: true,
    message: 'Navigation retrieved',
    data: responseData,
    links,
    ...responseData,
  });
};

/**
 * Create Navigation Item
 * POST /api/navigation
 */
export const createNavigationItem = async (req, res) => {
  const { label, url, target, order, isActive, isVisible, openInNewTab } = req.body;

  if (!label || !url) {
    return errorResponse(res, 400, 'Label and URL are required');
  }

  const newItem = await prisma.navigationItem.create({
    data: {
      label,
      url,
      target: target || url.replace(/^#/, ''),
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
      openInNewTab: openInNewTab !== undefined ? Boolean(openInNewTab) : false,
    },
  });

  return successResponse(res, 201, 'Navigation item created successfully', newItem);
};

/**
 * Update Single Navigation Item
 * PUT /api/navigation/:id
 */
export const updateNavigationItem = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const existing = await prisma.navigationItem.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(res, 404, 'Navigation item not found');
  }

  const updated = await prisma.navigationItem.update({
    where: { id },
    data: {
      ...(data.label !== undefined && { label: data.label }),
      ...(data.url !== undefined && { url: data.url }),
      ...(data.target !== undefined && { target: data.target }),
      ...(data.order !== undefined && { order: Number(data.order) }),
      ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
      ...(data.isVisible !== undefined && { isVisible: Boolean(data.isVisible) }),
      ...(data.openInNewTab !== undefined && { openInNewTab: Boolean(data.openInNewTab) }),
    },
  });

  return successResponse(res, 200, 'Navigation item updated successfully', updated);
};

/**
 * Bulk Update Navigation & Settings
 * PUT /api/navigation
 */
export const updateNavigation = async (req, res) => {
  const body = req.body;
  const links = body.links || (Array.isArray(body) ? body : []);

  if (Array.isArray(links)) {
    for (let idx = 0; idx < links.length; idx++) {
      const link = links[idx];
      if (link.id) {
        await prisma.navigationItem.update({
          where: { id: link.id },
          data: {
            ...(link.label !== undefined && { label: link.label }),
            ...(link.url !== undefined && { url: link.url }),
            ...(link.target !== undefined && { target: link.target }),
            order: link.order !== undefined ? Number(link.order) : idx + 1,
            isActive: link.isActive !== undefined ? Boolean(link.isActive) : true,
            isVisible: link.isVisible !== undefined ? Boolean(link.isVisible) : true,
            openInNewTab: link.openInNewTab !== undefined ? Boolean(link.openInNewTab) : false,
          },
        });
      }
    }
  }

  // Update website settings brand details if provided
  if (body.brandName || body.brandRole || body.logoLetters || body.resumeBtnText || body.talkBtnText) {
    const settings = await prisma.websiteSettings.findFirst();
    const settingsPayload = {
      ...(body.brandName && { brandName: body.brandName }),
      ...(body.brandRole && { brandRole: body.brandRole }),
      ...(body.logoLetters && {
        logoLetters: Array.isArray(body.logoLetters) ? body.logoLetters.join('') : body.logoLetters,
      }),
      ...(body.resumeBtnText && { resumeBtnText: body.resumeBtnText }),
      ...(body.talkBtnText && { talkBtnText: body.talkBtnText }),
    };

    if (settings) {
      await prisma.websiteSettings.update({
        where: { id: settings.id },
        data: settingsPayload,
      });
    } else {
      await prisma.websiteSettings.create({
        data: settingsPayload,
      });
    }
  }

  const updatedLinks = await prisma.navigationItem.findMany({
    orderBy: { order: 'asc' },
  });

  return successResponse(res, 200, 'Navigation updated successfully', {
    links: updatedLinks,
  });
};

/**
 * Delete Navigation Item
 * DELETE /api/navigation/:id
 */
export const deleteNavigationItem = async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.navigationItem.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(res, 404, 'Navigation item not found');
  }

  await prisma.navigationItem.delete({ where: { id } });

  return successResponse(res, 200, 'Navigation item deleted successfully');
};

export default {
  getNavigation,
  createNavigationItem,
  updateNavigationItem,
  updateNavigation,
  deleteNavigationItem,
};
