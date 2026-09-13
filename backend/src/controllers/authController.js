import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import ENV from '../config/environment.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Admin Login
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  const { email, usernameOrEmail, username, password } = req.body;
  const identifier = (email || usernameOrEmail || username || '').trim();

  if (!identifier || !password) {
    return errorResponse(res, 400, 'Please provide email and password');
  }

  const user = await prisma.adminUser.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: identifier },
      ],
    },
  });

  if (!user) {
    return errorResponse(res, 401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return errorResponse(res, 401, 'Invalid email or password');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    ENV.JWT_SECRET,
    { expiresIn: ENV.JWT_EXPIRES_IN }
  );

  const userData = {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  };

  return successResponse(res, 200, 'Login successful', {
    token,
    user: userData,
  });
};

/**
 * Admin Logout
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  return successResponse(res, 200, 'Logged out successfully');
};

/**
 * Get current admin user
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  return successResponse(res, 200, 'Admin details retrieved', req.user);
};

/**
 * Verify current token
 * GET /api/auth/verify
 */
export const verify = async (req, res) => {
  return res.status(200).json({
    success: true,
    valid: true,
    user: req.user,
  });
};

/**
 * Change Admin Password
 * PUT /api/auth/password
 */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return errorResponse(res, 400, 'New password must be at least 6 characters long');
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    return errorResponse(res, 404, 'Admin account not found');
  }

  if (currentPassword) {
    const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      return errorResponse(res, 400, 'Current password is incorrect');
    }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: hashedPassword },
  });

  return successResponse(res, 200, 'Admin password updated successfully');
};

export default {
  login,
  logout,
  getMe,
  verify,
  changePassword,
};

