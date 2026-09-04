const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/authMiddleware');

// Public
router.get('/', asyncHandler(aboutController.getAbout));

// Admin Protected
router.put('/', authenticate, asyncHandler(aboutController.updateAbout));

module.exports = router;
