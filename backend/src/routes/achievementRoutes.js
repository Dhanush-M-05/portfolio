import { Router } from 'express';
import {
  getAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '../controllers/achievementController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getAchievements));
router.get('/:id', asyncHandler(getAchievementById));
router.post('/', requireAuth, asyncHandler(createAchievement));
router.put('/:id', requireAuth, asyncHandler(updateAchievement));
router.delete('/:id', requireAuth, asyncHandler(deleteAchievement));

export default router;
