import prisma from '../config/database.js';
import cloudinaryService from './cloudinaryService.js';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

/**
 * Upload new resume PDF, update DB, mark previous inactive, and cleanup old asset
 */
export const processResumeUpload = async (file, title = 'ATS-Compliant Software Developer Resume') => {
  if (!file || !file.buffer) {
    throw new Error('Valid PDF resume file is required');
  }

  if (file.mimetype !== 'application/pdf') {
    throw new Error('Resume must be a PDF file only');
  }

  // 1. Get currently active resume to delete later
  const currentResume = await prisma.resume.findFirst({
    where: { isActive: true },
  });

  // 2. Upload to Cloudinary folder portfolio/resume/
  const uploadResult = await cloudinaryService.uploadBuffer(file.buffer, 'portfolio/resume', {
    resource_type: 'raw',
  });

  const fileUrl = uploadResult.secure_url || uploadResult.url;
  const publicId = uploadResult.public_id;

  // 3. Mark old resumes inactive
  await prisma.resume.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  });

  // 4. Create new active resume record in MySQL
  const newResume = await prisma.resume.create({
    data: {
      title,
      fileName: file.originalname || 'Dhanush-M-Resume.pdf',
      fileUrl,
      publicId,
      mimeType: 'application/pdf',
      fileSize: file.size,
      isActive: true,
    },
  });

  // 5. Delete old Cloudinary asset only after new upload and DB update succeed
  if (currentResume && currentResume.publicId && !currentResume.publicId.startsWith('local-')) {
    cloudinaryService.deleteFile(currentResume.publicId, 'raw').catch((err) => {
      console.warn('Could not remove previous resume from Cloudinary:', err.message);
    });
  }

  return newResume;
};

/**
 * Stream a PDF file (Cloudinary or local) directly to the client response with attachment headers
 */
export const pipePdfStream = (url, res, isDownload = true, filename = 'Dhanush-M-Resume.pdf') => {
  // If local fallback file
  if (url.startsWith('/')) {
    const candidatePaths = [
      path.resolve(process.cwd(), '../frontend/public' + url),
      path.resolve(process.cwd(), 'public' + url),
      path.resolve(process.cwd(), '../scratch/sample_cv_2026.pdf'),
    ];

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          `${isDownload ? 'attachment' : 'inline'}; filename="${filename}"`
        );
        return fs.createReadStream(p).pipe(res);
      }
    }
  }

  const client = url.startsWith('https') ? https : http;
  client.get(url, (remoteRes) => {
    // Follow redirect if Cloudinary redirects
    if (remoteRes.statusCode === 301 || remoteRes.statusCode === 302) {
      return pipePdfStream(remoteRes.headers.location, res, isDownload, filename);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `${isDownload ? 'attachment' : 'inline'}; filename="${filename}"`
    );

    remoteRes.pipe(res);
  }).on('error', (err) => {
    console.error('Failed to stream resume PDF:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Failed to stream resume document' });
    }
  });
};

export default {
  processResumeUpload,
  pipePdfStream,
};
