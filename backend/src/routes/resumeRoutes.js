import { Router } from 'express';
import {
  getResume,
  uploadResume as uploadResumeController,
  updateResume,
  deleteResume,
  downloadResume,
  viewResume,
} from '../controllers/resumeController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { uploadResume as uploadResumeMiddleware } from '../middleware/uploadMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getResume));
router.get('/download', asyncHandler(downloadResume));
router.get('/view', asyncHandler(viewResume));

router.post('/', requireAuth, uploadResumeMiddleware.single('file'), asyncHandler(uploadResumeController));
router.put('/:id', requireAuth, uploadResumeMiddleware.single('file'), asyncHandler(updateResume));
router.delete('/:id', requireAuth, asyncHandler(deleteResume));

export default router;
