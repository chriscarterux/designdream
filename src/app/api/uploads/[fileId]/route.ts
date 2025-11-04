/**
 * File Operations API Route
 * Handle individual file operations (get, delete)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { deleteFile } from '@/lib/storage/supabase-storage';
import type { StorageBucket } from '@/types/upload.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params;

    // Get attachment record
    const { data: attachment, error } = await supabaseAdmin
      .from('attachments')
      .select('*')
      .eq('id', fileId)
      .single();

    if (error || !attachment) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Get signed URL for private files
    const bucket = attachment.storage_bucket as StorageBucket;
    const isPublicBucket = bucket === 'profile-avatars' || bucket === 'shared-assets';

    let url: string;

    if (isPublicBucket) {
      const { data } = supabaseAdmin.storage
        .from(bucket)
        .getPublicUrl(attachment.file_path);
      url = data.publicUrl;
    } else {
      const { data, error: urlError } = await supabaseAdmin.storage
        .from(bucket)
        .createSignedUrl(attachment.file_path, 3600); // 1 hour expiry

      if (urlError) {
        throw urlError;
      }

      url = data.signedUrl;
    }

    return NextResponse.json({
      success: true,
      attachment: {
        ...attachment,
        url,
      },
    });
  } catch (error) {
    console.error('Get file error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get file' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params;

    // Get authenticated user
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get attachment record
    const { data: attachment, error: fetchError } = await supabaseAdmin
      .from('attachments')
      .select('*')
      .eq('id', fileId)
      .single();

    if (fetchError || !attachment) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Check if user owns the file or is admin
    // For now, allow user to delete their own uploads
    if (attachment.uploaded_by !== user.id) {
      // Check if user is admin (you'd need to implement role checking)
      // For now, return unauthorized
      return NextResponse.json(
        { error: 'Unauthorized to delete this file' },
        { status: 403 }
      );
    }

    // Delete file from storage
    await deleteFile(
      attachment.storage_bucket as StorageBucket,
      attachment.file_path
    );

    // Delete attachment record
    const { error: deleteError } = await supabaseAdmin
      .from('attachments')
      .delete()
      .eq('id', fileId);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Delete file error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete file' },
      { status: 500 }
    );
  }
}
