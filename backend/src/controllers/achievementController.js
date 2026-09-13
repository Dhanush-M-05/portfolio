import prisma from '../config/database.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Get Achievements
 * GET /api/achievements
 */
export const getAchievements = async (req, res) => {
  const showAll = req.query.all === 'true';
  const where = showAll ? {} : { isActive: true };

  const achievements = await prisma.achievement.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  return successResponse(res, 200, 'Achievements retrieved', achievements);
};

/**
 * Get Achievement by ID
 * GET /api/achievements/:id
 */
export const getAchievementById = async (req, res) => {
  const { id } = req.params;
  const achievement = await prisma.achievement.findUnique({
    where: { id },
  });

  if (!achievement) {
    return errorResponse(res, 404, 'Achievement not found');
  }

  return successResponse(res, 200, 'Achievement retrieved', achievement);
};

/**
 * Create Achievement
 * POST /api/achievements
 */
export const createAchievement = async (req, res) => {
  const { title, description, date, category, order, isActive } = req.body;

  if (!title) {
    return errorResponse(res, 400, 'Title is required');
  }

  const newAchievement = await prisma.achievement.create({
    data: {
      title,
      description: description || '',
      date: date || '',
      category: category || 'General',
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    },
  });

  return successResponse(res, 201, 'Achievement created successfully', newAchievement);
};

/**
 * Update Achievement
 * PUT /api/achievements/:id
 */
export const updateAchievement = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const existing = await prisma.achievement.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(res, 404, 'Achievement not found');
  }

  const updated = await prisma.achievement.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.date !== undefined && { date: data.date }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.order !== undefined && { order: Number(data.order) }),
      ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
    },
  });

  return successResponse(res, 200, 'Achievement updated successfully', updated);
};

/**
 * Delete Achievement
 * DELETE /api/achievements/:id
 */
export const deleteAchievement = async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.achievement.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(res, 404, 'Achievement not found');
  }

  await prisma.achievement.delete({ where: { id } });

  return successResponse(res, 200, 'Achievement deleted successfully');
};

export default {
  getAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};
