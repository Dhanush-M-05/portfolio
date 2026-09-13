import prisma from '../config/database.js';
import cloudinaryService from '../services/cloudinaryService.js';
import resumeService from '../services/resumeService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Get Certifications
 * GET /api/certifications
 */
export const getCertifications = async (req, res) => {
  const showAll = req.query.all === 'true';
  const where = showAll ? {} : { isActive: true };

  const certifications = await prisma.certification.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  // Map fileUrl to certificateUrl for complete frontend compatibility
  const mapped = certifications.map((c) => ({
    ...c,
    fileUrl: c.certificateUrl,
    name: c.title,
  }));

  return successResponse(res, 200, 'Certifications retrieved', mapped);
};

/**
 * Get Certification by ID
 * GET /api/certifications/:id
 */
export const getCertificationById = async (req, res) => {
  const { id } = req.params;
  const cert = await prisma.certification.findUnique({
    where: { id },
  });

  if (!cert) {
    return errorResponse(res, 404, 'Certification not found');
  }

  return successResponse(res, 200, 'Certification retrieved', {
    ...cert,
    fileUrl: cert.certificateUrl,
    name: cert.title,
  });
};

/**
 * Create Certification
 * POST /api/certifications
 */
export const createCertification = async (req, res) => {
  const data = req.body;
  const title = (data.title || data.name || '').trim();

  if (!title || !data.issuer) {
    return errorResponse(res, 400, 'Title and issuer are required');
  }

  let skills = data.skillsCovered;
  if (typeof skills === 'string') {
    skills = skills.split(',').map((s) => s.trim()).filter(Boolean);
  }

  let certificateUrl = data.certificateUrl || '';
  let certificatePublicId = data.certificatePublicId || '';
  let certificateFilename = '';
  let certificateMimeType = '';
  let certificateSize = 0;

  if (req.file && req.file.buffer) {
    const isPdf = req.file.mimetype === 'application/pdf';
    const uploadResult = await cloudinaryService.uploadBuffer(
      req.file.buffer,
      'portfolio/certificates',
      { resource_type: isPdf ? 'raw' : 'image' }
    );
    certificateUrl = uploadResult.secure_url || uploadResult.url;
    certificatePublicId = uploadResult.public_id;
    certificateFilename = req.file.originalname;
    certificateMimeType = req.file.mimetype;
    certificateSize = req.file.size;
  }

  const newCert = await prisma.certification.create({
    data: {
      title,
      issuer: data.issuer.trim(),
      issueDate: data.issueDate || '',
      credentialId: data.credentialId || '',
      credentialUrl: data.credentialUrl || '',
      certificateUrl,
      certificatePublicId,
      certificateFilename,
      certificateMimeType,
      certificateSize,
      skillsCovered: skills || [],
      description: data.description || '',
      order: data.order !== undefined ? Number(data.order) : 0,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    },
  });

  return successResponse(res, 201, 'Certification created successfully', {
    ...newCert,
    fileUrl: newCert.certificateUrl,
    name: newCert.title,
  });
};

/**
 * Update Certification
 * PUT /api/certifications/:id
 */
export const updateCertification = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const existing = await prisma.certification.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(res, 404, 'Certification not found');
  }

  let skills = data.skillsCovered;
  if (typeof skills === 'string') {
    skills = skills.split(',').map((s) => s.trim()).filter(Boolean);
  }

  let certificateUrl = data.certificateUrl !== undefined ? data.certificateUrl : existing.certificateUrl;
  let certificatePublicId = data.certificatePublicId !== undefined ? data.certificatePublicId : existing.certificatePublicId;
  let certificateFilename = existing.certificateFilename;
  let certificateMimeType = existing.certificateMimeType;
  let certificateSize = existing.certificateSize;

  if (req.file && req.file.buffer) {
    const isPdf = req.file.mimetype === 'application/pdf';
    const uploadResult = await cloudinaryService.replaceFile(
      req.file.buffer,
      'portfolio/certificates',
      existing.certificatePublicId,
      { resource_type: isPdf ? 'raw' : 'image' }
    );
    certificateUrl = uploadResult.secure_url || uploadResult.url;
    certificatePublicId = uploadResult.public_id;
    certificateFilename = req.file.originalname;
    certificateMimeType = req.file.mimetype;
    certificateSize = req.file.size;
  }

  const updated = await prisma.certification.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.name !== undefined && !data.title && { title: data.name }),
      ...(data.issuer !== undefined && { issuer: data.issuer }),
      ...(data.issueDate !== undefined && { issueDate: data.issueDate }),
      ...(data.credentialId !== undefined && { credentialId: data.credentialId }),
      ...(data.credentialUrl !== undefined && { credentialUrl: data.credentialUrl }),
      ...(certificateUrl !== undefined && { certificateUrl }),
      ...(certificatePublicId !== undefined && { certificatePublicId }),
      ...(certificateFilename !== undefined && { certificateFilename }),
      ...(certificateMimeType !== undefined && { certificateMimeType }),
      ...(certificateSize !== undefined && { certificateSize }),
      ...(skills !== undefined && { skillsCovered: skills }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.order !== undefined && { order: Number(data.order) }),
      ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
    },
  });

  return successResponse(res, 200, 'Certification updated successfully', {
    ...updated,
    fileUrl: updated.certificateUrl,
    name: updated.title,
  });
};

/**
 * Delete Certification
 * DELETE /api/certifications/:id
 */
export const deleteCertification = async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.certification.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(res, 404, 'Certification not found');
  }

  if (existing.certificatePublicId) {
    const isPdf = existing.certificateMimeType === 'application/pdf';
    cloudinaryService.deleteFile(existing.certificatePublicId, isPdf ? 'raw' : 'image').catch(() => {});
  }

  await prisma.certification.delete({ where: { id } });

  return successResponse(res, 200, 'Certification deleted successfully');
};

/**
 * View Certificate File in Browser
 * GET /api/certifications/:id/view
 */
export const viewCertificate = async (req, res) => {
  const { id } = req.params;

  const cert = await prisma.certification.findUnique({ where: { id } });
  if (!cert || !cert.certificateUrl) {
    return errorResponse(res, 404, 'Certificate file not found');
  }

  const filename = cert.certificateFilename || `${cert.title.replace(/\s+/g, '_')}_Certificate.pdf`;
  const isPdf = cert.certificateMimeType === 'application/pdf' || cert.certificateUrl.toLowerCase().endsWith('.pdf');

  if (isPdf) {
    return resumeService.pipePdfStream(cert.certificateUrl, res, false, filename);
  }

  // Redirect to Cloudinary image URL for preview
  return res.redirect(cert.certificateUrl);
};

export default {
  getCertifications,
  getCertificationById,
  createCertification,
  updateCertification,
  deleteCertification,
  viewCertificate,
};
