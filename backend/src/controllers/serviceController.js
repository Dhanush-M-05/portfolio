const { prisma } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Get all services (Public returns active, query all=true or admin can see all)
 * GET /api/services
 */
async function getServices(req, res) {
  const { all } = req.query;
  const where = all === 'true' ? {} : { isActive: true };

  const services = await prisma.service.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  return successResponse(res, services, 'Services retrieved successfully');
}

/**
 * Get single service by ID
 * GET /api/services/:id
 */
async function getServiceById(req, res) {
  const { id } = req.params;

  const service = await prisma.service.findUnique({
    where: { id: Number(id) },
  });

  if (!service) {
    return errorResponse(res, 'Service not found', 404);
  }

  return successResponse(res, service, 'Service retrieved successfully');
}

/**
 * Create new service
 * POST /api/services
 */
async function createService(req, res) {
  const { title, description, icon, order, isActive } = req.body;

  if (!title || !description) {
    return errorResponse(res, 'Title and description are required', 400);
  }

  const newService = await prisma.service.create({
    data: {
      title,
      description,
      icon: icon || null,
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    },
  });

  return successResponse(res, newService, 'Service created successfully', 201);
}

/**
 * Update service
 * PUT /api/services/:id
 */
async function updateService(req, res) {
  const { id } = req.params;
  const { title, description, icon, order, isActive } = req.body;

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (icon !== undefined) updateData.icon = icon;
  if (order !== undefined) updateData.order = Number(order);
  if (isActive !== undefined) updateData.isActive = Boolean(isActive);

  const updatedService = await prisma.service.update({
    where: { id: Number(id) },
    data: updateData,
  });

  return successResponse(res, updatedService, 'Service updated successfully');
}

/**
 * Delete service
 * DELETE /api/services/:id
 */
async function deleteService(req, res) {
  const { id } = req.params;

  await prisma.service.delete({
    where: { id: Number(id) },
  });

  return successResponse(res, null, 'Service deleted successfully');
}

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
