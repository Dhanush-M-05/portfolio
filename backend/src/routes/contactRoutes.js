const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const asyncHandler = require('../utils/asyncHandler');
const { createContactValidator } = require('../validators/contactValidator');
const { authenticate } = require('../middleware/authMiddleware');
const { contactLimiter } = require('../middleware/rateLimitMiddleware');

// Public Contact Form (rate limited against spam)
router.post('/', contactLimiter, createContactValidator, asyncHandler(contactController.submitContactMessage));

// Admin Protected Message Management
router.get('/', authenticate, asyncHandler(contactController.getContactMessages));
router.get('/:id', authenticate, asyncHandler(contactController.getContactMessageById));
router.patch('/:id/read', authenticate, asyncHandler(contactController.markMessageAsRead));
router.delete('/:id', authenticate, asyncHandler(contactController.deleteContactMessage));

module.exports = router;
