const { validationResult } = require('express-validator');
const { validationErrorResponse } = require('../utils/apiResponse');

/**
 * Middleware to intercept express-validator errors and return standard 422 JSON response
 */
function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return validationErrorResponse(res, formattedErrors, 'Validation failed');
  }

  next();
}

module.exports = {
  validate,
};
