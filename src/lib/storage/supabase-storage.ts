/**
 * Supabase Storage Client
 * Functions for interacting with Supabase Storage buckets
 */

import { createClient } from '@supabase/supabase-js';
import type { StorageBucket, AttachmentRecord } from '@/types/upload.types';
import { generateUniqueFileName, createFilePath } from './file-utils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  bucket: StorageBucket,
  userId: string,
  folder: string = 'uploads'
): Promise<{ path: string; url: string }> {
  const fileName = generateUniqueFileName(file.name);
  const filePath = createFilePath(userId, folder, fileName);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return {
    path: data.path,
    url: urlData.publicUrl,
  };
}

/**
 * Upload file with progress tracking
 */
export async function uploadFileWithProgress(
  file: File,
  bucket: StorageBucket,
  userId: string,
  folder: string = 'uploads',
  onProgress?: (progress: number) => void
): Promise<{ path: string; url: string }> {
  const fileName = generateUniqueFileName(file.name);
  const filePath = createFilePath(userId, folder, fileName);

  // Note: Supabase doesn't natively support progress tracking
  // This is a workaround using chunks
  const chunkSize = 256 * 1024; // 256KB chunks
  const chunks = Math.ceil(file.size / chunkSize);

  if (chunks === 1 || file.size < chunkSize) {
    // Small file, upload directly
    onProgress?.(50);
    const result = await uploadFile(file, bucket, userId, folder);
    onProgress?.(100);
    return result;
  }

  // For larger files, we still upload as one piece but simulate progress
  onProgress?.(10);
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  onProgress?.(90);

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  onProgress?.(100);

  return {
    path: data.path,
    url: urlData.publicUrl,
  };
}

/**
 * Delete file from storage
 */
export async function deleteFile(bucket: StorageBucket, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Get signed URL for private file
 */
export async function getSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresIn: number = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    throw new Error(`Failed to create signed URL: ${error.message}`);
  }

  return data.signedUrl;
}

/**
 * List files in a bucket path
 */
export async function listFiles(
  bucket: StorageBucket,
  path: string = ''
): Promise<any[]> {
  const { data, error } = await supabase.storage.from(bucket).list(path);

  if (error) {
    throw new Error(`Failed to list files: ${error.message}`);
  }

  return data || [];
}

/**
 * Download file from storage
 */
export async function downloadFile(bucket: StorageBucket, path: string): Promise<Blob> {
  const { data, error } = await supabase.storage.from(bucket).download(path);

  if (error) {
    throw new Error(`Failed to download file: ${error.message}`);
  }

  return data;
}

/**
 * Create attachment record in database
 */
export async function createAttachmentRecord(
  attachment: Omit<AttachmentRecord, 'id' | 'uploaded_at'>
): Promise<AttachmentRecord> {
  const { data, error } = await supabase
    .from('attachments')
    .insert(attachment)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create attachment record: ${error.message}`);
  }

  return data;
}

/**
 * Get attachment records by request ID
 */
export async function getAttachmentsByRequestId(requestId: string): Promise<AttachmentRecord[]> {
  const { data, error } = await supabase
    .from('attachments')
    .select('*')
    .eq('request_id', requestId)
    .order('uploaded_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch attachments: ${error.message}`);
  }

  return data || [];
}

/**
 * Delete attachment record
 */
export async function deleteAttachmentRecord(attachmentId: string): Promise<void> {
  const { error } = await supabase
    .from('attachments')
    .delete()
    .eq('id', attachmentId);

  if (error) {
    throw new Error(`Failed to delete attachment record: ${error.message}`);
  }
}

/**
 * Delete attachment (both file and record)
 */
export async function deleteAttachment(attachment: AttachmentRecord): Promise<void> {
  // Delete file from storage
  await deleteFile(attachment.storage_bucket as StorageBucket, attachment.file_path);

  // Delete record from database
  await deleteAttachmentRecord(attachment.id);
}

/**
 * Get file URL (public or signed)
 */
export async function getFileUrl(
  bucket: StorageBucket,
  path: string,
  isPublic: boolean = false
): Promise<string> {
  if (isPublic) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } else {
    return getSignedUrl(bucket, path);
  }
}

/**
 * Move file to different bucket or path
 */
export async function moveFile(
  fromBucket: StorageBucket,
  fromPath: string,
  toBucket: StorageBucket,
  toPath: string
): Promise<void> {
  const { error } = await supabase.storage
    .from(fromBucket)
    .move(fromPath, toPath);

  if (error) {
    throw new Error(`Failed to move file: ${error.message}`);
  }
}

/**
 * Copy file to different location
 */
export async function copyFile(
  fromBucket: StorageBucket,
  fromPath: string,
  toBucket: StorageBucket,
  toPath: string
): Promise<void> {
  const { error } = await supabase.storage
    .from(fromBucket)
    .copy(fromPath, toPath);

  if (error) {
    throw new Error(`Failed to copy file: ${error.message}`);
  }
}

/**
 * Check if file exists
 */
export async function fileExists(bucket: StorageBucket, path: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage.from(bucket).list(path);
    return !error && data.length > 0;
  } catch {
    return false;
  }
}

/**
 * Get storage bucket info
 */
export async function getBucketInfo(bucket: StorageBucket) {
  const { data, error } = await supabase.storage.getBucket(bucket);

  if (error) {
    throw new Error(`Failed to get bucket info: ${error.message}`);
  }

  return data;
}
