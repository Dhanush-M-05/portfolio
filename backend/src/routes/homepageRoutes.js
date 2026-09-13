import { Router } from 'express';
import {
  getHomepageSections,
  updateHomepageSections,
} from '../controllers/homepageController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getHomepageSections));
router.put('/', requireAuth, asyncHandler(updateHomepageSections));

export default router;
