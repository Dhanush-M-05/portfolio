import { errorResponse } from '../utils/apiResponse.js';

/**
 * Higher-order middleware to run a validation function against req.body
 */
export const validateBody = (validatorFn) => {
  return (req, res, next) => {
    const { isValid, errors } = validatorFn(req.body);
    if (!isValid) {
      return errorResponse(res, 422, 'Validation failed', errors);
    }
    next();
  };
};

export default validateBody;
