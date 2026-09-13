import { Router } from 'express';
import {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  updateSocialLinks,
  deleteSocialLink,
} from '../controllers/socialController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getSocialLinks));
router.post('/', requireAuth, asyncHandler(createSocialLink));
router.put('/', requireAuth, asyncHandler(updateSocialLinks));
router.put('/:id', requireAuth, asyncHandler(updateSocialLink));
router.delete('/:id', requireAuth, asyncHandler(deleteSocialLink));

export default router;
