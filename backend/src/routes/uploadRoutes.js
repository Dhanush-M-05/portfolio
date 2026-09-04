const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const fileService = require('../services/fileService');
const resumeService = require('../services/resumeService');
const { errorResponse } = require('../utils/apiResponse');

// In-memory storage for direct Cloudinary streaming
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
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
    const isDoc = ext === '.pdf' || ext === '.doc' || ext === '.docx';

    try {
      let uploadResult;
      if (isDoc) {
        uploadResult = await fileService.uploadResume(uploadedFile);
        // Register in resume table if a document was uploaded
        try {
          await resumeService.createResumeWithTransaction({
            fileName: uploadResult.fileName,
            fileUrl: uploadResult.url,
            cloudinaryPublicId: uploadResult.publicId,
            fileType: uploadResult.fileType || 'application/pdf',
            fileSize: uploadResult.fileSize,
            makeActive: true,
          });
        } catch (dbErr) {
          console.warn('[UploadRoutes] Could not update active resume table:', dbErr.message);
        }
      } else {
        uploadResult = await fileService.uploadImage(uploadedFile, {
          folder: 'portfolio/profile',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'File uploaded successfully to Cloudinary',
        fileUrl: uploadResult.url,
        fileName: uploadResult.fileName,
        cloudinaryPublicId: uploadResult.publicId,
        data: {
          fileUrl: uploadResult.url,
          fileName: uploadResult.fileName,
          cloudinaryPublicId: uploadResult.publicId,
          fileSize: uploadResult.fileSize,
          mimetype: uploadResult.fileType,
        },
      });
    } catch (uploadErr) {
      console.error('[UploadRoutes] Cloudinary upload failed:', uploadErr.message);
      return errorResponse(res, `Failed to upload file to Cloudinary: ${uploadErr.message}`, 500);
    }
  });
});

module.exports = router;

