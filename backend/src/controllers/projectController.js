const { prisma } = require('../config/database');
const { generateUniqueProjectSlug } = require('../utils/slugGenerator');
const fileService = require('../services/fileService');
const {
  successResponse,
  errorResponse,
  paginatedResponse,
} = require('../utils/apiResponse');

/**
 * Get projects (supports pagination, filtering by featured, search, and active status)
 * GET /api/projects
 */
async function getProjects(req, res) {
  const { page, limit, featured, search, all } = req.query;

  const where = {};
  if (all !== 'true') {
    where.isActive = true;
  }
  if (featured !== undefined) {
    where.featured = featured === 'true';
  }
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { shortDescription: { contains: search } },
      { description: { contains: search } },
    ];
  }

  // If pagination params supplied
  if (page || limit) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [total, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limitNum,
      }),
    ]);

    return paginatedResponse(res, projects, total, pageNum, limitNum, 'Projects retrieved successfully');
  }

  // Return all matching projects ordered
  const projects = await prisma.project.findMany({
    where,
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
  });

  return successResponse(res, projects, 'Projects retrieved successfully');
}

/**
 * Get project by ID
 * GET /api/projects/:id
 */
async function getProjectById(req, res) {
  const { id } = req.params;

  const project = await prisma.project.findUnique({
    where: { id: Number(id) },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!project) {
    return errorResponse(res, 'Project not found', 404);
  }

  return successResponse(res, project, 'Project retrieved successfully');
}

/**
 * Get project by URL slug
 * GET /api/projects/slug/:slug
 */
async function getProjectBySlug(req, res) {
  const { slug } = req.params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!project) {
    return errorResponse(res, `Project with slug '${slug}' not found`, 404);
  }

  return successResponse(res, project, 'Project retrieved successfully');
}

/**
 * Create project
 * POST /api/projects
 */
async function createProject(req, res) {
  const {
    title,
    slug,
    shortDescription,
    description,
    technologies,
    githubUrl,
    liveUrl,
    thumbnailUrl,
    featured,
    order,
    isActive,
  } = req.body;

  // Auto-generate unique slug if not explicitly provided
  const finalSlug = slug
    ? await generateUniqueProjectSlug(slug)
    : await generateUniqueProjectSlug(title);

  const newProject = await prisma.project.create({
    data: {
      title,
      slug: finalSlug,
      shortDescription: shortDescription || null,
      description,
      technologies: Array.isArray(technologies) ? technologies : (typeof technologies === 'string' ? JSON.parse(technologies) : null),
      githubUrl: githubUrl || null,
      liveUrl: liveUrl || null,
      thumbnailUrl: thumbnailUrl || null,
      featured: featured !== undefined ? Boolean(featured) : false,
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    },
    include: {
      images: true,
    },
  });

  return successResponse(res, newProject, 'Project created successfully', 201);
}

/**
 * Update project
 * PUT /api/projects/:id
 */
async function updateProject(req, res) {
  const { id } = req.params;
  const {
    title,
    slug,
    shortDescription,
    description,
    technologies,
    githubUrl,
    liveUrl,
    thumbnailUrl,
    featured,
    order,
    isActive,
  } = req.body;

  const existing = await prisma.project.findUnique({
    where: { id: Number(id) },
  });

  if (!existing) {
    return errorResponse(res, 'Project not found', 404);
  }

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
  if (description !== undefined) updateData.description = description;
  if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
  if (liveUrl !== undefined) updateData.liveUrl = liveUrl;
  if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
  if (featured !== undefined) updateData.featured = Boolean(featured);
  if (order !== undefined) updateData.order = Number(order);
  if (isActive !== undefined) updateData.isActive = Boolean(isActive);

  if (technologies !== undefined) {
    updateData.technologies = Array.isArray(technologies)
      ? technologies
      : typeof technologies === 'string'
      ? JSON.parse(technologies)
      : null;
  }

  // Handle slug change if provided
  if (slug && slug !== existing.slug) {
    updateData.slug = await generateUniqueProjectSlug(slug, existing.id);
  }

  const updatedProject = await prisma.project.update({
    where: { id: Number(id) },
    data: updateData,
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  });

  return successResponse(res, updatedProject, 'Project updated successfully');
}

/**
 * Delete project
 * DELETE /api/projects/:id
 */
async function deleteProject(req, res) {
  const { id } = req.params;

  await prisma.project.delete({
    where: { id: Number(id) },
  });

  return successResponse(res, null, 'Project and associated images deleted successfully');
}

/**
 * Add image to project
 * POST /api/projects/:id/images
 */
async function addProjectImage(req, res) {
  const { id } = req.params;
  const { altText, order, imageUrl: directImageUrl } = req.body;

  const project = await prisma.project.findUnique({
    where: { id: Number(id) },
  });

  if (!project) {
    return errorResponse(res, 'Project not found', 404);
  }

  let finalImageUrl = directImageUrl;

  if (req.file) {
    finalImageUrl = fileService.getFileUrl(req, 'projects', req.file.filename);
  }

  if (!finalImageUrl) {
    return errorResponse(res, 'Image file or imageUrl is required', 400);
  }

  const newImage = await prisma.projectImage.create({
    data: {
      projectId: Number(id),
      imageUrl: finalImageUrl,
      altText: altText || null,
      order: order !== undefined ? Number(order) : 0,
    },
  });

  return successResponse(res, newImage, 'Project image added successfully', 201);
}

/**
 * Delete image from project
 * DELETE /api/projects/:id/images/:imageId
 */
async function deleteProjectImage(req, res) {
  const { id, imageId } = req.params;

  const projectImage = await prisma.projectImage.findFirst({
    where: {
      id: Number(imageId),
      projectId: Number(id),
    },
  });

  if (!projectImage) {
    return errorResponse(res, 'Project image not found', 404);
  }

  await prisma.projectImage.delete({
    where: { id: Number(imageId) },
  });

  return successResponse(res, null, 'Project image deleted successfully');
}

module.exports = {
  getProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  addProjectImage,
  deleteProjectImage,
};
