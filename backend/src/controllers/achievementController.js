const { prisma } = require('../config/database');
const {
  successResponse,
  errorResponse,
  paginatedResponse,
} = require('../utils/apiResponse');

/**
 * Get all achievements
 * GET /api/achievements
 */
async function getAchievements(req, res) {
  const { page, limit, all } = req.query;

  const where = all === 'true' ? {} : { isActive: true };

  if (page || limit) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [total, achievements] = await Promise.all([
      prisma.achievement.count({ where }),
      prisma.achievement.findMany({
        where,
        orderBy: { order: 'asc' },
        skip,
        take: limitNum,
      }),
    ]);

    return paginatedResponse(res, achievements, total, pageNum, limitNum, 'Achievements retrieved successfully');
  }

  const achievements = await prisma.achievement.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  return successResponse(res, achievements, 'Achievements retrieved successfully');
}

/**
 * Get single achievement by ID
 * GET /api/achievements/:id
 */
async function getAchievementById(req, res) {
  const { id } = req.params;

  const achievement = await prisma.achievement.findUnique({
    where: { id: Number(id) },
  });

  if (!achievement) {
    return errorResponse(res, 'Achievement not found', 404);
  }

  return successResponse(res, achievement, 'Achievement retrieved successfully');
}

/**
 * Create achievement
 * POST /api/achievements
 */
async function createAchievement(req, res) {
  const { title, description, date, link, order, isActive } = req.body;

  if (!title) {
    return errorResponse(res, 'Title is required', 400);
  }

  const newAchievement = await prisma.achievement.create({
    data: {
      title,
      description: description || null,
      date: date || null,
      link: link || null,
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    },
  });

  return successResponse(res, newAchievement, 'Achievement created successfully', 201);
}

/**
 * Update achievement
 * PUT /api/achievements/:id
 */
async function updateAchievement(req, res) {
  const { id } = req.params;
  const { title, description, date, link, order, isActive } = req.body;

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (date !== undefined) updateData.date = date;
  if (link !== undefined) updateData.link = link;
  if (order !== undefined) updateData.order = Number(order);
  if (isActive !== undefined) updateData.isActive = Boolean(isActive);

  const updatedAchievement = await prisma.achievement.update({
    where: { id: Number(id) },
    data: updateData,
  });

  return successResponse(res, updatedAchievement, 'Achievement updated successfully');
}

/**
 * Delete achievement
 * DELETE /api/achievements/:id
 */
async function deleteAchievement(req, res) {
  const { id } = req.params;

  await prisma.achievement.delete({
    where: { id: Number(id) },
  });

  return successResponse(res, null, 'Achievement deleted successfully');
}

module.exports = {
  getAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};
