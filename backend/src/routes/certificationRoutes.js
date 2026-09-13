import { Router } from 'express';
import {
  getCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification,
  viewCertificate,
} from '../controllers/certificationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { uploadCertificate } from '../middleware/uploadMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getCertifications));
router.get('/:id', asyncHandler(getCertificationById));
router.get('/:id/view', asyncHandler(viewCertificate));

router.post('/', requireAuth, uploadCertificate.single('certificate'), asyncHandler(createCertification));
router.put('/:id', requireAuth, uploadCertificate.single('certificate'), asyncHandler(updateCertification));
router.delete('/:id', requireAuth, asyncHandler(deleteCertification));

export default router;
