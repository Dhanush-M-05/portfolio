import { Router } from 'express';
import {
  submitContact,
  getMessages,
  getMessageById,
  markMessageRead,
  deleteMessage,
} from '../controllers/contactController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { contactLimiter } from '../middleware/rateLimitMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { validateContact } from '../validators/contactValidator.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.post('/', contactLimiter, validateBody(validateContact), asyncHandler(submitContact));
router.get('/', requireAuth, asyncHandler(getMessages));
router.get('/:id', requireAuth, asyncHandler(getMessageById));
router.patch('/:id/read', requireAuth, asyncHandler(markMessageRead));
router.put('/:id/read', requireAuth, asyncHandler(markMessageRead));
router.delete('/:id', requireAuth, asyncHandler(deleteMessage));

export default router;
