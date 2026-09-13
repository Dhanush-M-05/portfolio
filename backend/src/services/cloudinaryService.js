import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

/**
 * Upload a memory buffer directly to Cloudinary using upload_stream
 */
export const uploadBuffer = (buffer, folder = 'portfolio', options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: options.resource_type || 'auto',
        public_id: options.public_id,
        overwrite: options.overwrite !== undefined ? options.overwrite : true,
        ...options,
      },
      (error, result) => {
        if (error) {
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
        resolve(result);
      }
    );

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
};

/**
 * Upload an image buffer to Cloudinary
 */
export const uploadImage = async (buffer, folder = 'portfolio/general', options = {}) => {
  return uploadBuffer(buffer, folder, {
    resource_type: 'image',
    ...options,
  });
};

/**
 * Upload raw document (e.g. PDF) to Cloudinary
 */
export const uploadRawFile = async (buffer, folder = 'portfolio/documents', options = {}) => {
  return uploadBuffer(buffer, folder, {
    resource_type: 'raw',
    ...options,
  });
};

/**
 * Delete a file from Cloudinary by public ID
 */
export const deleteFile = async (publicId, resourceType = 'image') => {
  if (!publicId) return null;
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error(`Failed to delete Cloudinary file (${publicId}):`, error.message);
    return null;
  }
};

/**
 * Replace an existing file: uploads new file first, then deletes old file
 */
export const replaceFile = async (newBuffer, folder, oldPublicId, options = {}) => {
  const uploadResult = await uploadBuffer(newBuffer, folder, options);
  if (oldPublicId) {
    // Delete previous asset asynchronously without blocking the response
    deleteFile(oldPublicId, options.resource_type || 'image').catch((err) => {
      console.warn(`Failed to clean up old Cloudinary asset (${oldPublicId}):`, err.message);
    });
  }
  return uploadResult;
};

export default {
  uploadBuffer,
  uploadImage,
  uploadRawFile,
  deleteFile,
  replaceFile,
};
