const path = require('path');
const http = require('http');
const https = require('https');
const stream = require('stream');
const cloudinary = require('../config/cloudinary');

/**
 * Checks if Cloudinary credentials are configured
 */
function isCloudinaryConfigured() {
  const { cloud_name, api_key, api_secret } = cloudinary.config();
  return Boolean(
    cloud_name &&
    api_key &&
    api_secret &&
    cloud_name !== 'your_cloud_name' &&
    api_key !== 'your_api_key' &&
    api_secret !== 'your_api_secret'
  );
}

/**
 * Uploads a buffer or stream to Cloudinary using upload_stream
 * @param {Buffer|stream.Readable} fileBufferOrStream
 * @param {Object} options Cloudinary upload options
 * @returns {Promise<Object>} Cloudinary upload result
 */
async function uploadToCloudinary(fileBufferOrStream, options = {}) {
  // If Cloudinary credentials are not configured (e.g. during local tests), return mock response
  if (!isCloudinaryConfigured()) {
    const folder = options.folder || 'portfolio';
    const originalName = options.originalName || 'file.dat';
    const ext = path.extname(originalName).toLowerCase();
    const sanitizedBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 30);
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    const publicId = `${folder}/${sanitizedBase}_${uniqueSuffix}`;
    const resourceType = options.resource_type || (ext === '.pdf' ? 'raw' : 'image');
    const cloudName = cloudinary.config().cloud_name || 'demo';
    const mockUrl = `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/v${Date.now()}/${publicId}${ext}`;

    return {
      secure_url: mockUrl,
      public_id: publicId,
      bytes: fileBufferOrStream ? (fileBufferOrStream.length || 1024) : 1024,
      format: ext.replace('.', ''),
      resource_type: resourceType,
    };
  }

  const normalized = extractFileBuffer(fileBufferOrStream);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        console.error('[Cloudinary] Upload failed:', error);
        return reject(error);
      }
      resolve(result);
    });

    if (Buffer.isBuffer(normalized)) {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(normalized);
      bufferStream.pipe(uploadStream);
    } else if (normalized && typeof normalized.pipe === 'function') {
      normalized.pipe(uploadStream);
    } else {
      reject(new Error('Invalid file payload: Expected Buffer or Readable stream.'));
    }
  });
}

/**
 * Normalizes input file object or buffer to a Buffer or Stream
 */
function extractFileBuffer(file) {
  if (Buffer.isBuffer(file)) return file;
  if (file && Buffer.isBuffer(file.buffer)) return file.buffer;
  if (file && file.buffer instanceof ArrayBuffer) return Buffer.from(file.buffer);
  if (file instanceof ArrayBuffer) return Buffer.from(file);
  return file;
}

/**
 * Upload an image (Profile image, Project image) to Cloudinary
 * Target folders: portfolio/profile, portfolio/projects
 * @param {Object|Buffer} file - Express multer file object or raw Buffer
 * @param {Object} options
 * @returns {Promise<{ url: string, publicId: string, fileName: string, fileType: string, fileSize: number }>}
 */
async function uploadImage(file, options = {}) {
  const fileBuffer = extractFileBuffer(file);
  const originalName = file.originalname || options.fileName || 'image.jpg';
  const fileType = file.mimetype || options.fileType || 'image/jpeg';
  const folder = options.folder || 'portfolio/projects';

  const ext = path.extname(originalName).toLowerCase();
  const sanitizedBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 40);

  const uploadOptions = {
    folder,
    resource_type: 'image',
    use_filename: true,
    unique_filename: true,
    filename_override: sanitizedBase,
    originalName,
    ...options,
  };

  const result = await uploadToCloudinary(fileBuffer, uploadOptions);

  return {
    url: result.secure_url || result.url,
    publicId: result.public_id,
    fileName: originalName,
    fileType,
    fileSize: result.bytes || (file.size || 0),
  };
}

/**
 * Upload a certificate (PDF, JPG, JPEG, PNG) to Cloudinary
 * Target folder: portfolio/certificates
 * @param {Object|Buffer} file - Express multer file object or raw Buffer
 * @param {Object} options
 * @returns {Promise<{ url: string, publicId: string, fileName: string, fileType: string, fileSize: number }>}
 */
async function uploadCertificate(file, options = {}) {
  const fileBuffer = extractFileBuffer(file);
  const originalName = file.originalname || options.fileName || 'certificate.pdf';
  const fileType = file.mimetype || options.fileType || 'application/pdf';
  const folder = 'portfolio/certificates';

  const ext = path.extname(originalName).toLowerCase();
  const isPdf = ext === '.pdf' || fileType.includes('pdf');
  const sanitizedBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 40);

  const uploadOptions = {
    folder,
    resource_type: isPdf ? 'raw' : 'image',
    use_filename: true,
    unique_filename: true,
    filename_override: sanitizedBase,
    originalName,
    ...options,
  };

  const result = await uploadToCloudinary(fileBuffer, uploadOptions);

  return {
    url: result.secure_url || result.url,
    publicId: result.public_id,
    fileName: originalName,
    fileType,
    fileSize: result.bytes || (file.size || 0),
  };
}

/**
 * Upload a resume PDF to Cloudinary
 * Target folder: portfolio/resume
 * @param {Object|Buffer} file - Express multer file object or raw Buffer
 * @param {Object} options
 * @returns {Promise<{ url: string, publicId: string, fileName: string, fileType: string, fileSize: number }>}
 */
async function uploadResume(file, options = {}) {
  const fileBuffer = extractFileBuffer(file);
  const originalName = file.originalname || options.fileName || 'Dhanush-M-Resume.pdf';
  const fileType = file.mimetype || options.fileType || 'application/pdf';
  const folder = 'portfolio/resume';

  const ext = path.extname(originalName).toLowerCase();
  if (ext !== '.pdf' && !fileType.includes('pdf')) {
    throw new Error('Invalid resume file type. Only PDF files are allowed.');
  }

  const sanitizedBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 40);

  const uploadOptions = {
    folder,
    resource_type: 'raw',
    use_filename: true,
    unique_filename: true,
    filename_override: sanitizedBase,
    originalName,
    ...options,
  };

  const result = await uploadToCloudinary(fileBuffer, uploadOptions);

  return {
    url: result.secure_url || result.url,
    publicId: result.public_id,
    fileName: originalName,
    fileType: 'application/pdf',
    fileSize: result.bytes || (file.size || 0),
  };
}

/**
 * Delete a file from Cloudinary by public ID
 * @param {string} publicId
 * @param {Object} options
 * @returns {Promise<Object>}
 */
async function deleteFile(publicId, options = {}) {
  if (!publicId) return { result: 'ok', mocked: true };

  if (!isCloudinaryConfigured()) {
    return { result: 'ok', mocked: true };
  }

  const resourceType = options.resource_type || 'image';

  try {
    let result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    if (result?.result !== 'ok' && resourceType === 'image') {
      // Try raw resource type (for PDFs)
      result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    }
    return result;
  } catch (error) {
    console.error(`[Cloudinary] Failed to delete file with publicId "${publicId}":`, error.message);
    throw error;
  }
}

/**
 * Checks if a string is a remote URL
 */
function isRemoteUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Retrieves a readable stream for a file either remotely or locally
 * @param {string} fileUrlOrPath
 * @returns {Promise<{ stream: NodeJS.ReadableStream, size?: number, mimeType?: string }>}
 */
async function getFileStream(fileUrlOrPath) {
  const fs = require('fs');

  // Check if it's a URL or path containing /uploads/ on the local filesystem
  if (typeof fileUrlOrPath === 'string' && fileUrlOrPath.includes('/uploads/')) {
    const uploadIndex = fileUrlOrPath.indexOf('/uploads/');
    const relativePath = fileUrlOrPath.substring(uploadIndex);
    const localFsPath = path.join(path.resolve(__dirname, '../../'), relativePath);
    if (fs.existsSync(localFsPath)) {
      const stats = await fs.promises.stat(localFsPath);
      return {
        stream: fs.createReadStream(localFsPath),
        size: stats.size,
        mimeType: 'application/pdf',
        filePath: localFsPath,
      };
    }
  }

  // Handle mock Cloudinary URLs when Cloudinary is not live configured
  if (
    !isCloudinaryConfigured() &&
    typeof fileUrlOrPath === 'string' &&
    fileUrlOrPath.includes('cloudinary.com')
  ) {
    const mockContent = Buffer.from('%PDF-1.4 Mock PDF Document for Dhanush M Portfolio\n%%EOF');
    const bufferStream = new stream.PassThrough();
    bufferStream.end(mockContent);
    return {
      stream: bufferStream,
      size: mockContent.length,
      mimeType: 'application/pdf',
    };
  }

  if (isRemoteUrl(fileUrlOrPath)) {
    return new Promise((resolve, reject) => {
      const client = fileUrlOrPath.startsWith('https://') ? https : http;
      client
        .get(fileUrlOrPath, (res) => {
          if (res.statusCode >= 400) {
            return reject(new Error(`Remote file download failed with status ${res.statusCode}`));
          }
          resolve({
            stream: res,
            size: res.headers['content-length'] ? parseInt(res.headers['content-length'], 10) : undefined,
            mimeType: res.headers['content-type'] || 'application/pdf',
          });
        })
        .on('error', reject);
    });
  }

  // Fallback for local files if any exist
  if (!fs.existsSync(fileUrlOrPath)) {
    const error = new Error('File not found on server');
    error.status = 404;
    throw error;
  }

  const stats = await fs.promises.stat(fileUrlOrPath);
  const fileReadStream = fs.createReadStream(fileUrlOrPath);

  return {
    stream: fileReadStream,
    size: stats.size,
    mimeType: 'application/pdf',
    filePath: fileUrlOrPath,
  };
}

module.exports = {
  isCloudinaryConfigured,
  uploadImage,
  uploadCertificate,
  uploadResume,
  deleteFile,
  isRemoteUrl,
  getFileStream,
};
