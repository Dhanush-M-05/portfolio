import prisma from '../config/database.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Get Experiences
 * GET /api/experience
 */
export const getExperience = async (req, res) => {
  const showAll = req.query.all === 'true';
  const where = showAll ? {} : { isActive: true };

  const experiences = await prisma.experience.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  return successResponse(res, 200, 'Experiences retrieved', experiences);
};

/**
 * Get Experience by ID
 * GET /api/experience/:id
 */
export const getExperienceById = async (req, res) => {
  const { id } = req.params;
  const experience = await prisma.experience.findUnique({
    where: { id },
  });

  if (!experience) {
    return errorResponse(res, 404, 'Experience entry not found');
  }

  return successResponse(res, 200, 'Experience retrieved', experience);
};

/**
 * Create Experience
 * POST /api/experience
 */
export const createExperience = async (req, res) => {
  const { company, position, location, startDate, endDate, isCurrent, description, technologies, order, isActive } = req.body;

  if (!company || !position) {
    return errorResponse(res, 400, 'Company and position are required');
  }

  let tech = technologies;
  if (typeof tech === 'string') {
    tech = tech.split(',').map((t) => t.trim()).filter(Boolean);
  }

  const newExperience = await prisma.experience.create({
    data: {
      company,
      position,
      location: location || '',
      startDate: startDate || '',
      endDate: endDate || '',
      isCurrent: isCurrent !== undefined ? Boolean(isCurrent) : false,
      description: description || '',
      technologies: tech || [],
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    },
  });

  return successResponse(res, 201, 'Experience created successfully', newExperience);
};

/**
 * Update Experience
 * PUT /api/experience/:id
 */
export const updateExperience = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(res, 404, 'Experience entry not found');
  }

  let tech = data.technologies;
  if (typeof tech === 'string') {
    tech = tech.split(',').map((t) => t.trim()).filter(Boolean);
  }

  const updated = await prisma.experience.update({
    where: { id },
    data: {
      ...(data.company !== undefined && { company: data.company }),
      ...(data.position !== undefined && { position: data.position }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.startDate !== undefined && { startDate: data.startDate }),
      ...(data.endDate !== undefined && { endDate: data.endDate }),
      ...(data.isCurrent !== undefined && { isCurrent: Boolean(data.isCurrent) }),
      ...(data.description !== undefined && { description: data.description }),
      ...(tech !== undefined && { technologies: tech }),
      ...(data.order !== undefined && { order: Number(data.order) }),
      ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
    },
  });

  return successResponse(res, 200, 'Experience updated successfully', updated);
};

/**
 * Delete Experience
 * DELETE /api/experience/:id
 */
export const deleteExperience = async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(res, 404, 'Experience entry not found');
  }

  await prisma.experience.delete({ where: { id } });

  return successResponse(res, 200, 'Experience deleted successfully');
};

export default {
  getExperience,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
};
