import prisma from '../config/database.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Get Skills
 * GET /api/skills
 */
export const getSkills = async (req, res) => {
  const showAll = req.query.all === 'true';
  const { category } = req.query;

  const where = {};
  if (!showAll) {
    where.isActive = true;
  }
  if (category && category !== 'all') {
    where.category = category;
  }

  const skills = await prisma.skill.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  // Also collect distinct categories for frontend filtering
  const categoriesRaw = await prisma.skill.findMany({
    where: showAll ? {} : { isActive: true },
    select: { category: true },
    distinct: ['category'],
  });
  const categories = categoriesRaw.map((c) => c.category);

  return res.status(200).json({
    success: true,
    message: 'Skills retrieved',
    data: skills,
    skills,
    categories,
  });
};

/**
 * Get Skill by ID
 * GET /api/skills/:id
 */
export const getSkillById = async (req, res) => {
  const { id } = req.params;
  const skill = await prisma.skill.findUnique({
    where: { id },
  });

  if (!skill) {
    return errorResponse(res, 404, 'Skill not found');
  }

  return successResponse(res, 200, 'Skill retrieved', skill);
};

/**
 * Create Skill
 * POST /api/skills
 */
export const createSkill = async (req, res) => {
  const { name, category, proficiency, icon, order, isActive } = req.body;

  if (!name || !category) {
    return errorResponse(res, 400, 'Name and category are required');
  }

  const newSkill = await prisma.skill.create({
    data: {
      name,
      category,
      proficiency: proficiency !== undefined ? Number(proficiency) : 85,
      icon: icon || 'code',
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    },
  });

  return successResponse(res, 201, 'Skill created successfully', newSkill);
};

/**
 * Update Skill
 * PUT /api/skills/:id
 */
export const updateSkill = async (req, res) => {
  const { id } = req.params;
  const { name, category, proficiency, icon, order, isActive } = req.body;

  // Search by ID first, or by name if frontend passed skill name
  let existing = await prisma.skill.findUnique({ where: { id } });
  if (!existing) {
    existing = await prisma.skill.findFirst({ where: { name: id } });
  }

  if (!existing) {
    return errorResponse(res, 404, 'Skill not found');
  }

  const updated = await prisma.skill.update({
    where: { id: existing.id },
    data: {
      ...(name !== undefined && { name }),
      ...(category !== undefined && { category }),
      ...(proficiency !== undefined && { proficiency: Number(proficiency) }),
      ...(icon !== undefined && { icon }),
      ...(order !== undefined && { order: Number(order) }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
    },
  });

  return successResponse(res, 200, 'Skill updated successfully', updated);
};

/**
 * Delete Skill
 * DELETE /api/skills/:id
 */
export const deleteSkill = async (req, res) => {
  const { id } = req.params;

  let existing = await prisma.skill.findUnique({ where: { id } });
  if (!existing) {
    existing = await prisma.skill.findFirst({ where: { name: id } });
  }

  if (!existing) {
    return errorResponse(res, 404, 'Skill not found');
  }

  await prisma.skill.delete({ where: { id: existing.id } });

  return successResponse(res, 200, 'Skill deleted successfully');
};

export default {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};
