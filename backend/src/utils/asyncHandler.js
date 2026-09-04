/**
 * Wraps an async route handler or middleware to catch and pass unhandled promise rejections to next()
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
