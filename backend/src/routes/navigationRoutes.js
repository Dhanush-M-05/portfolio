import { Router } from 'express';
import {
  getNavigation,
  createNavigationItem,
  updateNavigationItem,
  updateNavigation,
  deleteNavigationItem,
} from '../controllers/navigationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getNavigation));
router.post('/', requireAuth, asyncHandler(createNavigationItem));
router.put('/', requireAuth, asyncHandler(updateNavigation));
router.put('/:id', requireAuth, asyncHandler(updateNavigationItem));
router.delete('/:id', requireAuth, asyncHandler(deleteNavigationItem));

export default router;
