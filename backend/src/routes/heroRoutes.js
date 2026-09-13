import { Router } from 'express';
import { getHero, updateHero } from '../controllers/heroController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getHero));
router.put('/', requireAuth, asyncHandler(updateHero));

export default router;
