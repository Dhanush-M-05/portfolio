import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
} from '../controllers/profileController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { validateProfile } from '../validators/profileValidator.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getProfile));
router.put('/', requireAuth, validateBody(validateProfile), asyncHandler(updateProfile));
router.post('/image', requireAuth, uploadSingleImage.single('image'), asyncHandler(uploadProfileImage));
router.delete('/image', requireAuth, asyncHandler(deleteProfileImage));

export default router;
