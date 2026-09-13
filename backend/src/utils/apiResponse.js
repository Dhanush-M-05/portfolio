/**
 * Standard success response helper
 */
export const successResponse = (res, statusCode = 200, message = 'Operation successful', data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standard error response helper
 */
export const errorResponse = (res, statusCode = 500, message = 'Internal server error', errors = null) => {
  const payload = {
    success: false,
    message,
  };
  if (errors) {
    payload.errors = errors;
  }
  return res.status(statusCode).json(payload);
};

export default {
  successResponse,
  errorResponse,
};
