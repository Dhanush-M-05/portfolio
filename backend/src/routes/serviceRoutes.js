const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/authMiddleware');

// Public
router.get('/', asyncHandler(serviceController.getServices));
router.get('/:id', asyncHandler(serviceController.getServiceById));

// Admin Protected
router.post('/', authenticate, asyncHandler(serviceController.createService));
router.put('/:id', authenticate, asyncHandler(serviceController.updateService));
router.delete('/:id', authenticate, asyncHandler(serviceController.deleteService));

module.exports = router;
