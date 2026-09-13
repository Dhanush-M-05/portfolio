import { Router } from 'express';
import { getFooter, updateFooter } from '../controllers/footerController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getFooter));
router.put('/', requireAuth, asyncHandler(updateFooter));

export default router;
