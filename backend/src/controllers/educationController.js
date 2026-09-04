const { prisma } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/apiResponse');

function formatEducation(edu) {
  if (!edu) return edu;
  return {
    ...edu,
    period: edu.startYear ? `${edu.startYear}${edu.endYear ? ` – ${edu.endYear}` : ''}` : '',
  };
}

/**
 * Get all educations
 * GET /api/education
 */
async function getEducations(req, res) {
  const { all } = req.query;
  const where = all === 'true' ? {} : { isActive: true };

  const educations = await prisma.education.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  return successResponse(res, educations.map(formatEducation), 'Education records retrieved successfully');
}

/**
 * Get single education by ID
 * GET /api/education/:id
 */
async function getEducationById(req, res) {
  const { id } = req.params;

  const education = await prisma.education.findUnique({
    where: { id: Number(id) },
  });

  if (!education) {
    return errorResponse(res, 'Education record not found', 404);
  }

  return successResponse(res, formatEducation(education), 'Education record retrieved successfully');
}

/**
 * Create education
 * POST /api/education
 */
async function createEducation(req, res) {
  const {
    institution,
    degree,
    department,
    startYear,
    endYear,
    grade,
    description,
    order,
    isActive,
  } = req.body;

  if (!institution || !degree) {
    return errorResponse(res, 'Institution and degree are required', 400);
  }

  let sYear = startYear;
  let eYear = endYear;
  if (!sYear && req.body.period) {
    const parts = req.body.period.split('–').map((s) => s.trim());
    sYear = parts[0] || null;
    eYear = parts[1] || null;
  }

  const newEducation = await prisma.education.create({
    data: {
      institution,
      degree,
      department: department || null,
      startYear: sYear || null,
      endYear: eYear || null,
      grade: grade || null,
      description: description || null,
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    },
  });

  return successResponse(res, formatEducation(newEducation), 'Education record created successfully', 201);
}

/**
 * Update education
 * PUT /api/education/:id
 */
async function updateEducation(req, res) {
  const { id } = req.params;
  const {
    institution,
    degree,
    department,
    startYear,
    endYear,
    grade,
    description,
    order,
    isActive,
  } = req.body;

  const updateData = {};
  if (institution !== undefined) updateData.institution = institution;
  if (degree !== undefined) updateData.degree = degree;
  if (department !== undefined) updateData.department = department;
  if (startYear !== undefined) updateData.startYear = startYear;
  if (endYear !== undefined) updateData.endYear = endYear;
  if (req.body.period && !startYear && !endYear) {
    const parts = req.body.period.split('–').map((s) => s.trim());
    updateData.startYear = parts[0] || null;
    updateData.endYear = parts[1] || null;
  }
  if (grade !== undefined) updateData.grade = grade;
  if (description !== undefined) updateData.description = description;
  if (order !== undefined) updateData.order = Number(order);
  if (isActive !== undefined) updateData.isActive = Boolean(isActive);

  const updatedEducation = await prisma.education.update({
    where: { id: Number(id) },
    data: updateData,
  });

  return successResponse(res, formatEducation(updatedEducation), 'Education record updated successfully');
}

/**
 * Delete education
 * DELETE /api/education/:id
 */
async function deleteEducation(req, res) {
  const { id } = req.params;

  await prisma.education.delete({
    where: { id: Number(id) },
  });

  return successResponse(res, null, 'Education record deleted successfully');
}

module.exports = {
  getEducations,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
};
