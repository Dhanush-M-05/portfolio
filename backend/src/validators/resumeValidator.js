const { body } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

const updateResumeValidator = [
  body('fileName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('File name cannot be empty'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
    .toBoolean(),
  validate,
];

module.exports = {
  updateResumeValidator,
};
