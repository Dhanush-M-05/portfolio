import { Router } from 'express';
import {
  getEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/educationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getEducation));
router.get('/:id', asyncHandler(getEducationById));
router.post('/', requireAuth, asyncHandler(createEducation));
router.put('/:id', requireAuth, asyncHandler(updateEducation));
router.delete('/:id', requireAuth, asyncHandler(deleteEducation));

export default router;
