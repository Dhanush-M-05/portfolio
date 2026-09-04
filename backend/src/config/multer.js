const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Base upload path
const UPLOAD_ROOT = path.resolve(__dirname, '../../uploads');

// Ensure upload directories exist
const uploadDirs = ['resumes', 'certifications', 'profiles', 'projects'];
uploadDirs.forEach((dir) => {
  const fullPath = path.join(UPLOAD_ROOT, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

/**
 * Configure disk storage for a specific folder
 */
function createStorage(subfolder) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const destinationPath = path.join(UPLOAD_ROOT, subfolder);
      cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname).toLowerCase();
      const sanitizedBase = path
        .basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9-_]/g, '_')
        .slice(0, 40);
      cb(null, `${sanitizedBase}-${uniqueSuffix}${ext}`);
    },
  });
}

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

  if ((allowedMimes.includes(file.mimetype) || file.mimetype.includes('pdf')) && ext === '.pdf') {
    cb(null, true);
  } else if (ext === '.pdf') {
    cb(null, true);
  } else {
    const error = new Error('Invalid file type. Only PDF files are allowed for resumes.');
    error.status = 400;
    cb(error, false);
  }
}

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

  if ((allowedMimes.includes(file.mimetype) || file.mimetype.includes('pdf') || file.mimetype.includes('image')) && allowedExts.includes(ext)) {
    cb(null, true);
  } else if (allowedExts.includes(ext)) {
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
 * Filter for images (Profile, Project thumbnail/images): JPG, JPEG, PNG, WEBP
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

  if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    const error = new Error(
      'Invalid image type. Only JPG, JPEG, PNG, and WEBP files are allowed.'
    );
    error.status = 400;
    cb(error, false);
  }
}

// Multer upload instances
const uploadResume = multer({
  storage: createStorage('resumes'),
  fileFilter: resumeFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const uploadCertification = multer({
  storage: createStorage('certifications'),
  fileFilter: certificationFileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});

const uploadProfileImage = multer({
  storage: createStorage('profiles'),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const uploadProjectImage = multer({
  storage: createStorage('projects'),
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports = {
  UPLOAD_ROOT,
  uploadResume,
  uploadCertification,
  uploadProfileImage,
  uploadProjectImage,
};
