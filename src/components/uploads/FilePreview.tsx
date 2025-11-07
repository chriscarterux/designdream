'use client';

/**
 * FilePreview Component
 * Preview thumbnail for uploaded files
 */

import { useState, useEffect } from 'react';
import {
  File,
  FileText,
  Image as ImageIcon,
  Video,
  Archive,
  Download,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import type { FilePreviewProps, UploadFile, AttachmentRecord } from '@/types/upload.types';
import { formatFileSize, isImageFile, isPdfFile, isVideoFile, getFileCategory } from '@/lib/storage/file-utils';
import { cn } from '@/lib/utils';

function isUploadFile(file: FilePreviewProps['file']): file is UploadFile {
  return 'file' in file;
}

function getFileIcon(file: FilePreviewProps['file']) {
  if (isUploadFile(file)) {
    const category = getFileCategory(file.file);
    switch (category) {
      case 'image':
        return ImageIcon;
      case 'document':
        return FileText;
      case 'video':
        return Video;
      case 'archive':
        return Archive;
      default:
        return File;
    }
  } else {
    // AttachmentRecord
    if (file.mime_type.startsWith('image/')) return ImageIcon;
    if (file.mime_type.startsWith('video/')) return Video;
    if (file.mime_type === 'application/pdf') return FileText;
    if (file.mime_type.includes('zip')) return Archive;
    return File;
  }
}

function getFileName(file: FilePreviewProps['file']): string {
  return isUploadFile(file) ? file.file.name : file.file_name;
}

function getFileSize(file: FilePreviewProps['file']): number {
  return isUploadFile(file) ? file.file.size : file.file_size;
}

function getMimeType(file: FilePreviewProps['file']): string {
  return isUploadFile(file) ? file.file.type : file.mime_type;
}

export function FilePreview({
  file,
  onRemove,
  onDownload,
  showActions = true,
  variant = 'full',
}: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const fileName = getFileName(file);
  const fileSize = getFileSize(file);
  const mimeType = getMimeType(file);
  const FileIconComponent = getFileIcon(file);

  const isUploading = isUploadFile(file) && file.status === 'uploading';
  const isError = isUploadFile(file) && file.status === 'error';
  const isSuccess = isUploadFile(file) && file.status === 'success';

  useEffect(() => {
    if (isUploadFile(file) && mimeType.startsWith('image/')) {
      setIsLoadingPreview(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setIsLoadingPreview(false);
      };
      reader.onerror = () => {
        setIsLoadingPreview(false);
      };
      reader.readAsDataURL(file.file);
    } else if (!isUploadFile(file) && file.mime_type.startsWith('image/')) {
      // For AttachmentRecord, use the storage URL
      setPreviewUrl(file.file_path);
    }

    return () => {
      if (previewUrl && isUploadFile(file)) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file, mimeType, previewUrl]);

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border',
          isError && 'border-red-300 bg-red-50',
          isSuccess && 'border-green-300 bg-green-50',
          !isError && !isSuccess && 'border-gray-200 bg-white'
        )}
      >
        <div className="flex-shrink-0">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={fileName}
              className="h-10 w-10 rounded object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
              <FileIconComponent className="h-5 w-5 text-gray-500" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
          <p className="text-xs text-gray-500">{formatFileSize(fileSize)}</p>
        </div>

        <div className="flex items-center gap-2">
          {isUploading && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              {isUploadFile(file) && (
                <span className="text-xs text-gray-500">{file.progress}%</span>
              )}
            </div>
          )}

          {isSuccess && <CheckCircle className="h-4 w-4 text-green-500" />}

          {isError && <AlertCircle className="h-4 w-4 text-red-500" />}

          {showActions && !isUploading && (
            <>
              {onDownload && (
                <button
                  onClick={onDownload}
                  className="p-1 rounded hover:bg-gray-100"
                  title="Download"
                >
                  <Download className="h-4 w-4 text-gray-600" />
                </button>
              )}
              {onRemove && (
                <button
                  onClick={onRemove}
                  className="p-1 rounded hover:bg-red-100"
                  title="Remove"
                >
                  <X className="h-4 w-4 text-red-600" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative group rounded-lg border overflow-hidden',
        isError && 'border-red-300',
        isSuccess && 'border-green-300',
        !isError && !isSuccess && 'border-gray-200'
      )}
    >
      {/* Preview Area */}
      <div className="aspect-square bg-gray-100 relative">
        {isLoadingPreview && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {previewUrl && !isLoadingPreview ? (
          <img
            src={previewUrl}
            alt={fileName}
            className="w-full h-full object-cover"
          />
        ) : (
          !isLoadingPreview && (
            <div className="absolute inset-0 flex items-center justify-center">
              <FileIconComponent className="h-16 w-16 text-gray-400" />
            </div>
          )
        )}

        {/* Upload Progress Overlay */}
        {isUploading && isUploadFile(file) && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
            <div className="w-3/4 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${file.progress}%` }}
              />
            </div>
            <span className="text-white text-sm mt-2">{file.progress}%</span>
          </div>
        )}

        {/* Error Overlay */}
        {isError && isUploadFile(file) && (
          <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        )}

        {/* Success Indicator */}
        {isSuccess && (
          <div className="absolute top-2 right-2">
            <CheckCircle className="h-6 w-6 text-green-500 bg-white rounded-full" />
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 truncate" title={fileName}>
          {fileName}
        </p>
        <p className="text-xs text-gray-500 mt-1">{formatFileSize(fileSize)}</p>

        {isError && isUploadFile(file) && file.error && (
          <p className="text-xs text-red-600 mt-2">{file.error}</p>
        )}
      </div>

      {/* Action Buttons */}
      {showActions && !isUploading && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          {onDownload && (
            <button
              onClick={onDownload}
              className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-100"
              title="Download"
            >
              <Download className="h-4 w-4 text-gray-700" />
            </button>
          )}
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-2 rounded-full bg-white shadow-lg hover:bg-red-100"
              title="Remove"
            >
              <X className="h-4 w-4 text-red-600" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
