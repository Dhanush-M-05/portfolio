const express = require('express');
const router = express.Router();
const navigationController = require('../controllers/navigationController');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/authMiddleware');

// Public
router.get('/', asyncHandler(navigationController.getNavigationItems));

// Admin Protected
router.post('/', authenticate, asyncHandler(navigationController.createNavigationItem));
router.put('/', authenticate, asyncHandler(navigationController.updateNavigation));
router.put('/:id', authenticate, asyncHandler(navigationController.updateNavigationItem));
router.delete('/:id', authenticate, asyncHandler(navigationController.deleteNavigationItem));

module.exports = router;
