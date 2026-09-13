import ENV from '../config/environment.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || res.statusCode || 500;
  if (statusCode < 400) statusCode = 500;

  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Handle Multer upload errors
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File is too large. Maximum allowed size is 15MB.';
    } else {
      message = `File upload error: ${err.message}`;
    }
  }

  // Handle Prisma Database errors
  if (err.code && typeof err.code === 'string' && err.code.startsWith('P')) {
    switch (err.code) {
      case 'P2002': {
        statusCode = 409;
        const target = err.meta?.target ? ` (${err.meta.target})` : '';
        message = `A record with this unique field already exists${target}.`;
        break;
      }
      case 'P2025': {
        statusCode = 404;
        message = 'The requested database record was not found.';
        break;
      }
      case 'P2003': {
        statusCode = 400;
        message = 'Foreign key constraint failed.';
        break;
      }
      default: {
        statusCode = 500;
        message = 'Database operation failed.';
      }
    }
  }

  // Handle JSON Web Token errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired.';
  }

  // Log error securely
  if (ENV.NODE_ENV !== 'production') {
    console.error('🚨 Error Handler:', err);
  } else {
    console.error(`🚨 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}:`, err.message);
  }

  const responsePayload = {
    success: false,
    message,
  };

  if (errors) {
    responsePayload.errors = errors;
  }

  if (ENV.NODE_ENV === 'development' && err.stack) {
    responsePayload.stack = err.stack;
  }

  return res.status(statusCode).json(responsePayload);
};

export default errorHandler;
