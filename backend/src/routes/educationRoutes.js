const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/authMiddleware');

// Public
router.get('/', asyncHandler(educationController.getEducations));
router.get('/:id', asyncHandler(educationController.getEducationById));

// Admin Protected
router.post('/', authenticate, asyncHandler(educationController.createEducation));
router.put('/:id', authenticate, asyncHandler(educationController.updateEducation));
router.delete('/:id', authenticate, asyncHandler(educationController.deleteEducation));

module.exports = router;
