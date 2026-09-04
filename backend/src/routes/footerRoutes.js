const express = require('express');
const router = express.Router();
const footerController = require('../controllers/footerController');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/authMiddleware');

// Public
router.get('/', asyncHandler(footerController.getFooter));

// Admin Protected
router.put('/', authenticate, asyncHandler(footerController.updateFooter));

module.exports = router;
