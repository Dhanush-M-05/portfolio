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

  // Delete previous image if exists locally
  if (profile.profileImageFileName) {
    const oldPath = fileService.getLocalFilePath('profiles', profile.profileImageFileName);
    await fileService.deleteLocalFile(oldPath);
  }

  const fileUrl = fileService.getFileUrl(req, 'profiles', req.file.filename);

  const updated = await prisma.profile.update({
    where: { id: profile.id },
    data: {
      profileImageUrl: fileUrl,
      profileImageFileName: req.file.filename,
    },
  });

  return successResponse(
    res,
    {
      profileImageUrl: updated.profileImageUrl,
      profileImageFileName: updated.profileImageFileName,
    },
    'Profile image uploaded successfully'
  );
}

/**
 * Delete Profile Image
 * DELETE /api/profile/image
 */
async function deleteProfileImage(req, res) {
  const profile = await getOrCreateProfile();

  if (profile.profileImageFileName) {
    const oldPath = fileService.getLocalFilePath('profiles', profile.profileImageFileName);
    await fileService.deleteLocalFile(oldPath);
  }

  const updated = await prisma.profile.update({
    where: { id: profile.id },
    data: {
      profileImageUrl: null,
      profileImageFileName: null,
    },
  });

  return successResponse(res, updated, 'Profile image deleted successfully');
}

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
};
