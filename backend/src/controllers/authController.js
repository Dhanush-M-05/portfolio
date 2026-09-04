const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const environment = require('../config/environment');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Admin Login
 * POST /api/auth/login
 */
async function login(req, res) {
  const { email, password } = req.body;

  // Search admin user by email
  const admin = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!admin) {
    return errorResponse(res, 'Invalid email or password credentials.', 401);
  }

  // Verify bcrypt password
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return errorResponse(res, 'Invalid email or password credentials.', 401);
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
    environment.JWT_SECRET,
    { expiresIn: environment.JWT_EXPIRES_IN }
  );

  // Return token and sanitized admin user details (no password)
  const safeAdmin = {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };

  return successResponse(
    res,
    {
      token,
      user: safeAdmin,
    },
    'Login successful',
    200
  );
}

/**
 * Admin Logout
 * POST /api/auth/logout
 */
async function logout(req, res) {
  // Clear any auth cookies if present; client is instructed to delete token
  return successResponse(res, null, 'Logged out successfully', 200);
}

/**
 * Get current logged in admin
 * GET /api/auth/me
 */
async function getMe(req, res) {
  return successResponse(
    res,
    req.user,
    'Current user profile retrieved',
    200
  );
}

module.exports = {
  login,
  logout,
  getMe,
};
