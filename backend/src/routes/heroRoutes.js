const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/authMiddleware');

// Public
router.get('/', asyncHandler(heroController.getHero));

// Admin Protected
router.put('/', authenticate, asyncHandler(heroController.updateHero));

module.exports = router;
