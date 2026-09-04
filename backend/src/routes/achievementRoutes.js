const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/authMiddleware');

// Public
router.get('/', asyncHandler(achievementController.getAchievements));
router.get('/:id', asyncHandler(achievementController.getAchievementById));

// Admin Protected
router.post('/', authenticate, asyncHandler(achievementController.createAchievement));
router.put('/:id', authenticate, asyncHandler(achievementController.updateAchievement));
router.delete('/:id', authenticate, asyncHandler(achievementController.deleteAchievement));

module.exports = router;
