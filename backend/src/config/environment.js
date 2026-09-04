const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const environment = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_for_development_only_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Dhanush M',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'dhanush2005mp@gmail.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'AdminPassword@2026',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',

  // Email Notification Configuration (SMTP)
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === true,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
  CONTACT_RECEIVER_EMAIL: process.env.CONTACT_RECEIVER_EMAIL || 'dhanush2005mp@gmail.com',

  // Cloudinary File Storage Configuration
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
};

// Validate critical variables in production
if (environment.IS_PRODUCTION) {
  if (!environment.DATABASE_URL) {
    throw new Error('DATABASE_URL is required in production environment.');
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
    throw new Error('JWT_SECRET must be at least 16 characters long in production.');
  }
}

module.exports = environment;
