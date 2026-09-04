const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const environment = require('../config/environment');

const UPLOAD_ROOT = path.resolve(__dirname, '../../uploads');

/**
 * Generates an accessible URL for an uploaded file
 */
function getFileUrl(req, subfolder, filename) {
  if (!filename) return null;
  const protocol = req?.protocol || 'http';
  const host = req?.get('host') || `localhost:${environment.PORT}`;
  return `${protocol}://${host}/uploads/${subfolder}/${filename}`;
}

/**
 * Returns absolute local path for an uploaded file
 */
function getLocalFilePath(subfolder, filename) {
  if (!filename) return null;
  return path.join(UPLOAD_ROOT, subfolder, filename);
}

/**
 * Deletes a local file safely if it exists
 */
async function deleteLocalFile(filePath) {
  if (!filePath) return false;
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
  } catch (error) {
    console.error(`[FileService] Failed to delete file at ${filePath}:`, error.message);
  }
  return false;
}

/**
 * Checks if a string is a remote URL
 */
function isRemoteUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Retrieves a readable stream for a file either locally or remotely
 * @param {string} fileUrlOrPath
 * @returns {Promise<{ stream: NodeJS.ReadableStream, size?: number, mimeType?: string }>}
 */
async function getFileStream(fileUrlOrPath) {
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

  // Handle local filesystem path
  let absolutePath = fileUrlOrPath;
  if (!path.isAbsolute(absolutePath)) {
    // If it's a URL path like /uploads/resumes/filename.pdf
    if (absolutePath.startsWith('/uploads/')) {
      absolutePath = path.join(path.resolve(__dirname, '../../'), absolutePath);
    } else {
      absolutePath = path.join(UPLOAD_ROOT, absolutePath);
    }
  }

  if (!fs.existsSync(absolutePath)) {
    const error = new Error('File not found on server');
    error.status = 404;
    throw error;
  }

  const stats = await fs.promises.stat(absolutePath);
  const stream = fs.createReadStream(absolutePath);

  return {
    stream,
    size: stats.size,
    mimeType: 'application/pdf',
    filePath: absolutePath,
  };
}

module.exports = {
  UPLOAD_ROOT,
  getFileUrl,
  getLocalFilePath,
  deleteLocalFile,
  isRemoteUrl,
  getFileStream,
};
