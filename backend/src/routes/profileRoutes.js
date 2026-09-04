const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const asyncHandler = require('../utils/asyncHandler');
const { updateProfileValidator } = require('../validators/profileValidator');
const { authenticate } = require('../middleware/authMiddleware');
const { uploadProfileImage } = require('../config/multer');
const { handleUpload } = require('../middleware/uploadMiddleware');

// Public
router.get('/', asyncHandler(profileController.getProfile));

// Admin Protected
router.put('/', authenticate, updateProfileValidator, asyncHandler(profileController.updateProfile));
router.post(
  '/image',
  authenticate,
  handleUpload(uploadProfileImage.single('image')),
  asyncHandler(profileController.uploadProfileImage)
);
router.delete('/image', authenticate, asyncHandler(profileController.deleteProfileImage));

module.exports = router;
