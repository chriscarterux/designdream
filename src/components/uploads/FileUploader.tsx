'use client';

/**
 * FileUploader Component
 * Main file upload component with drag-drop, progress, and preview
 */

import { useCallback } from 'react';
import { DropZone } from './DropZone';
import { FileList } from './FileList';
import { useFileUpload } from '@/hooks/useFileUpload';
import type { FileUploaderProps } from '@/types/upload.types';
import { AlertCircle } from 'lucide-react';

export function FileUploader({
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024,
  accept,
  bucket = 'request-attachments',
  folder = 'uploads',
  onUploadComplete,
  onUploadError,
  requestId,
  existingFiles = [],
}: FileUploaderProps) {
  const {
    files,
    uploadFiles,
    removeFile,
    clearFiles,
    isUploading,
    error,
  } = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    bucket,
    folder,
    requestId,
    onUploadComplete,
    onUploadError,
  });

  const handleDrop = useCallback(
    (droppedFiles: File[]) => {
      uploadFiles(droppedFiles);
    },
    [uploadFiles]
  );

  const handleRemoveUploadingFile = useCallback(
    (file: any) => {
      removeFile(file.id);
    },
    [removeFile]
  );

  const totalFiles = files.length + existingFiles.length;
  const remainingSlots = maxFiles - totalFiles;

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {remainingSlots > 0 && (
        <DropZone
          onDrop={handleDrop}
          accept={accept}
          maxFiles={remainingSlots}
          disabled={isUploading}
        />
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Upload Error</p>
            <p className="text-sm text-red-700 mt-1 whitespace-pre-line">{error}</p>
          </div>
        </div>
      )}

      {/* File Stats */}
      {totalFiles > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {totalFiles} / {maxFiles} files uploaded
          </span>
          {files.length > 0 && !isUploading && (
            <button
              onClick={clearFiles}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Clear pending
            </button>
          )}
        </div>
      )}

      {/* Existing Files */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Uploaded Files</h4>
          <FileList
            files={existingFiles}
            showActions={true}
            variant="list"
            compact={true}
          />
        </div>
      )}

      {/* Uploading Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">
            {isUploading ? 'Uploading...' : 'Ready to Upload'}
          </h4>
          <FileList
            files={files}
            onRemove={handleRemoveUploadingFile}
            showActions={!isUploading}
            variant="list"
            compact={true}
          />
        </div>
      )}

      {/* No Files Message */}
      {totalFiles === 0 && !isUploading && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No files uploaded yet</p>
          <p className="text-xs mt-1">Drag and drop files or click to browse</p>
        </div>
      )}
    </div>
  );
}
