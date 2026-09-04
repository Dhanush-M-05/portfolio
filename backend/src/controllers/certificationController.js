const { prisma } = require('../config/database');
const fileService = require('../services/fileService');
const {
  successResponse,
  errorResponse,
  paginatedResponse,
} = require('../utils/apiResponse');

function formatCertification(c) {
  if (!c) return c;
  return {
    ...c,
    name: c.title,
  };
}

/**
 * Get all certifications
 * GET /api/certifications
 */
async function getCertifications(req, res) {
  const { page, limit, all } = req.query;

  const where = all === 'true' ? {} : { isActive: true };

  if (page || limit) {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [total, certifications] = await Promise.all([
      prisma.certification.count({ where }),
      prisma.certification.findMany({
        where,
        orderBy: { order: 'asc' },
        skip,
        take: limitNum,
      }),
    ]);

    return paginatedResponse(res, certifications.map(formatCertification), total, pageNum, limitNum, 'Certifications retrieved successfully');
  }

  const certifications = await prisma.certification.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  return successResponse(res, certifications.map(formatCertification), 'Certifications retrieved successfully');
}

/**
 * Get single certification
 * GET /api/certifications/:id
 */
async function getCertificationById(req, res) {
  const { id } = req.params;

  const cert = await prisma.certification.findUnique({
    where: { id: Number(id) },
  });

  if (!cert) {
    return errorResponse(res, 'Certification not found', 404);
  }

  return successResponse(res, formatCertification(cert), 'Certification retrieved successfully');
}

/**
 * Create certification (MANDATORY FILE UPLOAD)
 * POST /api/certifications
 */
async function createCertification(req, res) {
  const uploadedFile = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

  if (!uploadedFile) {
    return res.status(400).json({
      success: false,
      message: 'Certificate file is required',
    });
  }

  const {
    title,
    issuer,
    issueDate,
    credentialId,
    credentialUrl,
    order,
    isActive,
  } = req.body;

  const certTitle = title || req.body.name;

  if (!certTitle || !issuer) {
    return errorResponse(res, 'Title (or name) and issuer are required', 400);
  }

  // 1. Upload certificate to Cloudinary (folder: portfolio/certificates)
  const uploadResult = await fileService.uploadCertificate(uploadedFile);

  // 2. Save certificate metadata and Cloudinary URL to MySQL
  let newCertification;
  try {
    newCertification = await prisma.certification.create({
      data: {
        title: certTitle,
        issuer,
        issueDate: issueDate || null,
        credentialId: credentialId || null,
        credentialUrl: credentialUrl || null,
        fileUrl: uploadResult.url,
        cloudinaryPublicId: uploadResult.publicId,
        fileName: uploadResult.fileName,
        fileType: uploadResult.fileType,
        fileSize: uploadResult.fileSize,
        order: order !== undefined ? Number(order) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });
  } catch (dbError) {
    // If DB fails after upload, rollback the newly uploaded Cloudinary file
    await fileService.deleteFile(uploadResult.publicId).catch((err) => {
      console.warn('[Certification] Rollback failed:', err.message);
    });
    throw dbError;
  }

  return successResponse(res, formatCertification(newCertification), 'Certification created successfully with certificate file', 201);
}

/**
 * Update certification
 * PUT /api/certifications/:id
 */
async function updateCertification(req, res) {
  const { id } = req.params;
  const {
    title,
    issuer,
    issueDate,
    credentialId,
    credentialUrl,
    order,
    isActive,
    fileUrl: directFileUrl,
  } = req.body;

  const existing = await prisma.certification.findUnique({
    where: { id: Number(id) },
  });

  if (!existing) {
    return errorResponse(res, 'Certification not found', 404);
  }

  const uploadedFile = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

  // If user tries to unset fileUrl to empty/null without a new file, reject
  if (!uploadedFile && (directFileUrl === '' || directFileUrl === null)) {
    return res.status(400).json({
      success: false,
      message: 'Certificate file is required',
    });
  }

  const updateData = {};
  if (title !== undefined || req.body.name !== undefined) {
    updateData.title = title || req.body.name;
  }
  if (issuer !== undefined) updateData.issuer = issuer;
  if (issueDate !== undefined) updateData.issueDate = issueDate;
  if (credentialId !== undefined) updateData.credentialId = credentialId;
  if (credentialUrl !== undefined) updateData.credentialUrl = credentialUrl;
  if (order !== undefined) updateData.order = Number(order);
  if (isActive !== undefined) updateData.isActive = Boolean(isActive);

  let newUploadResult = null;

  if (uploadedFile) {
    // 1. Upload replacement certificate to Cloudinary
    newUploadResult = await fileService.uploadCertificate(uploadedFile);

    updateData.fileName = newUploadResult.fileName;
    updateData.fileUrl = newUploadResult.url;
    updateData.cloudinaryPublicId = newUploadResult.publicId;
    updateData.fileType = newUploadResult.fileType;
    updateData.fileSize = newUploadResult.fileSize;
  } else if (directFileUrl && directFileUrl.trim() !== '') {
    updateData.fileUrl = directFileUrl;
    if (req.body.cloudinaryPublicId) {
      updateData.cloudinaryPublicId = req.body.cloudinaryPublicId;
    }
  }

  let updatedCertification;
  try {
    updatedCertification = await prisma.certification.update({
      where: { id: Number(id) },
      data: updateData,
    });
  } catch (dbError) {
    // If DB fails after new upload, rollback new Cloudinary asset
    if (newUploadResult?.publicId) {
      await fileService.deleteFile(newUploadResult.publicId).catch((err) => {
        console.warn('[Certification] Rollback failed:', err.message);
      });
    }
    throw dbError;
  }

  // Delete old Cloudinary file only after new upload and DB update succeed
  if (newUploadResult && existing.cloudinaryPublicId && existing.cloudinaryPublicId !== newUploadResult.publicId) {
    fileService.deleteFile(existing.cloudinaryPublicId).catch((err) => {
      console.warn('[Certification] Failed to delete previous Cloudinary file:', err.message);
    });
  }

  return successResponse(res, formatCertification(updatedCertification), 'Certification updated successfully');
}

/**
 * Stream/view certificate file inline in browser
 * GET /api/certifications/:id/view
 */
async function viewCertificationFile(req, res) {
  const { id } = req.params;
  const cert = await prisma.certification.findUnique({
    where: { id: Number(id) },
  });

  if (!cert || !cert.fileUrl) {
    return errorResponse(res, 'Certificate file not found', 404);
  }

  try {
    const { stream, size, mimeType } = await fileService.getFileStream(cert.fileUrl);
    res.setHeader('Content-Type', cert.fileType || mimeType || 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${cert.fileName || 'certificate.pdf'}"`);
    if (size) {
      res.setHeader('Content-Length', size);
    }
    return stream.pipe(res);
  } catch (error) {
    // If streaming fails but file is remote URL, fallback to redirect
    if (fileService.isRemoteUrl(cert.fileUrl)) {
      return res.redirect(cert.fileUrl);
    }
    console.error('[CertView] Streaming failed:', error.message);
    return errorResponse(res, 'Failed to stream certificate document', 500);
  }
}

/**
 * Delete certification
 * DELETE /api/certifications/:id
 */
async function deleteCertification(req, res) {
  const { id } = req.params;

  const cert = await prisma.certification.findUnique({
    where: { id: Number(id) },
  });

  if (!cert) {
    return errorResponse(res, 'Certification not found', 404);
  }

  // Delete from Cloudinary
  if (cert.cloudinaryPublicId) {
    await fileService.deleteFile(cert.cloudinaryPublicId).catch((err) => {
      console.warn('[Certification] Failed to delete Cloudinary file:', err.message);
    });
  }

  await prisma.certification.delete({
    where: { id: Number(id) },
  });

  return successResponse(res, null, 'Certification deleted successfully');
}

module.exports = {
  getCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification,
  viewCertificationFile,
};
