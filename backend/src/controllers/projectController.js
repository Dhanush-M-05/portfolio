import prisma from '../config/database.js';
import cloudinaryService from '../services/cloudinaryService.js';
import { generateSlug } from '../utils/slugGenerator.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Get Projects
 * GET /api/projects
 */
export const getProjects = async (req, res) => {
  const showAll = req.query.all === 'true';
  const { featured, search, page, limit } = req.query;

  const where = {};
  if (!showAll) {
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

  const take = limit ? parseInt(limit, 10) : undefined;
  const skip = page && limit ? (parseInt(page, 10) - 1) * take : undefined;

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
      skip,
      take,
    }),
    prisma.project.count({ where }),
  ]);

  // Ensure isVisible is true when isActive is true for complete frontend compatibility
  const mappedProjects = projects.map((p) => ({
    ...p,
    isVisible: p.isActive,
  }));

  return res.status(200).json({
    success: true,
    message: 'Projects retrieved',
    data: mappedProjects,
    projects: mappedProjects,
    total,
    page: page ? parseInt(page, 10) : 1,
  });
};

/**
 * Get Project by ID
 * GET /api/projects/:id
 */
export const getProjectById = async (req, res) => {
  const { id } = req.params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!project) {
    return errorResponse(res, 404, 'Project not found');
  }

  return successResponse(res, 200, 'Project retrieved', {
    ...project,
    isVisible: project.isActive,
  });
};

/**
 * Get Project by Slug
 * GET /api/projects/slug/:slug
 */
export const getProjectBySlug = async (req, res) => {
  const { slug } = req.params;

  let project = await prisma.project.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  });

  // Fallback to searching by ID if not found by slug
  if (!project) {
    project = await prisma.project.findUnique({
      where: { id: slug },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  if (!project) {
    return errorResponse(res, 404, 'Project not found');
  }

  return successResponse(res, 200, 'Project details retrieved', {
    ...project,
    isVisible: project.isActive,
  });
};

/**
 * Create Project
 * POST /api/projects
 */
export const createProject = async (req, res) => {
  const data = req.body;
  const title = (data.title || '').trim();

  if (!title) {
    return errorResponse(res, 400, 'Project title is required');
  }

  let slug = generateSlug(data.slug || title);
  // Ensure unique slug
  let counter = 1;
  let uniqueSlug = slug;
  while (await prisma.project.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  // Handle technologies and features array parsing
  let technologies = data.technologies;
  if (typeof technologies === 'string') {
    technologies = technologies.split(',').map((t) => t.trim()).filter(Boolean);
  }

  let features = data.features;
  if (typeof features === 'string') {
    features = features.split('\n').map((f) => f.trim()).filter(Boolean);
  }

  // If thumbnail image file was uploaded
  let thumbnailUrl = data.thumbnailUrl;
  let thumbnailPublicId = data.thumbnailPublicId;
  if (req.file && req.file.buffer) {
    const uploadResult = await cloudinaryService.uploadImage(req.file.buffer, 'portfolio/projects');
    thumbnailUrl = uploadResult.secure_url || uploadResult.url;
    thumbnailPublicId = uploadResult.public_id;
  }

  const newProject = await prisma.project.create({
    data: {
      title,
      slug: uniqueSlug,
      shortDescription: data.shortDescription || data.description,
      description: data.description,
      tagline: data.tagline,
      category: data.category || 'Full Stack',
      technologies: technologies || [],
      features: features || [],
      githubUrl: data.githubUrl || '',
      liveUrl: data.liveUrl || '',
      liveDemoBtnText: data.liveDemoBtnText || 'Live Demo',
      githubBtnText: data.githubBtnText || 'GitHub',
      detailsBtnText: data.detailsBtnText || 'View Project',
      thumbnailUrl: thumbnailUrl || '',
      thumbnailPublicId: thumbnailPublicId || '',
      featured: data.featured !== undefined ? Boolean(data.featured) : false,
      order: data.order !== undefined ? Number(data.order) : 0,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    },
    include: {
      images: true,
    },
  });

  return successResponse(res, 201, 'Project created successfully', {
    ...newProject,
    isVisible: newProject.isActive,
  });
};

/**
 * Update Project
 * PUT /api/projects/:id
 */
export const updateProject = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  // Search by ID first, or by slug
  let existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    existing = await prisma.project.findUnique({ where: { slug: id } });
  }

  if (!existing) {
    return errorResponse(res, 404, 'Project not found');
  }

  // Handle technologies and features array parsing
  let technologies = data.technologies;
  if (typeof technologies === 'string') {
    technologies = technologies.split(',').map((t) => t.trim()).filter(Boolean);
  }

  let features = data.features;
  if (typeof features === 'string') {
    features = features.split('\n').map((f) => f.trim()).filter(Boolean);
  }

  // If new thumbnail file uploaded
  let thumbnailUrl = data.thumbnailUrl !== undefined ? data.thumbnailUrl : existing.thumbnailUrl;
  let thumbnailPublicId = data.thumbnailPublicId !== undefined ? data.thumbnailPublicId : existing.thumbnailPublicId;
  if (req.file && req.file.buffer) {
    const uploadResult = await cloudinaryService.replaceFile(
      req.file.buffer,
      'portfolio/projects',
      existing.thumbnailPublicId
    );
    thumbnailUrl = uploadResult.secure_url || uploadResult.url;
    thumbnailPublicId = uploadResult.public_id;
  }

  const updatePayload = {
    ...(data.title !== undefined && { title: data.title }),
    ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.tagline !== undefined && { tagline: data.tagline }),
    ...(data.category !== undefined && { category: data.category }),
    ...(technologies !== undefined && { technologies }),
    ...(features !== undefined && { features }),
    ...(data.githubUrl !== undefined && { githubUrl: data.githubUrl }),
    ...(data.liveUrl !== undefined && { liveUrl: data.liveUrl }),
    ...(data.liveDemoBtnText !== undefined && { liveDemoBtnText: data.liveDemoBtnText }),
    ...(data.githubBtnText !== undefined && { githubBtnText: data.githubBtnText }),
    ...(data.detailsBtnText !== undefined && { detailsBtnText: data.detailsBtnText }),
    ...(thumbnailUrl !== undefined && { thumbnailUrl }),
    ...(thumbnailPublicId !== undefined && { thumbnailPublicId }),
    ...(data.featured !== undefined && { featured: Boolean(data.featured) }),
    ...(data.order !== undefined && { order: Number(data.order) }),
    ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
  };

  const updated = await prisma.project.update({
    where: { id: existing.id },
    data: updatePayload,
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  });

  return successResponse(res, 200, 'Project updated successfully', {
    ...updated,
    isVisible: updated.isActive,
  });
};

/**
 * Delete Project
 * DELETE /api/projects/:id
 */
export const deleteProject = async (req, res) => {
  const { id } = req.params;

  let existing = await prisma.project.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!existing) {
    existing = await prisma.project.findUnique({
      where: { slug: id },
      include: { images: true },
    });
  }

  if (!existing) {
    return errorResponse(res, 404, 'Project not found');
  }

  // Delete thumbnail from Cloudinary if exists
  if (existing.thumbnailPublicId) {
    cloudinaryService.deleteFile(existing.thumbnailPublicId, 'image').catch(() => {});
  }

  // Delete project screenshots from Cloudinary
  if (existing.images && existing.images.length > 0) {
    for (const img of existing.images) {
      if (img.publicId) {
        cloudinaryService.deleteFile(img.publicId, 'image').catch(() => {});
      }
    }
  }

  await prisma.project.delete({ where: { id: existing.id } });

  return successResponse(res, 200, 'Project deleted successfully');
};

/**
 * Add Project Screenshot Image
 * POST /api/projects/:id/images
 */
export const addProjectImage = async (req, res) => {
  const { id } = req.params;

  let existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    existing = await prisma.project.findUnique({ where: { slug: id } });
  }

  if (!existing) {
    return errorResponse(res, 404, 'Project not found');
  }

  if (!req.file || !req.file.buffer) {
    return errorResponse(res, 400, 'Image file is required');
  }

  const uploadResult = await cloudinaryService.uploadImage(
    req.file.buffer,
    'portfolio/project-images'
  );

  const newImage = await prisma.projectImage.create({
    data: {
      projectId: existing.id,
      imageUrl: uploadResult.secure_url || uploadResult.url,
      publicId: uploadResult.public_id,
      caption: req.body.caption || '',
      order: req.body.order !== undefined ? Number(req.body.order) : 0,
    },
  });

  return successResponse(res, 201, 'Project image uploaded successfully', newImage);
};

/**
 * Delete Project Screenshot Image
 * DELETE /api/projects/:id/images/:imageId
 */
export const deleteProjectImage = async (req, res) => {
  const { id, imageId } = req.params;

  const image = await prisma.projectImage.findUnique({
    where: { id: imageId },
  });

  if (!image) {
    return errorResponse(res, 404, 'Project image not found');
  }

  if (image.publicId) {
    cloudinaryService.deleteFile(image.publicId, 'image').catch(() => {});
  }

  await prisma.projectImage.delete({ where: { id: imageId } });

  return successResponse(res, 200, 'Project image deleted successfully');
};

export default {
  getProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  addProjectImage,
  deleteProjectImage,
};
