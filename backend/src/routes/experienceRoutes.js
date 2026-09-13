import { Router } from 'express';
import {
  getExperience,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getExperience));
router.get('/:id', asyncHandler(getExperienceById));
router.post('/', requireAuth, asyncHandler(createExperience));
router.put('/:id', requireAuth, asyncHandler(updateExperience));
router.delete('/:id', requireAuth, asyncHandler(deleteExperience));

export default router;
