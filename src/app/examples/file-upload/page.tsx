/**
 * File Upload Example Page
 * Demonstrates usage of the FileUploader component
 */

'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/uploads';
import type { AttachmentRecord } from '@/types/upload.types';

export default function FileUploadExamplePage() {
  const [uploadedFiles, setUploadedFiles] = useState<AttachmentRecord[]>([]);

  const handleUploadComplete = (files: AttachmentRecord[]) => {
    console.log('Upload complete:', files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            File Upload Example
          </h1>
          <p className="text-gray-600 mb-8">
            Demonstrates the file upload component with drag-drop, progress tracking, and preview.
          </p>

          <div className="space-y-8">
            {/* Basic Usage */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Basic Usage
              </h2>
              <FileUploader
                maxFiles={5}
                maxSize={50 * 1024 * 1024}
                accept="image/*,.pdf"
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
              />
            </section>

            {/* With Request ID */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                With Request ID (for attaching to requests)
              </h2>
              <FileUploader
                maxFiles={10}
                requestId="example-request-id"
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
              />
            </section>

            {/* Images Only */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Images Only
              </h2>
              <FileUploader
                maxFiles={3}
                accept="image/*"
                bucket="shared-assets"
                folder="examples"
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
              />
            </section>

            {/* Upload Summary */}
            {uploadedFiles.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Upload Summary
                </h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium mb-2">
                    Successfully uploaded {uploadedFiles.length} file(s)
                  </p>
                  <ul className="space-y-1 text-sm text-green-700">
                    {uploadedFiles.map(file => (
                      <li key={file.id}>
                        {file.file_name} ({(file.file_size / 1024).toFixed(2)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Code Example */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Code Example
              </h2>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                {`import { FileUploader } from '@/components/uploads';

function MyComponent() {
  const handleUploadComplete = (files) => {
    console.log('Uploaded:', files);
  };

  return (
    <FileUploader
      maxFiles={10}
      maxSize={50 * 1024 * 1024} // 50MB
      accept="image/*,.pdf,.fig"
      requestId="optional-request-id"
      onUploadComplete={handleUploadComplete}
    />
  );
}`}
              </pre>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Features
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Drag and drop file uploads',
                  'Click to browse file picker',
                  'Multiple file selection',
                  'Real-time upload progress',
                  'File type validation',
                  'File size validation',
                  'Image preview thumbnails',
                  'Download functionality',
                  'Delete functionality',
                  'Responsive design',
                  'Error handling',
                  'Success indicators',
                ].map(feature => (
                  <li key={feature} className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 text-green-500 flex-shrink-0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
