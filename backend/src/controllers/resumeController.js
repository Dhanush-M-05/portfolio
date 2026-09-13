import prisma from '../config/database.js';
import resumeService from '../services/resumeService.js';
import cloudinaryService from '../services/cloudinaryService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Get Resume Info
 * GET /api/resume
 */
export const getResume = async (req, res) => {
  let resume = await prisma.resume.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!resume) {
    resume = await prisma.resume.create({
      data: {
        title: 'ATS-Compliant Software Developer Resume',
        fileName: 'Dhanush-M-Resume.pdf',
        fileUrl: '/resume.pdf',
        publicId: 'local-default-resume',
        mimeType: 'application/pdf',
        fileSize: 102400,
        isActive: true,
      },
    });
  }

  return successResponse(res, 200, 'Resume information retrieved', resume);
};

/**
 * Upload New Resume
 * POST /api/resume
 */
export const uploadResume = async (req, res) => {
  if (!req.file) {
    return errorResponse(res, 400, 'PDF resume file is required');
  }

  const title = req.body.title || 'ATS-Compliant Software Developer Resume';

  try {
    const newResume = await resumeService.processResumeUpload(req.file, title);
    return successResponse(res, 201, 'Resume uploaded and activated successfully', newResume);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

/**
 * Update Resume Metadata
 * PUT /api/resume/:id
 */
export const updateResume = async (req, res) => {
  const { id } = req.params;
  const { title, isActive } = req.body;

  // If a new file is uploaded alongside PUT
  if (req.file) {
    try {
      const newResume = await resumeService.processResumeUpload(req.file, title);
      return successResponse(res, 200, 'Resume updated successfully with new file', newResume);
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  }

  const existing = await prisma.resume.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(res, 404, 'Resume not found');
  }

  if (isActive === true) {
    await prisma.resume.updateMany({
      where: { id: { not: id } },
      data: { isActive: false },
    });
  }

  const updated = await prisma.resume.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
    },
  });

  return successResponse(res, 200, 'Resume updated successfully', updated);
};

/**
 * Delete Resume
 * DELETE /api/resume/:id
 */
export const deleteResume = async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.resume.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(res, 404, 'Resume not found');
  }

  if (existing.publicId && !existing.publicId.startsWith('local-')) {
    cloudinaryService.deleteFile(existing.publicId, 'raw').catch(() => {});
  }

  await prisma.resume.delete({ where: { id } });

  return successResponse(res, 200, 'Resume deleted successfully');
};

/**
 * Download Resume (Strict Attachment)
 * GET /api/resume/download
 */
export const downloadResume = async (req, res) => {
  const resume = await prisma.resume.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  const fileUrl = resume?.fileUrl || '/resume.pdf';
  const filename = resume?.fileName || 'Dhanush-M-Resume.pdf';

  return resumeService.pipePdfStream(fileUrl, res, true, filename);
};

/**
 * View Resume in Browser (Inline Disposition)
 * GET /api/resume/view
 */
export const viewResume = async (req, res) => {
  const resume = await prisma.resume.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  const fileUrl = resume?.fileUrl || '/resume.pdf';
  const filename = resume?.fileName || 'Dhanush-M-Resume.pdf';

  return resumeService.pipePdfStream(fileUrl, res, false, filename);
};

export default {
  getResume,
  uploadResume,
  updateResume,
  deleteResume,
  downloadResume,
  viewResume,
};
