const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certificationController');
const asyncHandler = require('../utils/asyncHandler');
const { createCertificationValidator, updateCertificationValidator } = require('../validators/certificationValidator');
const { authenticate } = require('../middleware/authMiddleware');
const { uploadCertification } = require('../config/multer');
const { handleUpload } = require('../middleware/uploadMiddleware');

// Public
router.get('/', asyncHandler(certificationController.getCertifications));
router.get('/:id/view', asyncHandler(certificationController.viewCertificationFile));
router.get('/:id', asyncHandler(certificationController.getCertificationById));

// Admin Protected
router.post(
  '/',
  authenticate,
  handleUpload(uploadCertification.any()),
  createCertificationValidator,
  asyncHandler(certificationController.createCertification)
);
router.put(
  '/:id',
  authenticate,
  handleUpload(uploadCertification.any()),
  updateCertificationValidator,
  asyncHandler(certificationController.updateCertification)
);
router.delete('/:id', authenticate, asyncHandler(certificationController.deleteCertification));

module.exports = router;
