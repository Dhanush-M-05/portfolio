const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/authMiddleware');

// Public
router.get('/', asyncHandler(socialController.getSocialLinks));

// Admin Protected
router.post('/', authenticate, asyncHandler(socialController.createSocialLink));
router.put('/', authenticate, asyncHandler(socialController.updateSocialLinks));
router.put('/:id', authenticate, asyncHandler(socialController.updateSocialLink));
router.delete('/:id', authenticate, asyncHandler(socialController.deleteSocialLink));

module.exports = router;
