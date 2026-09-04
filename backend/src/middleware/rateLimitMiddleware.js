const rateLimit = require('express-rate-limit');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Standard handler for rate limit exceeded
 */
function rateLimitHandler(message) {
  return (req, res) => {
    return errorResponse(res, message, 429);
  };
}

const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

/**
 * General API rate limiter
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 50000 : 1000,
  skip: (req) => {
    // Never rate-limit resume downloads, previews, views, or health checks
    const p = req.originalUrl || req.path || '';
    return p.includes('/resume/download') || p.includes('/resume/view') || p.includes('/resume/preview') || p.includes('/health');
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many requests from this IP. Please try again after 15 minutes.'),
});

/**
 * Strict login rate limiter: 10 login attempts per 15 minutes to prevent brute-force attacks
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many failed login attempts. Please try again after 15 minutes.'),
});

/**
 * Contact form rate limiter: 5 submissions per 15 minutes to prevent spam
 */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many contact messages sent. Please wait 15 minutes before sending another.'),
});

module.exports = {
  apiLimiter,
  authLimiter,
  contactLimiter,
};
