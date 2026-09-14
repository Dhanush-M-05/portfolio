import prisma from '../config/database.js';
import cloudinaryService from '../services/cloudinaryService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Get Profile
 * GET /api/profile
 */
export const getProfile = async (req, res) => {
  let profile = await prisma.profile.findFirst();

  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        name: 'Dhanush M',
        role: 'Web Developer',
        title: 'Full Stack Developer',
        degree: 'B.E.',
        department: 'Computer Science and Engineering',
        college: 'J.N.N Institute of Engineering',
        location: 'Chennai, India',
        avatarUrl: '/dhanush-profile.jpg',
      },
    });
  }

  // Ensure both avatarUrl and image properties are populated for frontend compatibility
  const responseData = {
    ...profile,
    image: profile.avatarUrl,
  };

  return successResponse(res, 200, 'Profile retrieved', responseData);
};

/**
 * Update Profile
 * PUT /api/profile
 */
export const updateProfile = async (req, res) => {
  let profile = await prisma.profile.findFirst();
  const updateData = { ...req.body };

  // Delete non-field or system properties
  delete updateData.id;
  delete updateData.createdAt;
  delete updateData.updatedAt;

  if (updateData.image && !updateData.avatarUrl) {
    updateData.avatarUrl = updateData.image;
  }
  delete updateData.image;

  let updated;
  if (profile) {
    updated = await prisma.profile.update({
      where: { id: profile.id },
      data: updateData,
    });
  } else {
    updated = await prisma.profile.create({
      data: {
        name: updateData.name || 'Dhanush M',
        ...updateData,
      },
    });
  }

  const responseData = {
    ...updated,
    image: updated.avatarUrl,
  };

  return successResponse(res, 200, 'Profile updated successfully', responseData);
};

/**
 * Upload Profile Image
 * POST /api/profile/image
 */
export const uploadProfileImage = async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return errorResponse(res, 400, 'Image file is required');
  }

  let profile = await prisma.profile.findFirst();
  const oldPublicId = profile?.avatarPublicId;

  // Upload to Cloudinary portfolio/profile/ and clean up previous image
  const uploadResult = await cloudinaryService.replaceFile(
    req.file.buffer,
    'portfolio/profile',
    oldPublicId,
    { resource_type: 'image' }
  );

  const newAvatarUrl = uploadResult.secure_url || uploadResult.url;
  const newPublicId = uploadResult.public_id;

  let updated;
  if (profile) {
    updated = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        avatarUrl: newAvatarUrl,
        avatarPublicId: newPublicId,
      },
    });
  } else {
    updated = await prisma.profile.create({
      data: {
        name: 'Dhanush M',
        avatarUrl: newAvatarUrl,
        avatarPublicId: newPublicId,
      },
    });
  }

  return successResponse(res, 200, 'Profile image uploaded successfully', {
    profileImageUrl: newAvatarUrl,
    avatarUrl: newAvatarUrl,
    url: newAvatarUrl,
    public_id: newPublicId,
    profile: {
      ...updated,
      image: newAvatarUrl,
    },
  });
};

/**
 * Delete Profile Image
 * DELETE /api/profile/image
 */
export const deleteProfileImage = async (req, res) => {
  const profile = await prisma.profile.findFirst();

  if (profile && profile.avatarPublicId) {
    await cloudinaryService.deleteFile(profile.avatarPublicId, 'image');
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        avatarUrl: '/dhanush-profile.jpg',
        avatarPublicId: null,
      },
    });
  }

  return successResponse(res, 200, 'Profile image reset to default', {
    avatarUrl: '/dhanush-profile.jpg',
    image: '/dhanush-profile.jpg',
  });
};

export default {
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
};
