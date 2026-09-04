const { prisma } = require('../config/database');
const fileService = require('../services/fileService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Helper to get or create the singleton profile
 */
async function getOrCreateProfile() {
  let profile = await prisma.profile.findFirst();
  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        name: 'Dhanush M',
        title: 'Full Stack Developer',
      },
    });
  }
  return profile;
}

/**
 * Get Profile
 * GET /api/profile
 */
async function getProfile(req, res) {
  const profile = await getOrCreateProfile();
  return successResponse(res, profile, 'Profile retrieved successfully');
}

/**
 * Update Profile
 * PUT /api/profile
 */
async function updateProfile(req, res) {
  const existing = await getOrCreateProfile();

  const allowedFields = [
    'name',
    'title',
    'college',
    'department',
    'course',
    'location',
    'email',
    'phone',
    'profileImageUrl',
    'profileImageFileName',
    'bio',
    'shortBio',
  ];

  const updateData = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  const updatedProfile = await prisma.profile.update({
    where: { id: existing.id },
    data: updateData,
  });

  return successResponse(res, updatedProfile, 'Profile updated successfully');
}

/**
 * Upload Profile Image
 * POST /api/profile/image
 */
async function uploadProfileImage(req, res) {
  if (!req.file) {
    return errorResponse(res, 'No image file uploaded.', 400);
  }

  const profile = await getOrCreateProfile();

  // 1. Upload new image to Cloudinary (folder: portfolio/profile)
  const uploadResult = await fileService.uploadImage(req.file, {
    folder: 'portfolio/profile',
  });

  // 2. Save new Cloudinary URL and public ID to MySQL
  let updated;
  try {
    updated = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        profileImageUrl: uploadResult.url,
        cloudinaryPublicId: uploadResult.publicId,
        profileImageFileName: uploadResult.fileName,
        fileType: uploadResult.fileType,
        fileSize: uploadResult.fileSize,
      },
    });
  } catch (dbError) {
    // If database update fails after Cloudinary upload, delete newly uploaded file to avoid orphans
    await fileService.deleteFile(uploadResult.publicId).catch((err) => {
      console.warn('[Profile] Failed to rollback orphan Cloudinary file:', err.message);
    });
    throw dbError;
  }

  // 3. Delete old Cloudinary file only after new upload and DB update succeed
  if (profile.cloudinaryPublicId && profile.cloudinaryPublicId !== uploadResult.publicId) {
    fileService.deleteFile(profile.cloudinaryPublicId).catch((err) => {
      console.warn('[Profile] Failed to cleanup previous Cloudinary asset:', err.message);
    });
  }

  return successResponse(
    res,
    {
      profileImageUrl: updated.profileImageUrl,
      imageUrl: updated.profileImageUrl,
      cloudinaryPublicId: updated.cloudinaryPublicId,
      profileImageFileName: updated.profileImageFileName,
      fileType: updated.fileType,
      fileSize: updated.fileSize,
    },
    'Profile image uploaded successfully to Cloudinary'
  );
}

/**
 * Delete Profile Image
 * DELETE /api/profile/image
 */
async function deleteProfileImage(req, res) {
  const profile = await getOrCreateProfile();

  // Delete from Cloudinary if exists
  if (profile.cloudinaryPublicId) {
    await fileService.deleteFile(profile.cloudinaryPublicId).catch((err) => {
      console.warn('[Profile] Failed to delete Cloudinary asset:', err.message);
    });
  }

  const updated = await prisma.profile.update({
    where: { id: profile.id },
    data: {
      profileImageUrl: null,
      cloudinaryPublicId: null,
      profileImageFileName: null,
      fileType: null,
      fileSize: null,
    },
  });

  return successResponse(
    res,
    {
      ...updated,
      imageUrl: null,
    },
    'Profile image deleted successfully'
  );
}

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
};
