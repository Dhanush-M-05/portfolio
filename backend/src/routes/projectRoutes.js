const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const asyncHandler = require('../utils/asyncHandler');
const { createProjectValidator, updateProjectValidator } = require('../validators/projectValidator');
const { authenticate } = require('../middleware/authMiddleware');
const { uploadProjectImage } = require('../config/multer');
const { handleUpload } = require('../middleware/uploadMiddleware');

// Public
router.get('/', asyncHandler(projectController.getProjects));
router.get('/slug/:slug', asyncHandler(projectController.getProjectBySlug));
router.get('/:id', asyncHandler(projectController.getProjectById));

// Admin Protected
router.post('/', authenticate, createProjectValidator, asyncHandler(projectController.createProject));
router.put('/:id', authenticate, updateProjectValidator, asyncHandler(projectController.updateProject));
router.delete('/:id', authenticate, asyncHandler(projectController.deleteProject));

// Project Images
router.post(
  '/:id/images',
  authenticate,
  handleUpload(uploadProjectImage.single('image')),
  asyncHandler(projectController.addProjectImage)
);
router.delete(
  '/:id/images/:imageId',
  authenticate,
  asyncHandler(projectController.deleteProjectImage)
);

module.exports = router;
