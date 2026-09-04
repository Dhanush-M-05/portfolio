const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/authMiddleware');

// Public
router.get('/', asyncHandler(experienceController.getExperiences));
router.get('/:id', asyncHandler(experienceController.getExperienceById));

// Admin Protected
router.post('/', authenticate, asyncHandler(experienceController.createExperience));
router.put('/:id', authenticate, asyncHandler(experienceController.updateExperience));
router.delete('/:id', authenticate, asyncHandler(experienceController.deleteExperience));

module.exports = router;
