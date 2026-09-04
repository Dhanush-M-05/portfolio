const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const asyncHandler = require('../utils/asyncHandler');
const { loginValidator } = require('../validators/authValidator');
const { authenticate } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

// Public login (rate limited to protect against brute-force)
router.post('/login', authLimiter, loginValidator, asyncHandler(authController.login));

// Protected auth endpoints
router.post('/logout', authenticate, asyncHandler(authController.logout));
router.get('/me', authenticate, asyncHandler(authController.getMe));
router.get('/verify', authenticate, (req, res) => {
  res.status(200).json({ success: true, valid: true, user: req.user });
});

module.exports = router;
