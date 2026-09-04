const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const environment = require('../config/environment');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Middleware to authenticate requests using JWT Bearer token
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(
        res,
        'Authentication required. No Bearer token provided.',
        401
      );
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, environment.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token has expired. Please log in again.', 401);
      }
      return errorResponse(res, 'Invalid or malformed authentication token.', 401);
    }

    if (!decoded || !decoded.id) {
      return errorResponse(res, 'Invalid token payload.', 401);
    }

    // Look up the admin user in the database
    const admin = await prisma.adminUser.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      return errorResponse(res, 'Admin user account no longer exists.', 401);
    }

    // Attach user to request
    req.user = admin;
    next();
  } catch (error) {
    console.error('[AuthMiddleware] Error:', error.message);
    return errorResponse(res, 'Authentication check failed', 401);
  }
}

/**
 * Role-based authorization middleware
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return errorResponse(
        res,
        'Forbidden: You do not have permission to perform this action.',
        403
      );
    }

    next();
  };
}

module.exports = {
  authenticate,
  authorize,
};
