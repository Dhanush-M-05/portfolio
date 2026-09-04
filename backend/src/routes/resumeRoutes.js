const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const asyncHandler = require('../utils/asyncHandler');
const { updateResumeValidator } = require('../validators/resumeValidator');
const { authenticate } = require('../middleware/authMiddleware');
const { uploadResume } = require('../config/multer');
const { handleUpload } = require('../middleware/uploadMiddleware');

// Public endpoints
router.get('/', asyncHandler(resumeController.getResume));
router.get('/download', asyncHandler(resumeController.downloadResume));
router.get('/view', asyncHandler(resumeController.viewResume));
router.get('/preview', asyncHandler(resumeController.viewResume));

// Admin Protected endpoints
router.post(
  '/',
  authenticate,
  handleUpload(uploadResume.any()),
  asyncHandler(resumeController.uploadResume)
);
router.post(
  '/upload',
  authenticate,
  handleUpload(uploadResume.any()),
  asyncHandler(resumeController.uploadResume)
);
router.put('/:id', authenticate, updateResumeValidator, asyncHandler(resumeController.updateResume));
router.delete('/:id', authenticate, asyncHandler(resumeController.deleteResume));

module.exports = router;
