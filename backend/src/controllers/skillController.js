const { prisma } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Get skills (filters by category and active status)
 * GET /api/skills
 */
async function getSkills(req, res) {
  const { category, all } = req.query;

  const where = {};
  if (all !== 'true') {
    where.isActive = true;
  }
  if (category) {
    where.category = category;
  }

  const skills = await prisma.skill.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  return successResponse(res, skills, 'Skills retrieved successfully');
}

/**
 * Get single skill by ID
 * GET /api/skills/:id
 */
async function getSkillById(req, res) {
  const { id } = req.params;
  const isNum = /^\d+$/.test(id);

  const skill = await prisma.skill.findUnique({
    where: isNum ? { id: Number(id) } : { name: id },
  });

  if (!skill) {
    return errorResponse(res, 'Skill not found', 404);
  }

  return successResponse(res, skill, 'Skill retrieved successfully');
}

/**
 * Create skill
 * POST /api/skills
 */
async function createSkill(req, res) {
  const { name, category, proficiency, icon, order, isActive } = req.body;

  if (!name || !category) {
    return errorResponse(res, 'Name and category are required', 400);
  }

  const newSkill = await prisma.skill.create({
    data: {
      name,
      category,
      proficiency: proficiency ? String(proficiency) : null,
      icon: icon || null,
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    },
  });

  return successResponse(res, newSkill, 'Skill created successfully', 201);
}

/**
 * Update skill
 * PUT /api/skills/:id
 */
async function updateSkill(req, res) {
  const { id } = req.params;
  const { name, category, proficiency, icon, order, isActive } = req.body;
  const isNum = /^\d+$/.test(id);

  const existing = await prisma.skill.findUnique({
    where: isNum ? { id: Number(id) } : { name: id },
  });

  if (!existing) {
    return errorResponse(res, 'Skill not found', 404);
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (category !== undefined) updateData.category = category;
  if (proficiency !== undefined) updateData.proficiency = String(proficiency);
  if (icon !== undefined) updateData.icon = icon;
  if (order !== undefined) updateData.order = Number(order);
  if (isActive !== undefined) updateData.isActive = Boolean(isActive);

  const updatedSkill = await prisma.skill.update({
    where: { id: existing.id },
    data: updateData,
  });

  return successResponse(res, updatedSkill, 'Skill updated successfully');
}

/**
 * Delete skill
 * DELETE /api/skills/:id
 */
async function deleteSkill(req, res) {
  const { id } = req.params;
  const isNum = /^\d+$/.test(id);

  const existing = await prisma.skill.findUnique({
    where: isNum ? { id: Number(id) } : { name: id },
  });

  if (!existing) {
    return errorResponse(res, 'Skill not found', 404);
  }

  await prisma.skill.delete({
    where: { id: existing.id },
  });

  return successResponse(res, null, 'Skill deleted successfully');
}

module.exports = {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};
