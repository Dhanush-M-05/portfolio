import multer from 'multer';

// Use in-memory storage so buffers are forwarded directly to Cloudinary without writing to disk
const storage = multer.memoryStorage();

// Max file size: 15MB
const limits = {
  fileSize: 15 * 1024 * 1024,
};

// Filter for image uploads
export const imageFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WEBP, GIF, SVG) are allowed!'), false);
  }
};

// Filter for certificate uploads (PDF or Images)
export const certificateFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Certificate must be a PDF or Image (JPEG, PNG, WEBP)!'), false);
  }
};

// Filter for resume uploads (strictly PDF)
export const resumeFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Resume must be a PDF file only!'), false);
  }
};

export const uploadSingleImage = multer({ storage, limits, fileFilter: imageFilter });
export const uploadCertificate = multer({ storage, limits, fileFilter: certificateFilter });
export const uploadResume = multer({ storage, limits, fileFilter: resumeFilter });
export const uploadAny = multer({ storage, limits });

export default {
  uploadSingleImage,
  uploadCertificate,
  uploadResume,
  uploadAny,
};
