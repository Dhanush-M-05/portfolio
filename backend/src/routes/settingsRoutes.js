const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/authMiddleware');

// Public
router.get('/', asyncHandler(settingsController.getSettings));

// Admin Protected
router.put('/', authenticate, asyncHandler(settingsController.updateSettings));

module.exports = router;
