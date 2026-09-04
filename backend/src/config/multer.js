const path = require('path');
const multer = require('multer');

// Memory storage keeps file buffers in memory for direct streaming to Cloudinary
const storage = multer.memoryStorage();

/**
 * Filter for resume: ONLY PDF allowed
 */
function resumeFileFilter(req, file, cb) {
  const allowedMimes = [
    'application/pdf',
    'application/x-pdf',
    'application/acrobat',
    'applications/vnd.pdf',
    'text/pdf',
    'application/octet-stream',
  ];
  const ext = path.extname(file.originalname).toLowerCase();
  const isMimeValid = allowedMimes.includes(file.mimetype) || file.mimetype.includes('pdf');
  const isExtValid = ext === '.pdf';

  if (isMimeValid && isExtValid) {
    cb(null, true);
  } else {
    const error = new Error('Invalid file type. Only PDF files are allowed for resumes.');
    error.status = 400;
    cb(error, false);
  }
}

/**
 * Filter for certificates: PDF, JPG, JPEG, PNG allowed
 */
function certificationFileFilter(req, file, cb) {
  const allowedMimes = [
    'application/pdf',
    'application/x-pdf',
    'application/octet-stream',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ];
  const allowedExts = ['.pdf', '.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();
  const isMimeValid = allowedMimes.includes(file.mimetype) || file.mimetype.includes('pdf') || file.mimetype.includes('image');
  const isExtValid = allowedExts.includes(ext);

  if (isMimeValid && isExtValid) {
    cb(null, true);
  } else {
    const error = new Error(
      'Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed for certifications.'
    );
    error.status = 400;
    cb(error, false);
  }
}

/**
 * Filter for images (Profile, Project): JPG, JPEG, PNG, WEBP
 */
function imageFileFilter(req, file, cb) {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  const isMimeValid = allowedMimes.includes(file.mimetype);
  const isExtValid = allowedExts.includes(ext);

  if (isMimeValid && isExtValid) {
    cb(null, true);
  } else {
    const error = new Error(
      'Invalid image type. Only JPG, JPEG, PNG, and WEBP files are allowed.'
    );
    error.status = 400;
    cb(error, false);
  }
}

// Multer upload instances using in-memory buffer storage for direct Cloudinary streaming
const uploadResume = multer({
  storage,
  fileFilter: resumeFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const uploadCertification = multer({
  storage,
  fileFilter: certificationFileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

const uploadProfileImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const uploadProjectImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports = {
  uploadResume,
  uploadCertification,
  uploadProfileImage,
  uploadProjectImage,
};

