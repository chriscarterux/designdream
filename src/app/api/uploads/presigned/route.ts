/**
 * Presigned URL API Route
 * Generate presigned URLs for direct upload to Supabase Storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateUniqueFileName, createFilePath } from '@/lib/storage/file-utils';
import type { StorageBucket } from '@/types/upload.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Generate presigned URL for upload
 * This allows clients to upload directly to Supabase Storage
 * without going through the API server
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, fileType, bucket = 'request-attachments', folder = 'uploads' } = body;

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'fileName and fileType are required' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate unique file path
    const uniqueFileName = generateUniqueFileName(fileName);
    const filePath = createFilePath(user.id, folder, uniqueFileName);

    // Create presigned URL for upload
    const { data, error: urlError } = await supabaseAdmin.storage
      .from(bucket as StorageBucket)
      .createSignedUploadUrl(filePath);

    if (urlError) {
      throw urlError;
    }

    return NextResponse.json({
      success: true,
      uploadUrl: data.signedUrl,
      filePath: data.path,
      token: data.token,
    });
  } catch (error) {
    console.error('Presigned URL error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate presigned URL' },
      { status: 500 }
    );
  }
}

/**
 * Generate presigned URL for download
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('filePath');
    const bucket = (searchParams.get('bucket') as StorageBucket) || 'request-attachments';
    const expiresIn = parseInt(searchParams.get('expiresIn') || '3600');

    if (!filePath) {
      return NextResponse.json(
        { error: 'filePath is required' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create presigned URL for download
    const { data, error: urlError } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);

    if (urlError) {
      throw urlError;
    }

    return NextResponse.json({
      success: true,
      downloadUrl: data.signedUrl,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Presigned download URL error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate presigned URL' },
      { status: 500 }
    );
  }
}
