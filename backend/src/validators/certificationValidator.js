const { body } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

const validateCertificateFileRequired = (req, res, next) => {
  const file = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);
  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'Certificate file is required',
    });
  }
  next();
};

const createCertificationValidator = [
  validateCertificateFileRequired,
  body('title')
    .custom((val, { req }) => {
      const title = val || req.body.name;
      if (!title || !title.trim()) {
        throw new Error('Certification title is required');
      }
      return true;
    }),
  body('issuer')
    .trim()
    .notEmpty()
    .withMessage('Issuer is required')
    .isLength({ max: 150 }),
  body('issueDate')
    .optional({ checkFalsy: true })
    .trim(),
  body('credentialId')
    .optional({ checkFalsy: true })
    .trim(),
  body('credentialUrl')
    .optional({ checkFalsy: true })
    .trim(),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .toInt(),
  body('isActive')
    .optional()
    .isBoolean()
    .toBoolean(),
  validate,
];

const updateCertificationValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Certification title cannot be empty')
    .isLength({ max: 200 }),
  body('issuer')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Issuer cannot be empty')
    .isLength({ max: 150 }),
  body('issueDate')
    .optional({ checkFalsy: true })
    .trim(),
  body('credentialId')
    .optional({ checkFalsy: true })
    .trim(),
  body('credentialUrl')
    .optional({ checkFalsy: true })
    .trim(),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .toInt(),
  body('isActive')
    .optional()
    .isBoolean()
    .toBoolean(),
  validate,
];

module.exports = {
  createCertificationValidator,
  updateCertificationValidator,
};
