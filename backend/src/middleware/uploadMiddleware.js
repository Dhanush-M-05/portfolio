const multer = require('multer');
const { errorResponse } = require('../utils/apiResponse');

/**
 * Creates a middleware wrapper around a multer upload function to catch upload errors
 */
function handleUpload(multerUpload) {
  return (req, res, next) => {
    multerUpload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return errorResponse(
              res,
              'File size exceeds the allowed limit.',
              400
            );
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return errorResponse(
              res,
              `Unexpected file field: ${err.field}. Please check field name.`,
              400
            );
          }
          return errorResponse(res, `Upload error: ${err.message}`, 400);
        }

        // Custom filter error
        return errorResponse(
          res,
          err.message || 'File upload validation failed.',
          err.status || 400
        );
      }

      next();
    });
  };
}

module.exports = {
  handleUpload,
};
