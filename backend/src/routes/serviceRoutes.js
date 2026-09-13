import { Router } from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getServices));
router.get('/:id', asyncHandler(getServiceById));
router.post('/', requireAuth, asyncHandler(createService));
router.put('/:id', requireAuth, asyncHandler(updateService));
router.delete('/:id', requireAuth, asyncHandler(deleteService));

export default router;
