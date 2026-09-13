import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  addProjectImage,
  deleteProjectImage,
} from '../controllers/projectController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getProjects));
router.get('/slug/:slug', asyncHandler(getProjectBySlug));
router.get('/:id', asyncHandler(getProjectById));

router.post('/', requireAuth, uploadSingleImage.single('thumbnail'), asyncHandler(createProject));
router.put('/:id', requireAuth, uploadSingleImage.single('thumbnail'), asyncHandler(updateProject));
router.delete('/:id', requireAuth, asyncHandler(deleteProject));

router.post('/:id/images', requireAuth, uploadSingleImage.single('image'), asyncHandler(addProjectImage));
router.delete('/:id/images/:imageId', requireAuth, asyncHandler(deleteProjectImage));

export default router;
