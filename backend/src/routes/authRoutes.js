import { Router } from 'express';
import { login, logout, getMe, verify, changePassword } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { validateLogin } from '../validators/authValidator.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.post('/login', authLimiter, validateBody(validateLogin), asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.get('/me', requireAuth, asyncHandler(getMe));
router.get('/verify', requireAuth, asyncHandler(verify));
router.put('/password', requireAuth, asyncHandler(changePassword));

export default router;
