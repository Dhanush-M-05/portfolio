const { prisma } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Get all navigation items
 * GET /api/navigation
 */
async function getNavigationItems(req, res) {
  const { all } = req.query;
  const where = all === 'true' ? {} : { isActive: true };

  const items = await prisma.navigationItem.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  return successResponse(res, items, 'Navigation items retrieved successfully');
}

/**
 * Create navigation item
 * POST /api/navigation
 */
async function createNavigationItem(req, res) {
  const { label, url, order, isActive, openInNewTab } = req.body;

  if (!label || !url) {
    return errorResponse(res, 'Label and URL are required', 400);
  }

  const newItem = await prisma.navigationItem.create({
    data: {
      label,
      url,
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      openInNewTab: openInNewTab !== undefined ? Boolean(openInNewTab) : false,
    },
  });

  return successResponse(res, newItem, 'Navigation item created successfully', 201);
}

/**
 * Update navigation item
 * PUT /api/navigation/:id
 */
async function updateNavigationItem(req, res) {
  const { id } = req.params;
  const { label, url, order, isActive, openInNewTab } = req.body;

  const updateData = {};
  if (label !== undefined) updateData.label = label;
  if (url !== undefined) updateData.url = url;
  if (order !== undefined) updateData.order = Number(order);
  if (isActive !== undefined) updateData.isActive = Boolean(isActive);
  if (openInNewTab !== undefined) updateData.openInNewTab = Boolean(openInNewTab);

  const updated = await prisma.navigationItem.update({
    where: { id: Number(id) },
    data: updateData,
  });

  return successResponse(res, updated, 'Navigation item updated successfully');
}

/**
 * Bulk update navigation items / configuration
 * PUT /api/navigation
 */
async function updateNavigation(req, res) {
  const { links } = req.body;
  if (Array.isArray(links)) {
    for (const item of links) {
      if (item.id && !isNaN(Number(item.id))) {
        await prisma.navigationItem.update({
          where: { id: Number(item.id) },
          data: {
            ...(item.label && { label: item.label }),
            ...(item.url && { url: item.url }),
            ...(item.order !== undefined && { order: Number(item.order) }),
            ...(item.isActive !== undefined && { isActive: Boolean(item.isActive) }),
            ...(item.openInNewTab !== undefined && { openInNewTab: Boolean(item.openInNewTab) }),
          },
        }).catch(() => null);
      }
    }
  }
  return successResponse(res, req.body, 'Navigation updated successfully');
}

/**
 * Delete navigation item
 * DELETE /api/navigation/:id
 */
async function deleteNavigationItem(req, res) {
  const { id } = req.params;

  await prisma.navigationItem.delete({
    where: { id: Number(id) },
  });

  return successResponse(res, null, 'Navigation item deleted successfully');
}

module.exports = {
  getNavigationItems,
  createNavigationItem,
  updateNavigationItem,
  updateNavigation,
  deleteNavigationItem,
};
