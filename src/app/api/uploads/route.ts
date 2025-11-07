/**
 * Upload API Route
 * Handle file uploads to Supabase Storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { uploadFile, createAttachmentRecord } from '@/lib/storage/supabase-storage';
import { validateFile } from '@/lib/storage/file-utils';
import type { StorageBucket } from '@/types/upload.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side Supabase client with service role key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = (formData.get('bucket') as StorageBucket) || 'request-attachments';
    const folder = (formData.get('folder') as string) || 'uploads';
    const requestId = formData.get('requestId') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(file, {
      maxSize: 50 * 1024 * 1024, // 50MB
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Get authenticated user
    // In production, verify JWT token from Authorization header
    const authHeader = request.headers.get('authorization');
    let userId = 'anonymous'; // Default for testing

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

      if (error || !user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      userId = user.id;
    }

    // Upload file to storage
    const { path, url } = await uploadFile(file, bucket, userId, folder);

    // Get file metadata
    const metadata: any = {
      original_name: file.name,
    };

    // For images, we could add dimensions here
    // This would require reading the file buffer and using an image library

    // Create attachment record in database
    const attachment = await createAttachmentRecord({
      request_id: requestId,
      file_name: file.name,
      file_path: path,
      file_size: file.size,
      mime_type: file.type,
      storage_bucket: bucket,
      uploaded_by: userId,
      metadata,
    });

    return NextResponse.json({
      success: true,
      attachment,
      url,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('requestId');

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID required' },
        { status: 400 }
      );
    }

    // Get attachments for request
    const { data: attachments, error } = await supabaseAdmin
      .from('attachments')
      .select('*')
      .eq('request_id', requestId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      attachments: attachments || [],
    });
  } catch (error) {
    console.error('Fetch attachments error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch attachments' },
      { status: 500 }
    );
  }
}
