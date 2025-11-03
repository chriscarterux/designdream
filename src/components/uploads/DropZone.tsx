'use client';

/**
 * DropZone Component
 * Drag-and-drop zone for file uploads
 */

import { useCallback, useState, type DragEvent } from 'react';
import { Upload } from 'lucide-react';
import type { DropZoneProps } from '@/types/upload.types';
import { cn } from '@/lib/utils';

export function DropZone({
  onDrop,
  accept,
  maxFiles = 10,
  disabled = false,
  children,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      const filesToUpload = droppedFiles.slice(0, maxFiles);

      if (filesToUpload.length > 0) {
        onDrop(filesToUpload);
      }
    },
    [disabled, maxFiles, onDrop]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
      const filesToUpload = selectedFiles.slice(0, maxFiles);

      if (filesToUpload.length > 0) {
        onDrop(filesToUpload);
      }

      // Reset input so same file can be selected again
      e.target.value = '';
    },
    [disabled, maxFiles, onDrop]
  );

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative rounded-lg border-2 border-dashed transition-all',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-gray-300 hover:border-gray-400',
        disabled && 'cursor-not-allowed opacity-50',
        !disabled && 'cursor-pointer'
      )}
    >
      <input
        type="file"
        id="file-upload"
        className="sr-only"
        accept={accept}
        multiple={maxFiles > 1}
        onChange={handleFileInput}
        disabled={disabled}
      />

      {children || (
        <label
          htmlFor="file-upload"
          className={cn(
            'flex flex-col items-center justify-center px-6 py-10',
            !disabled && 'cursor-pointer'
          )}
        >
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm font-medium text-gray-700">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {accept ? `Accepted: ${accept}` : 'All file types accepted'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Maximum {maxFiles} file{maxFiles > 1 ? 's' : ''} (50MB each)
          </p>
        </label>
      )}

      {isDragging && (
        <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center">
          <p className="text-lg font-semibold text-primary">Drop files here</p>
        </div>
      )}
    </div>
  );
}
