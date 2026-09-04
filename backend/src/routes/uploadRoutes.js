const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const fileService = require('../services/fileService');
const resumeService = require('../services/resumeService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Storage configuration for generic uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const folder = ext === '.pdf' || ext === '.doc' || ext === '.docx' ? 'resumes' : 'profiles';
    cb(null, path.resolve(__dirname, '../../uploads', folder));
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

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.pdf', '.doc', '.docx'];
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      const err = new Error('Only image files (JPG, PNG, WebP, SVG) and resume documents (PDF, DOC, DOCX) are allowed.');
      err.status = 400;
      cb(err, false);
    }
  },
});

/**
 * Generic file upload endpoint
 * POST /api/upload
 */
router.post('/', authenticate, (req, res) => {
  upload.any()(req, res, async (err) => {
    if (err) {
      return errorResponse(res, err.message || 'File upload failed', err.status || 400);
    }

    const uploadedFile = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);
    if (!uploadedFile) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    const ext = path.extname(uploadedFile.originalname).toLowerCase();
    const folder = ext === '.pdf' || ext === '.doc' || ext === '.docx' ? 'resumes' : 'profiles';
    const fileUrl = fileService.getFileUrl(req, folder, uploadedFile.filename);

    // If a PDF or document is uploaded via /api/upload, register it as active resume in the database
    if (ext === '.pdf' || ext === '.doc' || ext === '.docx') {
      try {
        await resumeService.createResumeWithTransaction({
          fileName: uploadedFile.filename,
          fileUrl,
          fileType: uploadedFile.mimetype || 'application/pdf',
          fileSize: uploadedFile.size,
          makeActive: true,
        });
      } catch (dbErr) {
        console.warn('[UploadRoutes] Could not update active resume table:', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl,
      fileName: uploadedFile.filename,
      data: {
        fileUrl,
        fileName: uploadedFile.filename,
        fileSize: uploadedFile.size,
        mimetype: uploadedFile.mimetype,
      },
    });
  });
});

module.exports = router;
