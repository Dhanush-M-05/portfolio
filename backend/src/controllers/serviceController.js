import prisma from '../config/database.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Get Services
 * GET /api/services
 */
export const getServices = async (req, res) => {
  const showAll = req.query.all === 'true';
  const where = showAll ? {} : { isActive: true };

  const services = await prisma.service.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  return successResponse(res, 200, 'Services retrieved', services);
};

/**
 * Get Service by ID
 * GET /api/services/:id
 */
export const getServiceById = async (req, res) => {
  const { id } = req.params;
  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    return errorResponse(res, 404, 'Service not found');
  }

  return successResponse(res, 200, 'Service retrieved', service);
};

/**
 * Create Service
 * POST /api/services
 */
export const createService = async (req, res) => {
  const { title, description, icon, order, isActive } = req.body;

  if (!title || !description) {
    return errorResponse(res, 400, 'Title and description are required');
  }

  const newService = await prisma.service.create({
    data: {
      title,
      description,
      icon: icon || 'CodeIcon',
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    },
  });

  return successResponse(res, 201, 'Service created successfully', newService);
};

/**
 * Update Service
 * PUT /api/services/:id
 */
export const updateService = async (req, res) => {
  const { id } = req.params;
  const { title, description, icon, order, isActive } = req.body;

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(res, 404, 'Service not found');
  }

  const updated = await prisma.service.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(icon !== undefined && { icon }),
      ...(order !== undefined && { order: Number(order) }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
    },
  });

  return successResponse(res, 200, 'Service updated successfully', updated);
};

/**
 * Delete Service
 * DELETE /api/services/:id
 */
export const deleteService = async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(res, 404, 'Service not found');
  }

  await prisma.service.delete({ where: { id } });

  return successResponse(res, 200, 'Service deleted successfully');
};

export default {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
