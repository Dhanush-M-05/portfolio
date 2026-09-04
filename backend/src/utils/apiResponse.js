/**
 * Formats a successful response
 */
function successResponse(res, data = {}, message = 'Operation successful', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Formats an error response
 */
function errorResponse(res, message = 'Something went wrong', statusCode = 500, errors = undefined) {
  const responseBody = {
    success: false,
    message,
  };

  if (errors !== undefined) {
    responseBody.errors = errors;
  }

  return res.status(statusCode).json(responseBody);
}

/**
 * Formats a paginated response
 */
function paginatedResponse(res, data = [], total = 0, page = 1, limit = 10, message = 'Data retrieved successfully') {
  const totalPages = Math.ceil(total / limit) || 1;

  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages,
    },
  });
}

/**
 * Formats a validation error response
 */
function validationErrorResponse(res, errors = [], message = 'Validation failed') {
  return res.status(422).json({
    success: false,
    message,
    errors,
  });
}

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  validationErrorResponse,
};
