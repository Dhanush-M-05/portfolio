const { prisma } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Get all navigation items
 * GET /api/navigation
 */
async function getNavigationItems(req, res) {
  const { all, full } = req.query;
  const where = all === 'true' ? {} : { isActive: true };

  const items = await prisma.navigationItem.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  if (full === 'true') {
    const settings = await prisma.websiteSettings.findFirst();
    return successResponse(res, {
      siteTitle: settings?.siteTitle || 'Dhanush M | Portfolio',
      brandName: settings?.brandName || 'Dhanush M',
      brandRole: settings?.brandRole || 'Web Developer',
      logoLetters: settings?.logoLetters ? settings.logoLetters.split('') : ['D', 'M'],
      resumeBtnText: settings?.resumeBtnText || 'Resume',
      talkBtnText: settings?.talkBtnText || "Let's Talk",
      links: items.map((i) => ({
        id: i.id,
        label: i.label,
        url: i.url,
        target: i.url.startsWith('#') ? i.url.slice(1) : i.url,
        order: i.order,
        isActive: i.isActive,
        isVisible: i.isActive,
        openInNewTab: i.openInNewTab,
      })),
    }, 'Navigation configuration retrieved successfully');
  }

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
  const {
    brandName,
    brandRole,
    logoLetters,
    resumeBtnText,
    talkBtnText,
    siteTitle,
    links,
  } = req.body;

  // 1. Update WebsiteSettings if brand/header/siteTitle settings are provided
  const settingsUpdate = {};
  if (brandName !== undefined) settingsUpdate.brandName = brandName;
  if (brandRole !== undefined) settingsUpdate.brandRole = brandRole;
  if (siteTitle !== undefined) settingsUpdate.siteTitle = siteTitle;
  if (resumeBtnText !== undefined) settingsUpdate.resumeBtnText = resumeBtnText;
  if (talkBtnText !== undefined) settingsUpdate.talkBtnText = talkBtnText;
  if (logoLetters !== undefined) {
    settingsUpdate.logoLetters = Array.isArray(logoLetters)
      ? logoLetters.join('')
      : String(logoLetters);
  }

  if (Object.keys(settingsUpdate).length > 0) {
    const existing = await prisma.websiteSettings.findFirst();
    if (existing) {
      await prisma.websiteSettings.update({
        where: { id: existing.id },
        data: settingsUpdate,
      });
    }
  }

  // 2. Sync Navigation Items if links array is provided
  if (Array.isArray(links)) {
    const keptIds = [];

    for (let idx = 0; idx < links.length; idx++) {
      const item = links[idx];
      const targetUrl = item.url || (item.target ? (item.target.startsWith('#') ? item.target : `#${item.target}`) : '#');
      const orderVal = item.order !== undefined ? Number(item.order) : idx + 1;
      const activeVal = item.isActive !== undefined ? Boolean(item.isActive) : (item.isVisible !== undefined ? Boolean(item.isVisible) : true);
      const newTabVal = Boolean(item.openInNewTab);

      if (item.id && !isNaN(Number(item.id))) {
        // Update existing item
        const updatedItem = await prisma.navigationItem.update({
          where: { id: Number(item.id) },
          data: {
            label: item.label || 'Link',
            url: targetUrl,
            order: orderVal,
            isActive: activeVal,
            openInNewTab: newTabVal,
          },
        }).catch(() => null);

        if (updatedItem) {
          keptIds.push(updatedItem.id);
        }
      } else if (item.label) {
        // Create newly added item
        const createdItem = await prisma.navigationItem.create({
          data: {
            label: item.label,
            url: targetUrl,
            order: orderVal,
            isActive: activeVal,
            openInNewTab: newTabVal,
          },
        });
        keptIds.push(createdItem.id);
      }
    }

    // Delete navigation items removed by admin (if any existed and not in keptIds)
    if (keptIds.length > 0) {
      await prisma.navigationItem.deleteMany({
        where: {
          id: { notIn: keptIds },
        },
      }).catch(() => null);
    }
  }

  // Retrieve fresh full configuration
  const [updatedSettings, updatedItems] = await Promise.all([
    prisma.websiteSettings.findFirst(),
    prisma.navigationItem.findMany({ orderBy: { order: 'asc' } }),
  ]);

  const fullResponse = {
    siteTitle: updatedSettings?.siteTitle || 'Dhanush M | Portfolio',
    brandName: updatedSettings?.brandName || 'Dhanush M',
    brandRole: updatedSettings?.brandRole || 'Web Developer',
    logoLetters: updatedSettings?.logoLetters ? updatedSettings.logoLetters.split('') : ['D', 'M'],
    resumeBtnText: updatedSettings?.resumeBtnText || 'Resume',
    talkBtnText: updatedSettings?.talkBtnText || "Let's Talk",
    links: updatedItems.map((i) => ({
      id: i.id,
      label: i.label,
      url: i.url,
      target: i.url.startsWith('#') ? i.url.slice(1) : i.url,
      order: i.order,
      isActive: i.isActive,
      isVisible: i.isActive,
      openInNewTab: i.openInNewTab,
    })),
  };

  return successResponse(res, fullResponse, 'Navigation updated successfully');
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
