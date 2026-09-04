const environment = require('../config/environment');
const { errorResponse } = require('../utils/apiResponse');

/**
 * 404 Not Found handler for undefined routes
 */
function notFoundHandler(req, res, next) {
  return errorResponse(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}

/**
 * Centralized error handler
 */
function errorHandler(err, req, res, next) {
  // Always log errors on the server console (without leaking passwords/secrets)
  console.error('[Error] Global Error Handler:', {
    message: err.message,
    status: err.status || err.statusCode,
    code: err.code,
    path: req.originalUrl,
    method: req.method,
    ...(environment.IS_PRODUCTION ? {} : { stack: err.stack }),
  });

  // Handle JSON parse error (e.g. malformed body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return errorResponse(res, 'Malformed JSON payload provided in request body.', 400);
  }

  // Handle Prisma Database Errors
  if (err.code) {
    switch (err.code) {
      case 'P2002': {
        const fields = err.meta?.target ? (Array.isArray(err.meta.target) ? err.meta.target.join(', ') : err.meta.target) : 'field';
        return errorResponse(
          res,
          `A record with this ${fields} already exists. Duplicate values are not allowed.`,
          409
        );
      }
      case 'P2025': {
        return errorResponse(
          res,
          err.meta?.cause || 'Requested record was not found.',
          404
        );
      }
      case 'P2003': {
        return errorResponse(
          res,
          'Foreign key constraint failed. Related record does not exist.',
          400
        );
      }
      case 'P2014': {
        return errorResponse(
          res,
          'The change you are trying to make would violate a required relationship.',
          400
        );
      }
      default:
        break;
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid authentication token.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Authentication token has expired. Please log in again.', 401);
  }

  // Handle custom status codes attached to errors
  const statusCode = err.status || err.statusCode || 500;
  const message =
    statusCode === 500 && environment.IS_PRODUCTION
      ? 'An unexpected internal server error occurred.'
      : err.message || 'Internal server error';

  return errorResponse(res, message, statusCode);
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
