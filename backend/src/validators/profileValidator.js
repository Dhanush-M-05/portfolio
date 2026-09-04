const { body } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Title must not exceed 150 characters'),
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 30 })
    .withMessage('Phone number must not exceed 30 characters'),
  body('profileImageUrl')
    .optional({ checkFalsy: true })
    .trim(),
  body('bio')
    .optional()
    .isString(),
  body('shortBio')
    .optional()
    .isString(),
  validate,
];

module.exports = {
  updateProfileValidator,
};
