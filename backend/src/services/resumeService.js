const { prisma } = require('../config/database');
const fileService = require('./fileService');

/**
 * Retrieves the currently active resume
 */
async function getActiveResume() {
  const activeResume = await prisma.resume.findFirst({
    where: { isActive: true },
    orderBy: { uploadedAt: 'desc' },
  });

  if (!activeResume) {
    // Fall back to most recent resume if none marked active
    return prisma.resume.findFirst({
      orderBy: { uploadedAt: 'desc' },
    });
  }

  return activeResume;
}

/**
 * Creates a new resume within a Prisma transaction, deactivating existing active resumes
 */
async function createResumeWithTransaction({ fileName, fileUrl, cloudinaryPublicId, fileType, fileSize, makeActive = true }) {
  return prisma.$transaction(async (tx) => {
    if (makeActive) {
      await tx.resume.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const newResume = await tx.resume.create({
      data: {
        fileName,
        fileUrl,
        cloudinaryPublicId: cloudinaryPublicId || null,
        fileType: fileType || 'application/pdf',
        fileSize: fileSize || 0,
        isActive: makeActive,
      },
    });

    return newResume;
  });
}

/**
 * Updates a resume, ensuring single active resume in a transaction if isActive is set to true
 */
async function updateResumeWithTransaction(id, updateData) {
  return prisma.$transaction(async (tx) => {
    if (updateData.isActive === true) {
      await tx.resume.updateMany({
        where: {
          isActive: true,
          id: { not: Number(id) },
        },
        data: { isActive: false },
      });
    }

    const updated = await tx.resume.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return updated;
  });
}

/**
 * Deletes a resume record and associated file
 */
async function deleteResume(id) {
  const resume = await prisma.resume.findUnique({
    where: { id: Number(id) },
  });

  if (!resume) {
    const error = new Error('Resume not found');
    error.status = 404;
    throw error;
  }

  // Delete from Cloudinary if present
  if (resume.cloudinaryPublicId) {
    await fileService.deleteFile(resume.cloudinaryPublicId, { resource_type: 'raw' }).catch((err) => {
      console.warn('[Resume] Failed to delete Cloudinary file:', err.message);
    });
  }

  // Delete DB record
  await prisma.resume.delete({
    where: { id: Number(id) },
  });

  // If the deleted resume was active, ensure the latest remaining resume is activated
  if (resume.isActive) {
    const latestRemaining = await prisma.resume.findFirst({
      orderBy: { uploadedAt: 'desc' },
    });
    if (latestRemaining) {
      await prisma.resume.update({
        where: { id: latestRemaining.id },
        data: { isActive: true },
      });
    }
  }

  return resume;
}

module.exports = {
  getActiveResume,
  createResumeWithTransaction,
  updateResumeWithTransaction,
  deleteResume,
};
