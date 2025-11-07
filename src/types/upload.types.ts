/**
 * File Upload Types
 * Type definitions for file upload and attachment system
 */

export interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
  storageKey?: string;
}

export interface AttachmentRecord {
  id: string;
  request_id: string | null;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  storage_bucket: string;
  uploaded_by: string;
  uploaded_at: string;
  metadata: AttachmentMetadata | null;
}

export interface AttachmentMetadata {
  width?: number;
  height?: number;
  duration?: number;
  thumbnail_path?: string;
  original_name?: string;
  [key: string]: any;
}

export interface FileUploadConfig {
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string | string[];
  bucket?: StorageBucket;
  folder?: string;
  resize?: {
    maxWidth: number;
    maxHeight: number;
    quality?: number;
  };
}

export type StorageBucket = 'request-attachments' | 'profile-avatars' | 'shared-assets';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export const ALLOWED_FILE_TYPES = {
  images: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml', 'image/webp'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  design: ['application/octet-stream'], // .fig, .sketch, .xd files
  archives: ['application/zip', 'application/x-zip-compressed'],
  videos: ['video/mp4', 'video/quicktime'],
} as const;

export const FILE_EXTENSIONS = {
  images: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'],
  documents: ['.pdf', '.doc', '.docx'],
  design: ['.fig', '.sketch', '.xd'],
  archives: ['.zip'],
  videos: ['.mp4', '.mov'],
} as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export interface FilePreviewProps {
  file: UploadFile | AttachmentRecord;
  onRemove?: () => void;
  onDownload?: () => void;
  showActions?: boolean;
  variant?: 'compact' | 'full';
}

export interface DropZoneProps {
  onDrop: (files: File[]) => void;
  accept?: string | string[];
  maxFiles?: number;
  disabled?: boolean;
  children?: React.ReactNode;
}

export interface FileUploaderProps extends FileUploadConfig {
  onUploadComplete?: (files: AttachmentRecord[]) => void;
  onUploadError?: (error: string) => void;
  requestId?: string;
  existingFiles?: AttachmentRecord[];
}
