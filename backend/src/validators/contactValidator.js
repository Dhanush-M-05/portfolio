const { body } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

const createContactValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Subject must be between 2 and 150 characters'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 5, max: 5000 })
    .withMessage('Message must be between 5 and 5000 characters'),
  validate,
];

module.exports = {
  createContactValidator,
};
