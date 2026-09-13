import { Router } from 'express';
import { getAbout, updateAbout } from '../controllers/aboutController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getAbout));
router.put('/', requireAuth, asyncHandler(updateAbout));

export default router;
