import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Load R2 credentials from Vite environment variables
const R2_ACCESS_KEY_ID = import.meta.env.VITE_R2_ACCESS_KEY_ID || '9d132915398bf4d4c309493c36d73d09';
const R2_SECRET_ACCESS_KEY = import.meta.env.VITE_R2_SECRET_ACCESS_KEY || '9ae59d0e0ec24b1fd65df7f614a5a11e131bfc64a529450ae4cfd8c8c1137ce8';
const R2_ENDPOINT = import.meta.env.VITE_R2_ENDPOINT || 'https://38165fa0207f3d738e0e54d47432e8ac.r2.cloudflarestorage.com';
const R2_BUCKET_NAME = import.meta.env.VITE_R2_BUCKET_NAME || 'lyntrixlearn';
const R2_PUBLIC_DOMAIN = import.meta.env.VITE_R2_PUBLIC_DOMAIN || 'https://pub-86868802225a4865905499ec8e95a407.r2.dev';

// Initialize S3 Client configured for Cloudflare R2
let s3ClientInstance = null;

function getS3Client() {
  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: 'auto',
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3ClientInstance;
}

/**
 * Upload any File or Blob to Cloudflare R2 with abort signal support
 * @param {Object} options
 * @param {File|Blob} options.file - The File or Blob to upload
 * @param {string} [options.folder='uploads'] - Folder prefix in bucket (e.g. 'slips', 'notes', 'thumbnails', 'videos')
 * @param {string} [options.fileName] - Optional custom file name
 * @param {AbortSignal} [options.abortSignal] - AbortSignal to cancel the upload
 * @returns {Promise<{ key: string, url: string, name: string, size: number, type: string, cancelled?: boolean }>}
 */
export async function uploadToR2({ file, folder = 'uploads', fileName = null, abortSignal = null }) {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  // Check if already aborted before starting
  if (abortSignal?.aborted) {
    return { cancelled: true };
  }

  // Generate safe filename
  const cleanOriginalName = (fileName || file.name || 'file')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const fileKey = `${folder}/${timestamp}-${cleanOriginalName}`;

  try {
    const s3 = getS3Client();

    // Convert File/Blob to ArrayBuffer for compatibility
    const arrayBuffer = await file.arrayBuffer();
    
    if (abortSignal?.aborted) {
      return { cancelled: true };
    }

    const uint8Array = new Uint8Array(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileKey,
      Body: uint8Array,
      ContentType: file.type || 'application/octet-stream',
    });

    await s3.send(command, { abortSignal });

    // Build the public CDN URL
    const publicUrl = `${R2_PUBLIC_DOMAIN.replace(/\/$/, '')}/${fileKey}`;

    return {
      success: true,
      key: fileKey,
      url: publicUrl,
      name: file.name || cleanOriginalName,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    if (error.name === 'AbortError' || abortSignal?.aborted) {
      return { cancelled: true };
    }
    console.error('Cloudflare R2 Upload Error:', error);
    throw error;
  }
}

/**
 * Utility to calculate video duration from File or Blob
 * @param {File|Blob} file 
 * @returns {Promise<{ durationSec: number, formatted: string } | null>}
 */
export function calculateVideoDuration(file) {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('video/')) {
      resolve(null);
      return;
    }

    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const durationSec = Math.round(video.duration);
      if (!durationSec || isNaN(durationSec)) {
        resolve(null);
        return;
      }

      const hours = Math.floor(durationSec / 3600);
      const minutes = Math.floor((durationSec % 3600) / 60);
      const seconds = durationSec % 60;

      let formatted = '';
      if (hours > 0) {
        formatted = `${hours}h ${minutes > 0 ? minutes + 'm' : ''}`.trim();
      } else {
        formatted = `${minutes}m ${seconds > 0 ? seconds + 's' : ''}`.trim();
      }

      resolve({ durationSec, formatted: formatted || '1m' });
    };

    video.onerror = () => {
      resolve(null);
    };

    video.src = URL.createObjectURL(file);
  });
}

export { R2_PUBLIC_DOMAIN, R2_BUCKET_NAME };
