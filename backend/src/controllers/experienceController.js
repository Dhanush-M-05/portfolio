const { prisma } = require('../config/database');
const {
  successResponse,
  errorResponse,
  paginatedResponse,
} = require('../utils/apiResponse');

function formatExperience(e) {
  if (!e) return e;
  return {
    ...e,
    organization: e.company,
    role: e.position,
    period: e.startDate + (e.endDate ? ` – ${e.endDate}` : ''),
  };
}

/**
 * Get all experiences
 * GET /api/experience
 */
async function getExperiences(req, res) {
  const { page, limit, all } = req.query;

  const where = all === 'true' ? {} : { isActive: true };

  if (page || limit) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [total, experiences] = await Promise.all([
      prisma.experience.count({ where }),
      prisma.experience.findMany({
        where,
        orderBy: { order: 'asc' },
        skip,
        take: limitNum,
      }),
    ]);

    return paginatedResponse(res, experiences.map(formatExperience), total, pageNum, limitNum, 'Experiences retrieved successfully');
  }

  const experiences = await prisma.experience.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  return successResponse(res, experiences.map(formatExperience), 'Experiences retrieved successfully');
}

/**
 * Get single experience
 * GET /api/experience/:id
 */
async function getExperienceById(req, res) {
  const { id } = req.params;

  const experience = await prisma.experience.findUnique({
    where: { id: Number(id) },
  });

  if (!experience) {
    return errorResponse(res, 'Experience not found', 404);
  }

  return successResponse(res, formatExperience(experience), 'Experience retrieved successfully');
}

/**
 * Create experience
 * POST /api/experience
 */
async function createExperience(req, res) {
  const {
    company,
    position,
    location,
    startDate,
    endDate,
    isCurrent,
    description,
    technologies,
    order,
    isActive,
  } = req.body;

  const companyName = company || req.body.organization;
  const positionTitle = position || req.body.role;
  const start = startDate || req.body.period || req.body.duration || 'Current';

  if (!companyName || !positionTitle) {
    return errorResponse(res, 'Company (or organization) and position (or role) are required', 400);
  }

  const newExperience = await prisma.experience.create({
    data: {
      company: companyName,
      position: positionTitle,
      location: location || null,
      startDate: start,
      endDate: endDate || null,
      isCurrent: isCurrent !== undefined ? Boolean(isCurrent) : false,
      description: description || null,
      technologies: Array.isArray(technologies)
        ? technologies
        : typeof technologies === 'string'
        ? JSON.parse(technologies)
        : null,
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    },
  });

  const formatted = {
    ...newExperience,
    organization: newExperience.company,
    role: newExperience.position,
    period: newExperience.startDate + (newExperience.endDate ? ` – ${newExperience.endDate}` : ''),
  };

  return successResponse(res, formatted, 'Experience created successfully', 201);
}

/**
 * Update experience
 * PUT /api/experience/:id
 */
async function updateExperience(req, res) {
  const { id } = req.params;
  const {
    company,
    position,
    location,
    startDate,
    endDate,
    isCurrent,
    description,
    technologies,
    order,
    isActive,
  } = req.body;

  const updateData = {};
  if (company !== undefined || req.body.organization !== undefined) {
    updateData.company = company || req.body.organization;
  }
  if (position !== undefined || req.body.role !== undefined) {
    updateData.position = position || req.body.role;
  }
  if (location !== undefined) updateData.location = location;
  if (startDate !== undefined || req.body.period !== undefined) {
    updateData.startDate = startDate || req.body.period;
  }
  if (endDate !== undefined) updateData.endDate = endDate;
  if (isCurrent !== undefined) updateData.isCurrent = Boolean(isCurrent);
  if (description !== undefined) updateData.description = description;
  if (order !== undefined) updateData.order = Number(order);
  if (isActive !== undefined) updateData.isActive = Boolean(isActive);

  if (technologies !== undefined) {
    updateData.technologies = Array.isArray(technologies)
      ? technologies
      : typeof technologies === 'string'
      ? JSON.parse(technologies)
      : null;
  }

  const updatedExperience = await prisma.experience.update({
    where: { id: Number(id) },
    data: updateData,
  });

  const formatted = {
    ...updatedExperience,
    organization: updatedExperience.company,
    role: updatedExperience.position,
    period: updatedExperience.startDate + (updatedExperience.endDate ? ` – ${updatedExperience.endDate}` : ''),
  };

  return successResponse(res, formatted, 'Experience updated successfully');
}

/**
 * Delete experience
 * DELETE /api/experience/:id
 */
async function deleteExperience(req, res) {
  const { id } = req.params;

  await prisma.experience.delete({
    where: { id: Number(id) },
  });

  return successResponse(res, null, 'Experience deleted successfully');
}

module.exports = {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
};
