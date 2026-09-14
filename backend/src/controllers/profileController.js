import prisma from '../config/database.js';
import supabaseStorageService from '../services/supabaseStorageService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * Allowed Profile fields
 * Only these fields are sent to Prisma.
 * This prevents unknown fields such as resumePath/resumeViewRoute
 * from causing Prisma errors.
 */
const PROFILE_FIELDS = [
  'name',
  'role',
  'title',
  'degree',
  'department',
  'college',
  'course',
  'domain',
  'location',
  'email',
  'phone',
  'tagline',
  'bio',
  'shortBio',
  'heroDescription',
  'aboutHeading',
  'aboutSubheading',
  'avatarUrl',
  'avatarPublicId',
  'stats',
];

/**
 * Pick only valid Prisma Profile fields
 */
const pickProfileFields = (body = {}) => {
  const data = {};

  for (const field of PROFILE_FIELDS) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }

  // Frontend compatibility:
  // image -> avatarUrl
  if (body.image !== undefined && body.avatarUrl === undefined) {
    data.avatarUrl = body.image;
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

    // IMPORTANT:
    // Only fields that actually exist in Prisma Profile model
    // will be sent to Prisma.
    const updateData = pickProfileFields(req.body);

    if (profile) {
      const updated = await prisma.profile.update({
        where: {
          id: profile.id,
        },
        data: updateData,
      });

      return successResponse(
        res,
        200,
        'Profile updated successfully',
        {
          ...updated,
          image: updated.avatarUrl,
        }
      );
    }

    const newProfile = await prisma.profile.create({
      data: {
        name: updateData.name || 'Dhanush M',
        ...updateData,
      },
    });

    return successResponse(
      res,
      201,
      'Profile created successfully',
      {
        ...newProfile,
        image: newProfile.avatarUrl,
      }
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
      return errorResponse(
        res,
        400,
        'Image file is required'
      );
    }

    let profile = await prisma.profile.findFirst();

    const oldFilePath = profile?.avatarPublicId || null;

    // Upload to Supabase Storage
    const uploadResult =
      await supabaseStorageService.replaceFile(
        oldFilePath,
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        'profile'
      );

    const newAvatarUrl = uploadResult.url;
    const newFilePath = uploadResult.path;

    let updated;

    if (profile) {
      updated = await prisma.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          avatarUrl: newAvatarUrl,
          avatarPublicId: newFilePath,
        },
      });
    } else {
      updated = await prisma.profile.create({
        data: {
          name: 'Dhanush M',
          avatarUrl: newAvatarUrl,
          avatarPublicId: newFilePath,
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
        path: newFilePath,
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

    if (profile?.avatarPublicId) {
      await supabaseStorageService.deleteFile(
        profile.avatarPublicId
      );

      await prisma.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          avatarUrl: null,
          avatarPublicId: null,
        },
      });
    }

    return successResponse(
      res,
      200,
      'Profile image deleted successfully',
      {
        avatarUrl: null,
        image: null,
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
