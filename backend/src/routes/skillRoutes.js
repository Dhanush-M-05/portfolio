const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/authMiddleware');

// Public
router.get('/', asyncHandler(skillController.getSkills));
router.get('/:id', asyncHandler(skillController.getSkillById));

// Admin Protected
router.post('/', authenticate, asyncHandler(skillController.createSkill));
router.put('/:id', authenticate, asyncHandler(skillController.updateSkill));
router.delete('/:id', authenticate, asyncHandler(skillController.deleteSkill));

module.exports = router;
