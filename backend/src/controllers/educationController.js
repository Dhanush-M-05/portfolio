import prisma from '../config/database.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Get Educations
 * GET /api/education
 */
export const getEducation = async (req, res) => {
  const showAll = req.query.all === 'true';
  const where = showAll ? {} : { isActive: true };

  const educations = await prisma.education.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  return successResponse(res, 200, 'Education records retrieved', educations);
};

/**
 * Get Education by ID
 * GET /api/education/:id
 */
export const getEducationById = async (req, res) => {
  const { id } = req.params;
  const education = await prisma.education.findUnique({
    where: { id },
  });

  if (!education) {
    return errorResponse(res, 404, 'Education record not found');
  }

  return successResponse(res, 200, 'Education record retrieved', education);
};

/**
 * Create Education
 * POST /api/education
 */
export const createEducation = async (req, res) => {
  const { institution, degree, department, startYear, endYear, grade, description, order, isActive } = req.body;

  if (!institution || !degree) {
    return errorResponse(res, 400, 'Institution and degree are required');
  }

  const newEducation = await prisma.education.create({
    data: {
      institution,
      degree,
      department: department || '',
      startYear: startYear || '',
      endYear: endYear || '',
      grade: grade || '',
      description: description || '',
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    },
  });

  return successResponse(res, 201, 'Education created successfully', newEducation);
};

/**
 * Update Education
 * PUT /api/education/:id
 */
export const updateEducation = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const existing = await prisma.education.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(res, 404, 'Education record not found');
  }

  const updated = await prisma.education.update({
    where: { id },
    data: {
      ...(data.institution !== undefined && { institution: data.institution }),
      ...(data.degree !== undefined && { degree: data.degree }),
      ...(data.department !== undefined && { department: data.department }),
      ...(data.startYear !== undefined && { startYear: data.startYear }),
      ...(data.endYear !== undefined && { endYear: data.endYear }),
      ...(data.grade !== undefined && { grade: data.grade }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.order !== undefined && { order: Number(data.order) }),
      ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
    },
  });

  return successResponse(res, 200, 'Education updated successfully', updated);
};

/**
 * Delete Education
 * DELETE /api/education/:id
 */
export const deleteEducation = async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.education.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(res, 404, 'Education record not found');
  }

  await prisma.education.delete({ where: { id } });

  return successResponse(res, 200, 'Education deleted successfully');
};

export default {
  getEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
};
