/**
 * File Utilities
 * Functions for file validation, processing, and manipulation
 */

import {
  ALLOWED_FILE_TYPES,
  FILE_EXTENSIONS,
  MAX_FILE_SIZE,
  FileValidationResult,
  type FileUploadConfig,
} from '@/types/upload.types';

/**
 * Validate file type by checking both MIME type and extension
 */
export function validateFileType(file: File, allowedTypes?: string | string[]): FileValidationResult {
  if (!allowedTypes) {
    // Default: allow all types defined in ALLOWED_FILE_TYPES
    const allAllowedTypes = Object.values(ALLOWED_FILE_TYPES).flat();
    const allExtensions = Object.values(FILE_EXTENSIONS).flat();

    const isValidMime = allAllowedTypes.includes(file.type);
    const extension = getFileExtension(file.name);
    const isValidExtension = allExtensions.includes(extension);

    if (!isValidMime && !isValidExtension) {
      return {
        valid: false,
        error: `File type ${file.type} (${extension}) is not supported`,
      };
    }
  } else {
    const allowed = Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes];
    const extension = getFileExtension(file.name);

    // Check if it matches MIME type or extension pattern
    const isValid = allowed.some(type => {
      if (type.includes('*')) {
        // Handle wildcards like "image/*"
        const [category] = type.split('/');
        return file.type.startsWith(category + '/');
      }
      if (type.startsWith('.')) {
        // Handle extensions like ".pdf"
        return extension === type;
      }
      return file.type === type;
    });

    if (!isValid) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed`,
      };
    }
  }

  return { valid: true };
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSize: number = MAX_FILE_SIZE): FileValidationResult {
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(maxSize)})`,
    };
  }
  return { valid: true };
}

/**
 * Validate file based on configuration
 */
export function validateFile(file: File, config: FileUploadConfig): FileValidationResult {
  // Check file size
  const sizeValidation = validateFileSize(file, config.maxSize);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  // Check file type
  const typeValidation = validateFileType(file, config.accept);
  if (!typeValidation.valid) {
    return typeValidation;
  }

  return { valid: true };
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const match = filename.match(/\.[^.]+$/);
  return match ? match[0].toLowerCase() : '';
}

/**
 * Get file type category
 */
export function getFileCategory(file: File): 'image' | 'document' | 'design' | 'archive' | 'video' | 'other' {
  const extension = getFileExtension(file.name);

  if (ALLOWED_FILE_TYPES.images.includes(file.type)) return 'image';
  if (ALLOWED_FILE_TYPES.documents.includes(file.type)) return 'document';
  if (ALLOWED_FILE_TYPES.videos.includes(file.type)) return 'video';
  if (ALLOWED_FILE_TYPES.archives.includes(file.type)) return 'archive';
  if (FILE_EXTENSIONS.design.includes(extension)) return 'design';

  return 'other';
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Generate unique file name
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(originalName);
  const nameWithoutExt = originalName.replace(extension, '').replace(/[^a-zA-Z0-9-_]/g, '-');

  return `${nameWithoutExt}-${timestamp}-${random}${extension}`;
}

/**
 * Create file path for storage
 */
export function createFilePath(userId: string, folder: string, fileName: string): string {
  return `${userId}/${folder}/${fileName}`;
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  return ALLOWED_FILE_TYPES.images.includes(file.type);
}

/**
 * Check if file is a PDF
 */
export function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf';
}

/**
 * Check if file is a video
 */
export function isVideoFile(file: File): boolean {
  return ALLOWED_FILE_TYPES.videos.includes(file.type);
}

/**
 * Read file as data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Resize image file
 */
export async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generate thumbnail for image
 */
export async function generateThumbnail(file: File, maxSize: number = 200): Promise<Blob> {
  return resizeImage(file, maxSize, maxSize, 0.8);
}

/**
 * Get image dimensions
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Check file magic bytes for validation (more secure than extension check)
 */
export async function checkFileMagicBytes(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arr = new Uint8Array(e.target?.result as ArrayBuffer).subarray(0, 4);
      let header = '';
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16).padStart(2, '0');
      }

      // Common file signatures
      const signatures: Record<string, string[]> = {
        png: ['89504e47'],
        jpg: ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffe3', 'ffd8ffe8'],
        gif: ['47494638'],
        pdf: ['25504446'],
        zip: ['504b0304', '504b0506', '504b0708'],
      };

      const isValid = Object.values(signatures).some(sigs =>
        sigs.some(sig => header.startsWith(sig))
      );

      resolve(isValid);
    };
    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
}

/**
 * Convert file to base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get pure base64
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
}
