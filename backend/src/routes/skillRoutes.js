import { Router } from 'express';
import {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getSkills));
router.get('/:id', asyncHandler(getSkillById));
router.post('/', requireAuth, asyncHandler(createSkill));
router.put('/:id', requireAuth, asyncHandler(updateSkill));
router.delete('/:id', requireAuth, asyncHandler(deleteSkill));

export default router;
