const resumeService = require('../services/resumeService');
const fileService = require('../services/fileService');
const { prisma } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Formats resume object to include legacy/frontend compatibility fields
 */
function formatResume(resume) {
  if (!resume) return null;
  const sizeKb = resume.fileSize ? `${Math.round(resume.fileSize / 1024)} KB` : '184 KB';
  const lastUpdated = resume.uploadedAt
    ? new Date(resume.uploadedAt).toISOString().split('T')[0]
    : '2026-09-02';

  return {
    ...resume,
    filePath: resume.fileUrl,
    fileSize: typeof resume.fileSize === 'number' ? sizeKb : resume.fileSize,
    rawFileSize: resume.fileSize,
    lastUpdated,
  };
}

/**
 * Get active resume metadata (or all resumes if all=true)
 * GET /api/resume
 */
async function getResume(req, res) {
  const { all } = req.query;

  if (all === 'true') {
    const resumes = await prisma.resume.findMany({
      orderBy: { uploadedAt: 'desc' },
    });
    return successResponse(res, resumes.map(formatResume), 'All resumes retrieved successfully');
  }

  const activeResume = await resumeService.getActiveResume();
  if (!activeResume) {
    return errorResponse(res, 'No active resume found', 404);
  }

  return successResponse(res, formatResume(activeResume), 'Active resume retrieved successfully');
}

/**
 * Upload a new resume PDF
 * POST /api/resume
 */
async function uploadResume(req, res) {
  let fileName;
  let fileUrl;
  let cloudinaryPublicId = null;
  let fileType = 'application/pdf';
  let fileSize = 0;

  const uploadedFile = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);
  const previousActive = await resumeService.getActiveResume();

  if (uploadedFile) {
    // 1. Validate and upload PDF to Cloudinary (folder: portfolio/resume)
    const uploadResult = await fileService.uploadResume(uploadedFile);
    fileName = uploadResult.fileName;
    fileUrl = uploadResult.url;
    cloudinaryPublicId = uploadResult.publicId;
    fileType = uploadResult.fileType;
    fileSize = uploadResult.fileSize;
  } else if (req.body.fileUrl) {
    // If uploaded directly or provided via URL
    fileUrl = req.body.fileUrl;
    cloudinaryPublicId = req.body.cloudinaryPublicId || null;
    fileName = req.body.fileName || 'Dhanush-M-Resume.pdf';
    fileSize = req.body.fileSize ? Number(req.body.fileSize) : 0;
    fileType = req.body.fileType || 'application/pdf';
  } else {
    return errorResponse(res, 'A PDF resume file or fileUrl is required', 400);
  }

  const makeActive = req.body.isActive !== undefined ? Boolean(req.body.isActive) : true;

  // 2. Save new Cloudinary URL/public ID and deactivate previous resume
  let newResume;
  try {
    newResume = await resumeService.createResumeWithTransaction({
      fileName,
      fileUrl,
      cloudinaryPublicId,
      fileType,
      fileSize,
      makeActive,
    });
  } catch (dbError) {
    // Rollback new Cloudinary file if database update fails
    if (cloudinaryPublicId && uploadedFile) {
      await fileService.deleteFile(cloudinaryPublicId, { resource_type: 'raw' }).catch((err) => {
        console.warn('[Resume] Failed to rollback orphan Cloudinary file:', err.message);
      });
    }
    throw dbError;
  }

  // 3. Delete old Cloudinary file only after new upload succeeds and DB is committed
  if (
    makeActive &&
    previousActive?.cloudinaryPublicId &&
    previousActive.cloudinaryPublicId !== cloudinaryPublicId
  ) {
    fileService.deleteFile(previousActive.cloudinaryPublicId, { resource_type: 'raw' }).catch((err) => {
      console.warn('[Resume] Failed to delete previous Cloudinary asset:', err.message);
    });
  }

  return successResponse(res, formatResume(newResume), 'Resume uploaded and activated successfully via Cloudinary', 201);
}

/**
 * Update resume metadata
 * PUT /api/resume/:id
 */
async function updateResume(req, res) {
  const { id } = req.params;
  const { fileName, isActive, fileUrl, cloudinaryPublicId } = req.body;

  const updateData = {};
  if (fileName !== undefined) updateData.fileName = fileName;
  if (isActive !== undefined) updateData.isActive = Boolean(isActive);
  if (fileUrl !== undefined) updateData.fileUrl = fileUrl;
  if (cloudinaryPublicId !== undefined) updateData.cloudinaryPublicId = cloudinaryPublicId;

  const updatedResume = await resumeService.updateResumeWithTransaction(id, updateData);

  return successResponse(res, updatedResume, 'Resume updated successfully');
}

/**
 * Delete resume
 * DELETE /api/resume/:id
 */
async function deleteResume(req, res) {
  const { id } = req.params;

  await resumeService.deleteResume(id);

  return successResponse(res, null, 'Resume deleted successfully');
}

/**
 * Download active resume as an attachment
 * GET /api/resume/download
 */
async function downloadResume(req, res) {
  const activeResume = await resumeService.getActiveResume();

  if (!activeResume) {
    return errorResponse(res, 'No resume available for download', 404);
  }

  try {
    const { stream, size } = await fileService.getFileStream(activeResume.fileUrl);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Dhanush-M-Resume.pdf"');
    if (size) {
      res.setHeader('Content-Length', size);
    }

    stream.pipe(res);
  } catch (error) {
    console.error('[ResumeDownload] Streaming failed:', error.message);
    return errorResponse(res, 'Failed to download resume file', 500);
  }
}

/**
 * View or preview active resume inline in browser
 * GET /api/resume/view or GET /api/resume/preview
 */
async function viewResume(req, res) {
  const activeResume = await resumeService.getActiveResume();

  if (!activeResume) {
    return errorResponse(res, 'No resume available for preview', 404);
  }

  try {
    const { stream, size } = await fileService.getFileStream(activeResume.fileUrl);

    res.setHeader('Content-Type', activeResume.fileType || 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="Dhanush-M-Resume.pdf"');
    if (size) {
      res.setHeader('Content-Length', size);
    }

    stream.pipe(res);
  } catch (error) {
    console.error('[ResumeView] Streaming failed:', error.message);
    return errorResponse(res, 'Failed to stream resume file for preview', 500);
  }
}

module.exports = {
  getResume,
  uploadResume,
  updateResume,
  deleteResume,
  downloadResume,
  viewResume,
};

