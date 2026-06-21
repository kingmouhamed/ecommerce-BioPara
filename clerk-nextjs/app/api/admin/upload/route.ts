import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { uploadImage } from '@/lib/cloudinary';
import { validateFileUpload } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify admin authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // 3. Validate file (security check: file type, size, name)
    const validation = validateFileUpload(file);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'File validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    // 4. Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Upload to Cloudinary
    const secureUrl = await uploadImage(buffer, 'products');

    return NextResponse.json({
      success: true,
      url: secureUrl,
      name: file.name,
    });
  } catch (error) {
    console.error('🚨 File Upload API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload image',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
