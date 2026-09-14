import prisma from '../config/database.js';
import cloudinaryService from '../services/cloudinaryService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Fields allowed in Profile model.
 * Unknown fields such as resumePath/image/id/timestamps
 * are automatically ignored.
 */
const PROFILE_FIELDS = [
  'name',
  'role',
  'title',
  'degree',
  'course',
  'department',
  'college',
  'email',
  'phone',
  'domain',
  'location',
  'tagline',
  'heroDescription',
  'bio',
  'shortBio',
  'aboutHeading',
  'aboutSubheading',
  'avatarUrl',
  'avatarPublicId',
  'resumeViewRoute',
  'stats',
];

/**
 * Keep only valid Prisma Profile fields.
 */
const sanitizeProfileData = (body = {}) => {
  const data = {};

  for (const field of PROFILE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      data[field] = body[field];
    }
  }

  return data;
};

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

  const responseData = {
    ...profile,
    image: profile.avatarUrl,
  };

  return successResponse(
    res,
    200,
    'Profile retrieved',
    responseData
  );
};

/**
 * Update Profile
 * PUT /api/profile
 */
export const updateProfile = async (req, res) => {
  try {
    let profile = await prisma.profile.findFirst();

    // Only allow fields that actually exist in Profile Prisma model.
    // This prevents errors such as:
    // Unknown argument `resumePath`
    const updateData = sanitizeProfileData(req.body);

    // Frontend compatibility:
    // If image is sent, use it as avatarUrl.
    if (req.body.image && !updateData.avatarUrl) {
      updateData.avatarUrl = req.body.image;
    }

    let updated;

    if (profile) {
      updated = await prisma.profile.update({
        where: {
          id: profile.id,
        },
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

    return successResponse(
      res,
      200,
      'Profile updated successfully',
      responseData
    );
  } catch (error) {
    console.error('Update Profile Error:', error);

    return errorResponse(
      res,
      500,
      `Failed to update profile: ${error.message}`
    );
  }
};

/**
 * Upload Profile Image
 * POST /api/profile/image
 */
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return errorResponse(res, 400, 'Image file is required');
    }

    let profile = await prisma.profile.findFirst();

    const oldPublicId = profile?.avatarPublicId || null;

    // Upload profile image to Cloudinary.
    const uploadResult = await cloudinaryService.replaceFile(
      req.file.buffer,
      'portfolio/profile',
      oldPublicId,
      {
        resource_type: 'image',
      }
    );

    const newAvatarUrl =
      uploadResult.secure_url || uploadResult.url;

    const newPublicId = uploadResult.public_id;

    let updated;

    if (profile) {
      updated = await prisma.profile.update({
        where: {
          id: profile.id,
        },
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

    return successResponse(
      res,
      200,
      'Profile image uploaded successfully',
      {
        profileImageUrl: newAvatarUrl,
        avatarUrl: newAvatarUrl,
        url: newAvatarUrl,
        public_id: newPublicId,
        profile: {
          ...updated,
          image: newAvatarUrl,
        },
      }
    );
  } catch (error) {
    console.error('Upload Profile Image Error:', error);

    return errorResponse(
      res,
      500,
      `Failed to upload profile image: ${error.message}`
    );
  }
};

/**
 * Delete Profile Image
 * DELETE /api/profile/image
 */
export const deleteProfileImage = async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst();

    if (profile && profile.avatarPublicId) {
      await cloudinaryService.deleteFile(
        profile.avatarPublicId,
        'image'
      );

      await prisma.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          avatarUrl: '/dhanush-profile.jpg',
          avatarPublicId: null,
        },
      });
    }

    return successResponse(
      res,
      200,
      'Profile image reset to default',
      {
        avatarUrl: '/dhanush-profile.jpg',
        image: '/dhanush-profile.jpg',
      }
    );
  } catch (error) {
    console.error('Delete Profile Image Error:', error);

    return errorResponse(
      res,
      500,
      `Failed to delete profile image: ${error.message}`
    );
  }
};

export default {
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
};
